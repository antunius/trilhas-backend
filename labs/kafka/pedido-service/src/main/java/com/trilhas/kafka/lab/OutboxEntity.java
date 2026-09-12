package com.trilhas.kafka.lab;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "outbox")
public class OutboxEntity {

  @Id @GeneratedValue private Long id;
  private String pedidoId;
  private boolean publicado;

  protected OutboxEntity() {}

  public OutboxEntity(String pedidoId) {
    this.pedidoId = pedidoId;
  }

  public Long getId() {
    return id;
  }

  public String getPedidoId() {
    return pedidoId;
  }

  public boolean isPublicado() {
    return publicado;
  }

  public void marcarPublicado() {
    this.publicado = true;
  }
}
