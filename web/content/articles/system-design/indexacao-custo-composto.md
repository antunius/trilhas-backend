---
slug: indexacao-custo-composto
categorySlug: system-design
title: "O custo dos índices e o índice composto"
navTitle: Custo e índice composto
summary: "Pesar o custo nas escritas, ordenar as colunas de um índice composto e saber quando o índice não ajuda"
level: intermediario
order: 23
section: tecnologias-chave
group: "Indexação"
---

## Objetivos de aprendizagem

- [ ] Explicar o custo de manter um índice
- [ ] Ordenar as colunas de um índice composto e reconhecer quando ele não ajuda

*Retomando o cenário da unidade: uma loja online com uma tabela de pedidos de 50 milhões de linhas e a consulta "mostrar os pedidos de um cliente".*

## O custo de manter índices

Índice não é de graça. Cada **escrita** precisa atualizar a tabela e **todos os índices** dela:

- Um `INSERT` de pedido grava a linha e insere uma entrada em cada índice. Com 4 índices, são 5 gravações em vez de 1.
- Um `UPDATE` em uma coluna indexada reposiciona a entrada na árvore.
- Um `DELETE` remove de todos os índices.

Além disso, cada índice **ocupa espaço** em disco e em memória (os níveis de cima da árvore ficam em cache). Um índice sobre uma coluna `BIGINT` em 50 milhões de linhas tem, grosso modo, algo na casa de 1 GB.

**Regra de ouro**: índices trocam escrita mais lenta e mais espaço por leitura mais rápida. Isso vale quando há **muito mais leituras que escritas** para aquele padrão. Num sistema dominado por escrita (log de eventos, métricas), cada índice a mais pesa.

## Índice composto e a ordem das colunas

Um **índice composto** cobre mais de uma coluna, como `(cliente_id, criado_em)`. Ele ordena primeiro por `cliente_id` e, dentro de cada cliente, por `criado_em`. Isso resolve de uma vez "os últimos 10 pedidos do cliente 987", sem precisar ordenar depois.

A **ordem importa**. Um índice `(cliente_id, criado_em)` ajuda em:

- `WHERE cliente_id = 987`
- `WHERE cliente_id = 987 ORDER BY criado_em`

mas **não** ajuda em `WHERE criado_em > '2025-01-01'` sozinho, porque o índice está ordenado primeiro por cliente. É como uma lista telefônica ordenada por sobrenome e depois nome: ótima para achar "Silva, João", inútil para achar todos os "João".

## Quando o índice não ajuda

- **Baixa seletividade**: *seletividade* é quão bem um valor filtra a tabela. Uma coluna `ativo` com 98% `true` não filtra quase nada, e o banco acaba lendo quase tudo, então o otimizador ignora o índice.
- **Função sobre a coluna**: `WHERE LOWER(email) = 'a@b.com'` não usa um índice sobre `email`, porque o índice guarda `email` e não `LOWER(email)`. Pode-se criar um índice sobre a expressão.
- **Tabela pequena**: com poucas centenas de linhas, ler tudo é tão rápido quanto usar o índice.
- **Coluna que muda o tempo todo**: cada mudança mexe na árvore.

## Lembre

- Cada **escrita** atualiza a tabela e **todos** os índices.
- No índice composto, a **ordem das colunas** define as consultas atendidas.
- Índice em coluna de **baixa seletividade** quase não ajuda.
