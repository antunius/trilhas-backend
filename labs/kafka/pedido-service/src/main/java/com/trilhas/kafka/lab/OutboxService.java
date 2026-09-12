package com.trilhas.kafka.lab;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OutboxService {

  private final PedidoRepository pedidos;
  private final OutboxRepository outbox;

  public OutboxService(PedidoRepository pedidos, OutboxRepository outbox) {
    this.pedidos = pedidos;
    this.outbox = outbox;
  }

  @Transactional
  public PedidoEntity salvarPedidoEOutbox(String pedidoId) {
    PedidoEntity pedido = pedidos.save(new PedidoEntity(pedidoId, 8000));
    outbox.save(new OutboxEntity(pedidoId));
    return pedido;
  }
}
