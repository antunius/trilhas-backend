package com.trilhas.kafka.lab;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OutboxRepository extends JpaRepository<OutboxEntity, Long> {
  List<OutboxEntity> findByPublicadoFalse();
}
