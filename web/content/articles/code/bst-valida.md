---
slug: bst-valida
categorySlug: code
title: "Valid Binary Search Tree"
navTitle: "Valid Binary Search Tree"
summary: "Validar uma BST passando limites (lo, hi) para baixo — o erro clássico é comparar só com o pai."
level: intermediario
order: 56
section: dfs
group: Binary Search Tree
---

## Enunciado

Dada a raiz de uma árvore binária, determine se ela é uma **BST válida**.

```
[2, 1, 3]                  → true
[5, 1, 4, null, null, 3, 6] → false      // 3 está à direita de 5, mas 3 < 5
```

## O erro clássico

Comparar cada nó apenas com seus filhos diretos aceitaria a segunda árvore: `4 > 1` e `3 < 4`, `6 > 4`, tudo "certo" localmente. Mas o `3` está na subárvore **direita da raiz 5**, então deveria ser maior que 5.

## Abordagem

Cada nó tem um **intervalo aberto permitido** `(lo, hi)`, herdado dos ancestrais. Começa em `(-∞, +∞)`. Ao descer à esquerda, `hi` vira o valor do pai; à direita, `lo` vira o valor do pai. É DFS top-down.

```treeviz
{
  "title": "valid binary search tree — limites (lo, hi)",
  "code": {
    "lang": "java",
    "content": "public boolean isValidBST(TreeNode root) {\n    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);\n}\n\nprivate boolean valid(TreeNode node, long lo, long hi) {\n    if (node == null) return true;\n    if (node.val <= lo || node.val >= hi) return false;\n    return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);\n}"
  },
  "examples": [
    {
      "id": "ok",
      "label": "Válida: [2, 1, 3]",
      "tree": [2, 1, 3],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["valid(2)"], "values": {"0": "(-∞, +∞)"}, "line": 7, "caption": "2 está dentro de (-∞, +∞) → ok."},
        {"current": 0, "visited": [0], "stack": ["valid(2)"], "values": {"0": "(-∞, +∞)"}, "line": 8, "caption": "Desce à esquerda com o intervalo (-∞, 2)."},
        {"current": 1, "visited": [0, 1], "stack": ["valid(2)", "valid(1)"], "values": {"0": "(-∞, +∞)", "1": "(-∞, 2)"}, "line": 7, "caption": "1 está dentro de (-∞, 2) → ok."},
        {"current": 0, "visited": [0, 1], "stack": ["valid(2)"], "values": {"0": "(-∞, +∞)", "1": "(-∞, 2)"}, "line": 8, "caption": "Desce à direita com o intervalo (2, +∞)."},
        {"current": 2, "visited": [0, 1, 2], "stack": ["valid(2)", "valid(3)"], "values": {"0": "(-∞, +∞)", "1": "(-∞, 2)", "2": "(2, +∞)"}, "line": 7, "caption": "3 está dentro de (2, +∞) → ok."},
        {"current": 0, "visited": [0, 1, 2], "found": true, "values": {"0": "(-∞, +∞)", "1": "(-∞, 2)", "2": "(2, +∞)"}, "line": 2, "caption": "Todos os nós respeitaram seus limites → BST válida."}
      ]
    },
    {
      "id": "nao",
      "label": "Inválida: [5, 1, 4, null, null, 3, 6]",
      "tree": [5, 1, 4, null, null, 3, 6],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["valid(5)"], "values": {"0": "(-∞, +∞)"}, "line": 7, "caption": "5 está dentro de (-∞, +∞) → ok."},
        {"current": 0, "visited": [0], "stack": ["valid(5)"], "values": {"0": "(-∞, +∞)"}, "line": 8, "caption": "Desce à esquerda com o intervalo (-∞, 5)."},
        {"current": 1, "visited": [0, 1], "stack": ["valid(5)", "valid(1)"], "values": {"0": "(-∞, +∞)", "1": "(-∞, 5)"}, "line": 7, "caption": "1 está dentro de (-∞, 5) → ok."},
        {"current": 0, "visited": [0, 1], "stack": ["valid(5)"], "values": {"0": "(-∞, +∞)", "1": "(-∞, 5)"}, "line": 8, "caption": "Desce à direita com o intervalo (5, +∞)."},
        {"current": 2, "visited": [0, 1, 2], "stack": ["valid(5)", "valid(4)"], "values": {"0": "(-∞, +∞)", "1": "(-∞, 5)", "2": "(5, +∞)"}, "line": 7, "caption": "4 está fora do intervalo aberto (5, +∞) → viola a BST: retorna false."},
        {"current": 2, "visited": [0, 1, 2], "compare": [2], "stack": ["valid(5)", "valid(4)"], "values": {"0": "(-∞, +∞)", "1": "(-∞, 5)", "2": "(5, +∞)"}, "line": 7, "caption": "Nó inválido: 4 precisa estar entre 5 e +∞."},
        {"current": 0, "visited": [0, 1, 2], "values": {"0": "(-∞, +∞)", "1": "(-∞, 5)", "2": "(5, +∞)"}, "line": 2, "caption": "Um nó violou os limites → não é BST."}
      ]
    }
  ]
}
```

## Código

```java
public boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean valid(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);
}
```

Alternativa: fazer a travessia em ordem e conferir que cada valor é maior que o anterior.

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(h).

## Erros comuns

- Comparar só com pai e filhos.
- Usar `int` para os limites e falhar quando um nó vale `Integer.MIN_VALUE`/`MAX_VALUE` (use `long` ou `null`).
- Aceitar duplicados quando o enunciado os proíbe (`<=`/`>=` vs `<`/`>`).
