---
slug: cache-camadas-pratica
categorySlug: system-design
title: "Camadas de cache e cache-aside com Spring Boot"
navTitle: Camadas e prática
summary: "Decidir em qual camada colocar o cache e implementar cache-aside manual e declarativo com Spring"
level: intermediario
order: 28
section: tecnologias-chave
group: "Cache"
---

## Objetivos de aprendizagem

- [ ] Escolher a camada de cache pelo tipo de dado
- [ ] Implementar cache-aside com StringRedisTemplate e com @Cacheable

*Retomando o cenário da unidade: a página de produto de uma loja online, com 200 mil visitas por minuto no pico e poucos produtos concentrando o tráfego.*

## Onde colocar o cache: as camadas

Quanto mais perto do usuário, mais rápido e maior o ganho, mas maior o risco de servir dado velho.

| Camada | O que guarda | Bom para | Risco |
|---|---|---|---|
| Navegador | Imagens, scripts, respostas com `Cache-Control` | Arquivos estáticos | Difícil forçar a atualização no cliente |
| CDN | Cópias próximas dos usuários, no mundo todo | Imagens, vídeos, páginas públicas | Invalidação global leva tempo |
| Aplicação (local) | Memória do próprio processo | Configurações, dados minúsculos | Cada servidor tem a sua cópia, e elas divergem |
| Cache distribuído (Redis, Memcached) | Memória compartilhada por todos os servidores | Dados dinâmicos, sessões | Uma viagem de rede a mais, e um novo componente |
| Banco de dados | Páginas e planos de consulta, internos | Automático | Não controlamos |

**Regra prática para a entrevista**: comece pelo caminho mais crítico, o que recebe mais leituras. Pergunte "este dado muda com que frequência, e quanto custa mostrar uma versão velha dele?". A resposta decide a camada e o TTL.

## Na prática

### Cache-aside com Redis (Spring Boot)

Dependência `spring-boot-starter-data-redis` no `pom.xml`, que fornece o `StringRedisTemplate`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

O serviço de produtos, com a leitura em cache-aside e a atualização que invalida a entrada:

```java
@Service
public class ProdutoService {

    private static final Duration TTL_BASE = Duration.ofMinutes(5);

    private final StringRedisTemplate redis;
    private final ProdutoRepository repository;
    private final ObjectMapper mapper;

    public ProdutoService(StringRedisTemplate redis, ProdutoRepository repository, ObjectMapper mapper) {
        this.redis = redis;
        this.repository = repository;
        this.mapper = mapper;
    }

    public Produto buscar(long id) throws JsonProcessingException {
        String chave = "produto:" + id;

        String json = redis.opsForValue().get(chave);
        if (json != null) {
            return mapper.readValue(json, Produto.class); // hit
        }

        Produto produto = repository.findById(id).orElseThrow(); // miss: vai ao banco
        Duration ttl = TTL_BASE.plusSeconds(ThreadLocalRandom.current().nextInt(0, 60)); // jitter
        redis.opsForValue().set(chave, mapper.writeValueAsString(produto), ttl);
        return produto;
    }

    public void atualizarPreco(long id, BigDecimal preco) {
        Produto produto = repository.findById(id).orElseThrow();
        produto.setPreco(preco);
        repository.save(produto);        // 1) grava na fonte de verdade
        redis.delete("produto:" + id);   // 2) só então invalida
    }
}
```

Repare na **ordem** em `atualizarPreco`: primeiro o banco, depois a invalidação. Se fosse o contrário, uma leitura entre os dois passos recarregaria o preço antigo no cache e ele ficaria errado até o TTL.

### A mesma ideia com as anotações do Spring

O Spring tem uma abstração de cache que faz o cache-aside por você. Com `@EnableCaching` na aplicação e `spring.cache.type=redis`, basta anotar os métodos:

```java
@Service
public class ProdutoService {

    @Cacheable(cacheNames = "produto", key = "#id")
    public Produto buscar(long id) {
        return repository.findById(id).orElseThrow(); // só executa no miss
    }

    @CacheEvict(cacheNames = "produto", key = "#id")
    public void atualizarPreco(long id, BigDecimal preco) {
        Produto produto = repository.findById(id).orElseThrow();
        produto.setPreco(preco);
        repository.save(produto); // a invalidação ocorre ao fim do método
    }
}
```

```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 5m   # TTL padrão de todas as entradas
```

As anotações deixam o código menor, mas escondem três coisas que o entrevistador pode perguntar: o TTL aqui é o mesmo para todas as entradas (sem jitter por padrão), o `@Cacheable` não protege contra stampede a menos que se use `sync = true`, e a chamada interna de um método da própria classe (`this.buscar(...)`) **não passa pelo proxy** do Spring, então o cache é ignorado.

## Lembre

- Quanto mais perto do usuário, **mais rápido e mais arriscado** em consistência.
- `@Cacheable` esconde: TTL único, **sem proteção a stampede** e proxy.
- Chamar o método dentro da **própria classe** ignora o cache.
