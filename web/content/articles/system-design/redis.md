---
slug: redis
categorySlug: system-design
title: "Deep Dive: Redis"
navTitle: Redis
summary: Explicar por que Redis é rápido (modelo single-threaded + dados em memória) e o que isso custa
level: intermediario
order: 43
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Explicar por que Redis é rápido (modelo single-threaded + dados em memória) e o que isso custa
- [ ] Escolher a estrutura de dados certa (string, hash, sorted set, stream) para cada caso de uso comum de entrevista
- [ ] Implementar, ao menos em pseudocódigo, um rate limiter, um lock distribuído e um leaderboard com Redis
- [ ] Discutir persistência e escalabilidade com vocabulário concreto (RDB, AOF, réplicas, Redis Cluster)

## Cenário de referência para esta aula

Vamos usar um cenário único ao longo da aula: uma plataforma de quiz ao vivo, onde milhares de jogadores respondem perguntas em tempo real, o sistema mantém um placar (leaderboard) ao vivo, limita quantas respostas por segundo cada jogador pode enviar (para evitar bots), e usa um lock temporário para garantir que apenas uma resposta por jogador seja contabilizada por pergunta.

## Fundamentos: o que é o Redis, por dentro

### Em memória, e o que isso significa na prática

Redis guarda todos os seus dados na RAM, não em disco (com persistência opcional discutida mais adiante). Isso é o motivo central de sua velocidade: uma leitura em Redis normalmente leva menos de 1 milissegundo, contra 5-20+ milissegundos de uma consulta típica a um banco relacional que precisa ir ao disco. Para o nosso quiz, isso significa que atualizar e consultar o placar pode acontecer em uma fração do tempo que levaria no banco principal.

### Single-threaded: rápido, mas com uma implicação séria

Redis processa comandos em uma única thread, um de cada vez, usando um event loop (o mesmo padrão usado por sistemas como Node.js). Isso elimina a complexidade de lidar com concorrência interna (dois comandos nunca disputam o mesmo dado ao mesmo tempo dentro do próprio Redis) e é surpreendentemente rápido — instâncias comuns sustentam a ordem de 100 mil+ operações por segundo.

**A implicação séria**: como é single-threaded, um único comando lento (ex: pedir para ordenar ou escanear uma estrutura com milhões de elementos) trava *todos* os outros comandos até terminar — não existe "outro núcleo" livre para atender o próximo cliente enquanto isso. No nosso quiz, isso significa: nunca rodar um comando que escaneie a lista inteira de 50 mil jogadores dentro do caminho crítico de uma resposta — é para isso que existem estruturas como o sorted set, que veremos a seguir, desenhadas para nunca exigir esse tipo de operação cara.

### As estruturas de dados, uma a uma

Redis não é um simples par chave-valor — é melhor pensado como um "servidor de estruturas de dados". As mais relevantes para entrevista:

- **String**: o tipo mais simples — uma chave aponta para um valor de texto ou número. Base de contadores simples (`INCR contador`) e cache básico.
- **Hash**: um objeto com múltiplos campos, como um dicionário aninhado sob uma única chave — útil para representar uma entidade inteira (ex: o perfil de um jogador) sem serializar/desserializar um JSON completo a cada leitura de um campo só.
- **List**: uma lista ordenada, com inserção/remoção eficiente nas duas pontas — base para filas simples.
- **Set**: uma coleção de valores únicos, sem ordem — útil para checar pertencimento rapidamente (ex: "esse jogador já respondeu essa pergunta?").
- **Sorted Set (ZSET)**: como um Set, mas cada membro tem uma pontuação numérica associada, e a estrutura se mantém sempre ordenada por essa pontuação — a peça central do nosso leaderboard, detalhada a seguir.
- **Stream**: um log de eventos append-only, com semântica parecida com uma versão simplificada do Kafka (aula anterior) — útil quando múltiplos consumidores precisam ler os mesmos eventos de forma independente, mas em uma escala menor que justificaria um Kafka completo.

## Rate Limiting: limitando respostas por jogador

### O problema

Precisamos impedir que um jogador (ou um bot automatizado) envie respostas mais rápido do que humanamente possível — digamos, no máximo 5 respostas a cada 10 segundos.

