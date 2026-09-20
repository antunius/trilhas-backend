---
slug: bfs-introducao
categorySlug: code
title: "BFS: Introdução"
navTitle: "BFS Intro"
summary: "Busca em largura: explorar camada por camada com uma fila, e os templates que você vai reaproveitar em árvores, grades e grafos."
level: iniciante
order: 62
section: bfs
group: Introduction
---

## A ideia

**Breadth-First Search** explora um grafo **por camadas**: primeiro o nó inicial, depois todos os vizinhos diretos (distância 1), depois todos os que estão a 2 arestas, e assim por diante. Ela só passa para a camada `k + 1` quando terminou toda a camada `k`.

A estrutura que garante essa ordem é uma **fila (FIFO)**: quem foi descoberto primeiro é processado primeiro. Compare com a DFS, que usa uma pilha (ou a pilha de chamadas) e mergulha até o fundo antes de voltar.

```graphviz
{
  "title": "BFS — camadas e fila",
  "code": {
    "lang": "java",
    "content": "int[] bfs(List<List<Integer>> adj, int start) {\n    int n = adj.size();\n    int[] dist = new int[n];\n    Arrays.fill(dist, -1);\n    Deque<Integer> queue = new ArrayDeque<>();\n    dist[start] = 0;\n    queue.offer(start);\n    while (!queue.isEmpty()) {\n        int u = queue.poll();\n        for (int v : adj.get(u)) {\n            if (dist[v] == -1) {\n                dist[v] = dist[u] + 1;\n                queue.offer(v);\n            }\n        }\n    }\n    return dist;\n}"
  },
  "examples": [
    {
      "id": "g",
      "label": "Grafo não direcionado, início em 0",
      "nodes": [{"id": 0, "x": 40, "y": 80}, {"id": 1, "x": 130, "y": 30}, {"id": 2, "x": 130, "y": 130}, {"id": 3, "x": 230, "y": 30}, {"id": 4, "x": 230, "y": 130}, {"id": 5, "x": 320, "y": 80}],
      "edges": [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]],
      "steps": [
        {"current": 0, "frontier": [0], "queue": ["0"], "values": {"0": "d=0"}, "line": 6, "caption": "Começamos em 0: distância 0, e ele entra na fila."},
        {"current": 0, "queue": [], "values": {"0": "d=0"}, "line": 9, "caption": "Sai da fila o nó 0 (distância 0). Vamos olhar seus vizinhos [1, 2]."},
        {"current": 0, "frontier": [1, 2], "queue": ["1", "2"], "values": {"0": "d=0", "1": "d=1", "2": "d=1"}, "activeEdge": [0, 1], "line": 13, "caption": "Vizinhos novos: [1, 2] → distância 1. Entram no fim da fila."},
        {"current": 1, "visited": [0], "frontier": [2], "queue": ["2"], "values": {"0": "d=0", "1": "d=1", "2": "d=1"}, "line": 9, "caption": "Sai da fila o nó 1 (distância 1). Vamos olhar seus vizinhos [0, 3]."},
        {"current": 1, "visited": [0], "frontier": [2, 3], "queue": ["2", "3"], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2"}, "activeEdge": [1, 3], "line": 13, "caption": "Vizinhos novos: [3] → distância 2. Entram no fim da fila."},
        {"current": 2, "visited": [0, 1], "frontier": [3], "queue": ["3"], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2"}, "line": 9, "caption": "Sai da fila o nó 2 (distância 1). Vamos olhar seus vizinhos [0, 3, 4]."},
        {"current": 2, "visited": [0, 1], "frontier": [3, 4], "queue": ["3", "4"], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2"}, "activeEdge": [2, 4], "line": 13, "caption": "Vizinhos novos: [4] → distância 2. Entram no fim da fila."},
        {"current": 3, "visited": [0, 1, 2], "frontier": [4], "queue": ["4"], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2"}, "line": 9, "caption": "Sai da fila o nó 3 (distância 2). Vamos olhar seus vizinhos [1, 2, 5]."},
        {"current": 3, "visited": [0, 1, 2], "frontier": [4, 5], "queue": ["4", "5"], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2", "5": "d=3"}, "activeEdge": [3, 5], "line": 13, "caption": "Vizinhos novos: [5] → distância 3. Entram no fim da fila."},
        {"current": 4, "visited": [0, 1, 2, 3], "frontier": [5], "queue": ["5"], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2", "5": "d=3"}, "line": 9, "caption": "Sai da fila o nó 4 (distância 2). Vamos olhar seus vizinhos [2, 5]."},
        {"current": 4, "visited": [0, 1, 2, 3], "frontier": [5], "queue": ["5"], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2", "5": "d=3"}, "line": 11, "caption": "Todos os vizinhos de 4 já foram descobertos: nada entra na fila."},
        {"current": 5, "visited": [0, 1, 2, 3, 4], "queue": [], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2", "5": "d=3"}, "line": 9, "caption": "Sai da fila o nó 5 (distância 3). Vamos olhar seus vizinhos [3, 4]."},
        {"current": 5, "visited": [0, 1, 2, 3, 4], "queue": [], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2", "5": "d=3"}, "line": 11, "caption": "Todos os vizinhos de 5 já foram descobertos: nada entra na fila."},
        {"visited": [0, 1, 2, 3, 4, 5], "queue": [], "values": {"0": "d=0", "1": "d=1", "2": "d=1", "3": "d=2", "4": "d=2", "5": "d=3"}, "found": true, "current": 5, "line": 17, "caption": "Fila vazia. Distâncias: [0, 1, 1, 2, 2, 3]. Cada nó foi descoberto na menor camada possível."}
      ]
    }
  ]
}
```

