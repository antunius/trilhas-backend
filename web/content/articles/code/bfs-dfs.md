---
slug: bfs-dfs
categorySlug: code
title: BFS/DFS em Grafos e Árvores
summary: Diferenciar quando usar BFS e quando usar DFS
level: intermediario
order: 37
section: patterns
---

## Objetivos de aprendizagem

- [ ] Diferenciar quando usar BFS e quando usar DFS
- [ ] Reconhecer as estruturas de dados de suporte usadas em cada abordagem

## Conteúdo

### Busca em largura (BFS)

Explora o grafo ou árvore nível por nível, usando uma fila para controlar a ordem de visita. É a escolha natural quando o problema pede o caminho mais curto em um grafo não ponderado (todas as arestas com o mesmo "custo"), já que a primeira vez que um nó é alcançado em BFS garante que foi pelo caminho mais curto possível.

### Busca em profundidade (DFS)

Explora o mais fundo possível por um caminho antes de retroceder, geralmente implementada com recursão ou uma pilha explícita. É a escolha natural para problemas que envolvem explorar todos os caminhos possíveis, detectar ciclos, ou quando a ordem de visita entre nós irmãos não importa para o resultado.

### Como escolher entre os dois

A pergunta central é: o problema precisa do caminho *mais curto*, ou apenas de *algum* caminho, ou de explorar todas as possibilidades? Caminho mais curto em grafo não ponderado aponta para BFS; explorar todos os caminhos ou detectar estrutura (como ciclos) aponta para DFS.

> Quer aprofundar? Veja a trilha de [DFS: Introdução](/category/code/dfs-introducao), com árvores e BST.

> Trilha completa de BFS: [BFS: Introdução](/category/code/bfs-introducao), com árvores, grades e grafos.

## Exemplo aplicado

Para encontrar o menor número de passos entre duas células em uma grade (onde cada movimento tem o mesmo custo), BFS garante que a primeira vez que a célula de destino é alcançada corresponde ao caminho mais curto — DFS não ofereceria essa garantia diretamente, pois pode encontrar um caminho mais longo antes de um mais curto.

## Erros comuns

- Usar DFS para um problema de caminho mais curto em um grafo não ponderado, sem a garantia que BFS oferece naturalmente.
- Esquecer de marcar nós já visitados, causando loops infinitos em grafos com ciclos.
