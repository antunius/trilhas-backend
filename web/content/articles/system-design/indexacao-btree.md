---
slug: indexacao-btree
categorySlug: system-design
title: "Índices: full scan, árvore B e o ganho em números"
navTitle: Índice e árvore B
summary: "Entender o que é um índice, como a árvore B o torna rápido e quanto ele ganha em leituras de página"
level: intermediario
order: 22
section: tecnologias-chave
group: "Indexação"
---

## Objetivos de aprendizagem

- [ ] Definir índice, full scan e árvore B
- [ ] Estimar as leituras de página com e sem índice

## Cenário de referência da unidade

Vamos usar uma loja online com uma tabela `pedido` de **50 milhões de linhas**. A consulta mais frequente do site é "mostrar os pedidos de um cliente", executada a cada visita à página "Meus pedidos". Um cliente típico tem uns 20 pedidos. Ao longo da aula vamos ver a mesma consulta sem índice, com índice, e o que isso faz com as gravações de novos pedidos.

## Fundamentos: o vocabulário básico, peça por peça

### O que é um índice, em uma frase

Um índice é uma estrutura **separada** da tabela, mantida ordenada por uma ou mais colunas, que permite achar linhas por valor sem ler a tabela inteira. A analogia é o índice remissivo de um livro: para achar onde se fala de "quórum", você não folheia 800 páginas, olha o índice ordenado e vai direto à página.

### Full scan

Sem índice, para achar os pedidos do cliente 987, o banco precisa examinar **cada linha** da tabela e verificar se `cliente_id = 987`. Isso é um **full scan** (varredura completa). Com 50 milhões de linhas, é como ler o livro inteiro para achar uma palavra.

### Árvore B (B-tree)

Quase todo banco relacional implementa o índice como uma **árvore B**: uma árvore balanceada em que cada nó (uma "página" de disco) guarda muitos valores ordenados e ponteiros para os nós de baixo. Como cada nó tem centenas de filhos, a árvore é **muito rasa**: mesmo com bilhões de entradas, ela tem só 3 ou 4 níveis.

### Como uma busca usa a árvore

1. Começa na **raiz**, compara 987 com os valores e escolhe o ramo certo.
2. Desce por um ou dois nós intermediários, repetindo a comparação.
3. Chega à **folha**, que guarda as posições das linhas com `cliente_id = 987`.
4. Lê essas poucas linhas na tabela.

![Índice acelera lookup, desacelera escrita](/diagrams/sd-indexacao.svg)

*A imagem mostra os dois lados do índice: a busca (seta para baixo, poucos passos) e a escrita (que precisa atualizar a árvore além da tabela).*

## Números concretos: quanto o índice ganha

Suponha que uma página de disco guarda 100 linhas. A tabela de 50 milhões de linhas ocupa então cerca de **500 mil páginas**.

- **Sem índice (full scan)**: até 500.000 leituras de página. Se cada leitura leva 0,1 ms em SSD, são cerca de **50 segundos** no pior caso. Na prática o banco lê em sequência e é mais rápido, mas ainda é uma consulta de segundos.
- **Com índice em `cliente_id`**: uma árvore B com ~300 filhos por nó precisa de 4 níveis para 50 milhões de chaves (300³ = 27 milhões ainda não basta, 300⁴ = 8,1 bilhões cobre com folga). São cerca de **4 leituras de página** para achar as posições, mais ~20 leituras para buscar os 20 pedidos. Em torno de **24 leituras**, ou seja, alguns milissegundos.

A conta mostra a diferença de **ordem de grandeza**: 500 mil contra 24. Esse é o ganho. Ele cresce com o tamanho da tabela: dobrar as linhas dobra o full scan, mas quase não muda a altura da árvore.

## Lembre

- Sem índice, o banco faz **full scan**: lê a tabela inteira.
- A árvore B é **larga e rasa**: 4 níveis cobrem bilhões de chaves.
- O ganho é de **ordem de grandeza**: 500 mil leituras contra cerca de 24.
