package com.trilhas.kafka.lab;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PedidoProducer {

  private static final Logger log = LoggerFactory.getLogger(PedidoProducer.class);

  private final KafkaTemplate<String, PedidoCriado> kafka;
  private final String topic;

  public PedidoProducer(
      KafkaTemplate<String, PedidoCriado> kafka, @Value("${lab.topic}") String topic) {
    this.kafka = kafka;
    this.topic = topic;
  }

  public void publicar(String pedidoId, int totalCentavos, boolean comKey) {
    PedidoCriado evento =
        new PedidoCriado(UUID.randomUUID().toString(), pedidoId, totalCentavos, null);
    String key = comKey ? pedidoId : null;
    kafka
        .send(topic, key, evento)
        .whenComplete(
            (result, ex) -> {
              if (ex != null) {
                log.error("Falha ao publicar {}", pedidoId, ex);
                return;
              }
              var meta = result.getRecordMetadata();
              log.info(
                  "publicado topic={} partition={} offset={} key={}",
                  meta.topic(),
                  meta.partition(),
                  meta.offset(),
                  key);
            });
  }
}
