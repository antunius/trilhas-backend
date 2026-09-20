---
slug: caminho-minimo-labirinto
categorySlug: code
title: "Shortest Path in a Maze"
navTitle: "Shortest Path in a Maze"
summary: "BFS em grade com distância por célula: o menor número de passos entre a entrada e a saída de um labirinto."
level: intermediario
order: 69
section: bfs
group: BFS on Grid
---

## Enunciado

Dada uma grade em que `0` é livre e `1` é parede, retorne o **menor número de células** em um caminho de `(0, 0)` até `(n-1, m-1)`, movendo-se em 4 direções. Se não existir, retorne `-1`.

```
. . . #
# # . #
. . . .
. # # .
Saída: 7
```

## Abordagem

Uma grade é um grafo em que cada célula livre é vizinha das 4 adjacentes livres. Como todo passo custa 1, **BFS garante o menor caminho**. Guardamos a distância junto de cada célula na fila (`{r, c, dist}`) e retornamos quando o destino sai.

```gridviz
{
  "title": "shortest path in a maze — distância por célula",
  "code": {
    "lang": "java",
    "content": "public int shortestPath(int[][] grid) {\n    int n = grid.length, m = grid[0].length;\n    if (grid[0][0] == 1 || grid[n - 1][m - 1] == 1) return -1;\n    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};\n    boolean[][] seen = new boolean[n][m];\n    Deque<int[]> queue = new ArrayDeque<>();\n    queue.offer(new int[]{0, 0, 1});\n    seen[0][0] = true;\n    while (!queue.isEmpty()) {\n        int[] cur = queue.poll();\n        int r = cur[0], c = cur[1], dist = cur[2];\n        if (r == n - 1 && c == m - 1) return dist;\n        for (int[] d : dirs) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr < 0 || nc < 0 || nr >= n || nc >= m) continue;\n            if (grid[nr][nc] == 1 || seen[nr][nc]) continue;\n            seen[nr][nc] = true;\n            queue.offer(new int[]{nr, nc, dist + 1});\n        }\n    }\n    return -1;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "# = parede, início (0,0), destino (3,3)",
      "grid": [[".", ".", ".", "#"], ["#", "#", ".", "#"], [".", ".", ".", "."], [".", "#", "#", "."]],
      "steps": [
        {"current": [0, 0], "frontier": [[0, 0]], "queue": ["(0,0)·1"], "values": {"0,0": 1}, "line": 8, "caption": "Início em (0,0) com distância 1 (contamos células). Vira a primeira da fila."},
        {"current": [0, 0], "frontier": [[0, 1]], "queue": ["(0,1)·2"], "values": {"0,0": 1, "0,1": 2}, "line": 18, "caption": "Sai (0,0) (dist 1). Descobre (0,1) com dist 2."},
        {"current": [0, 1], "visited": [[0, 0]], "frontier": [[0, 2]], "queue": ["(0,2)·3"], "values": {"0,0": 1, "0,1": 2, "0,2": 3}, "line": 18, "caption": "Sai (0,1) (dist 2). Descobre (0,2) com dist 3."},
        {"current": [0, 2], "visited": [[0, 0], [0, 1]], "frontier": [[1, 2]], "queue": ["(1,2)·4"], "values": {"0,0": 1, "0,1": 2, "0,2": 3, "1,2": 4}, "line": 18, "caption": "Sai (0,2) (dist 3). Descobre (1,2) com dist 4."},
        {"current": [1, 2], "visited": [[0, 0], [0, 1], [0, 2]], "frontier": [[2, 2]], "queue": ["(2,2)·5"], "values": {"0,0": 1, "0,1": 2, "0,2": 3, "1,2": 4, "2,2": 5}, "line": 18, "caption": "Sai (1,2) (dist 4). Descobre (2,2) com dist 5."},
        {"current": [2, 2], "visited": [[0, 0], [0, 1], [0, 2], [1, 2]], "frontier": [[2, 3], [2, 1]], "queue": ["(2,3)·6", "(2,1)·6"], "values": {"0,0": 1, "0,1": 2, "0,2": 3, "1,2": 4, "2,2": 5, "2,3": 6, "2,1": 6}, "line": 18, "caption": "Sai (2,2) (dist 5). Descobre (2,3), (2,1) com dist 6."},
        {"current": [2, 3], "visited": [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], "frontier": [[2, 1], [3, 3]], "queue": ["(2,1)·6", "(3,3)·7"], "values": {"0,0": 1, "0,1": 2, "0,2": 3, "1,2": 4, "2,2": 5, "2,3": 6, "2,1": 6, "3,3": 7}, "line": 18, "caption": "Sai (2,3) (dist 6). Descobre (3,3) com dist 7."},
        {"current": [2, 1], "visited": [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3]], "frontier": [[3, 3], [2, 0]], "queue": ["(3,3)·7", "(2,0)·7"], "values": {"0,0": 1, "0,1": 2, "0,2": 3, "1,2": 4, "2,2": 5, "2,3": 6, "2,1": 6, "3,3": 7, "2,0": 7}, "line": 18, "caption": "Sai (2,1) (dist 6). Descobre (2,0) com dist 7."},
        {"current": [3, 3], "compare": [[3, 3], [2, 3], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0]], "visited": [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3], [2, 1]], "queue": ["(2,0)·7"], "values": {"0,0": 1, "0,1": 2, "0,2": 3, "1,2": 4, "2,2": 5, "2,3": 6, "2,1": 6, "3,3": 7, "2,0": 7}, "found": true, "line": 12, "caption": "Sai o destino (3,3) com distância 7 → retornamos 7. (Em destaque, um caminho mais curto.)"}
      ]
    }
  ]
}
```

## Código

```java
public int shortestPath(int[][] grid) {
    int n = grid.length, m = grid[0].length;
    if (grid[0][0] == 1 || grid[n - 1][m - 1] == 1) return -1;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    boolean[][] seen = new boolean[n][m];
    Deque<int[]> queue = new ArrayDeque<>();
    queue.offer(new int[]{0, 0, 1});
    seen[0][0] = true;
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int r = cur[0], c = cur[1], dist = cur[2];
        if (r == n - 1 && c == m - 1) return dist;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= n || nc >= m) continue;
            if (grid[nr][nc] == 1 || seen[nr][nc]) continue;
            seen[nr][nc] = true;
            queue.offer(new int[]{nr, nc, dist + 1});
        }
    }
    return -1;
}
```

## Complexidade

- **Tempo:** O(n · m).
- **Espaço:** O(n · m).

## Erros comuns

- Esquecer de checar se início ou fim são paredes.
- Contar arestas quando o enunciado pede células (diferença de 1).
- Permitir 8 direções sem que o problema peça (o caminho fica mais curto que o esperado).
- Não marcar `seen` ao enfileirar.
