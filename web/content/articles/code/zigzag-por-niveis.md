---
slug: zigzag-por-niveis
categorySlug: code
title: "Binary Tree Zigzag Level Order Traversal"
navTitle: "Zigzag Level Order"
summary: "Level order alternando o sentido de leitura a cada nível, sem mudar a ordem em que a fila é processada."
level: intermediario
order: 67
section: bfs
group: BFS on Tree
---

## Enunciado

Retorne os valores nível por nível, mas **alternando a direção**: o primeiro nível da esquerda para a direita, o segundo da direita para a esquerda, e assim por diante.

```
Entrada: root = [1, 2, 3, 4, 5, 6, 7]
Saída: [[1], [3, 2], [4, 5, 6, 7]]
```

## Ideia

Não mude a forma como você percorre a árvore: **a fila continua sempre esquerda → direita**. Só muda onde você **insere** o valor na lista do nível: no fim (`addLast`) ou no início (`addFirst`), dependendo de uma flag que inverte a cada nível.

```treeviz
{
  "title": "zigzag level order",
  "code": {
    "lang": "java",
    "content": "public List<List<Integer>> zigzag(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n    Deque<TreeNode> queue = new ArrayDeque<>();\n    queue.offer(root);\n    boolean leftToRight = true;\n    while (!queue.isEmpty()) {\n        int size = queue.size();\n        LinkedList<Integer> level = new LinkedList<>();\n        for (int i = 0; i < size; i++) {\n            TreeNode node = queue.poll();\n            if (leftToRight) level.addLast(node.val);\n            else level.addFirst(node.val);\n            if (node.left != null) queue.offer(node.left);\n            if (node.right != null) queue.offer(node.right);\n        }\n        result.add(level);\n        leftToRight = !leftToRight;\n    }\n    return result;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "root = [1, 2, 3, 4, 5, 6, 7]",
      "tree": [1, 2, 3, 4, 5, 6, 7],
      "steps": [
        {"current": 0, "compare": [0], "queue": ["1"], "line": 5, "caption": "A raiz entra na fila."},
        {"compare": [0], "queue": ["1"], "line": 8, "caption": "Nível 0: há 1 nó(s) na fila. Processamos exatamente 1 antes de descer."},
        {"current": 0, "compare": [1, 2], "queue": ["2", "3"], "line": 11, "caption": "Sai 1; entram 2, 3."},
        {"visited": [0], "compare": [1, 2], "queue": ["2", "3"], "line": 17, "caption": "Nível completo: [1]. Resultado: [[1]]."},
        {"compare": [1, 2], "visited": [0], "queue": ["2", "3"], "line": 8, "caption": "Nível 1: há 2 nó(s) na fila. Processamos exatamente 2 antes de descer."},
        {"current": 1, "visited": [0], "compare": [2, 3, 4], "queue": ["3", "4", "5"], "line": 11, "caption": "Sai 2; entram 4, 5."},
        {"current": 2, "visited": [0, 1], "compare": [3, 4, 5, 6], "queue": ["4", "5", "6", "7"], "line": 11, "caption": "Sai 3; entram 6, 7."},
        {"visited": [0, 1, 2], "compare": [3, 4, 5, 6], "queue": ["4", "5", "6", "7"], "line": 17, "caption": "Nível completo (ordem invertida neste nível): [3, 2]. Resultado: [[1], [3, 2]]."},
        {"compare": [3, 4, 5, 6], "visited": [0, 1, 2], "queue": ["4", "5", "6", "7"], "line": 8, "caption": "Nível 2: há 4 nó(s) na fila. Processamos exatamente 4 antes de descer."},
        {"current": 3, "visited": [0, 1, 2], "compare": [4, 5, 6], "queue": ["5", "6", "7"], "line": 11, "caption": "Sai 4; é folha, ninguém entra."},
        {"current": 4, "visited": [0, 1, 2, 3], "compare": [5, 6], "queue": ["6", "7"], "line": 11, "caption": "Sai 5; é folha, ninguém entra."},
        {"current": 5, "visited": [0, 1, 2, 3, 4], "compare": [6], "queue": ["7"], "line": 11, "caption": "Sai 6; é folha, ninguém entra."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 5], "queue": [], "line": 11, "caption": "Sai 7; é folha, ninguém entra."},
        {"visited": [0, 1, 2, 3, 4, 5, 6], "queue": [], "line": 17, "caption": "Nível completo: [4, 5, 6, 7]. Resultado: [[1], [3, 2], [4, 5, 6, 7]]."},
        {"visited": [0, 1, 2, 3, 4, 5, 6], "queue": [], "found": true, "current": 0, "line": 3, "caption": "Fila vazia. Resultado: [[1], [3, 2], [4, 5, 6, 7]]."}
      ]
    }
  ]
}
```

## Código

```java
public List<List<Integer>> zigzag(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    boolean leftToRight = true;
    while (!queue.isEmpty()) {
        int size = queue.size();
        LinkedList<Integer> level = new LinkedList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (leftToRight) level.addLast(node.val);
            else level.addFirst(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
        leftToRight = !leftToRight;
    }
    return result;
}
```

Alternativa: montar o nível normalmente e chamar `Collections.reverse(level)` nos níveis ímpares.

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(w).

## Erros comuns

- Inverter a ordem em que os filhos entram na fila: isso embaralha os níveis seguintes.
- Esquecer de alternar a flag a cada nível (e não a cada nó).
- Usar `ArrayList.add(0, x)`, que custa O(n) por inserção.
