---
slug: redis-rate-limiting
categorySlug: system-design
title: "Rate limiting com Redis"
navTitle: Rate limiting
summary: "Limitar respostas por jogador com INCR e expiração, e entender por que o contador é atômico"
level: intermediario
order: 67
section: deep-dives-tecnologias
group: "Redis"
---

## Objetivos de aprendizagem

- [ ] Implementar um rate limiter de janela fixa com INCR e EXPIRE
- [ ] Explicar por que o INCR é seguro com muitos clientes simultâneos

*Retomando o cenário da unidade: uma plataforma de quiz ao vivo, com placar, limite de respostas por jogador e um lock para contar uma resposta só por pergunta.*

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

### Em Spring Boot

Com `StringRedisTemplate` (dependência `spring-boot-starter-data-redis`), o mesmo limitador de 5 respostas a cada 10 segundos:

```java
@Service
public class LimitadorRespostas {

    private static final int LIMITE = 5;
    private static final Duration JANELA = Duration.ofSeconds(10);
    private final StringRedisTemplate redis;

    public LimitadorRespostas(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public boolean permitir(String jogadorId) {
        String chave = "contador:" + jogadorId;
        Long contagem = redis.opsForValue().increment(chave);   // INCR atômico
        if (contagem != null && contagem == 1) {
            redis.expire(chave, JANELA);                        // abre a janela na 1ª requisição
        }
        return contagem != null && contagem <= LIMITE;
    }
}
```

Há uma falha sutil: se o processo cair entre o `increment` e o `expire`, a chave fica sem expiração e o jogador é bloqueado para sempre. Em produção costuma-se executar os dois comandos num script Lua, para que sejam atômicos juntos.

## Lembre

- `INCR` é **atômico**: mil requisições simultâneas recebem valores distintos.
- Contador com TTL é uma janela **fixa**; janela deslizante usa sorted set e custa mais.
- `INCR` e `EXPIRE` separados têm uma brecha: use um script Lua para juntá-los.
