package com.trilhas.kafka.lab;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PedidoCriado(
    @JsonProperty(required = true) String eventId,
    @JsonProperty(required = true) String pedidoId,
    @JsonProperty(required = true) int totalCentavos,
    String cupom) {}
