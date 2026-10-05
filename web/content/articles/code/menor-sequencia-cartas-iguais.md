---
slug: menor-sequencia-cartas-iguais
categorySlug: code
title: "Least Consecutive Cards to Match"
navTitle: "Least Consecutive Cards to Match"
summary: "Achar o menor trecho consecutivo que contém duas cartas iguais, usando a última posição de cada valor."
level: intermediario
order: 23
section: two-pointers
group: Sliding Window
---

## Enunciado

Dado um array `cards`, retorne o **menor número de cartas consecutivas** que você precisa pegar para ter um par de cartas iguais. Se não houver par, retorne `-1`.

```
Entrada: cards = [3, 4, 2, 3, 4, 7]
Saída: 4      // [3, 4, 2, 3]
```

## Ideia

Queremos a **menor janela que contém uma duplicata**. A menor janela válida sempre tem as cartas iguais **nas duas pontas**, e o par mais próximo de qualquer valor é entre ocorrências vizinhas. Então o `left` ideal para cada `right` é a **última posição em que esse valor apareceu** — guardada em um `HashMap`.

É a mesma família da [janela mais curta](/category/code/janela-mais-curta), com o `left` "saltando" direto para a posição certa em vez de andar um passo por vez.

```visualizer
{
  "title": "least consecutive cards to match",
  "code": {
    "lang": "java",
    "content": "public int minimumCardPickup(int[] cards) {\n    Map<Integer, Integer> last = new HashMap<>();\n    int best = Integer.MAX_VALUE;\n    for (int i = 0; i < cards.length; i++) {\n        if (last.containsKey(cards[i])) {\n            best = Math.min(best, i - last.get(cards[i]) + 1);\n        }\n        last.put(cards[i], i);\n    }\n    return best == Integer.MAX_VALUE ? -1 : best;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "cards = [3, 4, 2, 3, 4, 7]",
      "array": [3, 4, 2, 3, 4, 7],
      "steps": [
        {"pointers": {"i": 0}, "line": 2, "caption": "Mapa vazio: guardará a última posição de cada carta."},
        {"pointers": {"i": 0}, "compare": [0], "line": 8, "caption": "Registramos last[3] = 0."},
        {"pointers": {"i": 1}, "compare": [1], "line": 8, "caption": "Registramos last[4] = 1."},
        {"pointers": {"i": 2}, "compare": [2], "line": 8, "caption": "Registramos last[2] = 2."},
        {"pointers": {"prev": 0, "i": 3}, "compare": [0, 1, 2, 3], "line": 6, "caption": "A carta 3 já apareceu na posição 0: janela [0..3] de tamanho 4 → best = 4."},
        {"pointers": {"i": 3}, "compare": [3], "line": 8, "caption": "Registramos last[3] = 3."},
        {"pointers": {"prev": 1, "i": 4}, "compare": [1, 2, 3, 4], "line": 6, "caption": "A carta 4 já apareceu na posição 1: janela [1..4] de tamanho 4 → best = 4."},
        {"pointers": {"i": 4}, "compare": [4], "line": 8, "caption": "Registramos last[4] = 4."},
        {"pointers": {"i": 5}, "compare": [5], "line": 8, "caption": "Registramos last[7] = 5."},
        {"pointers": {"i": 5}, "found": true, "line": 10, "caption": "Retornamos best = 4."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(n).

## Erros comuns

- Retornar `i - last` sem somar 1: o tamanho da janela conta as duas pontas.
- Não atualizar `last` a cada passo (perde pares mais próximos).
