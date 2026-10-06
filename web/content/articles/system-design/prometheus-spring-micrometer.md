---
slug: prometheus-spring-micrometer
categorySlug: system-design
title: "Instrumentando o Spring Boot com Micrometer"
navTitle: Spring Boot e Micrometer
summary: "Expor métricas do serviço de pedidos com Actuator e Micrometer, criar métricas de negócio e subir Prometheus e Grafana com Docker"
level: intermediario
order: 105
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Expor o endpoint /actuator/prometheus em uma aplicação Spring Boot
- [ ] Criar Counter, Timer e Gauge para o serviço de pedidos
- [ ] Configurar o prometheus.yml e subir Prometheus e Grafana com docker-compose

## Retomando o cenário

*A loja precisa que o serviço de pedidos publique métricas de HTTP e de negócio (pedidos criados, pagamentos recusados, tamanho da fila) para o Prometheus coletar.*

## Micrometer: a fachada de métricas

O **Micrometer** é para métricas o que o SLF4J é para logs: uma API única, com adaptadores para vários sistemas. O Spring Boot Actuator já o inclui. Para o Prometheus, basta a dependência do registro:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,prometheus
  metrics:
    distribution:
      percentiles-histogram:
        http.server.requests: true   # publica os buckets para calcular p95/p99
    tags:
      application: pedidos           # label comum a todas as métricas
```

Com isso, `GET /actuator/prometheus` já devolve, entre outras, `http_server_requests_seconds_count`, `_sum` e `_bucket`, com os labels `method`, `uri`, `status` e `outcome`. Sem a opção `percentiles-histogram`, os buckets **não** são publicados e `histogram_quantile` não funciona.

## Métricas de negócio

As métricas HTTP vêm prontas. As do domínio, você cria:

```java
@Service
public class PedidoService {

    private final Counter pedidosCriados;
    private final Counter pagamentosRecusados;
    private final Timer duracaoPagamento;

    public PedidoService(MeterRegistry registry, FilaPagamentos fila) {
        this.pedidosCriados = Counter.builder("pedidos.criados")
            .description("Pedidos aceitos pela loja").register(registry);
        this.pagamentosRecusados = Counter.builder("pagamentos.recusados")
            .tag("motivo", "saldo").register(registry);   // poucos valores: ok
        this.duracaoPagamento = Timer.builder("pagamento.duracao")
            .publishPercentileHistogram().register(registry);

        // gauge: lê o valor atual a cada scrape
        Gauge.builder("pagamentos.fila.tamanho", fila, FilaPagamentos::tamanho)
            .register(registry);
    }

    public Pedido criar(NovoPedido novo) {
        Pedido p = repositorio.salvar(novo);
        pedidosCriados.increment();
        duracaoPagamento.record(() -> pagamentos.cobrar(p));
        return p;
    }
}
```

O Prometheus converte os nomes: `pedidos.criados` vira `pedidos_criados_total` (counters ganham o sufixo `_total`) e `pagamento.duracao` vira `pagamento_duracao_seconds_*`. Também existe a anotação `@Timed`, que mede a duração de um método sem código manual.

## Configurando o Prometheus e o Grafana

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: pedidos
    metrics_path: /actuator/prometheus
    static_configs:
      - targets: ["host.docker.internal:8080"]
```

```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    ports: ["9090:9090"]
    volumes: ["./prometheus.yml:/etc/prometheus/prometheus.yml"]
  grafana:
    image: grafana/grafana
    ports: ["3000:3000"]
```

Rode `docker compose up -d`, abra `http://localhost:9090/targets` e confira que o alvo `pedidos` está **UP**. O endereço `host.docker.internal` permite ao contêiner alcançar a aplicação rodando na máquina (no Linux, pode ser necessário `extra_hosts`).

## Lembre

- **Actuator + micrometer-registry-prometheus** expõem `/actuator/prometheus`.
- Ative `percentiles-histogram` para publicar os **buckets** e poder calcular percentis.
- Counters ganham o sufixo **`_total`** no Prometheus; o tamanho da fila é um **Gauge**.
- Confirme a coleta em `/targets`: o alvo deve estar **UP**.
