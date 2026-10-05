---
slug: bancos-pratica
categorySlug: system-design
title: "Bancos na prática: JPA, MongoDB e Redis com Spring"
navTitle: JPA, MongoDB e Redis
summary: "Ver o mesmo marketplace implementado nos três modelos com Spring Data"
level: intermediario
order: 20
section: tecnologias-chave
group: "Bancos de dados"
---

## Objetivos de aprendizagem

- [ ] Escrever uma transação de pedido com Spring Data JPA
- [ ] Usar Spring Data MongoDB e Redis para catálogo e carrinho

*Retomando o cenário da unidade: um marketplace online com pedidos e pagamentos, catálogo de produtos de atributos variáveis e carrinho temporário.*

## Na prática

### Relacional com Spring Data JPA: transação de pedido

```java
@Entity
public class Pedido {
    @Id @GeneratedValue
    private Long id;
    private Long clienteId;
    private BigDecimal total;
    // getters e setters omitidos
}

@Service
public class PedidoService {

    private final PedidoRepository pedidos;
    private final EstoqueRepository estoque;

    public PedidoService(PedidoRepository pedidos, EstoqueRepository estoque) {
        this.pedidos = pedidos;
        this.estoque = estoque;
    }

    @Transactional // atomicidade: se qualquer passo falhar, tudo é desfeito
    public Pedido criar(Long clienteId, Long produtoId, int quantidade, BigDecimal total) {
        estoque.baixar(produtoId, quantidade);       // lança exceção se não houver estoque
        Pedido pedido = new Pedido();
        pedido.setClienteId(clienteId);
        pedido.setTotal(total);
        return pedidos.save(pedido);
    }
}
```

Se `baixar` lançar uma exceção por falta de estoque, o `@Transactional` desfaz tudo e nenhum pedido fica gravado pela metade.

### Documento com Spring Data MongoDB: catálogo

```java
@Document(collection = "produtos")
public class Produto {
    @Id
    private String id;
    private String nome;
    private Map<String, Object> atributos; // cada produto tem atributos diferentes
    private List<Avaliacao> avaliacoes;
    // getters e setters omitidos
}

public interface ProdutoRepository extends MongoRepository<Produto, String> {
    List<Produto> findByCategoria(String categoria);
}
```

Uma só chamada `findById` traz o produto inteiro, com atributos e avaliações.

### Chave-valor com Redis: carrinho

```java
@Service
public class CarrinhoService {

    private final StringRedisTemplate redis;

    public CarrinhoService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public void adicionar(String sessao, String produtoId, int quantidade) {
        String chave = "carrinho:" + sessao;
        redis.opsForHash().increment(chave, produtoId, quantidade);
        redis.expire(chave, Duration.ofDays(7)); // carrinho abandonado some sozinho
    }

    public Map<Object, Object> ver(String sessao) {
        return redis.opsForHash().entries("carrinho:" + sessao);
    }
}
```

## Lembre

- `@Transactional` desfaz tudo se um passo falhar.
- O **Mongo** traz o produto inteiro numa só leitura.
- O **Redis** expira carrinhos abandonados com TTL.
