package com.trilhas.kafka.lab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KafkaLabApplication {

  public static void main(String[] args) {
    SpringApplication.run(KafkaLabApplication.class, args);
  }
}
