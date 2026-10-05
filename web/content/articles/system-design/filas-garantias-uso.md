---
slug: filas-garantias-uso
categorySlug: system-design
title: "Garantias de entrega, idempotência e quando usar fila"
navTitle: Garantias e quando usar
summary: "Comparar at-most-once e at-least-once, exigir consumidor idempotente e saber quando usar fila ou log"
level: intermediario
order: 44
section: tecnologias-chave
group: "Filas e mensageria"
---

## Objetivos de aprendizagem

- [ ] Comparar at-most-once, at-least-once e exactly-once
- [ ] Decidir quando introduzir uma fila e quando preferir um log

*Retomando o cenário da unidade: uma plataforma de vídeo que recebe 200 uploads por minuto no pico e precisa codificar cada vídeo em 4 resoluções.*

## Garantias de entrega

Uma pergunta decisiva é: quantas vezes uma mensagem chega ao consumidor?

- **At-most-once** (no máximo uma): o consumidor confirma **antes** de processar. Se cair no meio, a mensagem se perde. Rápido, mas aceita perda.
- **At-least-once** (pelo menos uma): o consumidor confirma **depois** de processar. Se cair antes do ack, a mensagem é reentregue, e então pode ser processada **duas vezes**. É o padrão da maioria dos sistemas.
- **Exactly-once** (exatamente uma): difícil e caro de garantir de ponta a ponta. Na prática, simula-se com at-least-once mais um consumidor idempotente.

### Idempotência no consumidor

Como at-least-once pode entregar duas vezes, o consumidor precisa ser **idempotente**: processar a mesma mensagem duas vezes não pode causar dano. Codificar o mesmo vídeo duas vezes só desperdiça tempo, mas **cobrar** um cliente duas vezes é um problema real. O truque: guardar o `id` da mensagem já processada e ignorar repetições.

## Quando introduzir uma fila

Uma fila faz sentido quando:

1. A tarefa pode ser **assíncrona** sem prejudicar a experiência (vídeo, relatório, e-mail).
2. Existe risco de **picos** que sobrecarregariam o processamento direto.
3. É preciso **desacoplar** serviços que evoluem e escalam de forma independente.
4. A tarefa é **lenta ou instável** e precisa de retry.

Uma fila **não** faz sentido quando o fluxo precisa de resposta imediata (confirmação de pagamento) ou quando o volume é tão pequeno que a complexidade extra não compensa.

## Fila ou log de eventos

Uma **fila tradicional** (RabbitMQ, SQS) entrega cada mensagem a um consumidor e a apaga depois do ack: ótima para distribuir tarefas. Um **log de eventos** (Kafka) retém as mensagens e permite que vários grupos de consumidores leiam o mesmo fluxo de forma independente, inclusive relendo o passado. O deep dive de Kafka mostra a diferença em detalhe. A regra: **tarefa para um trabalhador** pede fila, e **fato que vários sistemas precisam ver** pede log.

## Lembre

- **At-least-once** é o padrão: confirme **depois** de processar.
- O consumidor deve ser **idempotente**.
- **Tarefa para um trabalhador** pede fila; **fato que vários sistemas precisam ver** pede log.
