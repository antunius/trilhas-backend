---
slug: kafka-falhas-e-retencao
categorySlug: system-design
title: "Rebalanceamento, hot partitions, retries e retenção"
navTitle: Falhas e retenção
summary: "Entender o que acontece quando um consumer cai, quando uma chave domina o tráfego, quando o processamento falha e como a retenção permite reprocessar"
level: intermediario
order: 85
section: deep-dives-tecnologias
group: "Kafka"
---

## Objetivos de aprendizagem

- [ ] Explicar o que dispara um rebalanceamento e qual o efeito dele na latência
- [ ] Reconhecer uma hot partition e como evitá-la
- [ ] Escolher entre retry imediato, fila de retry e dead-letter para eventos que falham
- [ ] Usar a retenção do Kafka para reprocessar o histórico

## Rebalanceamento: quando um consumer cai

Se um consumer de um grupo falha, o Kafka percebe pela ausência de **heartbeats** e redistribui as partições dele entre os consumers restantes do grupo. Isso é o **rebalanceamento**. O mesmo acontece quando uma instância nova entra.

Durante o rebalanceamento, o grupo geralmente pausa o consumo por um breve período, de segundos conforme a configuração. É um detalhe real que vale mencionar ao discutir a latência ponta a ponta.

Duas configurações mudam o comportamento na prática:

- **Assignor.** O `RangeAssignor` e o `RoundRobinAssignor` fazem um "stop-the-world": revogam todas as partições de todos os consumers e redistribuem do zero. O `CooperativeStickyAssignor`, recomendado hoje, faz um rebalanceamento **incremental**: só as partições que precisam mudar de dono são revogadas, e o resto do grupo continua consumindo sem pausa.
- **Detecção de falha.** `session.timeout.ms` é o tempo sem heartbeat até considerar o consumer morto. `max.poll.interval.ms` é o tempo máximo entre chamadas de `poll()` antes de expulsar o consumer do grupo, o que importa quando o processamento de um lote demora.

```yaml
spring:
  kafka:
    consumer:
      properties:
        partition.assignment.strategy: org.apache.kafka.clients.consumer.CooperativeStickyAssignor
        session.timeout.ms: 15000
        max.poll.interval.ms: 300000
```

## Hot partitions: quando a chave vira um problema

Se a distribuição dos eventos entre as chaves não é uniforme, algumas partições recebem muito mais tráfego que outras. É uma **hot partition**. Imagine que um único entregador de teste gerasse um volume anormalmente alto: a partição dele ficaria sobrecarregada enquanto as outras ficam ociosas, e o paralelismo teórico de N partições não vira N vezes mais capacidade.

**Como reconhecer o risco na entrevista:** ao propor uma chave, pergunte em voz alta "essa chave tem distribuição razoavelmente uniforme, ou existe uma entidade que domina o volume?". Para detectar em produção, monitore o **consumer lag por partição**, e não só o lag total.

## Tratamento de erros e retries

Quando o processamento de um evento falha (o analytics não conseguiu gravar no banco por uma instabilidade), há três estratégias comuns:

- **Retry imediato.** Tenta de novo algumas vezes antes de desistir. Simples, mas se a falha for persistente, trava a partição inteira insistindo no mesmo evento.
- **Fila de retry.** O evento problemático vai para um tópico separado de retry, com atraso, e o consumer principal segue para os próximos eventos sem ficar bloqueado.
- **Dead-letter queue (DLQ).** Depois de um número máximo de tentativas, o evento vai para um tópico de "mensagens mortas", disponível para inspeção, sem bloquear o fluxo nem ser descartado em silêncio.

No nosso cenário, uma posição que falha no analytics (não crítico em tempo real) pode ir para uma fila de retry com atraso. Se a falha afetasse o app do cliente, onde a posição em tempo real é o produto, uma DLQ com alerta imediato seria mais apropriada, porque um atraso longo ali prejudica diretamente o usuário.

Com Spring Kafka, o retry com DLQ é uma configuração do container:

```java
@Bean
public DefaultErrorHandler errorHandler(KafkaTemplate<String, String> kafka) {
    // depois de 3 tentativas, 2 s entre elas, publica em atualizacoes-entrega.DLT
    var recoverer = new DeadLetterPublishingRecoverer(kafka);
    return new DefaultErrorHandler(recoverer, new FixedBackOff(2000L, 3));
}
```

## Retenção e replay

Diferente de uma fila tradicional, o Kafka retém os eventos por um período configurável (dias, ou indefinidamente), **independente de terem sido consumidos**. Um serviço novo, como um detector de atraso criado meses depois do lançamento, pode ler o tópico `atualizacoes-entrega` desde o início, reprocessando dias de histórico, sem afetar os consumers que já existem. Basta um novo `groupId` com `auto.offset.reset: earliest`.

## Lembre

- **Rebalanceamento** pausa o consumo; o assignor cooperativo reduz o estrago.
- **Hot partition** vem de uma chave dominante; monitore o lag **por partição**.
- Para eventos que falham, use **retry com atraso** e, esgotadas as tentativas, **DLQ**.
- A **retenção** permite reprocessar o histórico com um novo grupo.
