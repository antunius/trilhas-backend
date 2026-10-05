---
slug: arvores-introducao
categorySlug: code
title: "Árvores: Introdução"
navTitle: "Trees"
summary: "Vocabulário de árvores binárias e os três templates de travessia em profundidade."
level: iniciante
order: 47
section: dfs
group: Introduction
---

## O que é uma árvore

Uma árvore é uma estrutura **recursiva**: cada nó tem um valor e zero ou mais filhos, e cada filho é a raiz de uma árvore menor. Numa **árvore binária** cada nó tem no máximo dois filhos: `left` e `right`.

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
```

## Vocabulário

| Termo | Significado |
|---|---|
| Raiz | nó sem pai |
| Folha | nó sem filhos |
| Profundidade de um nó | número de arestas da raiz até ele |
| Altura da árvore | maior profundidade entre as folhas |
| Subárvore | um nó e tudo abaixo dele |

Como a definição é recursiva, quase todo problema de árvore vira: **"resolva para a subárvore esquerda, resolva para a direita e combine"**.

## Os três templates de travessia

A diferença entre eles é **quando** você visita o nó em relação aos filhos.

```treeviz
{
  "title": "travessias em profundidade",
  "code": {
    "lang": "java",
    "content": "void dfs(TreeNode node) {\n    if (node == null) return;\n    // PRÉ-ORDEM: visite aqui\n    dfs(node.left);\n    // EM ORDEM: visite aqui\n    dfs(node.right);\n    // PÓS-ORDEM: visite aqui\n}"
  },
  "examples": [
    {
      "id": "pre",
      "label": "Pré-ordem",
      "tree": [4, 2, 6, 1, 3, 5, 7],
      "steps": [
        {"current": 0, "stack": ["dfs(4)"], "line": 2, "caption": "dfs(4): o nó existe, seguimos."},
        {"current": 0, "visited": [0], "compare": [0], "stack": ["dfs(4)"], "line": 3, "caption": "Visita 4 (pré-ordem) → saída: [4]."},
        {"current": 1, "visited": [0], "stack": ["dfs(4)", "dfs(2)"], "line": 2, "caption": "dfs(2): o nó existe, seguimos."},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["dfs(4)", "dfs(2)"], "line": 3, "caption": "Visita 2 (pré-ordem) → saída: [4, 2]."},
        {"current": 3, "visited": [0, 1], "stack": ["dfs(4)", "dfs(2)", "dfs(1)"], "line": 2, "caption": "dfs(1): o nó existe, seguimos."},
        {"current": 3, "visited": [0, 1, 3], "compare": [3], "stack": ["dfs(4)", "dfs(2)", "dfs(1)"], "line": 3, "caption": "Visita 1 (pré-ordem) → saída: [4, 2, 1]."},
        {"current": 4, "visited": [0, 1, 3], "stack": ["dfs(4)", "dfs(2)", "dfs(3)"], "line": 2, "caption": "dfs(3): o nó existe, seguimos."},
        {"current": 4, "visited": [0, 1, 3, 4], "compare": [4], "stack": ["dfs(4)", "dfs(2)", "dfs(3)"], "line": 3, "caption": "Visita 3 (pré-ordem) → saída: [4, 2, 1, 3]."},
        {"current": 2, "visited": [0, 1, 3, 4], "stack": ["dfs(4)", "dfs(6)"], "line": 2, "caption": "dfs(6): o nó existe, seguimos."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "compare": [2], "stack": ["dfs(4)", "dfs(6)"], "line": 3, "caption": "Visita 6 (pré-ordem) → saída: [4, 2, 1, 3, 6]."},
        {"current": 5, "visited": [0, 1, 2, 3, 4], "stack": ["dfs(4)", "dfs(6)", "dfs(5)"], "line": 2, "caption": "dfs(5): o nó existe, seguimos."},
        {"current": 5, "visited": [0, 1, 2, 3, 4, 5], "compare": [5], "stack": ["dfs(4)", "dfs(6)", "dfs(5)"], "line": 3, "caption": "Visita 5 (pré-ordem) → saída: [4, 2, 1, 3, 6, 5]."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 5], "stack": ["dfs(4)", "dfs(6)", "dfs(7)"], "line": 2, "caption": "dfs(7): o nó existe, seguimos."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 5, 6], "compare": [6], "stack": ["dfs(4)", "dfs(6)", "dfs(7)"], "line": 3, "caption": "Visita 7 (pré-ordem) → saída: [4, 2, 1, 3, 6, 5, 7]."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 5, 6], "found": true, "line": 1, "caption": "Fim. Ordem de visita (pré-ordem): [4, 2, 1, 3, 6, 5, 7]."}
      ]
    },
    {
      "id": "in",
      "label": "Em ordem",
      "tree": [4, 2, 6, 1, 3, 5, 7],
      "steps": [
        {"current": 0, "stack": ["dfs(4)"], "line": 2, "caption": "dfs(4): o nó existe, seguimos."},
        {"current": 1, "stack": ["dfs(4)", "dfs(2)"], "line": 2, "caption": "dfs(2): o nó existe, seguimos."},
        {"current": 3, "stack": ["dfs(4)", "dfs(2)", "dfs(1)"], "line": 2, "caption": "dfs(1): o nó existe, seguimos."},
        {"current": 3, "visited": [3], "compare": [3], "stack": ["dfs(4)", "dfs(2)", "dfs(1)"], "line": 5, "caption": "Visita 1 (em ordem) → saída: [1]."},
        {"current": 1, "visited": [1, 3], "compare": [1], "stack": ["dfs(4)", "dfs(2)"], "line": 5, "caption": "Visita 2 (em ordem) → saída: [1, 2]."},
        {"current": 4, "visited": [1, 3], "stack": ["dfs(4)", "dfs(2)", "dfs(3)"], "line": 2, "caption": "dfs(3): o nó existe, seguimos."},
        {"current": 4, "visited": [1, 3, 4], "compare": [4], "stack": ["dfs(4)", "dfs(2)", "dfs(3)"], "line": 5, "caption": "Visita 3 (em ordem) → saída: [1, 2, 3]."},
        {"current": 0, "visited": [0, 1, 3, 4], "compare": [0], "stack": ["dfs(4)"], "line": 5, "caption": "Visita 4 (em ordem) → saída: [1, 2, 3, 4]."},
        {"current": 2, "visited": [0, 1, 3, 4], "stack": ["dfs(4)", "dfs(6)"], "line": 2, "caption": "dfs(6): o nó existe, seguimos."},
        {"current": 5, "visited": [0, 1, 3, 4], "stack": ["dfs(4)", "dfs(6)", "dfs(5)"], "line": 2, "caption": "dfs(5): o nó existe, seguimos."},
        {"current": 5, "visited": [0, 1, 3, 4, 5], "compare": [5], "stack": ["dfs(4)", "dfs(6)", "dfs(5)"], "line": 5, "caption": "Visita 5 (em ordem) → saída: [1, 2, 3, 4, 5]."},
        {"current": 2, "visited": [0, 1, 2, 3, 4, 5], "compare": [2], "stack": ["dfs(4)", "dfs(6)"], "line": 5, "caption": "Visita 6 (em ordem) → saída: [1, 2, 3, 4, 5, 6]."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 5], "stack": ["dfs(4)", "dfs(6)", "dfs(7)"], "line": 2, "caption": "dfs(7): o nó existe, seguimos."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 5, 6], "compare": [6], "stack": ["dfs(4)", "dfs(6)", "dfs(7)"], "line": 5, "caption": "Visita 7 (em ordem) → saída: [1, 2, 3, 4, 5, 6, 7]."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 5, 6], "found": true, "line": 1, "caption": "Fim. Ordem de visita (em ordem): [1, 2, 3, 4, 5, 6, 7]."}
      ]
    },
    {
      "id": "post",
      "label": "Pós-ordem",
      "tree": [4, 2, 6, 1, 3, 5, 7],
      "steps": [
        {"current": 0, "stack": ["dfs(4)"], "line": 2, "caption": "dfs(4): o nó existe, seguimos."},
        {"current": 1, "stack": ["dfs(4)", "dfs(2)"], "line": 2, "caption": "dfs(2): o nó existe, seguimos."},
        {"current": 3, "stack": ["dfs(4)", "dfs(2)", "dfs(1)"], "line": 2, "caption": "dfs(1): o nó existe, seguimos."},
        {"current": 3, "visited": [3], "compare": [3], "stack": ["dfs(4)", "dfs(2)", "dfs(1)"], "line": 7, "caption": "Visita 1 (pós-ordem) → saída: [1]."},
        {"current": 4, "visited": [3], "stack": ["dfs(4)", "dfs(2)", "dfs(3)"], "line": 2, "caption": "dfs(3): o nó existe, seguimos."},
        {"current": 4, "visited": [3, 4], "compare": [4], "stack": ["dfs(4)", "dfs(2)", "dfs(3)"], "line": 7, "caption": "Visita 3 (pós-ordem) → saída: [1, 3]."},
        {"current": 1, "visited": [1, 3, 4], "compare": [1], "stack": ["dfs(4)", "dfs(2)"], "line": 7, "caption": "Visita 2 (pós-ordem) → saída: [1, 3, 2]."},
        {"current": 2, "visited": [1, 3, 4], "stack": ["dfs(4)", "dfs(6)"], "line": 2, "caption": "dfs(6): o nó existe, seguimos."},
        {"current": 5, "visited": [1, 3, 4], "stack": ["dfs(4)", "dfs(6)", "dfs(5)"], "line": 2, "caption": "dfs(5): o nó existe, seguimos."},
        {"current": 5, "visited": [1, 3, 4, 5], "compare": [5], "stack": ["dfs(4)", "dfs(6)", "dfs(5)"], "line": 7, "caption": "Visita 5 (pós-ordem) → saída: [1, 3, 2, 5]."},
        {"current": 6, "visited": [1, 3, 4, 5], "stack": ["dfs(4)", "dfs(6)", "dfs(7)"], "line": 2, "caption": "dfs(7): o nó existe, seguimos."},
        {"current": 6, "visited": [1, 3, 4, 5, 6], "compare": [6], "stack": ["dfs(4)", "dfs(6)", "dfs(7)"], "line": 7, "caption": "Visita 7 (pós-ordem) → saída: [1, 3, 2, 5, 7]."},
        {"current": 2, "visited": [1, 2, 3, 4, 5, 6], "compare": [2], "stack": ["dfs(4)", "dfs(6)"], "line": 7, "caption": "Visita 6 (pós-ordem) → saída: [1, 3, 2, 5, 7, 6]."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 5, 6], "compare": [0], "stack": ["dfs(4)"], "line": 7, "caption": "Visita 4 (pós-ordem) → saída: [1, 3, 2, 5, 7, 6, 4]."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 5, 6], "found": true, "line": 1, "caption": "Fim. Ordem de visita (pós-ordem): [1, 3, 2, 5, 7, 6, 4]."}
      ]
    }
  ]
}
```

```java
void dfs(TreeNode node) {
    if (node == null) return;
    // pré-ordem: visita antes dos filhos      (copiar a árvore, serializar)
    dfs(node.left);
    // em ordem: visita entre os filhos        (BST → valores ordenados)
    dfs(node.right);
    // pós-ordem: visita depois dos filhos     (altura, deletar, resultados dos filhos)
}
```

| Ordem | Use quando | Exemplo |
|---|---|---|
| Pré-ordem | o pai precisa ser processado **antes** dos filhos | [Serializar](/category/code/serializar-arvore) |
| Em ordem | quer os valores de uma BST em ordem crescente | [BST válida](/category/code/bst-valida) |
| Pós-ordem | o pai precisa do resultado dos filhos | [Profundidade máxima](/category/code/profundidade-maxima) |

## Complexidade

Cada nó é visitado uma vez: **O(n)** tempo. Espaço O(h), onde `h` é a altura (pilha de chamadas): O(log n) em árvore balanceada, O(n) no pior caso (uma "lista").

## Erros comuns

- Esquecer o `node == null` — quase toda `NullPointerException` em árvore vem daqui.
- Confundir profundidade (de cima para baixo) com altura (de baixo para cima).
- Assumir que a árvore é balanceada.
