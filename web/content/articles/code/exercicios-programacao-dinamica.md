---
slug: exercicios-programacao-dinamica
categorySlug: code
title: "Exercícios: Programação Dinâmica"
navTitle: Programação Dinâmica
summary: 1. Dado um conjunto de moedas de valores diferentes, encontre o número mínimo de moedas necessárias para totalizar um valor específico.
level: avancado
order: 44
section: practice
---

## Enunciados sugeridos

1. Dado um conjunto de moedas de valores diferentes, encontre o número mínimo de moedas necessárias para totalizar um valor específico.
2. Dadas duas strings, encontre o comprimento da maior subsequência comum entre elas.
3. Dado um array de números representando valores de itens (com pesos associados) e uma capacidade máxima, encontre o valor máximo que cabe nessa capacidade (problema da mochila).

## Perguntas orientadoras

- Qual é o subproblema menor que, resolvido, ajuda a construir a solução do problema maior?
- Uma solução puramente recursiva, sem guardar resultados, recalcularia os mesmos subproblemas várias vezes?
- Faz mais sentido resolver de cima para baixo com memoização, ou de baixo para cima com uma tabela?

## O que revisar depois de resolver

- Você conseguiu identificar corretamente a recorrência (como o subproblema maior se relaciona com os menores)?
- A solução final está livre de recomputação redundante dos mesmos subproblemas?