### A implementação com Redis

Uma abordagem comum usa `INCR` (incrementa um contador atomicamente) combinado com uma expiração (TTL):

```
INCR contador:jogador_42
# se o valor retornado for 1 (primeira requisição da janela), define o TTL:
EXPIRE contador:jogador_42 10
# se o valor retornado for maior que 5, rejeita a requisição
```

**Por que isso é seguro mesmo com múltiplos clientes simultâneos**: como Redis processa comandos um de cada vez, o `INCR` é atômico — mesmo que 1.000 requisições do mesmo jogador cheguem no mesmo milissegundo, cada uma recebe um valor de retorno único e correto, sem duas requisições "lerem 3 e ambas escreverem 4" (uma condição de corrida clássica que aconteceria se isso fosse implementado como "ler o valor, somar 1, escrever de volta" em vez de um único comando atômico).

Essa abordagem específica (contador com TTL) implementa uma janela fixa; para uma janela deslizante mais precisa, sorted sets também são uma opção comum (armazenando o timestamp de cada requisição como membro, removendo os que saíram da janela) — mais preciso, porém mais caro por requisição.

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

## Lock Distribuído: garantindo uma resposta por jogador por pergunta

### O problema de contenção

Se o app do jogador reenviar a mesma resposta duas vezes (por uma reconexão de rede, por exemplo), precisamos garantir que ela seja contabilizada só uma vez.

### A implementação básica

```
SET lock:jogador_42:pergunta_7 "1" NX EX 5
```

O modificador `NX` ("only if Not eXists") faz esse comando ter sucesso apenas se a chave ainda não existir — se dois pedidos de lock chegarem quase simultaneamente, só um deles consegue criar a chave; o outro recebe uma resposta de falha e sabe que já existe um processamento em andamento. O `EX 5` garante que o lock expira sozinho em 5 segundos, mesmo que o processo que o criou trave e nunca o libere explicitamente — evitando um lock "preso" para sempre.

### O aviso importante sobre confiabilidade

Um lock Redis de nó único é uma ferramenta de **eficiência**, não uma garantia absoluta de correção em todos os cenários de falha distribuída — em situações raras envolvendo falha do próprio nó Redis no meio da operação, duas partes podem, em teoria, acreditar que possuem o lock simultaneamente. Para a maioria dos problemas de entrevista (incluindo o nosso quiz, onde o pior caso de uma resposta duplicada processada é irrelevante o suficiente), essa garantia "quase sempre correta" já é adequada — mas vale mencionar essa limitação explicitamente, em vez de apresentar o lock Redis como uma garantia perfeita. Para cenários onde essa garantia mais forte é realmente necessária, existe o algoritmo Redlock (coordenando o lock através de múltiplas instâncias Redis independentes), com seus próprios trade-offs de complexidade.

## Pub/Sub: notificando jogadores em tempo real

Redis Pub/Sub permite publicar uma mensagem em um "canal", entregue imediatamente a todos os assinantes conectados naquele momento — sem persistência: quem não estava conectado no momento da publicação simplesmente não recebe aquela mensagem.

No nosso quiz, isso serve bem para notificar "a próxima pergunta está disponível" a todos os jogadores conectados simultaneamente — se a conexão de um jogador cair por um segundo e ele perder essa notificação específica, o impacto é tolerável (a próxima ação do jogador, como abrir o app, pode simplesmente buscar o estado atual). Já para algo que não pode se dar ao luxo de perder mensagens (como o histórico de respostas de um jogador), Pub/Sub não é a ferramenta certa — Streams (o tipo de dado visto nos fundamentos) ou um sistema como Kafka seriam mais apropriados, já que retêm o histórico mesmo para quem não estava conectado no momento.

## Persistência: o que acontece se o Redis reiniciar

Por padrão, Redis prioriza velocidade sobre durabilidade — mas oferece dois mecanismos opcionais de persistência em disco:

