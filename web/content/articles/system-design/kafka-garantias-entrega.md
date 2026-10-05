---
slug: kafka-garantias-entrega
categorySlug: system-design
title: "Garantias de entrega e commit de offset"
navTitle: Garantias de entrega
summary: "Comparar at-most-once, at-least-once e exactly-once, e entender por que o consumidor idempotente costuma ser a melhor escolha"
level: intermediario
order: 84
section: deep-dives-tecnologias
group: "Kafka"
---

## Objetivos de aprendizagem

- [ ] Relacionar o momento do commit de offset à garantia de entrega obtida
- [ ] Diferenciar at-most-once, at-least-once e exactly-once, com o custo de cada um
- [ ] Explicar por que at-least-once com consumidor idempotente costuma bastar

## A pergunta que separa candidatos

Quando o consumer confirma (commita) o offset de uma mensagem? Antes ou depois de processá-la? A resposta decide o que acontece se ele cair no meio.

## Commit antes de processar: at-most-once

O consumer commita o offset e só depois processa. É rápido, mas se ele cair no meio do processamento, o offset já avançou, e a mensagem **se perde para sempre**: ao reiniciar, o consumer começa depois dela. A garantia é "no máximo uma vez".

## Commit depois de processar: at-least-once

O consumer processa e só depois commita. Se ele cair depois de processar mas antes de commitar, ao reiniciar ele relê a mesma mensagem, e ela é **processada duas vezes**. A garantia é "pelo menos uma vez", o padrão mais comum.

Isso só é seguro se o processamento for **idempotente**: processar a mesma atualização de posição duas vezes não pode causar efeito colateral duplicado, como enviar duas notificações push. Uma forma simples é guardar o identificador do evento já tratado e ignorar repetições.

## Exactly-once

Obtido por transações: o producer e o commit de offset participam da mesma transação atômica. Funciona, mas tem **custo real** em vazão e em complexidade operacional. Por isso a maioria dos sistemas prefere at-least-once mais idempotência no consumer, que é mais simples e "suficientemente correto".

| Garantia | Commit | Se o consumer cair | Custo |
|---|---|---|---|
| At-most-once | Antes de processar | Perde a mensagem | Baixo |
| At-least-once | Depois de processar | Reprocessa (duplica) | Baixo, exige idempotência |
| Exactly-once | Em transação | Nem perde nem duplica | Alto |

## No nosso cenário

Se o app do cliente processar a mesma atualização de posição duas vezes, o pior caso é mostrar a mesma localização duas vezes, o que é inofensivo. Isso é um argumento concreto para at-least-once, em vez de pagar o custo do exactly-once. Já um serviço que **cobra** o cliente por entrega concluída precisaria de mais cuidado, porque uma duplicata teria efeito financeiro.

## Na prática com Spring Boot

Commit manual **depois** do processamento. Com `ack-mode: manual`, o offset só avança quando o código chama `acknowledge()`:

```yaml
spring:
  kafka:
    consumer:
      enable-auto-commit: false
    listener:
      ack-mode: manual
```

```java
@KafkaListener(topics = "atualizacoes-entrega", groupId = "app-cliente")
public void aoReceber(ConsumerRecord<String, String> registro, Acknowledgment ack) {
    String idEvento = registro.topic() + "-" + registro.partition() + "-" + registro.offset();

    if (!eventosTratados.jaTratado(idEvento)) {     // idempotência
        mapa.atualizar(registro.key(), registro.value());
        eventosTratados.marcar(idEvento);
    }
    ack.acknowledge();   // só aqui o offset avança: at-least-once
}
```

## Lembre

- **Commit antes** de processar é at-most-once (pode perder). **Commit depois** é at-least-once (pode duplicar).
- At-least-once exige consumidor **idempotente**.
- Exactly-once existe, mas custa vazão e complexidade, e raramente é necessário.
