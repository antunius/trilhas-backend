package com.trilhas.kafka.lab;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PedidoController {

  private final PedidoProducer producer;
  private final OutboxService outbox;

  public PedidoController(PedidoProducer producer, OutboxService outbox) {
    this.producer = producer;
    this.outbox = outbox;
  }

  @PostMapping("/pedidos")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public void criar(
      @RequestParam String pedidoId,
      @RequestParam(defaultValue = "8000") int totalCentavos,
      @RequestParam(defaultValue = "true") boolean comKey) {
    producer.publicar(pedidoId, totalCentavos, comKey);
  }

  @PostMapping("/pedidos/lote")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public void lote(
      @RequestParam(defaultValue = "true") boolean comKey,
      @RequestParam(defaultValue = "9") int n) {
    for (int i = 1; i <= n; i++) {
      String id = "pedido-" + ((i % 3) + 1);
      producer.publicar(id, 1000 * i, comKey);
    }
  }

  @PostMapping("/pedidos/outbox")
  @ResponseStatus(HttpStatus.CREATED)
  public PedidoEntity outbox(@RequestParam String pedidoId) {
    return outbox.salvarPedidoEOutbox(pedidoId);
  }
}
