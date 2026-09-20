---
slug: numero-de-ilhas
categorySlug: code
title: "Number of Islands"
navTitle: "Number of Islands"
summary: "BFS como flood fill: cada nova terra não visitada é uma ilha, e a BFS marca a ilha inteira."
level: intermediario
order: 68
section: bfs
group: BFS on Grid
---

## Enunciado

Dada uma grade de `'1'` (terra) e `'0'` (água), conte o número de **ilhas**. Uma ilha é um grupo de células de terra conectadas na **horizontal ou vertical**.

```
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
Saída: 3
```

## Ideia

Percorra a grade. Ao achar uma terra **ainda não visitada**, você descobriu uma ilha nova: some 1 e faça uma BFS a partir dela, marcando toda a ilha como visitada. Assim ela não será contada de novo. Isso é um **flood fill**.

```gridviz
{
  "title": "number of islands — BFS como flood fill",
  "code": {
    "lang": "java",
    "content": "public int numIslands(char[][] grid) {\n    int rows = grid.length, cols = grid[0].length, islands = 0;\n    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};\n    for (int r = 0; r < rows; r++) {\n        for (int c = 0; c < cols; c++) {\n            if (grid[r][c] != '1') continue;\n            islands++;\n            Deque<int[]> queue = new ArrayDeque<>();\n            queue.offer(new int[]{r, c});\n            grid[r][c] = '0';\n            while (!queue.isEmpty()) {\n                int[] cell = queue.poll();\n                for (int[] d : dirs) {\n                    int nr = cell[0] + d[0], nc = cell[1] + d[1];\n                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;\n                    if (grid[nr][nc] != '1') continue;\n                    grid[nr][nc] = '0';\n                    queue.offer(new int[]{nr, nc});\n                }\n            }\n        }\n    }\n    return islands;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "L = terra, . = água",
      "grid": [["L", "L", ".", ".", "."], ["L", "L", ".", ".", "."], [".", ".", "L", ".", "."], [".", ".", ".", "L", "L"]],
      "steps": [
        {"current": [0, 0], "frontier": [[0, 0]], "queue": ["(0,0)"], "line": 7, "caption": "Encontramos terra ainda não visitada em (0,0): é a ilha #1. Marcamos a célula e a colocamos na fila."},
        {"current": [0, 0], "frontier": [[1, 0], [0, 1]], "queue": ["(1,0)", "(0,1)"], "line": 12, "caption": "Sai (0,0). Terra vizinha nova: (1,0), (0,1) → marca e enfileira."},
        {"current": [1, 0], "visited": [[0, 0]], "frontier": [[0, 1], [1, 1]], "queue": ["(0,1)", "(1,1)"], "line": 12, "caption": "Sai (1,0). Terra vizinha nova: (1,1) → marca e enfileira."},
        {"current": [0, 1], "visited": [[0, 0], [1, 0]], "frontier": [[1, 1]], "queue": ["(1,1)"], "line": 12, "caption": "Sai (0,1). Nenhum vizinho de terra novo."},
        {"current": [1, 1], "visited": [[0, 0], [1, 0], [0, 1]], "queue": [], "line": 12, "caption": "Sai (1,1). Nenhum vizinho de terra novo."},
        {"current": [2, 2], "visited": [[0, 0], [1, 0], [0, 1], [1, 1]], "frontier": [[2, 2]], "queue": ["(2,2)"], "line": 7, "caption": "Encontramos terra ainda não visitada em (2,2): é a ilha #2. Marcamos a célula e a colocamos na fila."},
        {"current": [2, 2], "visited": [[0, 0], [1, 0], [0, 1], [1, 1]], "queue": [], "line": 12, "caption": "Sai (2,2). Nenhum vizinho de terra novo."},
        {"current": [3, 3], "visited": [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2]], "frontier": [[3, 3]], "queue": ["(3,3)"], "line": 7, "caption": "Encontramos terra ainda não visitada em (3,3): é a ilha #3. Marcamos a célula e a colocamos na fila."},
        {"current": [3, 3], "visited": [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2]], "frontier": [[3, 4]], "queue": ["(3,4)"], "line": 12, "caption": "Sai (3,3). Terra vizinha nova: (3,4) → marca e enfileira."},
        {"current": [3, 4], "visited": [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2], [3, 3]], "queue": [], "line": 12, "caption": "Sai (3,4). Nenhum vizinho de terra novo."},
        {"visited": [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2], [3, 3], [3, 4]], "queue": [], "found": true, "line": 23, "caption": "Varremos toda a grade: 3 ilhas."}
      ]
    }
  ]
}
```

## Código

```java
public int numIslands(char[][] grid) {
    int rows = grid.length, cols = grid[0].length, islands = 0;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] != '1') continue;
            islands++;
            Deque<int[]> queue = new ArrayDeque<>();
            queue.offer(new int[]{r, c});
            grid[r][c] = '0';                     // marca ao enfileirar
            while (!queue.isEmpty()) {
                int[] cell = queue.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                    if (grid[nr][nc] != '1') continue;
                    grid[nr][nc] = '0';
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
    }
    return islands;
}
```

Se não puder alterar a grade, use uma matriz `visited` separada.

## Complexidade

- **Tempo:** O(linhas × colunas): cada célula entra na fila no máximo uma vez.
- **Espaço:** O(min(linhas, colunas)) para a fila (a fronteira); O(linhas × colunas) se usar `visited`.

## Erros comuns

- Marcar a célula só ao **sair** da fila: ela pode ser enfileirada várias vezes.
- Esquecer a checagem de limites antes de acessar `grid[nr][nc]`.
- Contar conectividade diagonal quando o enunciado pede só 4 direções.

Também dá para resolver com [DFS](/category/code/dfs-introducao); a diferença é só a estrutura (pilha × fila).
