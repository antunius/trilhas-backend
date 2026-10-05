---
slug: redis-escala-failover
categorySlug: system-design
title: "Escalando o Redis: réplicas, Cluster e Sentinel"
navTitle: Escala e failover
summary: "Escalar leitura com réplicas, escrita com Redis Cluster e manter disponibilidade com o Sentinel"
level: intermediario
order: 71
section: deep-dives-tecnologias
group: "Redis"
---

## Objetivos de aprendizagem

- [ ] Diferenciar réplicas de leitura, Redis Cluster e Sentinel
- [ ] Explicar o papel do quorum no failover automático

*Retomando o cenário da unidade: uma plataforma de quiz ao vivo, com placar, limite de respostas por jogador e um lock para contar uma resposta só por pergunta.*

## Escalando além de uma instância

- **Réplicas de leitura**: cópias do Redis principal que atendem apenas leituras, distribuindo a carga de leitura — mesmo trade-off de atraso de replicação já visto em bancos relacionais.
- **Redis Cluster**: particiona os dados entre múltiplos nós usando 16.384 "hash slots" fixos, cada chave mapeada para um slot via hash, e cada slot atribuído a um nó do cluster — permitindo escalar tanto leitura quanto escrita horizontalmente, ao custo de operações que envolvem múltiplas chaves em slots diferentes se tornarem mais limitadas (comandos que operam sobre várias chaves de uma vez só funcionam sem restrição se todas estiverem no mesmo slot).

## Operação avançada específica da tecnologia: failover automático com Redis Sentinel

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

## Lembre

- **Réplicas** escalam leitura; **Cluster** escala leitura e escrita com 16.384 slots.
- **Sentinel** promove uma réplica quando o primário cai.
- O **quorum** (2 de 3) evita failover por uma falha de rede de um só Sentinel.
