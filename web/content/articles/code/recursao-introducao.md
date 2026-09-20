---
slug: recursao-introducao
categorySlug: code
title: "Recursão: Introdução"
navTitle: "Recursion Intro"
summary: "Caso base, passo recursivo e pilha de chamadas: o alicerce de toda busca em profundidade."
level: iniciante
order: 46
section: dfs
group: Introduction
---

## O que é recursão

Uma função é recursiva quando resolve um problema chamando **a si mesma** para uma versão menor do mesmo problema. Toda solução recursiva tem duas partes:

1. **Caso base** — o menor problema, que se resolve sem nova chamada.
2. **Passo recursivo** — reduz o problema e delega o resto à própria função.

Sem caso base a recursão nunca para (`StackOverflowError`). Sem um passo que **realmente reduz** o problema, também não.

## A pilha de chamadas

Cada chamada ocupa um **quadro** na pilha com seus parâmetros e variáveis locais. A chamada mais nova fica no topo; quando ela retorna, seu quadro sai e a anterior continua exatamente de onde parou. É essa pilha que "lembra" o caminho de volta — e é ela que a DFS usa para percorrer árvores.

Repare, no exemplo abaixo, que as chamadas formam uma **árvore** (a árvore de chamadas). Percorrê-la de cima a baixo, esquerda antes de direita, é exatamente uma DFS.

```treeviz
{
  "title": "recursão — árvore de chamadas de fib(3)",
  "code": {
    "lang": "java",
    "content": "int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}"
  },
  "examples": [
    {
      "id": "fib3",
      "label": "fib(3): cada nó é uma chamada",
      "tree": ["fib(3)", "fib(2)", "fib(1)", "fib(1)", "fib(0)"],
      "steps": [
        {"current": 0, "visited": [0], "stack": ["fib(3)"], "line": 1, "caption": "Chamamos fib(3): um novo quadro entra na pilha."},
        {"current": 0, "visited": [0], "stack": ["fib(3)"], "line": 3, "caption": "n = 3 > 1: precisa de fib(2) e de fib(1)."},
        {"current": 1, "visited": [0, 1], "stack": ["fib(3)", "fib(2)"], "line": 1, "caption": "Chamamos fib(2): um novo quadro entra na pilha."},
        {"current": 1, "visited": [0, 1], "stack": ["fib(3)", "fib(2)"], "line": 3, "caption": "n = 2 > 1: precisa de fib(1) e de fib(0)."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["fib(3)", "fib(2)", "fib(1)"], "line": 1, "caption": "Chamamos fib(1): um novo quadro entra na pilha."},
        {"current": 3, "visited": [0, 1, 3], "stack": ["fib(3)", "fib(2)", "fib(1)"], "values": {"3": "→ 1"}, "line": 2, "caption": "Caso base: n = 1 ≤ 1, retorna 1 sem chamar mais ninguém."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["fib(3)", "fib(2)", "fib(0)"], "values": {"3": "→ 1"}, "line": 1, "caption": "Chamamos fib(0): um novo quadro entra na pilha."},
        {"current": 4, "visited": [0, 1, 3, 4], "stack": ["fib(3)", "fib(2)", "fib(0)"], "values": {"3": "→ 1", "4": "→ 0"}, "line": 2, "caption": "Caso base: n = 0 ≤ 1, retorna 0 sem chamar mais ninguém."},
        {"current": 1, "visited": [0, 1, 3, 4], "stack": ["fib(3)", "fib(2)"], "values": {"3": "→ 1", "4": "→ 0", "1": "→ 1"}, "line": 3, "caption": "fib(2) = fib(1) + fib(0) = 1 + 0 = 1. O quadro sai da pilha."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "stack": ["fib(3)", "fib(1)"], "values": {"3": "→ 1", "4": "→ 0", "1": "→ 1"}, "line": 1, "caption": "Chamamos fib(1): um novo quadro entra na pilha."},
        {"current": 2, "visited": [0, 1, 2, 3, 4], "stack": ["fib(3)", "fib(1)"], "values": {"3": "→ 1", "4": "→ 0", "1": "→ 1", "2": "→ 1"}, "line": 2, "caption": "Caso base: n = 1 ≤ 1, retorna 1 sem chamar mais ninguém."},
        {"current": 0, "visited": [0, 1, 2, 3, 4], "stack": ["fib(3)"], "values": {"3": "→ 1", "4": "→ 0", "1": "→ 1", "2": "→ 1", "0": "→ 2"}, "line": 3, "caption": "fib(3) = fib(2) + fib(1) = 1 + 1 = 2. O quadro sai da pilha."},
        {"current": 0, "visited": [0, 1, 2, 3, 4], "found": true, "values": {"3": "→ 1", "4": "→ 0", "1": "→ 1", "2": "→ 1", "0": "→ 2"}, "line": 3, "caption": "Resultado final: fib(3) = 2."}
      ]
    }
  ]
}
```

## Template

```java
Resultado resolve(Problema p) {
    if (ehCasoBase(p)) return valorBase;      // 1. para
    Resultado menor = resolve(reduz(p));      // 2. problema menor
    return combina(p, menor);                 // 3. monta a resposta
}
```

## Como pensar

Não tente simular a pilha inteira na cabeça. Use **fé indutiva**: assuma que `resolve` já funciona para problemas menores e pergunte apenas "dado o resultado do menor, como monto o meu?".

## Complexidade

- **Tempo:** número de chamadas × custo por chamada. `fib` ingênuo é O(2ⁿ) porque repete subproblemas (veja Programação Dinâmica).
- **Espaço:** profundidade máxima da recursão (a pilha).

## Erros comuns

- Esquecer o caso base ou deixá-lo inalcançável.
- Chamar com um argumento que não diminui.
- Recalcular o mesmo subproblema sem memoização.
- Ignorar o limite de pilha em entradas grandes (listas com 10⁵ elementos, por exemplo).

Próximo: [Árvores](/category/code/arvores-introducao).
