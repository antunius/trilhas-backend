---
slug: ordenacao-topologica
categorySlug: code
title: "Topological Sort"
navTitle: "Topological Sort"
summary: "Ordenar tarefas com dependências usando BFS e graus de entrada (algoritmo de Kahn)."
level: avancado
order: 72
section: bfs
group: Advanced
---

## Enunciado

Dado um **grafo direcionado acíclico (DAG)** com `n` nós e arestas `[a, b]` significando "`a` deve vir antes de `b`", retorne uma ordem que respeite todas as dependências.

```
n = 6, edges = [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]]
Uma ordem válida: [4, 5, 2, 0, 3, 1]
```

## Ideia — algoritmo de Kahn

Um nó com **grau de entrada 0** não depende de ninguém: pode ser o próximo. Então:

1. Calcule o grau de entrada (`indeg`) de todos os nós.
2. Enfileire todos com `indeg == 0`.
3. Ao retirar `u`, adicione-o à ordem e **"remova" suas arestas**: diminua o `indeg` de cada vizinho. Quem chegar a 0 entra na fila.

É uma BFS em que "descobrir" um nó significa **liberar todas as suas dependências**.

```graphviz
{
  "title": "ordenação topológica — algoritmo de Kahn",
  "code": {
    "lang": "java",
    "content": "public List<Integer> topoSort(int n, int[][] edges) {\n    List<List<Integer>> adj = new ArrayList<>();\n    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n    int[] indeg = new int[n];\n    for (int[] e : edges) {\n        adj.get(e[0]).add(e[1]);\n        indeg[e[1]]++;\n    }\n    Deque<Integer> queue = new ArrayDeque<>();\n    for (int i = 0; i < n; i++) if (indeg[i] == 0) queue.offer(i);\n    List<Integer> order = new ArrayList<>();\n    while (!queue.isEmpty()) {\n        int u = queue.poll();\n        order.add(u);\n        for (int v : adj.get(u)) {\n            if (--indeg[v] == 0) queue.offer(v);\n        }\n    }\n    return order.size() == n ? order : List.of();\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "Grafo acíclico (setas: A deve vir antes de B)",
      "nodes": [{"id": 5, "x": 40, "y": 40}, {"id": 4, "x": 40, "y": 150}, {"id": 2, "x": 150, "y": 40}, {"id": 3, "x": 260, "y": 40}, {"id": 0, "x": 150, "y": 150}, {"id": 1, "x": 300, "y": 150}],
      "edges": [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]],
      "directed": true,
      "steps": [
        {"values": {"0": "in=2", "1": "in=2", "2": "in=1", "3": "in=1", "4": "in=0", "5": "in=0"}, "line": 7, "caption": "Contamos o grau de entrada (in) de cada nó: quantas dependências ele ainda tem."},
        {"frontier": [4, 5], "queue": ["4", "5"], "values": {"0": "in=2", "1": "in=2", "2": "in=1", "3": "in=1", "4": "in=0", "5": "in=0"}, "line": 10, "caption": "Nós sem dependências entram na fila: [4, 5]."},
        {"current": 4, "frontier": [5], "queue": ["5"], "values": {"0": "in=2", "1": "in=2", "2": "in=1", "3": "in=1", "4": "in=0", "5": "in=0"}, "line": 14, "caption": "Sai 4 e entra na ordem: [4]."},
        {"current": 4, "frontier": [5], "queue": ["5"], "values": {"0": "in=1", "1": "in=1", "2": "in=1", "3": "in=1", "4": "in=0", "5": "in=0"}, "activeEdge": [4, 0], "line": 16, "caption": "Remove 4: diminui o grau de [0, 1]. Nenhum chegou a 0 ainda."},
        {"current": 5, "visited": [4], "queue": [], "values": {"0": "in=1", "1": "in=1", "2": "in=1", "3": "in=1", "4": "in=0", "5": "in=0"}, "line": 14, "caption": "Sai 5 e entra na ordem: [4, 5]."},
        {"current": 5, "visited": [4], "frontier": [2, 0], "queue": ["2", "0"], "values": {"0": "in=0", "1": "in=1", "2": "in=0", "3": "in=1", "4": "in=0", "5": "in=0"}, "activeEdge": [5, 2], "line": 16, "caption": "Remove 5: diminui o grau de [2, 0]. [2, 0] chegam a 0 e entram na fila."},
        {"current": 2, "visited": [4, 5], "frontier": [0], "queue": ["0"], "values": {"0": "in=0", "1": "in=1", "2": "in=0", "3": "in=1", "4": "in=0", "5": "in=0"}, "line": 14, "caption": "Sai 2 e entra na ordem: [4, 5, 2]."},
        {"current": 2, "visited": [4, 5], "frontier": [0, 3], "queue": ["0", "3"], "values": {"0": "in=0", "1": "in=1", "2": "in=0", "3": "in=0", "4": "in=0", "5": "in=0"}, "activeEdge": [2, 3], "line": 16, "caption": "Remove 2: diminui o grau de [3]. [3] chegam a 0 e entram na fila."},
        {"current": 0, "visited": [4, 5, 2], "frontier": [3], "queue": ["3"], "values": {"0": "in=0", "1": "in=1", "2": "in=0", "3": "in=0", "4": "in=0", "5": "in=0"}, "line": 14, "caption": "Sai 0 e entra na ordem: [4, 5, 2, 0]."},
        {"current": 3, "visited": [4, 5, 2, 0], "queue": [], "values": {"0": "in=0", "1": "in=1", "2": "in=0", "3": "in=0", "4": "in=0", "5": "in=0"}, "line": 14, "caption": "Sai 3 e entra na ordem: [4, 5, 2, 0, 3]."},
        {"current": 3, "visited": [4, 5, 2, 0], "frontier": [1], "queue": ["1"], "values": {"0": "in=0", "1": "in=0", "2": "in=0", "3": "in=0", "4": "in=0", "5": "in=0"}, "activeEdge": [3, 1], "line": 16, "caption": "Remove 3: diminui o grau de [1]. [1] chegam a 0 e entram na fila."},
        {"current": 1, "visited": [4, 5, 2, 0, 3], "queue": [], "values": {"0": "in=0", "1": "in=0", "2": "in=0", "3": "in=0", "4": "in=0", "5": "in=0"}, "line": 14, "caption": "Sai 1 e entra na ordem: [4, 5, 2, 0, 3, 1]."},
        {"visited": [4, 5, 2, 0, 3, 1], "queue": [], "values": {"0": "in=0", "1": "in=0", "2": "in=0", "3": "in=0", "4": "in=0", "5": "in=0"}, "found": true, "current": 1, "line": 19, "caption": "Todos os 6 nós saíram: ordem válida = [4, 5, 2, 0, 3, 1]."}
      ]
    }
  ]
}
```

## Código

```java
public List<Integer> topoSort(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        indeg[e[1]]++;
    }
    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) queue.offer(i);
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : adj.get(u)) {
            if (--indeg[v] == 0) queue.offer(v);
        }
    }
    return order.size() == n ? order : List.of();   // vazio = há ciclo
}
```

## Complexidade

- **Tempo:** O(V + E).
- **Espaço:** O(V + E).

## Erros comuns

- Inverter a direção das arestas (dependência × dependente).
- Não conferir `order.size() == n`: se houver ciclo, alguns nós nunca saem da fila.
- Achar que a ordem é única: em geral existem várias ordens válidas.
