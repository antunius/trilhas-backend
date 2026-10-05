---
slug: redis-pratica-entrevista
categorySlug: system-design
title: "Redis na prática e na entrevista"
navTitle: Na prática e na entrevista
summary: "Subir o Redis localmente, migrar formatos de valor sem quebrar leitores e saber o que diferencia respostas média e sênior"
level: intermediario
order: 72
section: deep-dives-tecnologias
group: "Redis"
---

## Objetivos de aprendizagem

- [ ] Subir o Redis com persistência AOF e migrar formatos com dual-write
- [ ] Reconhecer o que diferencia uma resposta média de uma sênior sobre Redis

## Subindo no Docker

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

## Evolução/schema/migração

Redis não tem schema formal, mas isso não significa que o **formato** de um valor nunca muda. Um exemplo comum no nosso cenário: o perfil de um jogador começa guardado como uma string JSON serializada (`perfil:jogador_42` → `'{"nome":"...","nivel":3}'`), mas a equipe decide migrar para um Hash, para permitir atualizar um único campo (ex: `nivel`) sem reescrever o objeto inteiro.

Migrar isso sem quebrar leitores em produção (que ainda esperam a string JSON) tipicamente usa uma estratégia de **dual-write / dual-read** durante uma janela de transição:

1. **Dual-write**: o código de escrita passa a gravar nos dois formatos simultaneamente — a string JSON antiga (`SET perfil:jogador_42 '{...}'`) e o novo hash (`HSET perfil_h:jogador_42 nome "..." nivel 3`) — para que ambos fiquem sempre consistentes enquanto a migração está em andamento.
2. **Backfill**: um job assíncrono varre as chaves antigas existentes e popula o novo formato para os perfis que ainda não foram reescritos desde que o dual-write começou.
3. **Dual-read com fallback**: o código de leitura tenta o novo formato (`HGETALL perfil_h:jogador_42`) primeiro e cai para o formato antigo (`GET perfil:jogador_42`) se o hash ainda não existir — garantindo que nenhum leitor quebre durante a transição.
4. **Corte final**: quando a telemetria confirma que 100% das leituras estão vindo do novo formato, o dual-write é desligado e as chaves antigas são removidas (ou deixadas expirar).

Essa abordagem evita qualquer janela em que um leitor receba um erro de "formato inesperado" — o custo é a complexidade temporária de manter os dois caminhos de escrita/leitura durante a migração.

## Principais usos

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

## Lembre

- Migração de formato: **dual-write, backfill, dual-read, corte**.
- Redis é mais que cache: rate limit, lock, ranking, sessão e pub/sub.
- Um comando caro e o lock "perfeito" são as duas pegadinhas favoritas.
