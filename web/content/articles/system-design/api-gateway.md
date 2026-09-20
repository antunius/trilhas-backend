---
slug: api-gateway
categorySlug: system-design
title: "Deep Dive: API Gateway"
navTitle: API Gateway
summary: Listar as responsabilidades concretas centralizadas em um API Gateway, com exemplos de cada uma
level: intermediario
order: 49
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Listar as responsabilidades concretas centralizadas em um API Gateway, com exemplos de cada uma
- [ ] Explicar o padrão Backend for Frontend (BFF) e quando ele se justifica
- [ ] Reconhecer o gateway como possível ponto único de falha e como mitigar isso

## Cenário de referência para esta aula

Vamos usar uma plataforma de streaming de vídeo com múltiplos microsserviços internos (catálogo, perfil de usuário, histórico de visualização, recomendação) e dois tipos de cliente muito diferentes: o app de TV (tela grande, controle remoto, poucas interações por sessão) e o app mobile (tela pequena, muitas interações rápidas).

## Responsabilidades concretas centralizadas no gateway

- **Autenticação e autorização**: o gateway valida o token do usuário uma única vez, antes de rotear a chamada para qualquer serviço interno — os serviços internos podem confiar que uma requisição que chegou até eles já foi autenticada, sem reimplementar essa lógica.
- **Rate limiting**: aplicado no ponto de entrada, antes que uma requisição excessiva consuma recursos de qualquer serviço interno.
- **Roteamento**: decide, com base no caminho da URL (ou outros critérios), para qual serviço interno uma requisição deve ir — `/catalogo/*` vai para o serviço de catálogo, `/perfil/*` para o serviço de perfil.
- **Agregação de respostas**: para a tela inicial (que precisa de dados de catálogo, histórico e recomendação simultaneamente), o gateway pode fazer as três chamadas internas em paralelo e combinar o resultado em uma única resposta ao cliente — uma única chamada de rede do ponto de vista do app, mesmo que internamente sejam três.

## Backend for Frontend (BFF): quando um gateway genérico não basta

No nosso cenário, o app de TV e o app mobile têm necessidades de dados muito diferentes para a mesma tela conceitual ("continuar assistindo"): a TV quer poucos itens com imagens de alta resolução; o mobile quer uma lista mais longa com imagens leves e otimizadas para rolagem rápida. Um único gateway genérico, tentando servir os dois formatos igualmente bem, tende a virar um meio-termo insatisfatório para ambos.

O padrão **Backend for Frontend** resolve isso criando uma camada de agregação **dedicada por tipo de cliente** — um BFF para TV, outro para mobile — cada um moldando a resposta especificamente para as necessidades daquele cliente, enquanto ambos continuam chamando os mesmos microsserviços internos por trás. Isso evita que a lógica de "o que a TV precisa" e "o que o mobile precisa" fique misturada em um único componente genérico, ao custo de manter mais de um componente de borda.

![Um API Gateway genérico vs. BFFs dedicados por tipo de cliente](/diagrams/api-gateway-bff.svg)

## O gateway como ponto único de falha

Como toda requisição externa passa pelo gateway, ele próprio se torna um componente crítico — se cair, toda a plataforma fica inacessível, mesmo que todos os microsserviços internos estejam saudáveis. A mitigação padrão é a mesma de qualquer componente crítico: múltiplas instâncias do gateway rodando atrás de um load balancer (Módulo 2), sem estado compartilhado entre elas que impeça escalar horizontalmente.

**Um erro sutil a evitar**: colocar lógica de negócio pesada dentro do gateway (não apenas roteamento, autenticação e agregação leve) o transforma, na prática, em mais um microsserviço monolítico crítico — dificultando escalar e implantar mudanças de negócio de forma independente dos demais serviços.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "API Gateway centraliza autenticação e roteamento" em termos gerais |
| Sênior | Detalha agregação de respostas com chamadas paralelas, e reconhece o gateway como ponto único de falha exigindo redundância |
| Staff+ | Além do acima, propõe BFFs dedicados quando diferentes tipos de cliente têm necessidades de dados genuinamente diferentes, evitando um gateway genérico que serve mal a todos |

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

### Evolução/schema/migração

Um gateway não versiona "schema" no sentido de banco de dados, mas versiona **contratos de rota** conforme os microsserviços de trás evoluem. Duas estratégias comuns:

- **Por header**: `Accept-Version: 2` no request, com o gateway roteando internamente para a versão correspondente do serviço de catálogo, por exemplo — o cliente não muda a URL, apenas o header.
- **Por prefixo de caminho**: `/v1/catalogo/**` e `/v2/catalogo/**` coexistindo como rotas distintas no `RouteLocator`, cada uma apontando para a versão correspondente do serviço, até que os clientes migrem.

Para depreciar `/v1/catalogo/**` sem quebrar clientes de um dia para o outro, o gateway pode logar um aviso de depreciação a cada chamada à rota antiga (incluindo, idealmente, um header de resposta `Deprecation` e `Sunset` com a data-limite), permitindo identificar quais clientes ainda dependem dela antes de remover a rota de fato, meses depois, quando o volume de chamadas à versão antiga cair a zero — o mesmo espírito do padrão expand/contract usado em migrações de schema, aplicado a contratos de API em vez de colunas.

### Principais usos

- Centralizar validação de autenticação e de JWT antes de qualquer requisição chegar aos serviços internos, evitando reimplementar essa lógica em cada um.
- Aplicar rate limiting e cotas por cliente de API, protegendo os serviços internos de uso excessivo por um único consumidor.
- Rotear e compor requisições em uma arquitetura de microsserviços, incluindo agregação de múltiplas chamadas internas em uma única resposta.
- Terminação de TLS e observabilidade centralizada (logging e tracing de todas as requisições) em um único ponto de borda, em vez de espalhada por cada serviço.

## Erros comuns

- Colocar lógica de negócio pesada dentro do gateway, misturando responsabilidades que deveriam pertencer aos serviços internos.
- Não considerar o gateway como um ponto único de falha que também precisa de redundância.
- Usar um único gateway genérico quando tipos de cliente muito diferentes justificariam BFFs dedicados.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se o serviço de recomendação demorar muito para responder durante a agregação da tela inicial?" (o gateway deveria ter um timeout e retornar o restante da tela sem a seção de recomendação, em vez de travar a resposta inteira esperando por um serviço lento).
- "Quando um BFF dedicado deixa de valer a pena?" (quando os clientes têm necessidades de dados suficientemente parecidas, o custo de manter múltiplos BFFs supera o benefício de personalização).
