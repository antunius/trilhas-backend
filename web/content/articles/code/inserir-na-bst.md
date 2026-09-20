---
slug: inserir-na-bst
categorySlug: code
title: "Insert Into BST"
navTitle: "Insert Into BST"
summary: "Inserir um valor em uma BST descendo até a posição vazia e ligando o novo nó ao pai."
level: iniciante
order: 57
section: dfs
group: Binary Search Tree
---

## Enunciado

Dada a raiz de uma BST e um valor `val` que ainda não existe nela, insira `val` mantendo a propriedade da BST e retorne a raiz.

```
root = [4, 2, 7, 1, 3], val = 5  →  [4, 2, 7, 1, 3, 5]   // 5 vira filho esquerdo de 7
```

## Abordagem

Siga a mesma regra da busca: menor → esquerda, maior → direita. Quando chegar a um `null`, **é ali que o novo nó pertence**. A recursão devolve o nó (novo ou o mesmo) para o pai religar seu ponteiro.

```treeviz
{
  "title": "insert into BST",
  "code": {
    "lang": "java",
    "content": "public TreeNode insert(TreeNode node, int val) {\n    if (node == null) return new TreeNode(val);\n    if (val < node.val) node.left = insert(node.left, val);\n    else node.right = insert(node.right, val);\n    return node;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Inserir 5 em [4, 2, 7, 1, 3]",
      "tree": [4, 2, 7, 1, 3],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "stack": ["insert(4)"], "line": 4, "caption": "5 > 4: vai para a direita."},
        {"current": 2, "visited": [0, 2], "compare": [2], "stack": ["insert(4)", "insert(7)"], "line": 3, "caption": "5 < 7: vai para a esquerda."},
        {"current": 5, "visited": [0, 2], "found": true, "stack": ["insert(4)", "insert(7)", "insert(null)"], "tree": [4, 2, 7, 1, 3, 5], "line": 2, "caption": "Posição vazia: cria o nó 5 aqui e o devolve ao pai."}
      ]
    }
  ]
}
```

## Código

```java
public TreeNode insert(TreeNode node, int val) {
    if (node == null) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
}
```

## Complexidade

- **Tempo:** O(h): O(log n) balanceada, O(n) degenerada.
- **Espaço:** O(h) de pilha (O(1) na versão iterativa).

## Erros comuns

- Não atribuir o retorno (`node.left = insert(...)`): o novo nó nunca é ligado.
- Retornar o novo nó em vez de `node` nos casos recursivos (perde a raiz).
- Inserir sempre na raiz esquerda/direita sem comparar.
