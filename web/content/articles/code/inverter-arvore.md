---
slug: inverter-arvore
categorySlug: code
title: "Invert Binary Tree"
navTitle: "Invert Binary Tree"
summary: "Espelhar uma árvore binária trocando esquerda e direita em cada nó com DFS pós-ordem."
level: iniciante
order: 54
section: dfs
group: DFS on Tree
---

## Enunciado

Inverta uma árvore binária: troque, em **todos** os nós, o filho esquerdo pelo direito, e retorne a raiz.

```
Entrada:  [4, 2, 7, 1, 3, 6, 9]
Saída:    [4, 7, 2, 9, 6, 3, 1]
```

## Abordagem

Inverter uma árvore = inverter as duas subárvores e depois trocá-las de lado. É um problema de DFS em **pós-ordem**: primeiro os filhos (já invertidos), depois o nó atual troca os ponteiros. (Trocar antes de descer também funciona, em pré-ordem.)

```treeviz
{
  "title": "invert binary tree",
  "code": {
    "lang": "java",
    "content": "public TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode left = invertTree(root.left);\n    TreeNode right = invertTree(root.right);\n    root.left = right;\n    root.right = left;\n    return root;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "root = [4, 2, 7, 1, 3, 6, 9]",
      "tree": [4, 2, 7, 1, 3, 6, 9],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["invert(4)"], "tree": [4, 2, 7, 1, 3, 6, 9], "line": 2, "caption": "invert(4): inverte primeiro as duas subárvores."},
        {"current": 1, "visited": [0, 1], "stack": ["invert(4)", "invert(2)"], "tree": [4, 2, 7, 1, 3, 6, 9], "line": 2, "caption": "invert(2): inverte primeiro as duas subárvores."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["invert(4)", "invert(2)", "invert(1)"], "tree": [4, 2, 7, 1, 3, 6, 9], "line": 2, "caption": "invert(1): inverte primeiro as duas subárvores."},
        {"current": 3, "visited": [0, 1, 3], "compare": [3], "stack": ["invert(4)", "invert(2)", "invert(1)"], "tree": [4, 2, 7, 1, 3, 6, 9], "line": 5, "caption": "Depois de inverter os filhos, troca esquerdo ↔ direito de 1."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["invert(4)", "invert(2)", "invert(3)"], "tree": [4, 2, 7, 1, 3, 6, 9], "line": 2, "caption": "invert(3): inverte primeiro as duas subárvores."},
        {"current": 4, "visited": [0, 1, 3, 4], "compare": [4], "stack": ["invert(4)", "invert(2)", "invert(3)"], "tree": [4, 2, 7, 1, 3, 6, 9], "line": 5, "caption": "Depois de inverter os filhos, troca esquerdo ↔ direito de 3."},
        {"current": 1, "visited": [0, 1, 3, 4], "compare": [1], "stack": ["invert(4)", "invert(2)"], "tree": [4, 2, 7, 3, 1, 6, 9], "line": 5, "caption": "Depois de inverter os filhos, troca esquerdo ↔ direito de 2."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "stack": ["invert(4)", "invert(7)"], "tree": [4, 2, 7, 3, 1, 6, 9], "line": 2, "caption": "invert(7): inverte primeiro as duas subárvores."},
        {"current": 5, "visited": [0, 1, 2, 3, 4, 5], "stack": ["invert(4)", "invert(7)", "invert(6)"], "tree": [4, 2, 7, 3, 1, 6, 9], "line": 2, "caption": "invert(6): inverte primeiro as duas subárvores."},
        {"current": 5, "visited": [0, 1, 2, 3, 4, 5], "compare": [5], "stack": ["invert(4)", "invert(7)", "invert(6)"], "tree": [4, 2, 7, 3, 1, 6, 9], "line": 5, "caption": "Depois de inverter os filhos, troca esquerdo ↔ direito de 6."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 5, 6], "stack": ["invert(4)", "invert(7)", "invert(9)"], "tree": [4, 2, 7, 3, 1, 6, 9], "line": 2, "caption": "invert(9): inverte primeiro as duas subárvores."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 5, 6], "compare": [6], "stack": ["invert(4)", "invert(7)", "invert(9)"], "tree": [4, 2, 7, 3, 1, 6, 9], "line": 5, "caption": "Depois de inverter os filhos, troca esquerdo ↔ direito de 9."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 5, 6], "compare": [2], "stack": ["invert(4)", "invert(7)"], "tree": [4, 2, 7, 3, 1, 9, 6], "line": 5, "caption": "Depois de inverter os filhos, troca esquerdo ↔ direito de 7."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 5, 6], "compare": [0], "stack": ["invert(4)"], "tree": [4, 7, 2, 9, 6, 3, 1], "line": 5, "caption": "Depois de inverter os filhos, troca esquerdo ↔ direito de 4."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 5, 6], "found": true, "tree": [4, 7, 2, 9, 6, 3, 1], "line": 7, "caption": "Árvore espelhada: cada nó teve seus filhos trocados."}
      ]
    }
  ]
}
```

## Código

```java
public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(h).

## Erros comuns

- Sobrescrever `root.left` antes de guardar o valor antigo (perde a subárvore). Use variáveis temporárias.
- Trocar só na raiz: a troca vale para todos os nós.
- Esquecer o caso `null`.
