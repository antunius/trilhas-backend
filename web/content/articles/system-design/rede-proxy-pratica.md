---
slug: rede-proxy-pratica
categorySlug: system-design
title: "Proxy reverso e balanceamento na prática"
navTitle: Proxy reverso e prática
summary: "Entender o proxy reverso e configurar o Nginx, o health check do Spring Boot e o balanceamento no cliente"
level: intermediario
order: 11
section: tecnologias-chave
group: "Rede"
---

## Objetivos de aprendizagem

- [ ] Explicar o papel do proxy reverso
- [ ] Configurar um balanceador Nginx e o health check do Spring Boot

*Retomando o cenário da unidade: uma loja online com 20 mil requisições por segundo, usuários no Brasil e na Europa e dezenas de servidores de aplicação.*

## Proxy reverso e o resto da fachada

Um load balancer de camada 7 é, na prática, um tipo de **proxy reverso**. Mas o proxy reverso faz mais que repartir:

- **Terminação de TLS**: ele faz a criptografia HTTPS com o cliente, e fala com os servidores internos em HTTP simples. Os servidores não precisam cuidar de certificados.
- **Cache** de respostas estáticas.
- **Compressão** e **limite de taxa** (por exemplo, 100 requisições por minuto por IP).
- **Ocultar** a topologia interna.

Quando essa fachada acumula funções de negócio (autenticação, agregação de respostas), passa a se chamar **API Gateway**, tema de um dos deep dives.

## Na prática

### Nginx como balanceador de camada 7

```nginx
upstream aplicacao {
    least_conn;                         # algoritmo: menos conexões
    server 10.0.1.11:8080 max_fails=3 fail_timeout=10s;
    server 10.0.1.12:8080 max_fails=3 fail_timeout=10s;
    server 10.0.1.13:8080 max_fails=3 fail_timeout=10s;
}

server {
    listen 443 ssl;                     # termina o TLS aqui
    server_name loja.com;

    location /api/ {
        proxy_pass http://aplicacao;    # repassa para os servidores de aplicação
        proxy_set_header X-Forwarded-For $remote_addr;
    }

    location /imagens/ {
        proxy_pass http://armazenamento-estatico;
    }
}
```

### Spring Boot atrás do proxy: health check e IP real

Para o balanceador saber se a instância está de pé, o Spring Boot expõe o endpoint de saúde pelo Actuator (`spring-boot-starter-actuator`):

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health
  endpoint:
    health:
      probes:
        enabled: true      # expõe /actuator/health/liveness e /readiness

server:
  forward-headers-strategy: framework   # respeita X-Forwarded-For e X-Forwarded-Proto
```

O balanceador consulta `/actuator/health/readiness`. A instância só entra na rotação quando está pronta, e sai quando começa a encerrar. E o `forward-headers-strategy` faz o Spring enxergar o **IP real do cliente**, e não o IP do balanceador.

### Roteamento do lado do cliente com Spring Cloud LoadBalancer

Entre serviços internos, o balanceamento pode ficar no próprio cliente:

```java
@Configuration
public class ClienteConfig {

    @Bean
    @LoadBalanced              // resolve "estoque" para uma das instâncias registradas
    RestClient.Builder restClient() {
        return RestClient.builder();
    }
}

@Service
public class PedidoService {

    private final RestClient estoque;

    public PedidoService(RestClient.Builder builder) {
        this.estoque = builder.baseUrl("http://estoque").build();
    }

    public int disponivel(long produtoId) {
        return estoque.get().uri("/produtos/{id}/estoque", produtoId)
            .retrieve().body(Integer.class);
    }
}
```

## Lembre

- Um balanceador L7 é, na prática, um **proxy reverso**.
- O proxy **termina o TLS** e fala HTTP simples com os servidores internos.
- Use `forward-headers-strategy` para o Spring enxergar o **IP real** do cliente.
