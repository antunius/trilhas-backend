---
slug: filas-pratica-entrevista
categorySlug: system-design
title: "Filas na prática e na entrevista"
navTitle: Na prática e na entrevista
summary: "Implementar fila com RabbitMQ e Spring, com retry e DLQ, e saber responder em entrevista"
level: intermediario
order: 45
section: tecnologias-chave
group: "Filas e mensageria"
---

## Objetivos de aprendizagem

- [ ] Configurar fila, DLQ e consumidor idempotente com Spring
- [ ] Responder com o nível esperado de um sênior

*Retomando o cenário da unidade: uma plataforma de vídeo que recebe 200 uploads por minuto no pico e precisa codificar cada vídeo em 4 resoluções.*

## Na prática

### Produtor e consumidor com Spring Boot e RabbitMQ

Dependência `spring-boot-starter-amqp`. A configuração da fila com DLQ:

```java
@Configuration
public class FilaConfig {

    @Bean
    Queue codificacao() {
        return QueueBuilder.durable("video.codificacao")
            .withArgument("x-dead-letter-exchange", "")
            .withArgument("x-dead-letter-routing-key", "video.codificacao.dlq")
            .build();
    }

    @Bean
    Queue codificacaoDlq() {
        return QueueBuilder.durable("video.codificacao.dlq").build();
    }
}
```

O produtor, que responde ao usuário sem esperar a codificação:

```java
@Service
public class UploadService {

    private final RabbitTemplate rabbit;

    public UploadService(RabbitTemplate rabbit) {
        this.rabbit = rabbit;
    }

    public void receberUpload(String videoId, String caminho) {
        // 1) arquivo já está salvo no armazenamento
        rabbit.convertAndSend("video.codificacao", new PedidoCodificacao(videoId, caminho));
        // 2) retorna na hora: o trabalho pesado acontece depois
    }
}
```

O consumidor idempotente, com retry limitado:

```java
@Component
public class CodificadorWorker {

    private final CodificadorService codificador;
    private final VideosProcessados processados;

    public CodificadorWorker(CodificadorService codificador, VideosProcessados processados) {
        this.codificador = codificador;
        this.processados = processados;
    }

    @RabbitListener(queues = "video.codificacao")
    public void processar(PedidoCodificacao pedido) {
        if (processados.jaFeito(pedido.videoId())) {
            return; // idempotência: reentrega não repete o trabalho
        }
        codificador.codificarTodasResolucoes(pedido); // lança exceção em caso de falha
        processados.marcar(pedido.videoId());
    }
}
```

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: auto      # ack só depois que o método termina sem exceção
        retry:
          enabled: true
          max-attempts: 3
          initial-interval: 2s
          multiplier: 2.0           # 2s, 4s... entre as tentativas
        default-requeue-rejected: false  # após esgotar, vai para a DLQ
```

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Diz "vou colocar uma fila" para desacoplar e absorver picos |
| Sênior | Justifica pelo cálculo de capacidade (média vs. pico), explica ack, retry e DLQ, e exige consumidor idempotente por causa do at-least-once |
| Staff+ | Discute ordenação (por chave/partição), backpressure, tamanho da fila como métrica de saúde, e a escolha entre fila e log de eventos |

## Erros comuns

- Tornar assíncrono um fluxo que precisa de resposta imediata, como a confirmação de pagamento.
- Introduzir uma fila sem dizer qual problema de acoplamento ou de pico ela resolve.
- Esquecer que at-least-once entrega duplicado e deixar o consumidor não idempotente.
- Não ter DLQ, de modo que uma mensagem com defeito trava a fila ou é perdida em silêncio.
- Não monitorar o tamanho da fila: ela crescendo sem parar significa que os consumidores não dão conta.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se o worker cai no meio da codificação?" (sem ack, a fila reentrega a outro worker; por isso a tarefa precisa ser idempotente.)
- "A fila está crescendo e não para. O que faz?" (verificar se os consumidores estão lentos, escalar mais workers, ou aplicar backpressure no produtor se o gargalo é permanente.)
- "Como garantir a ordem das mensagens de um mesmo vídeo?" (rotear por chave para a mesma partição ou consumidor, aceitando perder o paralelismo dentro dessa chave.)
- "Por que não usar apenas um endpoint HTTP síncrono?" (o pico exigiria dimensionar para o máximo, e uma falha do worker perderia o pedido sem retry nem DLQ.)

## Lembre

- A DLQ é configurada como **dead-letter exchange** da fila principal.
- `default-requeue-rejected: false` manda a mensagem à DLQ depois de esgotar as tentativas.
- Monitore o **tamanho da fila**: crescendo sem parar, os consumidores não dão conta.