## Template 1 — BFS em grafo com distâncias

```java
int[] bfs(List<List<Integer>> adj, int start) {
    int[] dist = new int[adj.size()];
    Arrays.fill(dist, -1);                 // -1 = ainda não descoberto
    Deque<Integer> queue = new ArrayDeque<>();
    dist[start] = 0;
    queue.offer(start);
    while (!queue.isEmpty()) {
        int u = queue.poll();
        for (int v : adj.get(u)) {
            if (dist[v] == -1) {               // só enfileira o que é novo
                dist[v] = dist[u] + 1;
                queue.offer(v);
            }
        }
    }
    return dist;
}
```

## Template 2 — nível por nível (tamanho da fila)

Quando o problema fala em **níveis**, **passos** ou **minutos**, processe a fila em "fatias":

```java
Deque<T> queue = new ArrayDeque<>();
queue.offer(inicio);
int nivel = 0;
while (!queue.isEmpty()) {
    int size = queue.size();               // congela o tamanho da camada atual
    for (int i = 0; i < size; i++) {
        T atual = queue.poll();
        // processa atual
        for (T vizinho : vizinhos(atual)) {
            if (!visitado(vizinho)) {
                marca(vizinho);            // marque AO ENFILEIRAR, não ao sair
                queue.offer(vizinho);
            }
        }
    }
    nivel++;
}
```

## Template 3 — grade (4 direções)

```java
int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
for (int[] d : dirs) {
    int nr = r + d[0], nc = c + d[1];
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;   // fora da grade
    if (grid[nr][nc] == PAREDE || visitado[nr][nc]) continue;
    visitado[nr][nc] = true;
    queue.offer(new int[]{nr, nc});
}
```

## Template 4 — multi-fonte

Se vários pontos começam ao mesmo tempo (várias laranjas podres, várias portas), **enfileire todos antes de começar** o laço. A BFS se comporta como se houvesse uma "super-origem" ligada a todos eles.

## Quando escolher BFS

- **Menor número de passos/arestas** em grafo não ponderado.
- Algo acontece **em ondas** (contágio, propagação, minutos).
- Percorrer uma árvore **por níveis**.
- Ordem de dependências (ordenação topológica com Kahn).

Se precisa explorar **todos** os caminhos ou combinações, prefira [DFS](/category/code/dfs-introducao).

## Complexidade

- **Tempo:** O(V + E) — cada nó entra e sai da fila uma vez; cada aresta é examinada uma vez (ou duas, se não direcionada).
- **Espaço:** O(V) para a fila e o `visitado`.

## Erros comuns

- Marcar como visitado **ao sair** da fila em vez de **ao entrar**: o mesmo nó entra várias vezes e o custo explode.
- Usar `LinkedList` como `Queue` sem necessidade; prefira `ArrayDeque`.
- Esquecer o `size` congelado ao contar níveis.
- Usar BFS em grafo **ponderado** esperando o caminho mais curto (aí é Dijkstra).

Próximo: [Caminho mais curto](/category/code/bfs-caminho-mais-curto).