- **RDB (snapshot)**: salva uma foto completa do estado em disco em intervalos configuráveis (ex: a cada 5 minutos). Rápido de restaurar, mas qualquer escrita entre o último snapshot e uma falha é perdida.
- **AOF (Append-Only File)**: registra cada comando de escrita em um log sequencial, permitindo reconstruir o estado exato replay-ando o log. Mais durável (perde, no máximo, uma fração de segundo de escritas, dependendo da configuração de sincronização), mas mais lento e o arquivo de log cresce continuamente.

**No nosso quiz**: o placar de uma partida ao vivo provavelmente não precisa de durabilidade perfeita — se o Redis reiniciar no meio de uma partida e perder os últimos segundos de pontuação, isso é recuperável re-computando a partir do log de respostas do banco principal (que continua sendo a fonte de verdade durável). Essa é uma justificativa concreta para aceitar a persistência mais fraca (RDB, ou até nenhuma) em troca de desempenho, desde que exista uma fonte de verdade durável em outro lugar do sistema.

## Escalando além de uma instância

- **Réplicas de leitura**: cópias do Redis principal que atendem apenas leituras, distribuindo a carga de leitura — mesmo trade-off de atraso de replicação já visto em bancos relacionais.
- **Redis Cluster**: particiona os dados entre múltiplos nós usando 16.384 "hash slots" fixos, cada chave mapeada para um slot via hash, e cada slot atribuído a um nó do cluster — permitindo escalar tanto leitura quanto escrita horizontalmente, ao custo de operações que envolvem múltiplas chaves em slots diferentes se tornarem mais limitadas (comandos que operam sobre várias chaves de uma vez só funcionam sem restrição se todas estiverem no mesmo slot).

## Na prática

### Subindo no Docker

Para desenvolvimento local, um único container `redis:7` já é suficiente, com persistência AOF habilitada para não perder o placar a cada reinício do container:

```yaml
# docker-compose.yml
version: "3.8"
services:
  redis:
    image: redis:7
    container_name: redis-quiz
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

Equivalente em `docker run`, para quem só quer subir rápido sem compose:

```bash
docker run -d --name redis-quiz -p 6379:6379 -v redis-data:/data redis:7 redis-server --appendonly yes
```

### Cliente Java: operação central de escrita/leitura

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

### Operação avançada específica da tecnologia: failover automático com Redis Sentinel

Em produção, uma única instância Redis é um ponto único de falha — se ela cair no meio de um quiz ao vivo, o placar inteiro fica indisponível. O **Redis Sentinel** resolve isso monitorando um par primário/réplica e promovendo automaticamente a réplica a primário quando detecta que o primário está fora do ar.

Topologia típica: um primário, uma réplica, e **três** processos Sentinel (número ímpar, para permitir quorum em caso de partição de rede) rodando em hosts distintos, monitorando ambos:

```
                 ┌───────────┐
                 │ Sentinel 1│
                 └─────┬─────┘
┌───────────┐    ┌─────┴─────┐    ┌───────────┐
│ Sentinel 2│────│  Primário │────│  Réplica  │
└───────────┘    └───────────┘    └───────────┘
                 ┌─────┴─────┐
                 │ Sentinel 3│
                 └───────────┘
