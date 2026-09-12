package com.trilhas.kafka.lab;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class PedidoConsumer {

  private static final Logger log = LoggerFactory.getLogger(PedidoConsumer.class);

  @KafkaListener(topics = "${lab.topic}", groupId = "${spring.kafka.consumer.group-id}")
  public void faturamento(ConsumerRecord<String, PedidoCriado> rec, Acknowledgment ack) {
    log.info(
        "faturamento partition={} offset={} key={} value={} group=faturamento",
        rec.partition(),
        rec.offset(),
        rec.key(),
        rec.value());
    ack.acknowledge();
  }

  @KafkaListener(topics = "${lab.topic}", groupId = "${lab.analytics-group}")
  public void analytics(ConsumerRecord<String, PedidoCriado> rec, Acknowledgment ack) {
    log.info(
        "analytics partition={} offset={} key={} value={} group=analytics",
        rec.partition(),
        rec.offset(),
        rec.key(),
        rec.value());
    ack.acknowledge();
  }
}
