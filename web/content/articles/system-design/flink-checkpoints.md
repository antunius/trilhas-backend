---
slug: flink-checkpoints
categorySlug: system-design
title: "Checkpoints e recuperação de falhas"
navTitle: Checkpoints
summary: "Entender como o Flink sobrevive a uma falha sem perder o estado e como chega ao exactly-once"
level: intermediario
order: 90
section: deep-dives-tecnologias
group: "Flink"
---

## Objetivos de aprendizagem

- [ ] Explicar como os checkpoints e as barriers recuperam o estado
- [ ] Descrever como o escalonamento redistribui key groups

*Retomando o cenário da unidade: um painel de métricas em tempo real para uma plataforma de anúncios, com cliques por minuto por campanha.*

## Checkpoints: sobrevivendo a uma falha no meio do processamento

Diferente de um consumidor simples e stateless, o Flink mantém estado interno real (a contagem parcial de cada janela em andamento) que precisa sobreviver a falhas — se um worker cair no meio de uma janela, perder essa contagem parcial significaria começar a métrica daquele período do zero, incorretamente.

Flink resolve isso com **checkpoints**: snapshots periódicos (ex: a cada 30 segundos) de todo o estado interno, salvos de forma durável. Se um worker falha, o processamento é retomado a partir do último checkpoint salvo, reprocessando apenas os eventos que chegaram depois dele — não desde o início do stream inteiro, e sem perder o progresso já computado antes do checkpoint.

## Operação avançada específica da tecnologia

**Checkpointing e recuperação de falha.** `env.enableCheckpointing(30_000)` faz o JobManager injetar periodicamente marcadores especiais — **checkpoint barriers** — no início do stream, que fluem junto com os dados normais através de cada operador. Quando um operador recebe um barrier em todas as suas entradas, ele tira um snapshot do próprio estado (aqui, as contagens parciais de janelas ainda abertas) e repassa o barrier adiante. Com o **RocksDB state backend** (configurado no `docker-compose.yml` acima), esse estado é mantido em disco local via RocksDB e os snapshots incrementais são enviados de forma assíncrona para armazenamento durável (`state.checkpoints.dir`), o que permite estado muito maior que a memória disponível e checkpoints que não bloqueiam o processamento.

Se um TaskManager cai, o JobManager reinicia as subtarefas afetadas a partir do último checkpoint bem-sucedido e reposiciona os offsets de leitura do Kafka source para o ponto salvo naquele checkpoint. Combinado com `DeliveryGuarantee.EXACTLY_ONCE` no `KafkaSink` (que usa transações do Kafka — os dados só ficam visíveis para consumidores quando o checkpoint correspondente é confirmado), isso dá **exactly-once** ponta a ponta: nenhum clique é contado duas vezes nem perdido, mesmo com falhas no meio do processamento.

**Distribuição de tarefas ao escalar o paralelismo.** O estado por chave (`campaignId`) é internamente particionado em um número fixo de **key groups** (definido por `maxParallelism`), e cada key group é atribuído a exatamente uma subtarefa. Ao aumentar o paralelismo do job (por exemplo, de 4 para 8), o Flink não redistribui chaves individualmente — ele reatribui key groups inteiros entre as subtarefas, restaurando o estado correspondente a partir do último checkpoint/savepoint. Isso é o que torna possível escalar (ou reduzir) o job sem perder estado nem exigir reprocessamento desde o início.

## Lembre

- Um **checkpoint** é um snapshot periódico e durável de todo o estado.
- Após uma falha, o job volta ao último checkpoint e reprocessa só o que veio depois.
- Exactly-once ponta a ponta combina checkpoints com um **sink transacional**.
