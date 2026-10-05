---
slug: bst-introducao
categorySlug: code
title: "Binary Search Tree: Introdução"
navTitle: "Binary Search Tree Intro"
summary: "O invariante da BST e os templates de busca, inserção e travessia em ordem."
level: intermediario
order: 55
section: dfs
group: Binary Search Tree
---

## O invariante

Uma **Binary Search Tree** é uma árvore binária em que, para **todo** nó:

- todos os valores da subárvore esquerda são **menores** que o nó;
- todos os valores da subárvore direita são **maiores**.

Não basta comparar com o filho direto: a regra vale para **toda a subárvore**. É isso que permite descartar metade da árvore a cada comparação — o mesmo raciocínio da busca binária.

## Template — busca

```java
TreeNode search(TreeNode node, int target) {
    if (node == null) return null;
    if (node.val == target) return node;
    if (target < node.val) return search(node.left, target);
    return search(node.right, target);
}
```

```treeviz
{
  "title": "busca em BST — metade da árvore descartada por passo",
  "code": {
    "lang": "java",
    "content": "TreeNode search(TreeNode node, int target) {\n    if (node == null) return null;\n    if (node.val == target) return node;\n    if (target < node.val) return search(node.left, target);\n    return search(node.right, target);\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Buscar 7",
      "tree": [8, 3, 10, 1, 6, null, 14, null, null, 4, 7],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "eliminated": [2, 6], "stack": ["search(8)"], "line": 4, "caption": "7 < 8: o alvo só pode estar à esquerda. Descartamos a subárvore direita inteira."},
        {"current": 1, "visited": [0, 1], "compare": [1], "eliminated": [3], "stack": ["search(8)", "search(3)"], "line": 5, "caption": "7 > 3: o alvo só pode estar à direita. Descartamos a subárvore esquerda inteira."},
        {"current": 4, "visited": [0, 1, 4], "compare": [4], "eliminated": [9], "stack": ["search(8)", "search(3)", "search(6)"], "line": 5, "caption": "7 > 6: o alvo só pode estar à direita. Descartamos a subárvore esquerda inteira."},
        {"current": 10, "visited": [0, 1, 4, 10], "compare": [10], "found": true, "stack": ["search(8)", "search(3)", "search(6)", "search(7)"], "line": 3, "caption": "7 == 7: achamos!"}
      ]
    }
  ]
}
```

## Template — inserção

```java
TreeNode insert(TreeNode node, int val) {
    if (node == null) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
}
```

## Template — travessia em ordem

```java
void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);          // valores saem em ordem crescente
    inorder(node.right, out);
}
```

> Se a travessia em ordem **não** sai crescente, a árvore não é uma BST.

## Complexidade

| Operação | Balanceada | Pior caso (degenerada) |
|---|---|---|
| Busca / inserção | O(log n) | O(n) |
| Em ordem | O(n) | O(n) |

## Aplicado em

[Valid BST](/category/code/bst-valida), [Insert Into BST](/category/code/inserir-na-bst), [LCA de BST](/category/code/lca-bst).

## Erros comuns

- Validar só pai e filho, ignorando o resto da subárvore.
- Assumir que a BST é balanceada (ela pode virar uma lista).
- Não tratar valores duplicados: defina a regra (`<`/`≤`) e mantenha-a.
