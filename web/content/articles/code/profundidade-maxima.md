---
slug: profundidade-maxima
categorySlug: code
title: "Max Depth of A Tree"
navTitle: "Max Depth of A Tree"
summary: "Calcular a altura de uma árvore binária com DFS bottom-up: 1 + o maior entre os filhos."
level: iniciante
order: 50
section: dfs
group: DFS on Tree
---

## Enunciado

Dada a raiz de uma árvore binária, retorne sua **profundidade máxima**: o número de nós no maior caminho da raiz até uma folha.

```
Entrada: root = [3, 9, 20, null, null, 15, 7]
Saída: 3
```

## Força bruta

Enumerar todos os caminhos raiz→folha e medir cada um. Funciona, mas repete trabalho e exige guardar caminhos; a recursão já faz isso naturalmente.

## Abordagem

Uma árvore vazia tem profundidade 0. Qualquer outra tem **1 (o próprio nó) + a maior profundidade entre as subárvores**. É pura fé indutiva: assuma que `maxDepth(filho)` funciona.

```treeviz
{
  "title": "max depth of a tree",
  "code": {
    "lang": "java",
    "content": "public int maxDepth(TreeNode root) {\n    if (root == null) return 0;\n    int left = maxDepth(root.left);\n    int right = maxDepth(root.right);\n    return 1 + Math.max(left, right);\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "root = [3, 9, 20, null, null, 15, 7]",
      "tree": [3, 9, 20, null, null, 15, 7],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["maxDepth(3)"], "line": 2, "caption": "maxDepth(3): o nó existe; descemos pelos dois lados."},
        {"current": 1, "visited": [0, 1], "stack": ["maxDepth(3)", "maxDepth(9)"], "line": 2, "caption": "maxDepth(9): o nó existe; descemos pelos dois lados."},
        {"current": 1, "visited": [0, 1], "stack": ["maxDepth(3)", "maxDepth(9)"], "line": 3, "caption": "Filho esquerdo é null → altura 0."},
        {"current": 1, "visited": [0, 1], "stack": ["maxDepth(3)", "maxDepth(9)"], "line": 4, "caption": "Filho direito é null → altura 0."},
        {"current": 1, "visited": [0, 1], "stack": ["maxDepth(3)", "maxDepth(9)"], "values": {"1": "→ 1"}, "line": 5, "caption": "1 + max(0, 0) = 1."},
        {"current": 0, "visited": [0, 1], "stack": ["maxDepth(3)"], "values": {"1": "→ 1"}, "line": 3, "caption": "left = 1."},
        {"current": 2, "visited": [0, 1, 2], "stack": ["maxDepth(3)", "maxDepth(20)"], "values": {"1": "→ 1"}, "line": 2, "caption": "maxDepth(20): o nó existe; descemos pelos dois lados."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(15)"], "values": {"1": "→ 1"}, "line": 2, "caption": "maxDepth(15): o nó existe; descemos pelos dois lados."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(15)"], "values": {"1": "→ 1"}, "line": 3, "caption": "Filho esquerdo é null → altura 0."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(15)"], "values": {"1": "→ 1"}, "line": 4, "caption": "Filho direito é null → altura 0."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(15)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 5, "caption": "1 + max(0, 0) = 1."},
        {"current": 2, "visited": [0, 1, 2, 5], "stack": ["maxDepth(3)", "maxDepth(20)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 3, "caption": "left = 1."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(7)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 2, "caption": "maxDepth(7): o nó existe; descemos pelos dois lados."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(7)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 3, "caption": "Filho esquerdo é null → altura 0."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(7)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 4, "caption": "Filho direito é null → altura 0."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)", "maxDepth(20)", "maxDepth(7)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1"}, "line": 5, "caption": "1 + max(0, 0) = 1."},
        {"current": 2, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)", "maxDepth(20)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1"}, "line": 4, "caption": "right = 1."},
        {"current": 2, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)", "maxDepth(20)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2"}, "line": 5, "caption": "1 + max(1, 1) = 2."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2"}, "line": 4, "caption": "right = 2."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "stack": ["maxDepth(3)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2", "0": "→ 3"}, "line": 5, "caption": "1 + max(1, 2) = 3."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "found": true, "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2", "0": "→ 3"}, "line": 5, "caption": "Profundidade máxima = 3."}
      ]
    }
  ]
}
```

## Código

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    int left = maxDepth(root.left);
    int right = maxDepth(root.right);
    return 1 + Math.max(left, right);
}
```

## Complexidade

- **Tempo:** O(n) — cada nó é visitado uma vez.
- **Espaço:** O(h) de pilha.

## Erros comuns

- Retornar `-1` ou `1` para `null`: o caso base é 0.
- Usar `max` sem somar 1 pelo nó atual.
- Contar arestas quando o enunciado pede nós (ou o contrário).
