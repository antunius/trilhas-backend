---
slug: flink-fundamentos
categorySlug: system-design
title: "Flink: streams, tempo, estado e keyBy"
navTitle: Fundamentos do Flink
summary: "Entender o vocabulário do Flink: stream, tempo do evento, estado, keyBy, job e slot"
level: intermediario
order: 87
section: deep-dives-tecnologias
group: "Flink"
---

## Objetivos de aprendizagem

- [ ] Diferenciar stream de batch e tempo do evento de tempo de processamento
- [ ] Explicar o papel do estado e do keyBy num job de contagem

## Cenário de referência da unidade

Vamos usar um painel de métricas em tempo real para uma plataforma de anúncios, mostrando "cliques por minuto por campanha" para os times de marketing acompanharem o desempenho de uma campanha enquanto ela está no ar.

## Fundamentos: o vocabulário básico, peça por peça

### O que é o Flink, em uma frase

Flink é um motor que processa **fluxos de eventos continuamente**, mantendo estado (contagens, somas, o último valor visto) enquanto os eventos chegam, e sobrevivendo a falhas sem perder esse estado. Em vez de rodar uma consulta sobre dados parados, você deixa uma consulta **sempre ligada** sobre dados que não param de chegar.

### Stream e evento

Um **evento** é um fato que aconteceu: "o usuário 7 clicou no anúncio 12 às 10:00:58". Um **stream** é a sequência ilimitada desses eventos, que nunca "termina". A diferença para um **batch** é essa: o batch processa um conjunto fechado (os cliques de ontem), e o stream processa o que chega agora.

### Tempo do evento e tempo de processamento

Há dois relógios. O **tempo do evento** é quando o clique realmente aconteceu (10:00:58). O **tempo de processamento** é quando o Flink o recebeu (10:01:05, por exemplo, por causa de um atraso de rede). Para uma métrica de "cliques por minuto" correta, o que importa é o tempo do evento, e é por isso que os watermarks (mais adiante) existem.

### Estado

**Estado** é a memória que o operador guarda entre eventos: a contagem parcial de cliques do minuto atual de cada campanha. Um operador sem estado olha cada evento isolado (filtrar cliques de bots); um com estado acumula (contar).

### keyBy

`keyBy(campaignId)` divide o stream em sub-streams, um por campanha, de modo que **todos os eventos da mesma campanha cheguem à mesma tarefa**. É o que permite manter uma contagem por campanha sem que duas tarefas disputem o mesmo número.

### Job, JobManager, TaskManager e slot

Um **job** é o programa de processamento que você submete. O **JobManager** coordena (distribui o trabalho, dispara checkpoints). Os **TaskManagers** executam. Cada TaskManager tem **slots**, e cada slot executa uma fatia do paralelismo do job.

### Juntando as peças: o caminho de um clique

1. Um clique é publicado no Kafka com seu tempo de evento.
2. O Flink o lê, extrai o `campaignId` e o roteia com `keyBy` para a tarefa responsável.
3. A tarefa soma 1 à contagem da janela do minuto em que o clique aconteceu.
4. Quando o watermark passa do fim da janela, o resultado é emitido para o painel.

## Lembre

- Flink mantém uma consulta **sempre ligada** sobre dados que não param de chegar.
- Métricas corretas usam o **tempo do evento**, não o de processamento.
- `keyBy` manda todos os eventos de uma chave para a **mesma tarefa**.
