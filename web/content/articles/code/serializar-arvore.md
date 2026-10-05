---
slug: serializar-arvore
categorySlug: code
title: "Serializing and Deserializing Binary Tree"
navTitle: "Serializing and Deserializing Binary Tree"
summary: "Transformar uma árvore em string e de volta usando pré-ordem com marcador de null."
level: avancado
order: 60
section: dfs
group: Advanced
---

## Enunciado

Projete um algoritmo que **serialize** uma árvore binária em uma string e **desserialize** essa string de volta na mesma árvore.

## A pista

Uma travessia sozinha não identifica a árvore (várias formas geram a mesma sequência). Mas a **pré-ordem com marcador para `null`** sim: cada nó "abre" e cada `#` "fecha" um ramo, então a estrutura fica sem ambiguidade.

```
      1
     / \
    2   3        →   "1,2,#,#,3,4,#,#,5,#,#"
       / \
      4   5
```

## Abordagem

- **Serializar:** pré-ordem; escreve o valor, ou `#` para `null`.
- **Desserializar:** consome os tokens **na mesma ordem** com uma fila: lê um token; se for `#`, devolve `null`; senão cria o nó e monta esquerda e depois direita.

```treeviz
{
  "title": "serialize / deserialize — pré-ordem com marcador #",
  "code": {
    "lang": "java",
    "content": "public String serialize(TreeNode root) {\n    StringBuilder sb = new StringBuilder();\n    write(root, sb);\n    return sb.toString();\n}\n\nprivate void write(TreeNode node, StringBuilder sb) {\n    if (node == null) { sb.append(\"#,\"); return; }\n    sb.append(node.val).append(',');\n    write(node.left, sb);\n    write(node.right, sb);\n}\n\npublic TreeNode deserialize(String data) {\n    Deque<String> q = new ArrayDeque<>(Arrays.asList(data.split(\",\")));\n    return read(q);\n}\n\nprivate TreeNode read(Deque<String> q) {\n    String t = q.poll();\n    if (t.equals(\"#\")) return null;\n    TreeNode node = new TreeNode(Integer.parseInt(t));\n    node.left = read(q);\n    node.right = read(q);\n    return node;\n}"
  },
  "examples": [
    {
      "id": "ser",
      "label": "Serializar",
      "tree": [1, 2, 3, null, null, 4, 5],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "stack": ["write(1)"], "line": 9, "caption": "Escreve 1 (pré-ordem). Saída: 1"},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["write(1)", "write(2)"], "line": 9, "caption": "Escreve 2 (pré-ordem). Saída: 1,2"},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["write(1)", "write(2)"], "line": 8, "caption": "Filho null → escreve '#'. Saída: 1,2,#"},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["write(1)", "write(2)"], "line": 8, "caption": "Filho null → escreve '#'. Saída: 1,2,#,#"},
        {"current": 2, "visited": [0, 1, 2], "compare": [2], "stack": ["write(1)", "write(3)"], "line": 9, "caption": "Escreve 3 (pré-ordem). Saída: 1,2,#,#,3"},
        {"current": 5, "visited": [0, 1, 2, 5], "compare": [5], "stack": ["write(1)", "write(3)", "write(4)"], "line": 9, "caption": "Escreve 4 (pré-ordem). Saída: 1,2,#,#,3,4"},
        {"current": 5, "visited": [0, 1, 2, 5], "compare": [5], "stack": ["write(1)", "write(3)", "write(4)"], "line": 8, "caption": "Filho null → escreve '#'. Saída: 1,2,#,#,3,4,#"},
        {"current": 5, "visited": [0, 1, 2, 5], "compare": [5], "stack": ["write(1)", "write(3)", "write(4)"], "line": 8, "caption": "Filho null → escreve '#'. Saída: 1,2,#,#,3,4,#,#"},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "compare": [6], "stack": ["write(1)", "write(3)", "write(5)"], "line": 9, "caption": "Escreve 5 (pré-ordem). Saída: 1,2,#,#,3,4,#,#,5"},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "compare": [6], "stack": ["write(1)", "write(3)", "write(5)"], "line": 8, "caption": "Filho null → escreve '#'. Saída: 1,2,#,#,3,4,#,#,5,#"},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "compare": [6], "stack": ["write(1)", "write(3)", "write(5)"], "line": 8, "caption": "Filho null → escreve '#'. Saída: 1,2,#,#,3,4,#,#,5,#,#"},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "found": true, "line": 4, "caption": "String final: \"1,2,#,#,3,4,#,#,5,#,#\"."}
      ]
    },
    {
      "id": "de",
      "label": "Desserializar",
      "tree": [1],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "stack": ["read(1)"], "tree": [1, null, null, null, null, null, null], "line": 22, "caption": "Lê 1: cria o nó e monta primeiro o filho esquerdo, depois o direito."},
        {"current": 1, "visited": [0, 1], "compare": [1], "stack": ["read(1)", "read(2)"], "tree": [1, 2, null, null, null, null, null], "line": 22, "caption": "Lê 2: cria o nó e monta primeiro o filho esquerdo, depois o direito."},
        {"current": 3, "visited": [0, 1], "stack": ["read(1)", "read(2)"], "line": 21, "caption": "Lê '#' → null, sem criar nó."},
        {"current": 4, "visited": [0, 1], "stack": ["read(1)", "read(2)"], "line": 21, "caption": "Lê '#' → null, sem criar nó."},
        {"current": 2, "visited": [0, 1, 2], "compare": [2], "stack": ["read(1)", "read(3)"], "tree": [1, 2, 3, null, null, null, null], "line": 22, "caption": "Lê 3: cria o nó e monta primeiro o filho esquerdo, depois o direito."},
        {"current": 5, "visited": [0, 1, 2, 5], "compare": [5], "stack": ["read(1)", "read(3)", "read(4)"], "tree": [1, 2, 3, null, null, 4, null], "line": 22, "caption": "Lê 4: cria o nó e monta primeiro o filho esquerdo, depois o direito."},
        {"current": 11, "visited": [0, 1, 2, 5], "stack": ["read(1)", "read(3)", "read(4)"], "line": 21, "caption": "Lê '#' → null, sem criar nó."},
        {"current": 12, "visited": [0, 1, 2, 5], "stack": ["read(1)", "read(3)", "read(4)"], "line": 21, "caption": "Lê '#' → null, sem criar nó."},
        {"current": 6, "visited": [0, 1, 2, 5, 6], "compare": [6], "stack": ["read(1)", "read(3)", "read(5)"], "tree": [1, 2, 3, null, null, 4, 5], "line": 22, "caption": "Lê 5: cria o nó e monta primeiro o filho esquerdo, depois o direito."},
        {"current": 13, "visited": [0, 1, 2, 5, 6], "stack": ["read(1)", "read(3)", "read(5)"], "line": 21, "caption": "Lê '#' → null, sem criar nó."},
        {"current": 14, "visited": [0, 1, 2, 5, 6], "stack": ["read(1)", "read(3)", "read(5)"], "line": 21, "caption": "Lê '#' → null, sem criar nó."},
        {"current": 0, "visited": [0, 1, 2, 5, 6], "found": true, "tree": [1, 2, 3, null, null, 4, 5], "line": 16, "caption": "Fila esgotada: a árvore original foi reconstruída."}
      ]
    }
  ]
}
```

## Código

```java
public String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    write(root, sb);
    return sb.toString();
}

private void write(TreeNode node, StringBuilder sb) {
    if (node == null) { sb.append("#,"); return; }
    sb.append(node.val).append(',');
    write(node.left, sb);
    write(node.right, sb);
}

public TreeNode deserialize(String data) {
    Deque<String> q = new ArrayDeque<>(Arrays.asList(data.split(",")));
    return read(q);
}

private TreeNode read(Deque<String> q) {
    String t = q.poll();
    if (t.equals("#")) return null;
    TreeNode node = new TreeNode(Integer.parseInt(t));
    node.left = read(q);
    node.right = read(q);
    return node;
}
```

## Complexidade

- **Tempo:** O(n) nas duas direções.
- **Espaço:** O(n) para a string/fila, mais O(h) de pilha.

## Erros comuns

- Omitir os marcadores de `null`: a string deixa de ser reversível.
- Serializar em uma ordem e desserializar em outra.
- Usar separador ausente (`12` pode ser o nó 12 ou os nós 1 e 2).
