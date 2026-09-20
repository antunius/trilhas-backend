---
slug: reconstruir-preorder-inorder
categorySlug: code
title: "Reconstruct Binary Tree from Preorder and Inorder Traversal"
navTitle: "Reconstruct from Preorder and Inorder"
summary: "Montar a árvore: o preorder entrega cada raiz e o inorder diz o que fica à esquerda e à direita."
level: avancado
order: 59
section: dfs
group: Advanced
---

## Enunciado

Dados os arrays `preorder` e `inorder` de uma árvore binária de valores **distintos**, reconstrua a árvore.

```
preorder = [3, 9, 20, 15, 7]
inorder  = [9, 3, 15, 20, 7]
Saída: [3, 9, 20, null, null, 15, 7]
```

## A pista

- **Preorder:** o primeiro elemento é sempre a raiz; depois vêm a subárvore esquerda inteira e a direita inteira.
- **Inorder:** tudo à esquerda da raiz pertence à subárvore esquerda; tudo à direita, à direita.

Achar a posição da raiz no `inorder` divide o problema em dois subproblemas independentes.

## Abordagem

Um ponteiro global `pre` percorre o preorder (a próxima raiz). Um `HashMap` valor → índice no inorder evita procurar a raiz linearmente. `build(lo, hi)` constrói a árvore do intervalo `[lo, hi]` do inorder: cria a raiz, descobre `mid`, constrói **primeiro a esquerda** (que é o que vem a seguir no preorder) e depois a direita.

```treeviz
{
  "title": "reconstruct — preorder dá a raiz, inorder divide os lados",
  "code": {
    "lang": "java",
    "content": "private int pre = 0;\nprivate Map<Integer, Integer> idx = new HashMap<>();\n\npublic TreeNode buildTree(int[] preorder, int[] inorder) {\n    for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);\n    return build(preorder, 0, inorder.length - 1);\n}\n\nprivate TreeNode build(int[] preorder, int lo, int hi) {\n    if (lo > hi) return null;\n    TreeNode root = new TreeNode(preorder[pre++]);\n    int mid = idx.get(root.val);\n    root.left = build(preorder, lo, mid - 1);\n    root.right = build(preorder, mid + 1, hi);\n    return root;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7]",
      "tree": [3, 9, 20, null, null, 15, 7],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "stack": ["build(0..4)"], "tree": [3, null, null, null, null, null, null], "line": 11, "caption": "preorder[0] = 3 é a raiz do intervalo inorder [0..4]. Cria o nó 3."},
        {"current": 0, "visited": [0], "compare": [0], "stack": ["build(0..4)"], "tree": [3, null, null, null, null, null, null], "line": 12, "caption": "3 está na posição 1 do inorder → esquerda = [0..0], direita = [2..4]."},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["build(0..4)", "build(0..0)"], "tree": [3, 9, null, null, null, null, null], "line": 11, "caption": "preorder[1] = 9 é a raiz do intervalo inorder [0..0]. Cria o nó 9."},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["build(0..4)", "build(0..0)"], "tree": [3, 9, null, null, null, null, null], "line": 12, "caption": "9 está na posição 0 do inorder → esquerda = [0..-1], direita = [1..0]."},
        {"current": 2, "visited": [0, 1, 2], "compare": [2], "stack": ["build(0..4)", "build(2..4)"], "tree": [3, 9, 20, null, null, null, null], "line": 11, "caption": "preorder[2] = 20 é a raiz do intervalo inorder [2..4]. Cria o nó 20."},
        {"current": 2, "visited": [0, 1, 2], "compare": [2], "stack": ["build(0..4)", "build(2..4)"], "tree": [3, 9, 20, null, null, null, null], "line": 12, "caption": "20 está na posição 3 do inorder → esquerda = [2..2], direita = [4..4]."},
        {"current": 5, "visited": [0, 1, 2, 5], "compare": [5], "stack": ["build(0..4)", "build(2..4)", "build(2..2)"], "tree": [3, 9, 20, null, null, 15, null], "line": 11, "caption": "preorder[3] = 15 é a raiz do intervalo inorder [2..2]. Cria o nó 15."},
        {"current": 5, "visited": [0, 1, 2, 5], "compare": [5], "stack": ["build(0..4)", "build(2..4)", "build(2..2)"], "tree": [3, 9, 20, null, null, 15, null], "line": 12, "caption": "15 está na posição 2 do inorder → esquerda = [2..1], direita = [3..2]."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "compare": [6], "stack": ["build(0..4)", "build(2..4)", "build(4..4)"], "tree": [3, 9, 20, null, null, 15, 7], "line": 11, "caption": "preorder[4] = 7 é a raiz do intervalo inorder [4..4]. Cria o nó 7."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "compare": [6], "stack": ["build(0..4)", "build(2..4)", "build(4..4)"], "tree": [3, 9, 20, null, null, 15, 7], "line": 12, "caption": "7 está na posição 4 do inorder → esquerda = [4..3], direita = [5..4]."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "found": true, "tree": [3, 9, 20, null, null, 15, 7], "line": 6, "caption": "Árvore reconstruída."}
      ]
    }
  ]
}
```

## Código

```java
private int pre = 0;
private Map<Integer, Integer> idx = new HashMap<>();

public TreeNode buildTree(int[] preorder, int[] inorder) {
    for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
    return build(preorder, 0, inorder.length - 1);
}

private TreeNode build(int[] preorder, int lo, int hi) {
    if (lo > hi) return null;
    TreeNode root = new TreeNode(preorder[pre++]);
    int mid = idx.get(root.val);
    root.left = build(preorder, lo, mid - 1);
    root.right = build(preorder, mid + 1, hi);
    return root;
}
```

## Complexidade

- **Tempo:** O(n) com o mapa (O(n²) se procurar a raiz linearmente).
- **Espaço:** O(n).

## Erros comuns

- Construir a direita antes da esquerda (o `pre` fica fora de ordem).
- Procurar a raiz no inorder com um laço a cada chamada.
- Resetar `pre` a cada chamada em vez de mantê-lo compartilhado.
