package com.trilhas.kafka.lab;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedido")
public class PedidoEntity {

  @Id private String id;
  private int totalCentavos;

  protected PedidoEntity() {}

  public PedidoEntity(String id, int totalCentavos) {
    this.id = id;
    this.totalCentavos = totalCentavos;
  }

  public String getId() {
    return id;
  }

  public int getTotalCentavos() {
    return totalCentavos;
  }
}
