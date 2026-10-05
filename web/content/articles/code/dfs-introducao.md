---
slug: dfs-introducao
categorySlug: code
title: "DFS: Introdução"
navTitle: "DFS Intro"
summary: "Busca em profundidade: ir o mais fundo possível, voltar e tentar o próximo caminho — com templates recursivo, iterativo e com estado."
level: iniciante
order: 48
section: dfs
group: Introduction
---

## A ideia

**Depth-First Search** explora um caminho até o fim antes de tentar o próximo. Em uma árvore: desce pela esquerda até uma folha, volta um passo, tenta a direita, e assim por diante. O "voltar" é gratuito porque a pilha de chamadas guarda o caminho.

```treeviz
{
  "title": "DFS — descendo com a profundidade",
  "code": {
    "lang": "java",
    "content": "void dfs(TreeNode node, int depth) {\n    if (node == null) return;\n    visit(node, depth);\n    dfs(node.left, depth + 1);\n    dfs(node.right, depth + 1);\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Árvore 1–6",
      "tree": [1, 2, 3, 4, 5, null, 6],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "stack": ["dfs(1, 0)"], "values": {"0": "d=0"}, "line": 3, "caption": "Visita o nó 1 na profundidade 0."},
        {"current": 0, "visited": [0], "stack": ["dfs(1, 0)"], "values": {"0": "d=0"}, "line": 4, "caption": "Desce para o filho esquerdo: dfs(2, 1)."},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["dfs(1, 0)", "dfs(2, 1)"], "values": {"0": "d=0", "1": "d=1"}, "line": 3, "caption": "Visita o nó 2 na profundidade 1."},
        {"current": 1, "visited": [0, 1], "stack": ["dfs(1, 0)", "dfs(2, 1)"], "values": {"0": "d=0", "1": "d=1"}, "line": 4, "caption": "Desce para o filho esquerdo: dfs(4, 2)."},
        {"current": 3, "visited": [0, 1, 3], "compare": [3], "stack": ["dfs(1, 0)", "dfs(2, 1)", "dfs(4, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2"}, "line": 3, "caption": "Visita o nó 4 na profundidade 2."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["dfs(1, 0)", "dfs(2, 1)", "dfs(4, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2"}, "line": 4, "caption": "Filho esquerdo de 4 é null → a chamada retorna na hora."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["dfs(1, 0)", "dfs(2, 1)", "dfs(4, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2"}, "line": 5, "caption": "Filho direito de 4 é null → a chamada retorna na hora."},
        {"current": 1, "visited": [0, 1, 3], "stack": ["dfs(1, 0)", "dfs(2, 1)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2"}, "line": 5, "caption": "Desce para o filho direito: dfs(5, 2)."},
        {"current": 4, "visited": [0, 1, 3, 4], "compare": [4], "stack": ["dfs(1, 0)", "dfs(2, 1)", "dfs(5, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2"}, "line": 3, "caption": "Visita o nó 5 na profundidade 2."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["dfs(1, 0)", "dfs(2, 1)", "dfs(5, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2"}, "line": 4, "caption": "Filho esquerdo de 5 é null → a chamada retorna na hora."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["dfs(1, 0)", "dfs(2, 1)", "dfs(5, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2"}, "line": 5, "caption": "Filho direito de 5 é null → a chamada retorna na hora."},
        {"current": 0, "visited": [0, 1, 3, 4], "stack": ["dfs(1, 0)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2"}, "line": 5, "caption": "Desce para o filho direito: dfs(3, 1)."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "compare": [2], "stack": ["dfs(1, 0)", "dfs(3, 1)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2", "2": "d=1"}, "line": 3, "caption": "Visita o nó 3 na profundidade 1."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "stack": ["dfs(1, 0)", "dfs(3, 1)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2", "2": "d=1"}, "line": 4, "caption": "Filho esquerdo de 3 é null → a chamada retorna na hora."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "stack": ["dfs(1, 0)", "dfs(3, 1)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2", "2": "d=1"}, "line": 5, "caption": "Desce para o filho direito: dfs(6, 2)."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 6], "compare": [6], "stack": ["dfs(1, 0)", "dfs(3, 1)", "dfs(6, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2", "2": "d=1", "6": "d=2"}, "line": 3, "caption": "Visita o nó 6 na profundidade 2."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 6], "stack": ["dfs(1, 0)", "dfs(3, 1)", "dfs(6, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2", "2": "d=1", "6": "d=2"}, "line": 4, "caption": "Filho esquerdo de 6 é null → a chamada retorna na hora."},
        {"current": 6, "visited": [0, 1, 2, 3, 4, 6], "stack": ["dfs(1, 0)", "dfs(3, 1)", "dfs(6, 2)"], "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2", "2": "d=1", "6": "d=2"}, "line": 5, "caption": "Filho direito de 6 é null → a chamada retorna na hora."},
        {"current": 0, "visited": [0, 1, 2, 3, 4, 6], "found": true, "values": {"0": "d=0", "1": "d=1", "3": "d=2", "4": "d=2", "2": "d=1", "6": "d=2"}, "line": 1, "caption": "A pilha esvaziou: toda a árvore foi visitada, sempre indo ao fundo antes de voltar."}
      ]
    }
  ]
}
```

## Template 1 — recursivo

```java
void dfs(TreeNode node) {
    if (node == null) return;
    // processa node
    dfs(node.left);
    dfs(node.right);
}
```

## Template 2 — carregando estado para baixo (top-down)

```java
void dfs(TreeNode node, int depth, List<Integer> path) {
    if (node == null) return;
    path.add(node.val);                     // escolhe
    if (node.left == null && node.right == null) {
        registra(path);                     // chegou numa folha
    }
    dfs(node.left, depth + 1, path);
    dfs(node.right, depth + 1, path);
    path.remove(path.size() - 1);           // desfaz (backtracking)
}
```

## Template 3 — iterativo com pilha explícita

```java
void dfs(TreeNode root) {
    if (root == null) return;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        // processa node
        if (node.right != null) stack.push(node.right);  // direita primeiro,
        if (node.left != null)  stack.push(node.left);   // para a esquerda sair antes
    }
}
```

Use o iterativo quando a profundidade pode estourar a pilha do Java.

## Template 4 — DFS em grafo (com `visited`)

```java
void dfs(int u, List<List<Integer>> adj, boolean[] visited) {
    visited[u] = true;
    for (int v : adj.get(u)) {
        if (!visited[v]) dfs(v, adj, visited);
    }
}
```

Em árvores não há ciclos, então `visited` é desnecessário. Em grafos ele evita loops infinitos.

## Quando escolher DFS

- Explorar **todos os caminhos** ou todas as combinações.
- Problemas sobre **subárvores** (altura, tamanho, soma, validade).
- Detectar ciclos ou componentes conectados.
- Se o enunciado pede o **caminho mais curto** em grafo não ponderado, prefira BFS (veja [BFS/DFS](/category/code/bfs-dfs)).

## Complexidade

- **Tempo:** O(V + E) em grafos; O(n) em árvores.
- **Espaço:** O(h) de pilha.

## Erros comuns

- Esquecer o caso base `null`.
- Em grafos, não marcar `visited` antes de descer.
- Em backtracking, esquecer de desfazer a escolha ao voltar.
