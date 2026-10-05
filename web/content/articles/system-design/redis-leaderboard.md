---
slug: redis-leaderboard
categorySlug: system-design
title: "Leaderboard com sorted set"
navTitle: Leaderboard
summary: "Montar um ranking ao vivo com sorted set e entender por que ele nunca precisa reordenar tudo"
level: intermediario
order: 68
section: deep-dives-tecnologias
group: "Redis"
---

## Objetivos de aprendizagem

- [ ] Usar ZADD, ZINCRBY e ZREVRANGE para montar um ranking
- [ ] Explicar por que o sorted set é a estrutura certa para rankings

*Retomando o cenário da unidade: uma plataforma de quiz ao vivo, com placar, limite de respostas por jogador e um lock para contar uma resposta só por pergunta.*

## Leaderboard com Sorted Set

### Por que sorted set é a estrutura certa aqui

Um sorted set mantém seus membros automaticamente ordenados por uma pontuação, com operações de inserção, atualização e consulta de ranking em tempo logarítmico — nunca é necessário reordenar manualmente ou escanear a estrutura inteira para saber quem está em primeiro lugar.

```
ZADD placar_quiz_7 850 "jogador_42"
ZADD placar_quiz_7 920 "jogador_15"
ZREVRANGE placar_quiz_7 0 9 WITHSCORES   # top 10 jogadores
ZRANK placar_quiz_7 "jogador_42"          # posição do jogador 42 no ranking
```

![Sorted Set como leaderboard: membros sempre ordenados por pontuação](/diagrams/redis-sorted-set.svg)

No nosso quiz, cada resposta correta dispara um `ZADD` (ou `ZINCRBY`, que soma à pontuação existente em vez de sobrescrever), e a tela de ranking ao vivo simplesmente consulta `ZREVRANGE` periodicamente — uma operação barata mesmo com 50 mil jogadores na estrutura, porque o sorted set já mantém a ordenação internamente, sem nunca precisar reordenar tudo do zero.

## Cliente Java: operação central de escrita/leitura

Usando o **Lettuce** (cliente assíncrono/reativo, hoje o padrão de facto no ecossistema Java/Spring), a operação central do nosso quiz é atualizar e ler o placar com sorted sets. Abaixo, um trecho que registra uma resposta correta e busca o top 10:

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.ScoredValue;

import java.util.List;

public class PlacarQuizService {

    private final RedisCommands<String, String> redis;

    public PlacarQuizService(String redisUri) {
        RedisClient client = RedisClient.create(redisUri); // ex: "redis://localhost:6379"
        StatefulRedisConnection<String, String> connection = client.connect();
        this.redis = connection.sync();
    }

    // registra a pontuação de uma resposta correta (equivalente a ZINCRBY)
    public void registrarResposta(String quizId, String jogadorId, double pontos) {
        redis.zincrby("placar_quiz_" + quizId, pontos, jogadorId);
    }

    // busca o top N do ranking, do maior para o menor score
    public List<ScoredValue<String>> topJogadores(String quizId, int n) {
        return redis.zrevrangeWithScores("placar_quiz_" + quizId, 0, n - 1);
    }
}
```

Para operações de alta frequência — por exemplo, gravar em lote a pontuação de vários jogadores ao final de uma rodada — um **pipeline** evita uma ida-e-volta de rede por comando, agrupando várias escritas em um único round-trip:

```java
import io.lettuce.core.api.async.RedisAsyncCommands;
import io.lettuce.core.RedisFuture;

import java.util.List;
import java.util.Map;

public void registrarRodadaEmLote(String quizId, Map<String, Double> pontosPorJogador) {
    RedisAsyncCommands<String, String> async = connection.async();
    async.setAutoFlushCommands(false); // desliga o flush automático por comando

    List<RedisFuture<Double>> futures = pontosPorJogador.entrySet().stream()
        .map(e -> async.zincrby("placar_quiz_" + quizId, e.getValue(), e.getKey()))
        .toList();

    async.flushCommands(); // envia todos os comandos acumulados de uma vez
    futures.forEach(RedisFuture::join); // aguarda a conclusão de todos
}
```

## Lembre

- O sorted set mantém os membros **sempre ordenados** pela pontuação.
- `ZINCRBY` soma pontos; `ZREVRANGE` devolve o topo; ambos em tempo logarítmico.
- Um **pipeline** agrupa vários comandos em uma só ida e volta de rede.
