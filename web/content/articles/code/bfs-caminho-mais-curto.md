---
slug: bfs-caminho-mais-curto
categorySlug: code
title: "Caminho Mais Curto com BFS"
navTitle: "Shortest Path Intro"
summary: "Por que a BFS encontra o menor caminho em grafos não ponderados e como reconstruí-lo com o vetor parent."
level: iniciante
order: 63
section: bfs
group: Introduction
---

## Por que BFS dá o menor caminho

A BFS descobre os nós em **ordem crescente de distância**: todos os nós a 1 aresta, depois os a 2, depois os a 3. Portanto, a **primeira vez** que um nó é alcançado é por um caminho com o menor número possível de arestas. Isso vale só quando todas as arestas têm o mesmo custo.

A DFS não tem essa garantia: ela pode alcançar o destino por um caminho longo muito antes de tentar o curto.

## Distância vs. caminho

O template de distância responde "**quantos** passos?". Para saber **quais** passos, guarde de onde cada nó veio (`parent`) e volte do destino até a origem.

```graphviz
{
  "title": "menor caminho — guardando parent",
  "code": {
    "lang": "java",
    "content": "List<Integer> shortestPath(List<List<Integer>> adj, int s, int t) {\n    int n = adj.size();\n    int[] parent = new int[n];\n    Arrays.fill(parent, -1);\n    boolean[] seen = new boolean[n];\n    Deque<Integer> queue = new ArrayDeque<>();\n    queue.offer(s);\n    seen[s] = true;\n    while (!queue.isEmpty()) {\n        int u = queue.poll();\n        if (u == t) break;\n        for (int v : adj.get(u)) {\n            if (!seen[v]) {\n                seen[v] = true;\n                parent[v] = u;\n                queue.offer(v);\n            }\n        }\n    }\n    LinkedList<Integer> path = new LinkedList<>();\n    if (!seen[t]) return path;\n    for (int at = t; at != -1; at = parent[at]) path.addFirst(at);\n    return path;\n}"
  },
  "examples": [
    {
      "id": "g",
      "label": "Caminho de 0 até 5",
      "nodes": [{"id": 0, "x": 40, "y": 80}, {"id": 1, "x": 130, "y": 30}, {"id": 2, "x": 130, "y": 130}, {"id": 3, "x": 230, "y": 30}, {"id": 4, "x": 230, "y": 130}, {"id": 5, "x": 320, "y": 80}],
      "edges": [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]],
      "steps": [
        {"current": 0, "frontier": [0], "queue": ["0"], "line": 8, "caption": "Começa em s = 0. Guardaremos, para cada nó, quem o descobriu (parent)."},
        {"current": 0, "queue": [], "line": 10, "caption": "Sai da fila o nó 0."},
        {"current": 0, "frontier": [1, 2], "queue": ["1", "2"], "values": {"1": "←0", "2": "←0"}, "activeEdge": [0, 1], "line": 15, "caption": "Descobre [1, 2]: parent de cada um é 0."},
        {"current": 1, "visited": [0], "frontier": [2], "queue": ["2"], "values": {"1": "←0", "2": "←0"}, "line": 10, "caption": "Sai da fila o nó 1."},
        {"current": 1, "visited": [0], "frontier": [2, 3], "queue": ["2", "3"], "values": {"1": "←0", "2": "←0", "3": "←1"}, "activeEdge": [1, 3], "line": 15, "caption": "Descobre [3]: parent de cada um é 1."},
        {"current": 2, "visited": [0, 1], "frontier": [3], "queue": ["3"], "values": {"1": "←0", "2": "←0", "3": "←1"}, "line": 10, "caption": "Sai da fila o nó 2."},
        {"current": 2, "visited": [0, 1], "frontier": [3, 4], "queue": ["3", "4"], "values": {"1": "←0", "2": "←0", "3": "←1", "4": "←2"}, "activeEdge": [2, 4], "line": 15, "caption": "Descobre [4]: parent de cada um é 2."},
        {"current": 3, "visited": [0, 1, 2], "frontier": [4], "queue": ["4"], "values": {"1": "←0", "2": "←0", "3": "←1", "4": "←2"}, "line": 10, "caption": "Sai da fila o nó 3."},
        {"current": 3, "visited": [0, 1, 2], "frontier": [4, 5], "queue": ["4", "5"], "values": {"1": "←0", "2": "←0", "3": "←1", "4": "←2", "5": "←3"}, "activeEdge": [3, 5], "line": 15, "caption": "Descobre [5]: parent de cada um é 3."},
        {"current": 4, "visited": [0, 1, 2, 3], "frontier": [5], "queue": ["5"], "values": {"1": "←0", "2": "←0", "3": "←1", "4": "←2", "5": "←3"}, "line": 10, "caption": "Sai da fila o nó 4."},
        {"current": 5, "visited": [0, 1, 2, 3, 4], "queue": [], "values": {"1": "←0", "2": "←0", "3": "←1", "4": "←2", "5": "←3"}, "line": 11, "caption": "Saiu o destino 5: podemos parar. Agora reconstruímos o caminho seguindo os parents de trás para frente."},
        {"current": 5, "compare": [0, 1, 3, 5], "visited": [0, 1, 2, 3, 4, 5], "queue": [], "values": {"1": "←0", "2": "←0", "3": "←1", "4": "←2", "5": "←3"}, "found": true, "line": 22, "caption": "Seguindo parent de 5 até a origem e invertendo: caminho = [0, 1, 3, 5] (3 arestas)."}
      ]
    }
  ]
}
```

## Template — menor caminho

```java
List<Integer> shortestPath(List<List<Integer>> adj, int s, int t) {
    int[] parent = new int[adj.size()];
    Arrays.fill(parent, -1);
    boolean[] seen = new boolean[adj.size()];
    Deque<Integer> queue = new ArrayDeque<>();
    queue.offer(s);
    seen[s] = true;
    while (!queue.isEmpty()) {
        int u = queue.poll();
        if (u == t) break;                 // pode parar assim que o destino sai
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                seen[v] = true;
                parent[v] = u;             // quem me descobriu
                queue.offer(v);
            }
        }
    }
    LinkedList<Integer> path = new LinkedList<>();
    if (!seen[t]) return path;             // inalcançável
    for (int at = t; at != -1; at = parent[at]) path.addFirst(at);
    return path;
}
```

## Variações

| Pergunta | O que guardar |
|---|---|
| Quantos passos? | `dist[]` (ou o contador de níveis) |
| Qual o caminho? | `parent[]` + reconstrução |
| Existe caminho? | só `seen[]` |
| Quantos caminhos mínimos? | `dist[]` + contador `ways[]` |

## Complexidade

- **Tempo:** O(V + E).
- **Espaço:** O(V).

## Erros comuns

- Reconstruir o caminho sem inverter no final (sai do destino para a origem).
- Não tratar o destino inalcançável.
- Aplicar em grafo ponderado: use Dijkstra.

Veja aplicações em [grade](/category/code/caminho-minimo-labirinto) e em [grafo implícito](/category/code/word-ladder).
