---
slug: profundidade-minima
categorySlug: code
title: "Minimum Depth of Binary Tree"
navTitle: "Minimum Depth"
summary: "A BFS encerra na primeira folha: o exemplo clássico de parar cedo por causa da ordem por níveis."
level: iniciante
order: 66
section: bfs
group: BFS on Tree
---

## Enunciado

Retorne a **profundidade mínima** de uma árvore binária: o número de nós no caminho mais curto da raiz até uma **folha** (nó sem filhos).

```
Entrada: root = [1, 2, 3, 4, 5]
Saída: 2      // 1 → 3, e 3 é folha
```

## DFS vs. BFS

Com DFS você precisa visitar a árvore inteira para ter certeza do mínimo. Com BFS, como os níveis saem em ordem, **a primeira folha que aparecer já está na menor profundidade possível** — dá para retornar imediatamente.

## Abordagem

Level order comum, com uma checagem a mais: ao retirar um nó, se ele não tem filhos, retorne a profundidade atual.

```treeviz
{
  "title": "minimum depth — a primeira folha encerra a busca",
  "code": {
    "lang": "java",
    "content": "public int minDepth(TreeNode root) {\n    if (root == null) return 0;\n    Deque<TreeNode> queue = new ArrayDeque<>();\n    queue.offer(root);\n    int depth = 1;\n    while (!queue.isEmpty()) {\n        int size = queue.size();\n        for (int i = 0; i < size; i++) {\n            TreeNode node = queue.poll();\n            if (node.left == null && node.right == null) return depth;\n            if (node.left != null) queue.offer(node.left);\n            if (node.right != null) queue.offer(node.right);\n        }\n        depth++;\n    }\n    return depth;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "root = [1, 2, 3, 4, 5]",
      "tree": [1, 2, 3, 4, 5],
      "steps": [
        {"current": 0, "compare": [0], "queue": ["1"], "line": 4, "caption": "A raiz entra na fila."},
        {"compare": [0], "queue": ["1"], "line": 7, "caption": "Nível 0: há 1 nó(s) na fila. Processamos exatamente 1 antes de descer."},
        {"current": 0, "compare": [1, 2], "queue": ["2", "3"], "line": 9, "caption": "Sai 1; entram 2, 3."},
        {"visited": [0], "compare": [1, 2], "queue": ["2", "3"], "line": 14, "caption": "Nível sem folhas: descemos para a profundidade 2."},
        {"compare": [1, 2], "visited": [0], "queue": ["2", "3"], "line": 7, "caption": "Nível 1: há 2 nó(s) na fila. Processamos exatamente 2 antes de descer."},
        {"current": 1, "visited": [0], "compare": [2, 3, 4], "queue": ["3", "4", "5"], "line": 9, "caption": "Sai 2; entram 4, 5."},
        {"current": 2, "visited": [0, 1], "queue": ["4", "5"], "found": true, "line": 10, "caption": "3 é folha (sem filhos): é a primeira que aparece em BFS → profundidade mínima = 2."}
      ]
    }
  ]
}
```

## Código

```java
public int minDepth(TreeNode root) {
    if (root == null) return 0;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    int depth = 1;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (node.left == null && node.right == null) return depth;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        depth++;
    }
    return depth;
}
```

## Complexidade

- **Tempo:** O(n) no pior caso, mas pode terminar muito antes.
- **Espaço:** O(w).

## Erros comuns

- Tratar um nó com **um só filho** como folha. Só é folha quem não tem **nenhum** filho.
- Na versão DFS, usar `1 + min(left, right)` sem cuidar do caso em que um lado é `null` (retornaria 1 errado).
- Começar `depth` em 0 quando o enunciado conta nós.
