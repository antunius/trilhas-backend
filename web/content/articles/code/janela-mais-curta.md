---
slug: janela-mais-curta
categorySlug: code
title: "Sliding Window - Shortest"
navTitle: "Sliding Window - Shortest"
summary: "Template de janela variável para achar o menor intervalo que satisfaz uma condição, contraindo enquanto ainda é válida."
level: intermediario
order: 22
section: two-pointers
group: Sliding Window
---

## Enunciado

Dado um array de inteiros **positivos** `nums` e um `target`, retorne o tamanho do **menor** subarray contíguo com soma **≥ target**. Se não existir, retorne 0.

```
Entrada: nums = [2, 3, 1, 2, 4, 3], target = 7
Saída: 2      // [4, 3]
```

## A inversão em relação à "mais longa"

Na mais longa, encolhemos quando a janela fica **inválida**. Na mais curta, encolhemos **enquanto ela é válida**, porque cada contração pode gerar uma janela ainda menor. O registro do melhor resultado acontece **dentro** do `while`.

1. `right` expande e soma `nums[right]`.
2. `while` a soma ≥ `target`: registre `right - left + 1`, remova `nums[left]`, avance `left`.

```visualizer
{
  "title": "janela variável — mais curta com soma ≥ alvo",
  "code": {
    "lang": "java",
    "content": "public int minSubArrayLen(int target, int[] nums) {\n    int left = 0, sum = 0, best = Integer.MAX_VALUE;\n    for (int right = 0; right < nums.length; right++) {\n        sum += nums[right];\n        while (sum >= target) {\n            best = Math.min(best, right - left + 1);\n            sum -= nums[left];\n            left++;\n        }\n    }\n    return best == Integer.MAX_VALUE ? 0 : best;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "nums = [2, 3, 1, 2, 4, 3], target = 7",
      "array": [2, 3, 1, 2, 4, 3],
      "steps": [
        {"pointers": {"left": 0, "right": 0}, "line": 2, "caption": "Janela vazia; best começa em infinito."},
        {"pointers": {"left": 0, "right": 0}, "compare": [0], "line": 4, "caption": "Expande: entra nums[0] = 2 → sum = 2."},
        {"pointers": {"left": 0, "right": 1}, "compare": [0, 1], "line": 4, "caption": "Expande: entra nums[1] = 3 → sum = 5."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 4, "caption": "Expande: entra nums[2] = 1 → sum = 6."},
        {"pointers": {"left": 0, "right": 3}, "compare": [0, 1, 2, 3], "line": 4, "caption": "Expande: entra nums[3] = 2 → sum = 8."},
        {"pointers": {"left": 0, "right": 3}, "compare": [0, 1, 2, 3], "line": 6, "caption": "sum = 8 ≥ 7: janela válida de tamanho 4 → best = 4."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "eliminated": [0], "line": 8, "caption": "Tentamos encolher: sai nums[0] = 2 → sum = 6."},
        {"pointers": {"left": 1, "right": 4}, "compare": [1, 2, 3, 4], "eliminated": [0], "line": 4, "caption": "Expande: entra nums[4] = 4 → sum = 10."},
        {"pointers": {"left": 1, "right": 4}, "compare": [1, 2, 3, 4], "eliminated": [0], "line": 6, "caption": "sum = 10 ≥ 7: janela válida de tamanho 4 → best = 4."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "eliminated": [0, 1], "line": 8, "caption": "Tentamos encolher: sai nums[1] = 3 → sum = 7."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "eliminated": [0, 1], "line": 6, "caption": "sum = 7 ≥ 7: janela válida de tamanho 3 → best = 3."},
        {"pointers": {"left": 3, "right": 4}, "compare": [3, 4], "eliminated": [0, 1, 2], "line": 8, "caption": "Tentamos encolher: sai nums[2] = 1 → sum = 6."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "eliminated": [0, 1, 2], "line": 4, "caption": "Expande: entra nums[5] = 3 → sum = 9."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "eliminated": [0, 1, 2], "line": 6, "caption": "sum = 9 ≥ 7: janela válida de tamanho 3 → best = 3."},
        {"pointers": {"left": 4, "right": 5}, "compare": [4, 5], "eliminated": [0, 1, 2, 3], "line": 8, "caption": "Tentamos encolher: sai nums[3] = 2 → sum = 7."},
        {"pointers": {"left": 4, "right": 5}, "compare": [4, 5], "eliminated": [0, 1, 2, 3], "line": 6, "caption": "sum = 7 ≥ 7: janela válida de tamanho 2 → best = 2."},
        {"pointers": {"left": 5, "right": 5}, "compare": [5], "eliminated": [0, 1, 2, 3, 4], "line": 8, "caption": "Tentamos encolher: sai nums[4] = 4 → sum = 3."},
        {"pointers": {"left": 5, "right": 5}, "found": true, "line": 11, "caption": "Retornamos best = 2."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(1).

## Erros comuns

- Registrar `best` fora do `while` (perde janelas menores).
- Retornar `Integer.MAX_VALUE` quando nenhuma janela é válida.
- Usar com negativos: encolher pode aumentar a soma.
