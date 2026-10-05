---
slug: visao-lado-direito
categorySlug: code
title: "Binary Tree Right Side View"
navTitle: "Right Side View"
summary: "Level order guardando só o último nó de cada nível: o que você vê ao olhar a árvore pela direita."
level: intermediario
order: 65
section: bfs
group: BFS on Tree
---

## Enunciado

Imagine-se em pé à **direita** de uma árvore binária. Retorne os valores dos nós que você consegue ver, de cima para baixo.

```
Entrada: root = [1, 2, 3, null, 5, null, 4]
Saída: [1, 3, 4]
```

## Ideia

Em cada nível, o nó visível é **o último da esquerda para a direita**. Note que nem sempre ele é filho direito: no nível 3 acima, o `5` está à esquerda de `4`, mas `4` cobre a vista.

Basta o [template de level order](/category/code/ordem-por-niveis) guardando, ao final de cada nível, o último valor lido.

```treeviz
{
  "title": "right side view — último de cada nível",
  "code": {
    "lang": "java",
    "content": "public List<Integer> rightSideView(TreeNode root) {\n    List<Integer> result = new ArrayList<>();\n    if (root == null) return result;\n    Deque<TreeNode> queue = new ArrayDeque<>();\n    queue.offer(root);\n    while (!queue.isEmpty()) {\n        int size = queue.size();\n        int last = 0;\n        for (int i = 0; i < size; i++) {\n            TreeNode node = queue.poll();\n            last = node.val;\n            if (node.left != null) queue.offer(node.left);\n            if (node.right != null) queue.offer(node.right);\n        }\n        result.add(last);\n    }\n    return result;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "root = [1, 2, 3, null, 5, null, 4]",
      "tree": [1, 2, 3, null, 5, null, 4],
      "steps": [
        {"current": 0, "compare": [0], "queue": ["1"], "line": 5, "caption": "A raiz entra na fila."},
        {"compare": [0], "queue": ["1"], "line": 7, "caption": "Nível 0: há 1 nó(s) na fila. Processamos exatamente 1 antes de descer."},
        {"current": 0, "compare": [1, 2], "queue": ["2", "3"], "values": {"0": "★"}, "line": 10, "caption": "Sai 1; entram 2, 3. É o último do nível → visível pela direita."},
        {"visited": [0], "compare": [1, 2], "queue": ["2", "3"], "line": 15, "caption": "Fim do nível: guardamos o último (1). Resultado: [1]."},
        {"compare": [1, 2], "visited": [0], "queue": ["2", "3"], "line": 7, "caption": "Nível 1: há 2 nó(s) na fila. Processamos exatamente 2 antes de descer."},
        {"current": 1, "visited": [0], "compare": [2, 4], "queue": ["3", "5"], "line": 10, "caption": "Sai 2; entram 5."},
        {"current": 2, "visited": [0, 1], "compare": [4, 6], "queue": ["5", "4"], "values": {"2": "★"}, "line": 10, "caption": "Sai 3; entram 4. É o último do nível → visível pela direita."},
        {"visited": [0, 1, 2], "compare": [4, 6], "queue": ["5", "4"], "line": 15, "caption": "Fim do nível: guardamos o último (3). Resultado: [1, 3]."},
        {"compare": [4, 6], "visited": [0, 1, 2], "queue": ["5", "4"], "line": 7, "caption": "Nível 2: há 2 nó(s) na fila. Processamos exatamente 2 antes de descer."},
        {"current": 4, "visited": [0, 1, 2], "compare": [6], "queue": ["4"], "line": 10, "caption": "Sai 5; é folha, ninguém entra."},
        {"current": 6, "visited": [0, 1, 2, 4], "queue": [], "values": {"6": "★"}, "line": 10, "caption": "Sai 4; é folha, ninguém entra. É o último do nível → visível pela direita."},
        {"visited": [0, 1, 2, 4, 6], "queue": [], "line": 15, "caption": "Fim do nível: guardamos o último (4). Resultado: [1, 3, 4]."},
        {"visited": [0, 1, 2, 4, 6], "queue": [], "found": true, "current": 0, "line": 3, "caption": "Fila vazia. Resultado: [1, 3, 4]."}
      ]
    }
  ]
}
```

## Código

```java
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        int last = 0;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            last = node.val;                  // o último sobrescreve
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(last);
    }
    return result;
}
```

Alternativa: `if (i == size - 1) result.add(node.val);` dentro do laço.

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(w).

## Erros comuns

- Percorrer só os filhos direitos: perde nós à esquerda que ficam visíveis quando o lado direito é mais raso.
- Enfileirar a direita antes da esquerda **sem** ajustar qual nó guardar (aí o primeiro do nível é o visível).
