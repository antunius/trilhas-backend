---
slug: ordem-por-niveis
categorySlug: code
title: "Binary Tree Level Order Traversal"
navTitle: "Level Order Traversal"
summary: "O template de BFS em árvores: uma fatia da fila por nível, devolvendo uma lista por nível."
level: iniciante
order: 64
section: bfs
group: BFS on Tree
---

## Enunciado

Dada a raiz de uma árvore binária, retorne os valores **nível por nível**, da esquerda para a direita.

```
Entrada: root = [3, 9, 20, null, null, 15, 7]
Saída: [[3], [9, 20], [15, 7]]
```

## Por que não DFS

A DFS visita 3, 9, 20, 15, 7 no melhor caso, mas não separa os níveis. É possível (passando `depth` e usando `result.get(depth)`), porém a BFS é o modelo natural: a fila **já contém exatamente o próximo nível**.

## Abordagem

Em cada rodada, `size = queue.size()` é o número de nós do nível atual. Retire exatamente `size` nós, guarde seus valores e enfileire os filhos — que formarão o próximo nível.

```treeviz
{
  "title": "level order — um nível por vez",
  "code": {
    "lang": "java",
    "content": "public List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n    Deque<TreeNode> queue = new ArrayDeque<>();\n    queue.offer(root);\n    while (!queue.isEmpty()) {\n        int size = queue.size();\n        List<Integer> level = new ArrayList<>();\n        for (int i = 0; i < size; i++) {\n            TreeNode node = queue.poll();\n            level.add(node.val);\n            if (node.left != null) queue.offer(node.left);\n            if (node.right != null) queue.offer(node.right);\n        }\n        result.add(level);\n    }\n    return result;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "root = [3, 9, 20, null, null, 15, 7]",
      "tree": [3, 9, 20, null, null, 15, 7],
      "steps": [
        {"current": 0, "compare": [0], "queue": ["3"], "line": 5, "caption": "A raiz entra na fila."},
        {"compare": [0], "queue": ["3"], "line": 7, "caption": "Nível 0: há 1 nó(s) na fila. Processamos exatamente 1 antes de descer."},
        {"current": 0, "compare": [1, 2], "queue": ["9", "20"], "line": 10, "caption": "Sai 3; entram 9, 20."},
        {"visited": [0], "compare": [1, 2], "queue": ["9", "20"], "line": 15, "caption": "Nível completo: [3]. Resultado: [[3]]."},
        {"compare": [1, 2], "visited": [0], "queue": ["9", "20"], "line": 7, "caption": "Nível 1: há 2 nó(s) na fila. Processamos exatamente 2 antes de descer."},
        {"current": 1, "visited": [0], "compare": [2], "queue": ["20"], "line": 10, "caption": "Sai 9; é folha, ninguém entra."},
        {"current": 2, "visited": [0, 1], "compare": [5, 6], "queue": ["15", "7"], "line": 10, "caption": "Sai 20; entram 15, 7."},
        {"visited": [0, 1, 2], "compare": [5, 6], "queue": ["15", "7"], "line": 15, "caption": "Nível completo: [9, 20]. Resultado: [[3], [9, 20]]."},
        {"compare": [5, 6], "visited": [0, 1, 2], "queue": ["15", "7"], "line": 7, "caption": "Nível 2: há 2 nó(s) na fila. Processamos exatamente 2 antes de descer."},
        {"current": 5, "visited": [0, 1, 2], "compare": [6], "queue": ["7"], "line": 10, "caption": "Sai 15; é folha, ninguém entra."},
        {"current": 6, "visited": [0, 1, 2, 5], "queue": [], "line": 10, "caption": "Sai 7; é folha, ninguém entra."},
        {"visited": [0, 1, 2, 5, 6], "queue": [], "line": 15, "caption": "Nível completo: [15, 7]. Resultado: [[3], [9, 20], [15, 7]]."},
        {"visited": [0, 1, 2, 5, 6], "queue": [], "found": true, "current": 0, "line": 3, "caption": "Fila vazia. Resultado: [[3], [9, 20], [15, 7]]."}
      ]
    }
  ]
}
```

## Código

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}
```

Este é **o** template de BFS em árvores: os próximos três problemas são variações dele.

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(w), onde `w` é a largura máxima da árvore (até n/2 na última camada).

## Erros comuns

- Usar `queue.size()` diretamente na condição do `for` (ele muda durante o laço).
- Esquecer o `root == null`.
- Enfileirar filhos `null` e quebrar com `NullPointerException` ao sair.
