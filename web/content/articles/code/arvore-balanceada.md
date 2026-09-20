---
slug: arvore-balanceada
categorySlug: code
title: "Balanced Binary Tree"
navTitle: "Balanced Binary Tree"
summary: "Verificar se uma árvore é balanceada em O(n), devolvendo a altura ou -1 para sinalizar desbalanceamento."
level: intermediario
order: 52
section: dfs
group: DFS on Tree
---

## Enunciado

Uma árvore é **balanceada** se, para **todo** nó, as alturas das subárvores esquerda e direita diferem em no máximo 1. Retorne `true` se a árvore for balanceada.

```
[3, 9, 20, null, null, 15, 7]   → true
[1, 2, 2, 3, 3, null, null, 4, 4] → false
```

## Força bruta

Em cada nó, calcular as alturas dos dois lados (O(n)) e depois repetir para todos os filhos: **O(n²)** no pior caso, porque a altura é recalculada várias vezes.

## Abordagem

Faça **uma passada só**, bottom-up: `height(node)` retorna a altura se a subárvore é balanceada, ou **-1** se não for. Assim o sinal de falha sobe pela árvore e podemos abortar cedo.

```treeviz
{
  "title": "balanced binary tree — altura ou -1",
  "code": {
    "lang": "java",
    "content": "public boolean isBalanced(TreeNode root) {\n    return height(root) != -1;\n}\n\nprivate int height(TreeNode node) {\n    if (node == null) return 0;\n    int left = height(node.left);\n    if (left == -1) return -1;\n    int right = height(node.right);\n    if (right == -1) return -1;\n    if (Math.abs(left - right) > 1) return -1;\n    return 1 + Math.max(left, right);\n}"
  },
  "examples": [
    {
      "id": "ok",
      "label": "Balanceada",
      "tree": [3, 9, 20, null, null, 15, 7],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["height(3)"], "line": 6, "caption": "height(3): calcula a altura dos filhos."},
        {"current": 1, "visited": [0, 1], "stack": ["height(3)", "height(9)"], "line": 6, "caption": "height(9): calcula a altura dos filhos."},
        {"current": 1, "visited": [0, 1], "stack": ["height(3)", "height(9)"], "line": 7, "caption": "Filho esquerdo é null → 0."},
        {"current": 1, "visited": [0, 1], "stack": ["height(3)", "height(9)"], "line": 9, "caption": "Filho direito é null → 0."},
        {"current": 1, "visited": [0, 1], "stack": ["height(3)", "height(9)"], "values": {"1": "→ 1"}, "line": 12, "caption": "|0 - 0| ≤ 1: balanceado. Altura = 1."},
        {"current": 0, "visited": [0, 1], "stack": ["height(3)"], "values": {"1": "→ 1"}, "line": 7, "caption": "left = 1."},
        {"current": 2, "visited": [0, 1, 2], "stack": ["height(3)", "height(20)"], "values": {"1": "→ 1"}, "line": 6, "caption": "height(20): calcula a altura dos filhos."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["height(3)", "height(20)", "height(15)"], "values": {"1": "→ 1"}, "line": 6, "caption": "height(15): calcula a altura dos filhos."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["height(3)", "height(20)", "height(15)"], "values": {"1": "→ 1"}, "line": 7, "caption": "Filho esquerdo é null → 0."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["height(3)", "height(20)", "height(15)"], "values": {"1": "→ 1"}, "line": 9, "caption": "Filho direito é null → 0."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["height(3)", "height(20)", "height(15)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 12, "caption": "|0 - 0| ≤ 1: balanceado. Altura = 1."},
        {"current": 2, "visited": [0, 1, 2, 5], "stack": ["height(3)", "height(20)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 7, "caption": "left = 1."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)", "height(20)", "height(7)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 6, "caption": "height(7): calcula a altura dos filhos."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)", "height(20)", "height(7)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 7, "caption": "Filho esquerdo é null → 0."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)", "height(20)", "height(7)"], "values": {"1": "→ 1", "5": "→ 1"}, "line": 9, "caption": "Filho direito é null → 0."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)", "height(20)", "height(7)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1"}, "line": 12, "caption": "|0 - 0| ≤ 1: balanceado. Altura = 1."},
        {"current": 2, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)", "height(20)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1"}, "line": 9, "caption": "right = 1."},
        {"current": 2, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)", "height(20)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2"}, "line": 12, "caption": "|1 - 1| ≤ 1: balanceado. Altura = 2."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2"}, "line": 9, "caption": "right = 2."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "stack": ["height(3)"], "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2", "0": "→ 3"}, "line": 12, "caption": "|1 - 2| ≤ 1: balanceado. Altura = 3."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "found": true, "values": {"1": "→ 1", "5": "→ 1", "6": "→ 1", "2": "→ 2", "0": "→ 3"}, "line": 2, "caption": "height(root) != -1 → a árvore é balanceada."}
      ]
    },
    {
      "id": "nao",
      "label": "Desbalanceada",
      "tree": [1, 2, 2, 3, 3, null, null, 4, 4],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["height(1)"], "line": 6, "caption": "height(1): calcula a altura dos filhos."},
        {"current": 1, "visited": [0, 1], "stack": ["height(1)", "height(2)"], "line": 6, "caption": "height(2): calcula a altura dos filhos."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["height(1)", "height(2)", "height(3)"], "line": 6, "caption": "height(3): calcula a altura dos filhos."},
        {"current": 7, "visited": [0, 1, 3, 7], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "line": 6, "caption": "height(4): calcula a altura dos filhos."},
        {"current": 7, "visited": [0, 1, 3, 7], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "line": 7, "caption": "Filho esquerdo é null → 0."},
        {"current": 7, "visited": [0, 1, 3, 7], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "line": 9, "caption": "Filho direito é null → 0."},
        {"current": 7, "visited": [0, 1, 3, 7], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "values": {"7": "→ 1"}, "line": 12, "caption": "|0 - 0| ≤ 1: balanceado. Altura = 1."},
        {"current": 3, "visited": [0, 1, 3, 7], "stack": ["height(1)", "height(2)", "height(3)"], "values": {"7": "→ 1"}, "line": 7, "caption": "left = 1."},
        {"current": 8, "visited": [0, 1, 3, 7, 8], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "values": {"7": "→ 1"}, "line": 6, "caption": "height(4): calcula a altura dos filhos."},
        {"current": 8, "visited": [0, 1, 3, 7, 8], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "values": {"7": "→ 1"}, "line": 7, "caption": "Filho esquerdo é null → 0."},
        {"current": 8, "visited": [0, 1, 3, 7, 8], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "values": {"7": "→ 1"}, "line": 9, "caption": "Filho direito é null → 0."},
        {"current": 8, "visited": [0, 1, 3, 7, 8], "stack": ["height(1)", "height(2)", "height(3)", "height(4)"], "values": {"7": "→ 1", "8": "→ 1"}, "line": 12, "caption": "|0 - 0| ≤ 1: balanceado. Altura = 1."},
        {"current": 3, "visited": [0, 1, 3, 7, 8], "stack": ["height(1)", "height(2)", "height(3)"], "values": {"7": "→ 1", "8": "→ 1"}, "line": 9, "caption": "right = 1."},
        {"current": 3, "visited": [0, 1, 3, 7, 8], "stack": ["height(1)", "height(2)", "height(3)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2"}, "line": 12, "caption": "|1 - 1| ≤ 1: balanceado. Altura = 2."},
        {"current": 1, "visited": [0, 1, 3, 7, 8], "stack": ["height(1)", "height(2)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2"}, "line": 7, "caption": "left = 2."},
        {"current": 4, "visited": [0, 1, 3, 4, 7, 8], "stack": ["height(1)", "height(2)", "height(3)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2"}, "line": 6, "caption": "height(3): calcula a altura dos filhos."},
        {"current": 4, "visited": [0, 1, 3, 4, 7, 8], "stack": ["height(1)", "height(2)", "height(3)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2"}, "line": 7, "caption": "Filho esquerdo é null → 0."},
        {"current": 4, "visited": [0, 1, 3, 4, 7, 8], "stack": ["height(1)", "height(2)", "height(3)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2"}, "line": 9, "caption": "Filho direito é null → 0."},
        {"current": 4, "visited": [0, 1, 3, 4, 7, 8], "stack": ["height(1)", "height(2)", "height(3)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1"}, "line": 12, "caption": "|0 - 0| ≤ 1: balanceado. Altura = 1."},
        {"current": 1, "visited": [0, 1, 3, 4, 7, 8], "stack": ["height(1)", "height(2)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1"}, "line": 9, "caption": "right = 1."},
        {"current": 1, "visited": [0, 1, 3, 4, 7, 8], "stack": ["height(1)", "height(2)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3"}, "line": 12, "caption": "|2 - 1| ≤ 1: balanceado. Altura = 3."},
        {"current": 0, "visited": [0, 1, 3, 4, 7, 8], "stack": ["height(1)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3"}, "line": 7, "caption": "left = 3."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 7, 8], "stack": ["height(1)", "height(2)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3"}, "line": 6, "caption": "height(2): calcula a altura dos filhos."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 7, 8], "stack": ["height(1)", "height(2)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3"}, "line": 7, "caption": "Filho esquerdo é null → 0."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 7, 8], "stack": ["height(1)", "height(2)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3"}, "line": 9, "caption": "Filho direito é null → 0."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 7, 8], "stack": ["height(1)", "height(2)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3", "2": "→ 1"}, "line": 12, "caption": "|0 - 0| ≤ 1: balanceado. Altura = 1."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 7, 8], "stack": ["height(1)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3", "2": "→ 1"}, "line": 9, "caption": "right = 1."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 7, 8], "stack": ["height(1)"], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3", "2": "→ 1", "0": "→ -1"}, "line": 11, "caption": "|3 - 1| = 2 > 1 → este nó está desbalanceado: retorna -1."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 7, 8], "values": {"7": "→ 1", "8": "→ 1", "3": "→ 2", "4": "→ 1", "1": "→ 3", "2": "→ 1", "0": "→ -1"}, "line": 2, "caption": "height(root) == -1 → a árvore NÃO é balanceada."}
      ]
    }
  ]
}
```

## Código

```java
public boolean isBalanced(TreeNode root) {
    return height(root) != -1;
}

private int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left);
    if (left == -1) return -1;
    int right = height(node.right);
    if (right == -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}
```

## Complexidade

- **Tempo:** O(n) — cada nó é visitado uma vez.
- **Espaço:** O(h).

## Erros comuns

- Checar o balanceamento só na raiz: a regra vale para **todo** nó.
- Esquecer de propagar o `-1` e misturá-lo em `1 + max(...)`.
- Recalcular alturas em cada nó (volta a O(n²)).
