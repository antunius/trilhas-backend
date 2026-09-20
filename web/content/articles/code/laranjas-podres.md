---
slug: laranjas-podres
categorySlug: code
title: "Rotting Oranges"
navTitle: "Rotting Oranges"
summary: "BFS multi-fonte por níveis: todas as laranjas podres contaminam ao mesmo tempo, e cada nível é um minuto."
level: intermediario
order: 70
section: bfs
group: BFS on Grid
---

## Enunciado

Em uma grade, `0` é vazio, `1` é laranja fresca e `2` é podre. A cada minuto, toda fresca **adjacente (4 direções)** a uma podre apodrece. Retorne o número mínimo de minutos até não restar fresca, ou `-1` se for impossível.

```
2 1 1
1 1 0
0 1 1
Saída: 4
```

## Ideia

Todas as podres agem **simultaneamente**, então elas são a origem da BFS ao mesmo tempo (**multi-fonte**). Cada **nível** da BFS é um **minuto**. Contamos as frescas: se chegar a 0, retornamos o número de níveis; se a fila acabar e ainda houver frescas, é impossível.

```gridviz
{
  "title": "rotting oranges — BFS multi-fonte",
  "code": {
    "lang": "java",
    "content": "public int orangesRotting(int[][] grid) {\n    int rows = grid.length, cols = grid[0].length, fresh = 0, minutes = 0;\n    Deque<int[]> queue = new ArrayDeque<>();\n    for (int r = 0; r < rows; r++)\n        for (int c = 0; c < cols; c++) {\n            if (grid[r][c] == 2) queue.offer(new int[]{r, c});\n            else if (grid[r][c] == 1) fresh++;\n        }\n    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};\n    while (!queue.isEmpty() && fresh > 0) {\n        int size = queue.size();\n        for (int i = 0; i < size; i++) {\n            int[] cell = queue.poll();\n            for (int[] d : dirs) {\n                int nr = cell[0] + d[0], nc = cell[1] + d[1];\n                if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;\n                if (grid[nr][nc] != 1) continue;\n                grid[nr][nc] = 2;\n                fresh--;\n                queue.offer(new int[]{nr, nc});\n            }\n        }\n        minutes++;\n    }\n    return fresh == 0 ? minutes : -1;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "R = podre, F = fresca, . = vazio",
      "grid": [["R", "F", "F"], ["F", "F", "."], [".", "F", "F"]],
      "steps": [
        {"grid": [["R", "F", "F"], ["F", "F", "."], [".", "F", "F"]], "current": [0, 0], "frontier": [[0, 0]], "queue": ["(0,0)"], "line": 6, "caption": "Varredura inicial: todas as laranjas podres entram na fila de uma vez (multi-fonte). Frescas: 6."},
        {"grid": [["R", "F", "F"], ["F", "F", "."], [".", "F", "F"]], "frontier": [[0, 0]], "queue": ["(0,0)"], "line": 11, "caption": "Minuto 1: 1 laranja(s) podre(s) contaminam as vizinhas ao mesmo tempo."},
        {"grid": [["R", "R", "F"], ["R", "F", "."], [".", "F", "F"]], "current": [0, 0], "frontier": [[1, 0], [0, 1]], "queue": ["(1,0)", "(0,1)"], "line": 13, "caption": "Sai (0,0): apodrece (1,0), (0,1). Frescas restantes: 4."},
        {"grid": [["R", "R", "F"], ["R", "F", "."], [".", "F", "F"]], "frontier": [[1, 0], [0, 1]], "queue": ["(1,0)", "(0,1)"], "line": 23, "caption": "Fim do minuto 1. Frescas: 4."},
        {"grid": [["R", "R", "F"], ["R", "F", "."], [".", "F", "F"]], "frontier": [[1, 0], [0, 1]], "queue": ["(1,0)", "(0,1)"], "line": 11, "caption": "Minuto 2: 2 laranja(s) podre(s) contaminam as vizinhas ao mesmo tempo."},
        {"grid": [["R", "R", "F"], ["R", "R", "."], [".", "F", "F"]], "current": [1, 0], "frontier": [[0, 1], [1, 1]], "queue": ["(0,1)", "(1,1)"], "line": 13, "caption": "Sai (1,0): apodrece (1,1). Frescas restantes: 3."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "F", "F"]], "current": [0, 1], "frontier": [[1, 1], [0, 2]], "queue": ["(1,1)", "(0,2)"], "line": 13, "caption": "Sai (0,1): apodrece (0,2). Frescas restantes: 2."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "F", "F"]], "frontier": [[1, 1], [0, 2]], "queue": ["(1,1)", "(0,2)"], "line": 23, "caption": "Fim do minuto 2. Frescas: 2."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "F", "F"]], "frontier": [[1, 1], [0, 2]], "queue": ["(1,1)", "(0,2)"], "line": 11, "caption": "Minuto 3: 2 laranja(s) podre(s) contaminam as vizinhas ao mesmo tempo."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "R", "F"]], "current": [1, 1], "frontier": [[0, 2], [2, 1]], "queue": ["(0,2)", "(2,1)"], "line": 13, "caption": "Sai (1,1): apodrece (2,1). Frescas restantes: 1."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "R", "F"]], "current": [0, 2], "frontier": [[2, 1]], "queue": ["(2,1)"], "line": 13, "caption": "Sai (0,2): nenhuma vizinha fresca."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "R", "F"]], "frontier": [[2, 1]], "queue": ["(2,1)"], "line": 23, "caption": "Fim do minuto 3. Frescas: 1."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "R", "F"]], "frontier": [[2, 1]], "queue": ["(2,1)"], "line": 11, "caption": "Minuto 4: 1 laranja(s) podre(s) contaminam as vizinhas ao mesmo tempo."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "R", "R"]], "current": [2, 1], "frontier": [[2, 2]], "queue": ["(2,2)"], "line": 13, "caption": "Sai (2,1): apodrece (2,2). Frescas restantes: 0."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "R", "R"]], "frontier": [[2, 2]], "queue": ["(2,2)"], "line": 23, "caption": "Fim do minuto 4. Frescas: 0."},
        {"grid": [["R", "R", "R"], ["R", "R", "."], [".", "R", "R"]], "queue": [], "found": true, "compare": [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 1], [2, 2]], "line": 25, "caption": "Nenhuma fresca sobrou → resposta = 4 minutos."}
      ]
    }
  ]
}
```

## Código

```java
public int orangesRotting(int[][] grid) {
    int rows = grid.length, cols = grid[0].length, fresh = 0, minutes = 0;
    Deque<int[]> queue = new ArrayDeque<>();
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) queue.offer(new int[]{r, c});
            else if (grid[r][c] == 1) fresh++;
        }
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!queue.isEmpty() && fresh > 0) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                if (grid[nr][nc] != 1) continue;
                grid[nr][nc] = 2;
                fresh--;
                queue.offer(new int[]{nr, nc});
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}
```

## Complexidade

- **Tempo:** O(linhas × colunas).
- **Espaço:** O(linhas × colunas) no pior caso (fila).

## Erros comuns

- Rodar uma BFS separada a partir de cada laranja podre: dá a resposta errada (os efeitos são simultâneos) e é muito mais lento.
- Contar um minuto extra no último nível (por isso o `fresh > 0` no laço).
- Esquecer o `-1` quando alguma fresca fica isolada (cercada por células vazias).
