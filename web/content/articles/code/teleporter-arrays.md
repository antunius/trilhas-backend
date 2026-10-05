---
slug: teleporter-arrays
categorySlug: code
title: "Teleporter Arrays"
navTitle: "Teleporter Arrays"
summary: "Dois arrays ordenados com valores em comum: somar o melhor caminho trocando de array nos pontos comuns."
level: avancado
order: 32
section: two-pointers
group: Advanced
---

## Enunciado

Você recebe dois arrays **ordenados** `a` e `b`, com valores distintos dentro de cada um. Você percorre um deles da esquerda para a direita somando os valores. Quando encontra um valor que existe nos dois arrays, pode **"teleportar"** para o outro array e continuar. Retorne a **maior soma** possível de um caminho.

```
a = [2, 4, 5, 8, 10]
b = [4, 6, 8, 9]
Saída: 30      // 2 + 4 + 6 + 8 + 10
```

## Ideia

Os valores comuns são pontos de decisão. Entre dois valores comuns consecutivos, os trechos de `a` e de `b` são independentes: escolha o de **maior soma**. Como os arrays são ordenados, dois ponteiros os percorrem em paralelo, sempre avançando o menor.

1. `a[i] < b[j]`: acumule em `sumA` e avance `i`.
2. `a[i] > b[j]`: acumule em `sumB` e avance `j`.
3. Iguais: some `max(sumA, sumB) + valor` ao total e zere as somas.
4. Ao final, some `max(sumA, sumB)` das sobras.

```visualizer
{
  "title": "teleporter arrays — dois arrays ordenados",
  "code": {
    "lang": "java",
    "content": "public long maxScore(int[] a, int[] b) {\n    long sumA = 0, sumB = 0, total = 0;\n    int i = 0, j = 0;\n    while (i < a.length && j < b.length) {\n        if (a[i] < b[j]) {\n            sumA += a[i++];\n        } else if (a[i] > b[j]) {\n            sumB += b[j++];\n        } else {\n            total += Math.max(sumA, sumB) + a[i];\n            sumA = sumB = 0;\n            i++; j++;\n        }\n    }\n    while (i < a.length) sumA += a[i++];\n    while (j < b.length) sumB += b[j++];\n    return total + Math.max(sumA, sumB);\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "a = [2, 4, 5, 8, 10], b = [4, 6, 8, 9]  (na tela: a = índices 0–4, b = índices 5–8)",
      "array": [2, 4, 5, 8, 10, 4, 6, 8, 9],
      "steps": [
        {"pointers": {"i": 0, "j": 5}, "compare": [0, 5], "line": 3, "caption": "i percorre a (índices 0–4); j percorre b (índices 5–8 na tela). Somas parciais zeradas."},
        {"pointers": {"i": 0, "j": 5}, "compare": [0, 5], "line": 6, "caption": "a[0] = 2 < b[0] = 4: só a pode andar → sumA = 2."},
        {"pointers": {"i": 1, "j": 5}, "compare": [1, 5], "line": 10, "caption": "Valor comum 4: escolhemos o melhor trecho, max(2, 0) + 4 = 6 → total = 6."},
        {"pointers": {"i": 2, "j": 6}, "line": 11, "caption": "Zeramos as somas: começa um novo trecho."},
        {"pointers": {"i": 2, "j": 6}, "compare": [2, 6], "line": 6, "caption": "a[2] = 5 < b[1] = 6: só a pode andar → sumA = 5."},
        {"pointers": {"i": 3, "j": 6}, "compare": [3, 6], "line": 8, "caption": "a[3] = 8 > b[1] = 6: só b pode andar → sumB = 6."},
        {"pointers": {"i": 3, "j": 7}, "compare": [3, 7], "line": 10, "caption": "Valor comum 8: escolhemos o melhor trecho, max(5, 6) + 8 = 14 → total = 20."},
        {"pointers": {"i": 4, "j": 8}, "line": 11, "caption": "Zeramos as somas: começa um novo trecho."},
        {"pointers": {"i": 4, "j": 8}, "compare": [4, 8], "line": 8, "caption": "a[4] = 10 > b[3] = 9: só b pode andar → sumB = 9."},
        {"pointers": {"i": 4, "j": 8}, "found": true, "line": 17, "caption": "Sobras: sumA = 10, sumB = 9. Resposta = 20 + 10 = 30."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n + m).
- **Espaço:** O(1).

## Erros comuns

- Usar `int` e estourar: use `long` (ou módulo, se o enunciado pedir).
- Esquecer de somar as sobras após o laço.
- Somar o valor comum duas vezes.
