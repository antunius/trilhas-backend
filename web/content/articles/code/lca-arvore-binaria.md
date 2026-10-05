---
slug: lca-arvore-binaria
categorySlug: code
title: "Lowest Common Ancestor"
navTitle: "Lowest Common Ancestor"
summary: "LCA em árvore binária qualquer com DFS bottom-up: o primeiro nó que recebe um alvo de cada lado."
level: avancado
order: 61
section: dfs
group: Advanced
---

## Enunciado

Dada uma árvore binária **qualquer** (sem ordenação) e dois nós `p` e `q`, retorne o menor ancestral comum.

```
root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]
p = 5, q = 1  →  3
p = 5, q = 4  →  5
```

## Por que não dá para usar o truque da BST

Sem ordenação não sabemos para que lado ir. Precisamos perguntar às subárvores.

## Abordagem

`lca(node)` retorna:

- `null` se nem `p` nem `q` estão na subárvore;
- `p` ou `q` se apenas um deles foi encontrado (ou o próprio nó, se ele for um alvo);
- o **LCA** se os dois estão nela.

Combinação no pai: se **ambos** os lados retornam algo não-nulo, os alvos estão em lados diferentes → o nó atual é o LCA. Se só um lado retorna algo, repasse para cima.

```treeviz
{
  "title": "LCA em árvore binária — bottom-up",
  "code": {
    "lang": "java",
    "content": "public TreeNode lca(TreeNode node, TreeNode p, TreeNode q) {\n    if (node == null || node == p || node == q) return node;\n    TreeNode left = lca(node.left, p, q);\n    TreeNode right = lca(node.right, p, q);\n    if (left != null && right != null) return node;\n    return left != null ? left : right;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "p = 5, q = 1",
      "tree": [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["lca(3)"], "line": 2, "caption": "lca(3): não é p nem q; pergunta às duas subárvores."},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["lca(3)", "lca(5)"], "values": {"1": "→ 5"}, "line": 2, "caption": "5 é um dos alvos: devolve 5 e não precisa descer mais."},
        {"current": 0, "visited": [0, 1], "stack": ["lca(3)"], "values": {"1": "→ 5"}, "line": 3, "caption": "left = 5."},
        {"current": 2, "visited": [0, 1, 2], "compare": [2], "stack": ["lca(3)", "lca(1)"], "values": {"1": "→ 5", "2": "→ 1"}, "line": 2, "caption": "1 é um dos alvos: devolve 1 e não precisa descer mais."},
        {"current": 0, "visited": [0, 1, 2], "stack": ["lca(3)"], "values": {"1": "→ 5", "2": "→ 1"}, "line": 4, "caption": "right = 1."},
        {"current": 0, "visited": [0, 1, 2], "compare": [0, 1, 2], "found": true, "stack": ["lca(3)"], "values": {"1": "→ 5", "2": "→ 1", "0": "→ 3"}, "line": 5, "caption": "Um alvo em cada lado → 3 é o ancestral comum mais baixo."}
      ]
    },
    {
      "id": "b",
      "label": "p = 5, q = 4",
      "tree": [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["lca(3)"], "line": 2, "caption": "lca(3): não é p nem q; pergunta às duas subárvores."},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["lca(3)", "lca(5)"], "values": {"1": "→ 5"}, "line": 2, "caption": "5 é um dos alvos: devolve 5 e não precisa descer mais."},
        {"current": 0, "visited": [0, 1], "stack": ["lca(3)"], "values": {"1": "→ 5"}, "line": 3, "caption": "left = 5."},
        {"current": 2, "visited": [0, 1, 2], "stack": ["lca(3)", "lca(1)"], "values": {"1": "→ 5"}, "line": 2, "caption": "lca(1): não é p nem q; pergunta às duas subárvores."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["lca(3)", "lca(1)", "lca(0)"], "values": {"1": "→ 5"}, "line": 2, "caption": "lca(0): não é p nem q; pergunta às duas subárvores."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["lca(3)", "lca(1)", "lca(0)"], "values": {"1": "→ 5"}, "line": 3, "caption": "left = null."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["lca(3)", "lca(1)", "lca(0)"], "values": {"1": "→ 5"}, "line": 4, "caption": "right = null."},
        {"current": 5, "visited": [0, 1, 2, 5], "stack": ["lca(3)", "lca(1)", "lca(0)"], "values": {"1": "→ 5", "5": "→ null"}, "line": 6, "caption": "Só um lado achou algo: repassa null para cima."},
        {"current": 2, "visited": [0, 1, 2, 5], "stack": ["lca(3)", "lca(1)"], "values": {"1": "→ 5", "5": "→ null"}, "line": 3, "caption": "left = null."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)", "lca(1)", "lca(8)"], "values": {"1": "→ 5", "5": "→ null"}, "line": 2, "caption": "lca(8): não é p nem q; pergunta às duas subárvores."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)", "lca(1)", "lca(8)"], "values": {"1": "→ 5", "5": "→ null"}, "line": 3, "caption": "left = null."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)", "lca(1)", "lca(8)"], "values": {"1": "→ 5", "5": "→ null"}, "line": 4, "caption": "right = null."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)", "lca(1)", "lca(8)"], "values": {"1": "→ 5", "5": "→ null", "6": "→ null"}, "line": 6, "caption": "Só um lado achou algo: repassa null para cima."},
        {"current": 2, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)", "lca(1)"], "values": {"1": "→ 5", "5": "→ null", "6": "→ null"}, "line": 4, "caption": "right = null."},
        {"current": 2, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)", "lca(1)"], "values": {"1": "→ 5", "5": "→ null", "6": "→ null", "2": "→ null"}, "line": 6, "caption": "Só um lado achou algo: repassa null para cima."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)"], "values": {"1": "→ 5", "5": "→ null", "6": "→ null", "2": "→ null"}, "line": 4, "caption": "right = null."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "stack": ["lca(3)"], "values": {"1": "→ 5", "5": "→ null", "6": "→ null", "2": "→ null", "0": "→ 5"}, "line": 6, "caption": "Só um lado achou algo: repassa 5 para cima."}
      ]
    }
  ]
}
```

## Código

```java
public TreeNode lca(TreeNode node, TreeNode p, TreeNode q) {
    if (node == null || node == p || node == q) return node;
    TreeNode left = lca(node.left, p, q);
    TreeNode right = lca(node.right, p, q);
    if (left != null && right != null) return node;
    return left != null ? left : right;
}
```

O caso `p = 5, q = 4` mostra por que o nó alvo pode ser o próprio ancestral: ao encontrar `5`, devolvemos `5` sem descer, e `4` (descendente dele) nunca precisa ser visitado.

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(h).

## Erros comuns

- Continuar descendo depois de achar `p` ou `q`.
- Esquecer de tratar o caso em que um alvo é ancestral do outro.
- Assumir que ambos os nós existem na árvore (o enunciado normalmente garante).
