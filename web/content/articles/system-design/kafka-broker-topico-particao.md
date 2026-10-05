---
slug: kafka-broker-topico-particao
categorySlug: system-design
title: "Broker, tópico e partição"
navTitle: Broker, tópico e partição
summary: "Definir com precisão broker, tópico, partição e réplica, e a diferença entre tópico e partição"
level: intermediario
order: 81
section: deep-dives-tecnologias
group: "Kafka"
---

## Objetivos de aprendizagem

- [ ] Definir broker, tópico, partição e réplica sem confundir uns com os outros
- [ ] Explicar por que um tópico é dividido em partições

## Retomando o cenário

No rastreamento de entregas, cada posição do entregador vira um evento. Esta lição mostra **onde** esses eventos ficam guardados.

## Broker

Um broker é uma única máquina (ou processo) do cluster Kafka. Em produção, um cluster tem vários brokers trabalhando juntos, e cada um armazena uma parte dos dados e atende leituras e escritas para essa parte. Pense no broker como "um servidor do cluster Kafka", análogo a um nó em qualquer sistema distribuído.

## Tópico

Um tópico é o nome lógico de um canal de eventos. No nosso cenário teríamos um tópico chamado `atualizacoes-entrega`. Produtores escrevem eventos nomeando o tópico de destino, e consumidores se inscrevem nele para receber os eventos. É a unidade organizacional mais alta do Kafka, o equivalente ao "nome da fila".

## Partição

Um tópico não é guardado como um bloco único. Ele é dividido em **partições**, e cada partição é fisicamente um arquivo de log sequencial: os eventos são apenas anexados ao final, nunca reescritos no meio.

Se o tópico `atualizacoes-entrega` tem 8 partições, existem 8 logs sequenciais independentes, e cada um pode estar num broker diferente do cluster.

**Por que dividir em partições?** Duas razões centrais:

1. **Paralelismo.** Partições diferentes podem ser processadas por consumidores diferentes ao mesmo tempo.
2. **Tamanho.** O tópico pode ser maior do que uma única máquina conseguiria armazenar ou servir, já que partições diferentes vivem em brokers diferentes.

A confusão mais comum de quem estuda Kafka pela primeira vez é tratar tópico e partição como sinônimos. A relação é: **um tópico tem várias partições, e cada partição é um log independente.**

## Réplicas

Cada partição pode ter várias cópias, chamadas réplicas, espalhadas por brokers diferentes, para tolerância a falhas. Uma delas é a **líder**, que atende as leituras e escritas, e as outras seguem a líder. Se o broker que hospeda a líder cair, uma das réplicas assume automaticamente, sem perda de dados já confirmados, desde que a replicação tenha sido configurada corretamente.

Com fator de replicação 3, cada partição existe em três brokers. O cluster aguenta a queda de um broker sem perder a partição.

## Lembre

- **Tópico** é o canal lógico, e **partição** é cada log físico dentro dele.
- Partições dão **paralelismo** e permitem um tópico **maior que uma máquina**.
- Réplicas copiam cada partição em outros brokers, e a **líder** atende as requisições.
