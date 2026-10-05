---
slug: range-sum-query
categorySlug: code
title: "Range Sum Query - Immutable"
navTitle: "Range Sum Query - Immutable"
summary: "Construir o array de prefixos uma vez e responder qualquer soma de intervalo em O(1)."
level: iniciante
order: 26
section: two-pointers
group: Prefix Sum
---

## Enunciado

Implemente `NumArray(int[] nums)` e `sumRange(left, right)`, que retorna a soma de `nums[left..right]`. Haverá muitas chamadas.

```
nums = [-2, 0, 3, -5, 2, -1]
sumRange(2, 5) → -1     // 3 + (-5) + 2 + (-1)
```

## Abordagem

Pague O(n) uma vez no construtor para montar `prefix`. Cada consulta vira uma subtração.

```visualizer
{
  "title": "range sum query — construindo o prefix sum",
  "code": {
    "lang": "java",
    "content": "class NumArray {\n    private final int[] prefix;\n\n    public NumArray(int[] nums) {\n        prefix = new int[nums.length + 1];\n        for (int i = 0; i < nums.length; i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n    }\n\n    public int sumRange(int left, int right) {\n        return prefix[right + 1] - prefix[left];\n    }\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "nums = [-2, 0, 3, -5, 2, -1]  (na construção, a tela mostra o array prefix[])",
      "array": [-2, 0, 3, -5, 2, -1],
      "steps": [
        {"pointers": {"i": 0}, "array": [0], "line": 5, "caption": "prefix tem n + 1 posições; prefix[0] = 0 (soma de nada)."},
        {"pointers": {"i": 0}, "compare": [0], "array": [0, -2], "line": 7, "caption": "prefix[1] = prefix[0] + nums[0] = 0 + (-2) = -2."},
        {"pointers": {"i": 1}, "compare": [1], "array": [0, -2, -2], "line": 7, "caption": "prefix[2] = prefix[1] + nums[1] = -2 + (0) = -2."},
        {"pointers": {"i": 2}, "compare": [2], "array": [0, -2, -2, 1], "line": 7, "caption": "prefix[3] = prefix[2] + nums[2] = -2 + (3) = 1."},
        {"pointers": {"i": 3}, "compare": [3], "array": [0, -2, -2, 1, -4], "line": 7, "caption": "prefix[4] = prefix[3] + nums[3] = 1 + (-5) = -4."},
        {"pointers": {"i": 4}, "compare": [4], "array": [0, -2, -2, 1, -4, -2], "line": 7, "caption": "prefix[5] = prefix[4] + nums[4] = -4 + (2) = -2."},
        {"pointers": {"i": 5}, "compare": [5], "array": [0, -2, -2, 1, -4, -2, -3], "line": 7, "caption": "prefix[6] = prefix[5] + nums[5] = -2 + (-1) = -3."},
        {"pointers": {"left": 2, "right": 5}, "compare": [2, 3, 4, 5], "found": true, "array": [-2, 0, 3, -5, 2, -1], "line": 12, "caption": "sumRange(2, 5) = prefix[6] - prefix[2] = -3 - (-2) = -1."}
      ]
    }
  ]
}
```

## Complexidade

- **Construção:** O(n) tempo, O(n) espaço.
- **Consulta:** O(1).

## Erros comuns

- Usar `prefix[right] - prefix[left]` (falta o `+ 1` em `right`).
- Alocar `prefix` com tamanho `n` em vez de `n + 1`.
