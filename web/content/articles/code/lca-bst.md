---
slug: lca-bst
categorySlug: code
title: "Lowest Common Ancestor of a Binary Search Tree"
navTitle: "Lowest Common Ancestor of a BST"
summary: "Achar o menor ancestral comum em uma BST descendo até o primeiro nó que separa p e q."
level: intermediario
order: 58
section: dfs
group: Binary Search Tree
---

## Enunciado

Dada uma BST e dois nós `p` e `q`, retorne o **menor ancestral comum** (LCA): o nó mais profundo que tem `p` e `q` entre seus descendentes (um nó conta como descendente de si mesmo).

```
root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]
p = 2, q = 8  →  6
p = 3, q = 5  →  4
```

## Abordagem

Na BST, o invariante ordena tudo. A partir da raiz:

- se `p` e `q` são **menores** que o nó, o LCA está à esquerda;
- se são **maiores**, está à direita;
- caso contrário, o nó **separa** os dois (ou é um deles) → é o LCA.

Sem recursão nem pilha: um laço simples.

```treeviz
{
  "title": "LCA em BST — o primeiro nó que separa p e q",
  "code": {
    "lang": "java",
    "content": "public TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {\n    TreeNode node = root;\n    while (node != null) {\n        if (p.val < node.val && q.val < node.val) node = node.left;\n        else if (p.val > node.val && q.val > node.val) node = node.right;\n        else return node;\n    }\n    return null;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "p = 3, q = 5",
      "tree": [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "eliminated": [2, 5, 6], "line": 4, "caption": "p = 3 e q = 5 são menores que 6: os dois estão à esquerda."},
        {"current": 1, "visited": [0, 1], "compare": [1], "eliminated": [3], "line": 5, "caption": "p = 3 e q = 5 são maiores que 2: os dois estão à direita."},
        {"current": 4, "visited": [0, 1, 4], "compare": [4, 9, 10], "found": true, "line": 6, "caption": "4 separa p = 3 e q = 5 (ou é um deles): é o menor ancestral comum."}
      ]
    },
    {
      "id": "b",
      "label": "p = 2, q = 8",
      "tree": [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0, 1, 2], "found": true, "line": 6, "caption": "6 separa p = 2 e q = 8 (ou é um deles): é o menor ancestral comum."}
      ]
    }
  ]
}
```

## Código

```java
public TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
    TreeNode node = root;
    while (node != null) {
        if (p.val < node.val && q.val < node.val) node = node.left;
        else if (p.val > node.val && q.val > node.val) node = node.right;
        else return node;
    }
    return null;
}
```

## Complexidade

- **Tempo:** O(h).
- **Espaço:** O(1).

## Erros comuns

- Usar a solução de árvore binária genérica (O(n)) e ignorar o invariante.
- Esquecer o caso em que `p` ou `q` **é** o ancestral.
- Comparar referências em vez de valores (ou o contrário) sem consistência.
