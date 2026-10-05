---
slug: kafka-visao-geral
categorySlug: system-design
title: "Kafka: o que é e por que não uma fila simples"
navTitle: O que é o Kafka
summary: "Entender o Kafka como um log de eventos e por que ele aparece no lugar de uma fila tradicional"
level: intermediario
order: 80
section: deep-dives-tecnologias
group: "Kafka"
---

## Objetivos de aprendizagem

- [ ] Explicar o Kafka como um log de eventos, e não como uma fila que apaga o que foi lido
- [ ] Dizer por que uma fila simples não basta quando vários serviços precisam do mesmo evento
- [ ] Estimar a vazão de um sistema e ver por que ela exige várias partições

## Cenário de referência da unidade

Todas as lições de Kafka usam o mesmo cenário: um sistema de rastreamento de entregas, estilo "onde está meu pedido". Cada atualização de posição de um entregador gera um evento. Três serviços precisam consumir esses eventos de forma independente: o app do cliente (mapa em tempo real), o painel de suporte e um pipeline de analytics.

## O que é o Kafka, em uma frase

Kafka é um sistema de mensageria distribuído que funciona como um **log de eventos**: produtores escrevem eventos no fim desse log, e consumidores leem esses eventos. A diferença para uma fila tradicional é que o evento **não desaparece depois de lido**, e vários leitores independentes podem ler o mesmo log, cada um do seu próprio ponto de partida.

A analogia é um caderno de registros em que só se escreve na última linha. Qualquer pessoa pode ler o caderno do começo, marcando com o dedo até onde já leu, e ler não apaga nada para os outros.

## Por que uma fila simples não bastaria aqui

Um candidato apressado proporia uma fila comum, do tipo SQS, e seguiria em frente. O problema: numa fila tradicional, a mensagem consumida normalmente desaparece. Se três serviços precisam ler o mesmo evento, há dois caminhos ruins:

- **Duplicar a mensagem em três filas.** É frágil, e todo evento novo exige lembrar de atualizar três lugares.
- **Aceitar que só um serviço a lê.** Os outros dois ficam sem o dado.

O Kafka resolve isso de forma nativa: vários grupos de consumidores leem o mesmo tópico do começo ao fim, cada um com o seu próprio progresso. Esse é, sozinho, o motivo mais comum para o Kafka aparecer em vez de uma fila mais simples. Na entrevista, vale dizer isso explicitamente em vez de anunciar apenas "vou usar Kafka".

## Números concretos para ancorar a escala

Uma única partição, em hardware comum, sustenta algo entre dezenas e algumas centenas de milhares de mensagens por segundo para mensagens pequenas. A ordem de grandeza real depende do tamanho da mensagem e do disco. O ponto central é que **existe um teto por partição**, porque ela é processada sequencialmente.

No nosso cenário, 500 mil entregadores ativos enviam uma atualização a cada 5 segundos:

> 500.000 ÷ 5 = **100.000 eventos por segundo**

Isso está perto o bastante do teto de uma única partição para justificar, por si só, a necessidade de várias partições dividindo a carga. As próximas lições mostram como elas funcionam.

## Lembre

- Kafka é um **log**: o evento fica retido e vários leitores independentes o leem.
- O argumento mais forte contra a fila simples é **vários consumidores independentes do mesmo evento**.
- Há um teto de vazão por partição, e é ele que obriga a dividir o tópico.
