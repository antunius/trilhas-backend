---
slug: exercicios-grafos-arvores
categorySlug: code
title: "Exercícios: BFS/DFS em Grafos e Árvores"
navTitle: BFS/DFS em Grafos e Árvores
summary: 1. Dado um grafo não ponderado, encontre o número mínimo de passos entre dois nós específicos.
level: avancado
order: 43
section: practice
---

## Enunciados sugeridos

1. Dado um grafo não ponderado, encontre o número mínimo de passos entre dois nós específicos.
2. Dada uma árvore binária, verifique se ela é balanceada (a diferença de altura entre subárvores nunca ultrapassa 1).
3. Dado um grafo, determine se ele contém um ciclo.

## Perguntas orientadoras

- O problema pede o caminho *mais curto*, ou apenas *algum* caminho válido?
- É necessário visitar todos os nós, ou é possível parar assim que uma condição é satisfeita?
- Como você está marcando nós já visitados, para evitar processá-los mais de uma vez (ou entrar em loop infinito em grafos com ciclos)?

## O que revisar depois de resolver

- Se o problema pedia caminho mais curto, você usou BFS (e não DFS)?
- A solução lida corretamente com grafos desconectados (mais de um componente)?
