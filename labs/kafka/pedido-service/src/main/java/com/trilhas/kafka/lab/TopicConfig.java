package com.trilhas.kafka.lab;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class TopicConfig {

  @Bean
  NewTopic pedidosCriados(
      @Value("${lab.topic}") String name, @Value("${lab.partitions}") int partitions) {
    return TopicBuilder.name(name).partitions(partitions).replicas(1).build();
  }
}
