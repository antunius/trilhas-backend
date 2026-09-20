---
slug: subarvore-de-outra
categorySlug: code
title: "Subtree of Another Tree"
navTitle: "Subtree of Another Tree"
summary: "Combinar duas DFS: percorrer a árvore principal e, em cada nó, testar se as duas árvores são idênticas."
level: intermediario
order: 53
section: dfs
group: DFS on Tree
---

## Enunciado

Dadas as raízes `root` e `sub`, retorne `true` se existe em `root` uma subárvore com a **mesma estrutura e os mesmos valores** que `sub`.

```
root = [3, 4, 5, 1, 2], sub = [4, 1, 2]  → true
```

## Força bruta

Serializar as duas árvores e procurar uma string dentro da outra também funciona, mas exige cuidado com marcadores para evitar falsos positivos. A solução recursiva é mais direta.

## Abordagem

Duas DFS aninhadas:

1. `isSubtree` percorre `root` e, em cada nó, pergunta "a árvore que começa aqui é igual a `sub`?".
2. `isSame(a, b)` compara duas árvores: ambas `null` → iguais; só uma `null` → diferentes; senão valores iguais **e** filhos iguais.

```treeviz
{
  "title": "subarvore de outra árvore — isSame em cada nó",
  "code": {
    "lang": "java",
    "content": "public boolean isSubtree(TreeNode root, TreeNode sub) {\n    if (root == null) return false;\n    if (isSame(root, sub)) return true;\n    return isSubtree(root.left, sub) || isSubtree(root.right, sub);\n}\n\nprivate boolean isSame(TreeNode a, TreeNode b) {\n    if (a == null && b == null) return true;\n    if (a == null || b == null) return false;\n    return a.val == b.val && isSame(a.left, b.left) && isSame(a.right, b.right);\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "root = [3, 4, 5, 1, 2], sub = [4, 1, 2]",
      "tree": [3, 4, 5, 1, 2],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "stack": ["isSubtree(3)"], "line": 3, "caption": "isSame(3, sub[raiz 4]) → false: 3 ≠ 4 (ou a estrutura difere)."},
        {"current": 0, "visited": [0], "stack": ["isSubtree(3)"], "line": 4, "caption": "Procura sub na subárvore esquerda."},
        {"current": 1, "visited": [0, 1], "compare": [1, 3, 4], "found": true, "stack": ["isSubtree(3)", "isSubtree(4)"], "line": 3, "caption": "isSame(4, sub[raiz 4]) → True: a árvore em 4 é idêntica a sub."}
      ]
    }
  ]
}
```

## Código

```java
public boolean isSubtree(TreeNode root, TreeNode sub) {
    if (root == null) return false;
    if (isSame(root, sub)) return true;
    return isSubtree(root.left, sub) || isSubtree(root.right, sub);
}

private boolean isSame(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.val == b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
}
```

## Complexidade

- **Tempo:** O(n · m), com `n` nós em `root` e `m` em `sub` (`isSame` roda a cada nó, mas para no primeiro descasamento).
- **Espaço:** O(h).

## Erros comuns

- Comparar só o valor da raiz e esquecer a estrutura abaixo.
- Tratar `null` e `null` como diferentes em `isSame`.
- Confundir "subárvore" com "subconjunto de nós": a subárvore inclui **todos** os descendentes.
