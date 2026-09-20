---
slug: no-visivel
categorySlug: code
title: "Visible Tree Node"
navTitle: "Visible Tree Node"
summary: "Contar nós que não têm ancestral maior, carregando o máximo do caminho como estado top-down."
level: intermediario
order: 51
section: dfs
group: DFS on Tree
---

## Enunciado

Um nó é **visível** se nenhum nó no caminho da raiz até ele tem valor maior. Conte os nós visíveis. A raiz é sempre visível.

```
Entrada: root = [3, 1, 4, 3, null, 1, 5]
Saída: 4      // 3 (raiz), 3 (folha à esquerda), 4 e 5
```

## Força bruta

Para cada nó, subir até a raiz conferindo os ancestrais: O(n · h) e exige ponteiro para o pai.

## Abordagem

A pergunta é sobre os **ancestrais**, então o estilo é top-down: passamos `maxSoFar`, o maior valor visto no caminho. O nó é visível se `node.val >= maxSoFar`; depois passamos `max(maxSoFar, node.val)` aos filhos.

```treeviz
{
  "title": "visible tree node — estado descendo pela árvore",
  "code": {
    "lang": "java",
    "content": "public int visibleNodes(TreeNode node, int maxSoFar) {\n    if (node == null) return 0;\n    int count = node.val >= maxSoFar ? 1 : 0;\n    int newMax = Math.max(maxSoFar, node.val);\n    count += visibleNodes(node.left, newMax);\n    count += visibleNodes(node.right, newMax);\n    return count;\n}\n// chamada: visibleNodes(root, Integer.MIN_VALUE)"
  },
  "examples": [
    {
      "id": "classico",
      "label": "root = [3, 1, 4, 3, null, 1, 5]",
      "tree": [3, 1, 4, 3, null, 1, 5],
      "steps": [
        {"current": 0, "visited": [0], "compare": [0], "stack": ["visible(3, máx=-∞)"], "values": {"0": "máx -∞"}, "line": 3, "caption": "Nó 3 vs máximo do caminho (-∞): é visível (≥ máximo)."},
        {"current": 0, "visited": [0], "stack": ["visible(3, máx=-∞)"], "values": {"0": "máx -∞"}, "line": 4, "caption": "O máximo passado aos filhos é 3."},
        {"current": 1, "visited": [0, 1], "eliminated": [1], "stack": ["visible(3, máx=-∞)", "visible(1, máx=3)"], "values": {"0": "máx -∞", "1": "máx 3"}, "line": 3, "caption": "Nó 1 vs máximo do caminho (3): NÃO é visível (há um ancestral maior)."},
        {"current": 1, "visited": [0, 1], "stack": ["visible(3, máx=-∞)", "visible(1, máx=3)"], "values": {"0": "máx -∞", "1": "máx 3"}, "line": 4, "caption": "O máximo passado aos filhos é 3."},
        {"current": 3, "visited": [0, 1, 3], "compare": [3], "stack": ["visible(3, máx=-∞)", "visible(1, máx=3)", "visible(3, máx=3)"], "values": {"0": "máx -∞", "1": "máx 3", "3": "máx 3"}, "line": 3, "caption": "Nó 3 vs máximo do caminho (3): é visível (≥ máximo)."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["visible(3, máx=-∞)", "visible(1, máx=3)", "visible(3, máx=3)"], "values": {"0": "máx -∞", "1": "máx 3", "3": "máx 3"}, "line": 4, "caption": "O máximo passado aos filhos é 3."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["visible(3, máx=-∞)", "visible(1, máx=3)", "visible(3, máx=3)"], "values": {"0": "máx -∞", "1": "máx 3", "3": "→ 1"}, "line": 7, "caption": "Subárvore de 3 tem 1 nó(s) visível(is)."},
        {"current": 1, "visited": [0, 1, 3], "stack": ["visible(3, máx=-∞)", "visible(1, máx=3)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1"}, "line": 7, "caption": "Subárvore de 1 tem 1 nó(s) visível(is)."},
        {"current": 2, "visited": [0, 1, 2, 3], "compare": [2], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3"}, "line": 3, "caption": "Nó 4 vs máximo do caminho (3): é visível (≥ máximo)."},
        {"current": 2, "visited": [0, 1, 2, 3], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3"}, "line": 4, "caption": "O máximo passado aos filhos é 4."},
        {"current": 5, "visited": [0, 1, 2, 3, 5], "eliminated": [5], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)", "visible(1, máx=4)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3", "5": "máx 4"}, "line": 3, "caption": "Nó 1 vs máximo do caminho (4): NÃO é visível (há um ancestral maior)."},
        {"current": 5, "visited": [0, 1, 2, 3, 5], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)", "visible(1, máx=4)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3", "5": "máx 4"}, "line": 4, "caption": "O máximo passado aos filhos é 4."},
        {"current": 5, "visited": [0, 1, 2, 3, 5], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)", "visible(1, máx=4)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3", "5": "→ 0"}, "line": 7, "caption": "Subárvore de 1 tem 0 nó(s) visível(is)."},
        {"current": 6, "visited": [0, 1, 2, 3, 5, 6], "compare": [6], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)", "visible(5, máx=4)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3", "5": "→ 0", "6": "máx 4"}, "line": 3, "caption": "Nó 5 vs máximo do caminho (4): é visível (≥ máximo)."},
        {"current": 6, "visited": [0, 1, 2, 3, 5, 6], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)", "visible(5, máx=4)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3", "5": "→ 0", "6": "máx 4"}, "line": 4, "caption": "O máximo passado aos filhos é 5."},
        {"current": 6, "visited": [0, 1, 2, 3, 5, 6], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)", "visible(5, máx=4)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "máx 3", "5": "→ 0", "6": "→ 1"}, "line": 7, "caption": "Subárvore de 5 tem 1 nó(s) visível(is)."},
        {"current": 2, "visited": [0, 1, 2, 3, 5, 6], "stack": ["visible(3, máx=-∞)", "visible(4, máx=3)"], "values": {"0": "máx -∞", "1": "→ 1", "3": "→ 1", "2": "→ 2", "5": "→ 0", "6": "→ 1"}, "line": 7, "caption": "Subárvore de 4 tem 2 nó(s) visível(is)."},
        {"current": 0, "visited": [0, 1, 2, 3, 5, 6], "stack": ["visible(3, máx=-∞)"], "values": {"0": "→ 4", "1": "→ 1", "3": "→ 1", "2": "→ 2", "5": "→ 0", "6": "→ 1"}, "line": 7, "caption": "Subárvore de 3 tem 4 nó(s) visível(is)."},
        {"current": 0, "visited": [0, 1, 2, 3, 5, 6], "found": true, "values": {"0": "→ 4", "1": "→ 1", "3": "→ 1", "2": "→ 2", "5": "→ 0", "6": "→ 1"}, "line": 7, "caption": "Total de nós visíveis = 4."}
      ]
    }
  ]
}
```

## Código

```java
public int visibleNodes(TreeNode node, int maxSoFar) {
    if (node == null) return 0;
    int count = node.val >= maxSoFar ? 1 : 0;
    int newMax = Math.max(maxSoFar, node.val);
    count += visibleNodes(node.left, newMax);
    count += visibleNodes(node.right, newMax);
    return count;
}
// chamada: visibleNodes(root, Integer.MIN_VALUE)
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(h).

## Erros comuns

- Usar `>` em vez de `>=` (um nó igual ao máximo continua visível).
- Passar `maxSoFar` em vez de `newMax` aos filhos.
- Inicializar com `0` quando há valores negativos.
