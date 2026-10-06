---
slug: processos-multi-etapas
categorySlug: system-design
title: "Padrão: Processos de Múltiplas Etapas"
navTitle: Processos de Múltiplas Etapas
summary: Reconhecer quando um fluxo de negócio envolve múltiplas etapas coordenadas entre diferentes serviços
level: intermediario
order: 117
section: padroes-recorrentes
group: "Fluxos longos"
---

## Objetivos de aprendizagem

- [ ] Reconhecer quando um fluxo de negócio envolve múltiplas etapas coordenadas entre diferentes serviços
- [ ] Conhecer abordagens para manter consistência ao longo desse tipo de fluxo

## Conteúdo

### Reconhecendo o padrão

![Saga / etapas compensáveis](/diagrams/sd-processos-multi-etapas.svg)

Alguns fluxos de negócio não se resolvem em uma única operação atômica — eles envolvem várias etapas, possivelmente em serviços diferentes, que precisam acontecer em uma ordem específica (ex: reservar estoque, processar pagamento, confirmar pedido, notificar o usuário). O desafio central é: o que acontece se uma etapa no meio do processo falhar, depois que etapas anteriores já foram concluídas com sucesso?

### Orquestração vs. coreografia

Uma abordagem é ter um serviço orquestrador central que chama cada etapa em sequência e decide o que fazer em caso de falha (essa abordagem tende a ser mais fácil de entender e depurar). A outra é a coreografia, onde cada serviço reage a eventos publicados pelos anteriores, sem um coordenador central — mais desacoplada, porém mais difícil de rastrear o estado geral do processo em um dado momento.

### Desfazendo etapas já concluídas (compensação)

Quando uma etapa falha após etapas anteriores já terem sido concluídas, é necessário desfazer o que já foi feito — por exemplo, se o pagamento falha depois do estoque já ter sido reservado, a reserva de estoque precisa ser revertida. Esse conjunto de ações de reversão é chamado de compensação, e precisa ser planejado para cada etapa que tenha efeitos colaterais persistentes.

## Exemplo aplicado

Em um fluxo de compra de e-commerce, um orquestrador central pode coordenar: reservar o item no estoque, processar o pagamento, confirmar o pedido. Se o pagamento falhar após o estoque já ter sido reservado, o orquestrador aciona a ação de compensação correspondente, liberando o item reservado de volta ao estoque disponível.

## Implementando na prática (Java + Spring Boot)

### Como implementar

Na orquestração, um único serviço (o orquestrador) conhece a sequência completa do processo, chama cada etapa explicitamente e decide o que fazer quando uma etapa falha — isso concentra a lógica de controle em um lugar só, o que facilita entender o estado atual do processo e depurar problemas em produção. Na coreografia, cada serviço publica eventos sobre o que fez e reage a eventos de outros serviços, sem que ninguém tenha a visão completa do fluxo — é mais desacoplada, mas para reconstruir "o que aconteceu com o pedido X" é preciso juntar eventos espalhados por vários serviços.

Para a maioria dos casos (especialmente fluxos como checkout, com poucas etapas e necessidade de auditoria clara), vale a pena começar com uma saga orquestrada: um serviço central publica um comando para cada etapa, espera a confirmação (ou falha) e, se algo falhar no meio do caminho, dispara as ações de compensação das etapas já concluídas, na ordem inversa. Isso evita reimplementar transações distribuídas (2PC) — cada etapa é uma transação local simples, e a consistência entre elas é garantida pela lógica da saga, não pelo banco de dados.

### Como usar em Java com Spring Boot

Abaixo, um orquestrador simples baseado em `@KafkaListener`: ele inicia a saga publicando um comando de reserva de estoque, escuta o resultado de cada etapa e decide o próximo passo — incluindo a compensação (liberar o estoque) se o pagamento falhar.

