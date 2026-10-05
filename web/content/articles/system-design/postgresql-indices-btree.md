---
slug: postgresql-indices-btree
categorySlug: system-design
title: "Índices B-tree no PostgreSQL"
navTitle: Índices B-tree
summary: "Entender o que um índice B-tree realmente faz, quando ele não ajuda e quanto custa mantê-lo"
level: intermediario
order: 55
section: deep-dives-tecnologias
group: "PostgreSQL"
---

## Objetivos de aprendizagem

- [ ] Explicar por que o B-tree tem poucos níveis
- [ ] Reconhecer quando um índice não é usado e o que fazer

*Retomando o cenário da unidade: uma plataforma de reviews de restaurantes, com dados relacionais e busca de restaurantes dentro de um raio geográfico.*

## Índices B-tree: o que realmente acontece por baixo

Um índice B-tree (o tipo padrão no PostgreSQL) organiza os valores de uma coluna em uma estrutura de árvore balanceada, permitindo localizar um valor específico em tempo logarítmico, em vez de examinar cada linha da tabela sequencialmente.

**Exemplo concreto**: uma tabela `reviews` com 10 milhões de linhas, buscando reviews de um restaurante específico (`WHERE restaurante_id = 42`). Sem índice, o banco faz um *sequential scan* — examina as 10 milhões de linhas, uma a uma, para saber quais correspondem. Com um índice B-tree em `restaurante_id`, o banco desce a árvore em poucos passos até localizar diretamente as linhas relevantes. A árvore B é larga: cada nó guarda centenas de chaves, então para 10 milhões de linhas ela tem apenas **3 a 4 níveis**, ou seja, 3 a 4 leituras de página de disco, e não dezenas de comparações.

**Quando um índice NÃO ajuda**: se a consulta busca `WHERE UPPER(nome_restaurante) = 'PIZZARIA X'`, um índice comum em `nome_restaurante` não é usado, porque o banco precisaria aplicar a função `UPPER` a cada linha antes de comparar — o índice guarda os valores originais, não os valores transformados. A solução, quando esse padrão de consulta é frequente, é um índice de expressão (indexando o resultado de `UPPER(nome_restaurante)` diretamente) — um detalhe que separa quem só sabe "adicionar índice" de quem entende como índices realmente funcionam.

**O custo, sempre presente**: cada índice adicional torna cada `INSERT`/`UPDATE`/`DELETE` na tabela mais lento (o índice também precisa ser atualizado), e ocupa espaço em disco adicional — a decisão de indexar deve vir de um padrão de leitura real e frequente, não "por precaução".

### Em Spring Boot

Com JPA, uma consulta que se beneficia do índice em `restaurante_id`, e o índice criado por migração (Flyway):

```java
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestauranteIdOrderByCriadoEmDesc(Long restauranteId, Pageable pagina);
}
```

```sql
CREATE INDEX idx_review_restaurante_data ON review (restaurante_id, criado_em DESC);
-- índice de expressão para buscas por nome sem diferenciar maiúsculas
CREATE INDEX idx_restaurante_nome_upper ON restaurante (UPPER(nome));
```

Confirme com `EXPLAIN ANALYZE` que o plano usa `Index Scan` e não `Seq Scan`.

## Lembre

- O B-tree é **largo**: 3 a 4 níveis bastam para 10 milhões de linhas.
- Aplicar uma **função** à coluna impede o índice comum: use um **índice de expressão**.
- Todo índice **encarece** INSERT, UPDATE e DELETE.