```

Trecho de `sentinel.conf` (replicado nos três processos Sentinel):

```
sentinel monitor placar-quiz 10.0.0.1 6379 2
sentinel down-after-milliseconds placar-quiz 5000
sentinel failover-timeout placar-quiz 10000
sentinel parallel-syncs placar-quiz 1
```

O `2` no `monitor` é o quorum: pelo menos 2 dos 3 Sentinels precisam concordar que o primário está inacessível (`down-after-milliseconds` sem resposta) antes de iniciar um failover — isso evita que uma falha de rede momentânea em um único Sentinel dispare uma promoção desnecessária. Quando o quorum é atingido, os Sentinels elegem um líder entre si, esse líder promove a réplica a novo primário (`REPLICAOF NO ONE`), reconfigura as réplicas remanescentes para apontar para o novo primário, e o cliente Redis (se configurado para descobrir o primário via Sentinel, em vez de um endereço fixo) passa a rotear escritas para o novo endereço automaticamente. No nosso quiz, isso significa que uma queda do nó primário durante uma partida ao vivo se traduz em alguns segundos de indisponibilidade de escrita, não em perda total do placar.

### Evolução/schema/migração

Redis não tem schema formal, mas isso não significa que o **formato** de um valor nunca muda. Um exemplo comum no nosso cenário: o perfil de um jogador começa guardado como uma string JSON serializada (`perfil:jogador_42` → `'{"nome":"...","nivel":3}'`), mas a equipe decide migrar para um Hash, para permitir atualizar um único campo (ex: `nivel`) sem reescrever o objeto inteiro.

Migrar isso sem quebrar leitores em produção (que ainda esperam a string JSON) tipicamente usa uma estratégia de **dual-write / dual-read** durante uma janela de transição:

1. **Dual-write**: o código de escrita passa a gravar nos dois formatos simultaneamente — a string JSON antiga (`SET perfil:jogador_42 '{...}'`) e o novo hash (`HSET perfil_h:jogador_42 nome "..." nivel 3`) — para que ambos fiquem sempre consistentes enquanto a migração está em andamento.
2. **Backfill**: um job assíncrono varre as chaves antigas existentes e popula o novo formato para os perfis que ainda não foram reescritos desde que o dual-write começou.
3. **Dual-read com fallback**: o código de leitura tenta o novo formato (`HGETALL perfil_h:jogador_42`) primeiro e cai para o formato antigo (`GET perfil:jogador_42`) se o hash ainda não existir — garantindo que nenhum leitor quebre durante a transição.
4. **Corte final**: quando a telemetria confirma que 100% das leituras estão vindo do novo formato, o dual-write é desligado e as chaves antigas são removidas (ou deixadas expirar).

Essa abordagem evita qualquer janela em que um leitor receba um erro de "formato inesperado" — o custo é a complexidade temporária de manter os dois caminhos de escrita/leitura durante a migração.

### Principais usos

- **Cache de leitura** na frente de um banco relacional ou de um serviço externo lento, reduzindo latência e carga no sistema de origem.
- **Rate limiting** em APIs públicas, usando contadores com TTL (janela fixa) ou sorted sets (janela deslizante, como leaky/token bucket implementado sobre `ZADD`/`ZREMRANGEBYSCORE`).
- **Session store** para aplicações web, guardando sessões de usuário com expiração automática via TTL.
- **Leaderboards** em jogos e aplicações com ranking (exatamente o caso do nosso quiz), usando sorted sets.
- **Pub/Sub leve** para notificações em tempo real onde perder uma mensagem ocasional é aceitável (ex: "atualização disponível", contagens de presença).

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que Redis é "um cache rápido em memória", menciona TTL e talvez sorted sets para ranking |
| Sênior | Escolhe a estrutura de dados certa por caso de uso com justificativa (não só "cache"), implementa rate limiting e lock distribuído corretamente com os comandos certos, reconhece o limite de confiabilidade de um lock de nó único |
| Staff+ | Além do acima, discute proativamente o risco do single-threaded model em operações caras, justifica a escolha entre RDB/AOF/sem persistência com base em qual é a fonte de verdade durável do sistema, e antecipa limitações de comandos multi-chave em um Redis Cluster |

## Erros comuns

- Tratar Redis apenas como cache, ignorando rate limiting, locks, pub/sub e leaderboards como casos de uso igualmente centrais.
- Implementar um "lock" com `GET` seguido de `SET` (duas operações separadas) em vez de `SET ... NX` atômico — isso reintroduz a condição de corrida que o lock deveria eliminar.
- Apresentar um lock Redis de nó único como uma garantia de correção absoluta, sem mencionar seus limites.
- Não considerar o risco de um comando caro travar toda a instância, dado o modelo single-threaded.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que usar `INCR` em vez de `GET` seguido de `SET` para um contador?" (atomicidade — evita condição de corrida entre ler e escrever).
- "O que acontece com o rate limiter se o Redis cair no meio de uma partida?" (depende da estratégia de failover/réplica — vale reconhecer que, sem uma réplica configurada, os contadores em andamento se perdem, e o sistema precisa decidir se isso é aceitável).
- "Como você lidaria com uma chave (ex: um jogador viral) recebendo volume desproporcional de tráfego em um Redis Cluster?" (revisita o conceito de hot key/hot partition, já visto no deep dive de Kafka).