```java
@Service
@RequiredArgsConstructor
public class PedidoSagaOrchestrator {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    // Dispara a saga: primeira etapa é reservar o item no estoque
    public void iniciarCompra(PedidoCriado evento) {
        var comando = new ReservarEstoqueCommand(evento.pedidoId(), evento.itemId(), evento.quantidade());
        kafkaTemplate.send("estoque.reservar", evento.pedidoId(), comando);
    }

    // Etapa 1 concluída -> segue para pagamento
    @KafkaListener(topics = "estoque.reservado", groupId = "pedido-saga")
    public void aoReservarEstoque(EstoqueReservado evento) {
        var comando = new ProcessarPagamentoCommand(evento.pedidoId(), evento.valor());
        kafkaTemplate.send("pagamento.processar", evento.pedidoId(), comando);
    }

    // Etapa 1 falhou -> não há nada a compensar ainda, apenas encerra a saga
    @KafkaListener(topics = "estoque.reserva-falhou", groupId = "pedido-saga")
    public void aoFalharReserva(EstoqueReservaFalhou evento) {
        kafkaTemplate.send("pedido.cancelado", evento.pedidoId(),
                new PedidoCancelado(evento.pedidoId(), "Estoque indisponível"));
    }

    // Etapa 2 concluída -> confirma o pedido
    @KafkaListener(topics = "pagamento.aprovado", groupId = "pedido-saga")
    public void aoAprovarPagamento(PagamentoAprovado evento) {
        kafkaTemplate.send("pedido.confirmar", evento.pedidoId(),
                new ConfirmarPedidoCommand(evento.pedidoId()));
    }

    // Etapa 2 falhou -> ação de compensação: liberar o estoque já reservado
    @KafkaListener(topics = "pagamento.recusado", groupId = "pedido-saga")
    public void aoRecusarPagamento(PagamentoRecusado evento) {
        var compensacao = new LiberarEstoqueCommand(evento.pedidoId(), evento.itemId(), evento.quantidade());
        kafkaTemplate.send("estoque.compensar", evento.pedidoId(), compensacao);

        kafkaTemplate.send("pedido.cancelado", evento.pedidoId(),
                new PedidoCancelado(evento.pedidoId(), "Pagamento recusado"));
    }
}
```

No serviço de estoque, o listener de compensação apenas reverte o efeito colateral já aplicado:

```java
@KafkaListener(topics = "estoque.compensar", groupId = "estoque-service")
public void liberarEstoque(LiberarEstoqueCommand comando) {
    estoqueRepository.devolverQuantidade(comando.itemId(), comando.quantidade());
}
```

Cada etapa publica um evento de sucesso ou falha no seu próprio tópico; o orquestrador nunca chama os outros serviços diretamente, apenas reage às mensagens. Isso mantém as etapas fracamente acopladas entre si, mesmo com a lógica de decisão centralizada.

### Como configurar

Dependência Maven (`pom.xml`):

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

Configuração dos tópicos e do consumer group em `application.yml`:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: pedido-saga
      auto-offset-reset: earliest
      properties:
        spring.json.trusted.packages: "com.exemplo.pedidos.saga"
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

app:
  topics:
    estoque-reservar: estoque.reservar
    estoque-reservado: estoque.reservado
    estoque-reserva-falhou: estoque.reserva-falhou
    estoque-compensar: estoque.compensar
    pagamento-processar: pagamento.processar
    pagamento-aprovado: pagamento.aprovado
    pagamento-recusado: pagamento.recusado
    pedido-confirmar: pedido.confirmar
    pedido-cancelado: pedido.cancelado
```

Em produção, vale habilitar `enable.idempotence=true` no producer e usar `read_committed` no consumer caso transações Kafka sejam usadas, para evitar que uma falha de rede duplique comandos de compensação.

## Erros comuns

- Tratar um fluxo de múltiplas etapas como se fosse uma única transação atômica simples, ignorando o que acontece em caso de falha parcial.
- Não planejar as ações de compensação necessárias para reverter etapas já concluídas quando uma etapa posterior falha.
