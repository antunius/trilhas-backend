package com.trilhas.kafka.lab;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OutboxPublisher {

  private static final Logger log = LoggerFactory.getLogger(OutboxPublisher.class);

  private final OutboxRepository outbox;
  private final PedidoProducer producer;

  public OutboxPublisher(OutboxRepository outbox, PedidoProducer producer) {
    this.outbox = outbox;
    this.producer = producer;
  }

  @Scheduled(fixedDelay = 2000)
  @Transactional
  public void publicarPendentes() {
    for (OutboxEntity row : outbox.findByPublicadoFalse()) {
      try {
        producer.publicar(row.getPedidoId(), 8000, true);
        row.marcarPublicado();
        log.info("outbox publicada id={} pedido={}", row.getId(), row.getPedidoId());
      } catch (RuntimeException ex) {
        log.warn("broker indisponível, outbox {} fica na caixinha", row.getId());
      }
    }
  }
}
