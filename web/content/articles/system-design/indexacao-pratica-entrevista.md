---
slug: indexacao-pratica-entrevista
categorySlug: system-design
title: "Indexação na prática e na entrevista"
navTitle: Na prática e na entrevista
summary: "Declarar índices com JPA e migrações, confirmar o uso com EXPLAIN e saber responder em entrevista"
level: intermediario
order: 24
section: tecnologias-chave
group: "Indexação"
---

## Objetivos de aprendizagem

- [ ] Declarar um índice composto com JPA e por migração
- [ ] Confirmar com EXPLAIN ANALYZE que o índice é usado

*Retomando o cenário da unidade: uma loja online com uma tabela de pedidos de 50 milhões de linhas e a consulta "mostrar os pedidos de um cliente".*

## Na prática

### Declarando o índice com JPA

```java
@Entity
@Table(
    name = "pedido",
    indexes = @Index(name = "idx_pedido_cliente_data", columnList = "cliente_id, criado_em")
)
public class Pedido {
    @Id @GeneratedValue
    private Long id;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "criado_em")
    private Instant criadoEm;
    // getters e setters omitidos
}

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // usa o índice composto: filtra por cliente e já devolve ordenado
    List<Pedido> findTop10ByClienteIdOrderByCriadoEmDesc(Long clienteId);
}
```

Em produção, índices entram por **migração versionada** (Flyway ou Liquibase), não só pela anotação:

```sql
CREATE INDEX idx_pedido_cliente_data ON pedido (cliente_id, criado_em DESC);
```

### Confirmando que o índice é usado

Não adivinhe: peça o plano de execução.

```sql
EXPLAIN ANALYZE
SELECT * FROM pedido WHERE cliente_id = 987 ORDER BY criado_em DESC LIMIT 10;
```

Procure por `Index Scan` (usa índice) em vez de `Seq Scan` (full scan).

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Diz "vou criar um índice em `cliente_id`" e explica que acelera a busca |
| Sênior | Aponta a consulta específica que justifica o índice, escolhe um composto com a ordem certa, menciona o custo em escritas e espaço |
| Staff+ | Estima o ganho em leituras de página, avalia a seletividade, confirma com `EXPLAIN`, discute índices parciais e de cobertura, e pesa a proporção leitura/escrita do sistema |

## Erros comuns

- Sugerir indexar todas as colunas, ignorando o custo em escritas e armazenamento.
- Colocar a coluna na ordem errada num índice composto.
- Indexar uma coluna de baixa seletividade (como um booleano) e esperar ganho.
- Propor o índice sem apontar a consulta que o justifica.
- Esquecer de conferir o plano de execução, assumindo que o índice está sendo usado.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que a árvore B tem poucos níveis?" (cada nó tem centenas de filhos, então a altura cresce como o logaritmo, com base grande: 4 níveis para bilhões de chaves.)
- "Seu sistema grava 50 mil eventos por segundo. Você indexaria a tabela de eventos?" (cada índice multiplica o custo da escrita; indexe só o que as consultas exigem, ou mantenha um armazenamento separado para consulta.)
- "Qual a diferença entre `(a, b)` e `(b, a)`?" (a ordem define quais consultas o índice atende: filtrar só por `a` funciona no primeiro, só por `b` funciona no segundo.)
- "A consulta continua lenta mesmo com índice. O que verifica?" (o plano de execução: seletividade, função aplicada à coluna, estatísticas desatualizadas, tipo de dado incompatível.)

## Lembre

- Em produção, índices entram por **migração versionada** (Flyway).
- Procure `Index Scan` e não `Seq Scan` no plano.
- Aponte **a consulta** que justifica cada índice.
