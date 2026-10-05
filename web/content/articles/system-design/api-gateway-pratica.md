---
slug: api-gateway-pratica
categorySlug: system-design
title: "API Gateway na prática: Spring Cloud Gateway"
navTitle: Na prática
summary: "Empacotar o gateway em Docker, rotear com Spring Cloud Gateway e aplicar rate limiting distribuído"
level: intermediario
order: 101
section: deep-dives-tecnologias
group: "API Gateway"
---

## Objetivos de aprendizagem

- [ ] Configurar rotas e filtros no Spring Cloud Gateway
- [ ] Aplicar rate limiting distribuído com Redis

*Retomando o cenário da unidade: uma plataforma de streaming de vídeo com microsserviços internos e dois clientes diferentes, o app de TV e o app mobile.*

## Na prática

### Subindo no Docker

Diferente de um banco de dados, um API Gateway normalmente não é um produto de prateleira que se sobe pronto — é um serviço próprio, construído sobre um framework como o **Spring Cloud Gateway**, que fica na borda roteando para catálogo, perfil, histórico e recomendação do nosso cenário de streaming. Por isso, o artefato concreto aqui é um `Dockerfile` da própria aplicação de gateway, não uma imagem de terceiro:

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/streaming-gateway.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

E no `docker-compose.yml`, o gateway sobe ao lado do Redis usado para rate limiting distribuído (Parte de operação avançada abaixo):

```yaml
services:
  gateway:
    build: .
    ports:
      - "8080:8080"
    environment:
      REDIS_HOST: redis
      CATALOGO_URI: http://catalogo:8081
      PERFIL_URI: http://perfil:8082
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Cliente Java: operação central de escrita/leitura

A "operação central" de um gateway não é ler/escrever dados — é rotear. No Spring Cloud Gateway, isso é definido programaticamente com um bean `RouteLocator`, roteando por caminho (como descrito antes) e também por header, para o caso do app de TV e do app mobile precisarem de tratamento diferente na mesma rota lógica:

```java
@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator streamingRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("catalogo", r -> r.path("/catalogo/**")
                .uri("http://catalogo:8081"))
            .route("perfil", r -> r.path("/perfil/**")
                .uri("http://perfil:8082"))
            .route("home-tv", r -> r.path("/home/**")
                .and().header("X-Client-Type", "tv")
                .uri("http://bff-tv:8090"))
            .route("home-mobile", r -> r.path("/home/**")
                .and().header("X-Client-Type", "mobile")
                .uri("http://bff-mobile:8091"))
            .build();
    }
}
```

As duas últimas rotas são exatamente o roteamento por tipo de cliente para os BFFs dedicados vistos antes — o gateway decide, com base no header `X-Client-Type`, para qual BFF encaminhar a mesma URL lógica `/home`.

### Operação avançada específica da tecnologia

**Rate limiting distribuído com Redis.** Como o gateway roda em múltiplas instâncias atrás de um load balancer, um limite de requisições por cliente não pode viver na memória de uma instância isolada — precisa ser compartilhado. O `RequestRateLimiter` do Spring Cloud Gateway usa Redis com o algoritmo *token bucket*:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: catalogo
          uri: http://catalogo:8081
          predicates:
            - Path=/catalogo/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 50   # tokens repostos por segundo
                redis-rate-limiter.burstCapacity: 100   # tamanho máximo do bucket (picos)
```

`replenishRate` é a taxa sustentada permitida por cliente; `burstCapacity` permite um pico temporário acima dela antes de começar a rejeitar requisições — o mesmo bucket compartilhado no Redis é consultado por qualquer instância do gateway que receba a requisição.

**Circuit breaker na borda.** Para o problema citado nas Perguntas de aprofundamento (recomendação lenta travando a agregação da tela inicial), um circuit breaker com Resilience4j na própria rota do gateway evita que uma dependência lenta derrube a experiência inteira:

```java
.route("recomendacao", r -> r.path("/recomendacao/**")
    .filters(f -> f.circuitBreaker(c -> c
        .setName("recomendacaoCB")
        .setFallbackUri("forward:/fallback/recomendacao")))
    .uri("http://recomendacao:8083"))
```

Quando o circuito abre (após falhas ou timeouts consecutivos), as próximas chamadas são redirecionadas imediatamente para `/fallback/recomendacao` — que pode retornar uma seção vazia ou um cache antigo, permitindo que o resto da tela inicial (catálogo, histórico) seja entregue normalmente.

## Lembre

- O gateway é **um serviço seu**, não um produto de prateleira.
- Rotas e filtros são **configuração**; a lógica fica nos serviços.
- Para limitar a taxa entre várias instâncias, o contador precisa ser **compartilhado** (Redis).
