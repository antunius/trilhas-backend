---
slug: dfs-em-arvores-intro
categorySlug: code
title: "DFS em Árvores: Introdução"
navTitle: "Intro"
summary: "Os dois estilos de DFS em árvores — devolver valores para cima ou passar estado para baixo — e como escolher."
level: intermediario
order: 49
section: dfs
group: DFS on Tree
---

## Dois estilos

Quase todo problema de DFS em árvore cai em um de dois estilos (ou combina os dois).

### Bottom-up: os filhos devolvem, o pai combina

Cada chamada **retorna** um valor sobre a sua subárvore, e o pai combina os retornos dos filhos.

```treeviz
{
  "title": "DFS bottom-up — filhos devolvem, pai combina",
  "code": {
    "lang": "java",
    "content": "int size(TreeNode node) {\n    if (node == null) return 0;\n    int left = size(node.left);\n    int right = size(node.right);\n    return 1 + left + right;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Árvore 1–6",
      "tree": [1, 2, 3, 4, 5, null, 6],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["size(1)"], "line": 2, "caption": "size(1): nó existe; pergunta a cada filho o tamanho da sua subárvore."},
        {"current": 1, "visited": [0, 1], "stack": ["size(1)", "size(2)"], "line": 2, "caption": "size(2): nó existe; pergunta a cada filho o tamanho da sua subárvore."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["size(1)", "size(2)", "size(4)"], "line": 2, "caption": "size(4): nó existe; pergunta a cada filho o tamanho da sua subárvore."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["size(1)", "size(2)", "size(4)"], "line": 3, "caption": "Filho esquerdo é null → tamanho 0."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["size(1)", "size(2)", "size(4)"], "line": 4, "caption": "Filho direito é null → tamanho 0."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["size(1)", "size(2)", "size(4)"], "values": {"3": "→ 1"}, "line": 5, "caption": "size(4) = 1 + 0 + 0 = 1. O resultado sobe para o pai."},
        {"current": 1, "visited": [0, 1, 3], "stack": ["size(1)", "size(2)"], "values": {"3": "→ 1"}, "line": 3, "caption": "left = 1 (tamanho da subárvore de 4)."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["size(1)", "size(2)", "size(5)"], "values": {"3": "→ 1"}, "line": 2, "caption": "size(5): nó existe; pergunta a cada filho o tamanho da sua subárvore."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["size(1)", "size(2)", "size(5)"], "values": {"3": "→ 1"}, "line": 3, "caption": "Filho esquerdo é null → tamanho 0."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["size(1)", "size(2)", "size(5)"], "values": {"3": "→ 1"}, "line": 4, "caption": "Filho direito é null → tamanho 0."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["size(1)", "size(2)", "size(5)"], "values": {"3": "→ 1", "4": "→ 1"}, "line": 5, "caption": "size(5) = 1 + 0 + 0 = 1. O resultado sobe para o pai."},
        {"current": 1, "visited": [0, 1, 3, 4], "stack": ["size(1)", "size(2)"], "values": {"3": "→ 1", "4": "→ 1"}, "line": 4, "caption": "right = 1 (tamanho da subárvore de 5)."},
        {"current": 1, "visited": [0, 1, 3, 4], "stack": ["size(1)", "size(2)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3"}, "line": 5, "caption": "size(2) = 1 + 1 + 1 = 3. O resultado sobe para o pai."},
        {"current": 0, "visited": [0, 1, 3, 4], "stack": ["size(1)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3"}, "line": 3, "caption": "left = 3 (tamanho da subárvore de 2)."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "stack": ["size(1)", "size(3)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3"}, "line": 2, "caption": "size(3): nó existe; pergunta a cada filho o tamanho da sua subárvore."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "stack": ["size(1)", "size(3)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3"}, "line": 3, "caption": "Filho esquerdo é null → tamanho 0."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)", "size(3)", "size(6)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3"}, "line": 2, "caption": "size(6): nó existe; pergunta a cada filho o tamanho da sua subárvore."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)", "size(3)", "size(6)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3"}, "line": 3, "caption": "Filho esquerdo é null → tamanho 0."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)", "size(3)", "size(6)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3"}, "line": 4, "caption": "Filho direito é null → tamanho 0."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)", "size(3)", "size(6)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3", "6": "→ 1"}, "line": 5, "caption": "size(6) = 1 + 0 + 0 = 1. O resultado sobe para o pai."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)", "size(3)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3", "6": "→ 1"}, "line": 4, "caption": "right = 1 (tamanho da subárvore de 6)."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)", "size(3)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3", "6": "→ 1", "2": "→ 2"}, "line": 5, "caption": "size(3) = 1 + 0 + 1 = 2. O resultado sobe para o pai."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3", "6": "→ 1", "2": "→ 2"}, "line": 4, "caption": "right = 2 (tamanho da subárvore de 3)."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 6], "stack": ["size(1)"], "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3", "6": "→ 1", "2": "→ 2", "0": "→ 6"}, "line": 5, "caption": "size(1) = 1 + 3 + 2 = 6. O resultado sobe para o pai."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 6], "found": true, "values": {"3": "→ 1", "4": "→ 1", "1": "→ 3", "6": "→ 1", "2": "→ 2", "0": "→ 6"}, "line": 5, "caption": "A raiz devolve 6: a árvore tem 6 nós."}
      ]
    }
  ]
}
```

```java
int dfs(TreeNode node) {
    if (node == null) return valorBase;
    int left = dfs(node.left);
    int right = dfs(node.right);
    return combina(node, left, right);
}
```

**Aplicado em:** [Max Depth](/category/code/profundidade-maxima), [Balanced Binary Tree](/category/code/arvore-balanceada), [Invert Binary Tree](/category/code/inverter-arvore), [LCA](/category/code/lca-arvore-binaria).

### Top-down: o pai passa estado para os filhos

O que você sabe sobre o **caminho até aqui** desce como parâmetro (profundidade, máximo, limites, soma parcial).

```java
int dfs(TreeNode node, Estado acima) {
    if (node == null) return 0;
    Estado novo = atualiza(acima, node);
    return contribuicao(node, acima) + dfs(node.left, novo) + dfs(node.right, novo);
}
```

**Aplicado em:** [Visible Tree Node](/category/code/no-visivel), [Valid BST](/category/code/bst-valida).

## Como escolher

| Pergunta | Estilo |
|---|---|
| A resposta de um nó depende **dos filhos**? | bottom-up |
| A resposta de um nó depende **dos ancestrais**? | top-down |
| Precisa dos dois? | top-down para passar contexto + bottom-up para retornar |

## Receita

1. Defina em uma frase o que `dfs(node)` **retorna** (ou o que muda).
2. Escreva o caso base para `null`.
3. Assuma que o filho já funciona e combine.
4. Confira a raiz e uma folha na mão.

## Erros comuns

- Misturar as duas ideias sem definir o que a função retorna.
- Guardar estado em variável global e esquecer de resetá-lo entre chamadas.
- Retornar do lugar errado e perder a resposta dos filhos.
