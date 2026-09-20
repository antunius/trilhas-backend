---
slug: subarray-soma-alvo
categorySlug: code
title: "Subarray Sum Equals Target"
navTitle: "Subarray Sum Equals Target"
summary: "Contar subarrays com soma k usando prefix sum e hash map, inclusive com números negativos."
level: intermediario
order: 25
section: two-pointers
group: Prefix Sum
---

## Enunciado

Dado `nums` (pode ter negativos) e um inteiro `k`, retorne o **número de subarrays contíguos** cuja soma é `k`.

```
Entrada: nums = [3, 4, 7, 2, -3, 1, 4, 2], k = 7
Saída: 4
```

## Por que sliding window não serve

Com negativos, encolher a janela pode aumentar a soma; a condição deixa de ser monotônica.

## Abordagem

Seja `prefix` a soma até o índice atual. Um subarray que termina aqui e soma `k` existe para cada prefixo anterior igual a `prefix - k`. Um `HashMap` conta quantas vezes cada prefixo já apareceu. Inicialize `seen[0] = 1` para contar subarrays que começam no índice 0.

```visualizer
{
  "title": "subarray sum equals k — prefix sum + hash map",
  "code": {
    "lang": "java",
    "content": "public int subarraySum(int[] nums, int k) {\n    Map<Integer, Integer> seen = new HashMap<>();\n    seen.put(0, 1);\n    int prefix = 0, count = 0;\n    for (int x : nums) {\n        prefix += x;\n        count += seen.getOrDefault(prefix - k, 0);\n        seen.merge(prefix, 1, Integer::sum);\n    }\n    return count;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "nums = [3, 4, 7, 2, -3, 1, 4, 2], k = 7",
      "array": [3, 4, 7, 2, -3, 1, 4, 2],
      "steps": [
        {"pointers": {"i": 0}, "line": 3, "caption": "Prefixo vazio (soma 0) já vale 1 ocorrência: assim subarrays que começam no índice 0 são contados."},
        {"pointers": {"i": 0}, "compare": [0], "line": 6, "caption": "prefix = 3 (soma de nums[0..0])."},
        {"pointers": {"i": 0}, "compare": [0], "line": 7, "caption": "Procuramos prefixo 3 - 7 = -4: apareceu 0x antes → count = 0."},
        {"pointers": {"i": 0}, "compare": [0], "line": 8, "caption": "Registramos o prefixo 3 (agora 1x)."},
        {"pointers": {"i": 1}, "compare": [1], "line": 6, "caption": "prefix = 7 (soma de nums[0..1])."},
        {"pointers": {"i": 1}, "compare": [1], "line": 7, "caption": "Procuramos prefixo 7 - 7 = 0: apareceu 1x antes → count = 1."},
        {"pointers": {"i": 1}, "compare": [1], "line": 8, "caption": "Registramos o prefixo 7 (agora 1x)."},
        {"pointers": {"i": 2}, "compare": [2], "line": 6, "caption": "prefix = 14 (soma de nums[0..2])."},
        {"pointers": {"i": 2}, "compare": [2], "line": 7, "caption": "Procuramos prefixo 14 - 7 = 7: apareceu 1x antes → count = 2."},
        {"pointers": {"i": 2}, "compare": [2], "line": 8, "caption": "Registramos o prefixo 14 (agora 1x)."},
        {"pointers": {"i": 3}, "compare": [3], "line": 6, "caption": "prefix = 16 (soma de nums[0..3])."},
        {"pointers": {"i": 3}, "compare": [3], "line": 7, "caption": "Procuramos prefixo 16 - 7 = 9: apareceu 0x antes → count = 2."},
        {"pointers": {"i": 3}, "compare": [3], "line": 8, "caption": "Registramos o prefixo 16 (agora 1x)."},
        {"pointers": {"i": 4}, "compare": [4], "line": 6, "caption": "prefix = 13 (soma de nums[0..4])."},
        {"pointers": {"i": 4}, "compare": [4], "line": 7, "caption": "Procuramos prefixo 13 - 7 = 6: apareceu 0x antes → count = 2."},
        {"pointers": {"i": 4}, "compare": [4], "line": 8, "caption": "Registramos o prefixo 13 (agora 1x)."},
        {"pointers": {"i": 5}, "compare": [5], "line": 6, "caption": "prefix = 14 (soma de nums[0..5])."},
        {"pointers": {"i": 5}, "compare": [5], "line": 7, "caption": "Procuramos prefixo 14 - 7 = 7: apareceu 1x antes → count = 3."},
        {"pointers": {"i": 5}, "compare": [5], "line": 8, "caption": "Registramos o prefixo 14 (agora 2x)."},
        {"pointers": {"i": 6}, "compare": [6], "line": 6, "caption": "prefix = 18 (soma de nums[0..6])."},
        {"pointers": {"i": 6}, "compare": [6], "line": 7, "caption": "Procuramos prefixo 18 - 7 = 11: apareceu 0x antes → count = 3."},
        {"pointers": {"i": 6}, "compare": [6], "line": 8, "caption": "Registramos o prefixo 18 (agora 1x)."},
        {"pointers": {"i": 7}, "compare": [7], "line": 6, "caption": "prefix = 20 (soma de nums[0..7])."},
        {"pointers": {"i": 7}, "compare": [7], "line": 7, "caption": "Procuramos prefixo 20 - 7 = 13: apareceu 1x antes → count = 4."},
        {"pointers": {"i": 7}, "compare": [7], "line": 8, "caption": "Registramos o prefixo 20 (agora 1x)."},
        {"pointers": {"i": 7}, "found": true, "line": 10, "caption": "Retornamos count = 4."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(n).

## Erros comuns

- Esquecer `seen.put(0, 1)`.
- Atualizar o mapa **antes** de consultar `prefix - k` (conta o subarray vazio quando `k = 0`).
- Guardar só existência em vez de contagem: perde subarrays repetidos.
