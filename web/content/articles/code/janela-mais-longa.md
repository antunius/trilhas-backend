---
slug: janela-mais-longa
categorySlug: code
title: "Sliding Window - Longest"
navTitle: "Sliding Window - Longest"
summary: "Template de janela variável para achar o maior intervalo que satisfaz uma condição monotônica."
level: intermediario
order: 20
section: two-pointers
group: Sliding Window
---

## Enunciado

Dado um array de inteiros **positivos** `nums` e um `target`, retorne o tamanho do **maior** subarray contíguo cuja soma seja **≤ target**.

```
Entrada: nums = [3, 1, 2, 7, 4, 2, 1, 1, 5], target = 8
Saída: 4      // [4, 2, 1, 1]
```

## Por que funciona

Com valores positivos, **expandir aumenta a soma e contrair a diminui**. A condição é monotônica: se uma janela é inválida, aumentá-la nunca a conserta. Logo, quando fica inválida, só resta encolher pela esquerda.

## Template

1. `right` avança sempre, adicionando `nums[right]`.
2. `while` a janela for inválida, remova `nums[left]` e avance `left`.
3. Agora a janela é válida: atualize `best`.

```visualizer
{
  "title": "janela variável — mais longa com soma ≤ alvo",
  "code": {
    "lang": "java",
    "content": "public int longestAtMost(int[] nums, int target) {\n    int left = 0, sum = 0, best = 0;\n    for (int right = 0; right < nums.length; right++) {\n        sum += nums[right];\n        while (sum > target) {\n            sum -= nums[left];\n            left++;\n        }\n        best = Math.max(best, right - left + 1);\n    }\n    return best;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "nums = [3, 1, 2, 7, 4, 2, 1, 1, 5], target = 8",
      "array": [3, 1, 2, 7, 4, 2, 1, 1, 5],
      "steps": [
        {"pointers": {"left": 0, "right": 0}, "line": 2, "caption": "Começamos com janela vazia: left = 0, sum = 0, best = 0."},
        {"pointers": {"left": 0, "right": 0}, "compare": [0], "line": 4, "caption": "Expande: entra nums[0] = 3 → sum = 3."},
        {"pointers": {"left": 0, "right": 0}, "compare": [0], "line": 9, "caption": "Janela válida de tamanho 1 → best = 1."},
        {"pointers": {"left": 0, "right": 1}, "compare": [0, 1], "line": 4, "caption": "Expande: entra nums[1] = 1 → sum = 4."},
        {"pointers": {"left": 0, "right": 1}, "compare": [0, 1], "line": 9, "caption": "Janela válida de tamanho 2 → best = 2."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 4, "caption": "Expande: entra nums[2] = 2 → sum = 6."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 9, "caption": "Janela válida de tamanho 3 → best = 3."},
        {"pointers": {"left": 0, "right": 3}, "compare": [0, 1, 2, 3], "line": 4, "caption": "Expande: entra nums[3] = 7 → sum = 13."},
        {"pointers": {"left": 0, "right": 3}, "compare": [0, 1, 2, 3], "line": 5, "caption": "sum = 13 > 8: a janela é inválida, precisa encolher."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "eliminated": [0], "line": 7, "caption": "Sai nums[0] = 3 → sum = 10."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "line": 5, "caption": "sum = 10 > 8: a janela é inválida, precisa encolher."},
        {"pointers": {"left": 2, "right": 3}, "compare": [2, 3], "eliminated": [0, 1], "line": 7, "caption": "Sai nums[1] = 1 → sum = 9."},
        {"pointers": {"left": 2, "right": 3}, "compare": [2, 3], "line": 5, "caption": "sum = 9 > 8: a janela é inválida, precisa encolher."},
        {"pointers": {"left": 3, "right": 3}, "compare": [3], "eliminated": [0, 1, 2], "line": 7, "caption": "Sai nums[2] = 2 → sum = 7."},
        {"pointers": {"left": 3, "right": 3}, "compare": [3], "eliminated": [0, 1, 2], "line": 9, "caption": "Janela válida de tamanho 1 → best = 3."},
        {"pointers": {"left": 3, "right": 4}, "compare": [3, 4], "line": 4, "caption": "Expande: entra nums[4] = 4 → sum = 11."},
        {"pointers": {"left": 3, "right": 4}, "compare": [3, 4], "line": 5, "caption": "sum = 11 > 8: a janela é inválida, precisa encolher."},
        {"pointers": {"left": 4, "right": 4}, "compare": [4], "eliminated": [0, 1, 2, 3], "line": 7, "caption": "Sai nums[3] = 7 → sum = 4."},
        {"pointers": {"left": 4, "right": 4}, "compare": [4], "eliminated": [0, 1, 2, 3], "line": 9, "caption": "Janela válida de tamanho 1 → best = 3."},
        {"pointers": {"left": 4, "right": 5}, "compare": [4, 5], "line": 4, "caption": "Expande: entra nums[5] = 2 → sum = 6."},
        {"pointers": {"left": 4, "right": 5}, "compare": [4, 5], "eliminated": [0, 1, 2, 3], "line": 9, "caption": "Janela válida de tamanho 2 → best = 3."},
        {"pointers": {"left": 4, "right": 6}, "compare": [4, 5, 6], "line": 4, "caption": "Expande: entra nums[6] = 1 → sum = 7."},
        {"pointers": {"left": 4, "right": 6}, "compare": [4, 5, 6], "eliminated": [0, 1, 2, 3], "line": 9, "caption": "Janela válida de tamanho 3 → best = 3."},
        {"pointers": {"left": 4, "right": 7}, "compare": [4, 5, 6, 7], "line": 4, "caption": "Expande: entra nums[7] = 1 → sum = 8."},
        {"pointers": {"left": 4, "right": 7}, "compare": [4, 5, 6, 7], "eliminated": [0, 1, 2, 3], "line": 9, "caption": "Janela válida de tamanho 4 → best = 4."},
        {"pointers": {"left": 4, "right": 8}, "compare": [4, 5, 6, 7, 8], "line": 4, "caption": "Expande: entra nums[8] = 5 → sum = 13."},
        {"pointers": {"left": 4, "right": 8}, "compare": [4, 5, 6, 7, 8], "line": 5, "caption": "sum = 13 > 8: a janela é inválida, precisa encolher."},
        {"pointers": {"left": 5, "right": 8}, "compare": [5, 6, 7, 8], "eliminated": [0, 1, 2, 3, 4], "line": 7, "caption": "Sai nums[4] = 4 → sum = 9."},
        {"pointers": {"left": 5, "right": 8}, "compare": [5, 6, 7, 8], "line": 5, "caption": "sum = 9 > 8: a janela é inválida, precisa encolher."},
        {"pointers": {"left": 6, "right": 8}, "compare": [6, 7, 8], "eliminated": [0, 1, 2, 3, 4, 5], "line": 7, "caption": "Sai nums[5] = 2 → sum = 7."},
        {"pointers": {"left": 6, "right": 8}, "compare": [6, 7, 8], "eliminated": [0, 1, 2, 3, 4, 5], "line": 9, "caption": "Janela válida de tamanho 3 → best = 4."},
        {"pointers": {"left": 6, "right": 8}, "found": true, "line": 11, "caption": "Retornamos best = 4."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n) — `left` e `right` só andam para frente.
- **Espaço:** O(1).

## Erros comuns

- Usar `if` em vez de `while` para encolher.
- Atualizar `best` antes de restaurar a validade.
- Aplicar com números negativos: a monotonicidade deixa de valer.
