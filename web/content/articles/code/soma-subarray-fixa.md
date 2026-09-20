---
slug: soma-subarray-fixa
categorySlug: code
title: "Subarray Sum - Fixed"
navTitle: "Subarray Sum - Fixed"
summary: "Encontrar a maior soma entre todos os subarrays de tamanho k reaproveitando a soma da janela anterior."
level: iniciante
order: 18
section: two-pointers
group: Sliding Window
---

## Enunciado

Dado um array de inteiros `nums` e um inteiro `k`, retorne a **maior soma** de qualquer subarray contíguo de tamanho `k`.

```
Entrada: nums = [2, 1, 5, 1, 3, 2], k = 3
Saída: 9      // [5, 1, 3]
```

## Força bruta

Para cada posição inicial, somar `k` elementos: O(n·k). Cada soma refaz trabalho que a anterior já fez — duas janelas vizinhas compartilham `k - 1` elementos.

## Abordagem

Calcule a soma da primeira janela. Depois, ao deslizar uma posição: **some o elemento que entra e subtraia o que sai**. Cada passo custa O(1).

```visualizer
{
  "title": "subarray sum fixo — janela de tamanho k",
  "code": {
    "lang": "java",
    "content": "public int maxSumFixed(int[] nums, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) sum += nums[i];\n    int best = sum;\n    for (int right = k; right < nums.length; right++) {\n        sum += nums[right] - nums[right - k];\n        best = Math.max(best, sum);\n    }\n    return best;\n}"
  },
  "examples": [
    {
      "id": "k3",
      "label": "nums = [2, 1, 5, 1, 3, 2], k = 3",
      "array": [2, 1, 5, 1, 3, 2],
      "steps": [
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 3, "caption": "Somamos os 3 primeiros elementos: sum = 8."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 4, "caption": "best = 8 (a primeira janela é o melhor resultado até agora)."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "eliminated": [0], "line": 5, "caption": "right = 3: a janela avança uma posição."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "line": 6, "caption": "Entra nums[3] = 1, sai nums[0] = 2 → sum = 7."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "line": 7, "caption": "best = max(anterior, 7) = 8."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "eliminated": [1], "line": 5, "caption": "right = 4: a janela avança uma posição."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "line": 6, "caption": "Entra nums[4] = 3, sai nums[1] = 1 → sum = 9."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "line": 7, "caption": "best = max(anterior, 9) = 9."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "eliminated": [2], "line": 5, "caption": "right = 5: a janela avança uma posição."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "line": 6, "caption": "Entra nums[5] = 2, sai nums[2] = 5 → sum = 6."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "line": 7, "caption": "best = max(anterior, 6) = 9."},
        {"pointers": {"left": 3, "right": 5}, "found": true, "line": 9, "caption": "Retornamos best = 9."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(1).

## Erros comuns

- Recalcular a soma inteira a cada passo (volta a O(n·k)).
- Off-by-one no elemento que sai: é `nums[right - k]`.
- Não tratar `k > nums.length`.
