---
slug: minimum-window-substring
categorySlug: code
title: "Minimum Window Substring"
navTitle: "Minimum Window Substring"
summary: "Menor janela de s que contém todos os caracteres de t, com contagem de faltantes."
level: avancado
order: 31
section: two-pointers
group: Advanced
---

## Enunciado

Dadas `s` e `t`, retorne a **menor substring** de `s` que contém todos os caracteres de `t` (com multiplicidade). Se não existir, retorne `""`.

```
Entrada: s = "ADOBECODEBANC", t = "ABC"
Saída: "BANC"
```

## Abordagem

É uma [janela mais curta](/category/code/janela-mais-curta) cuja validade é "cobre todas as letras de t". Para checar isso em O(1) mantemos:

- `need[c]`: quantas letras `c` ainda faltam (fica negativo quando sobra).
- `missing`: quantas letras no total ainda faltam. Janela válida ⇔ `missing == 0`.

Ao entrar uma letra que faltava, `missing--`. Ao sair uma letra que a janela precisava, `missing++`.

```visualizer
{
  "title": "minimum window substring",
  "code": {
    "lang": "java",
    "content": "public String minWindow(String s, String t) {\n    int[] need = new int[128];\n    for (char c : t.toCharArray()) need[c]++;\n    int missing = t.length();\n    int left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE;\n    for (int right = 0; right < s.length(); right++) {\n        if (need[s.charAt(right)]-- > 0) missing--;\n        while (missing == 0) {\n            if (right - left + 1 < bestLen) {\n                bestLen = right - left + 1;\n                bestStart = left;\n            }\n            if (++need[s.charAt(left)] > 0) missing++;\n            left++;\n        }\n    }\n    return bestLen == Integer.MAX_VALUE ? \"\" : s.substring(bestStart, bestStart + bestLen);\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "s = \"ADOBECODEBANC\", t = \"ABC\"",
      "array": ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"],
      "steps": [
        {"pointers": {"left": 0, "right": 0}, "line": 3, "caption": "need guarda quantas letras de t ainda faltam. missing = 3 letras a cobrir."},
        {"pointers": {"left": 0, "right": 0}, "compare": [0], "line": 7, "caption": "Entra 'A'. Era uma letra que faltava → missing = 2."},
        {"pointers": {"left": 0, "right": 1}, "compare": [0, 1], "line": 7, "caption": "Entra 'D'. Não faltava (sobra) → missing continua 2."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 7, "caption": "Entra 'O'. Não faltava (sobra) → missing continua 2."},
        {"pointers": {"left": 0, "right": 3}, "compare": [0, 1, 2, 3], "line": 7, "caption": "Entra 'B'. Era uma letra que faltava → missing = 1."},
        {"pointers": {"left": 0, "right": 4}, "compare": [0, 1, 2, 3, 4], "line": 7, "caption": "Entra 'E'. Não faltava (sobra) → missing continua 1."},
        {"pointers": {"left": 0, "right": 5}, "compare": [0, 1, 2, 3, 4, 5], "line": 7, "caption": "Entra 'C'. Era uma letra que faltava → missing = 0."},
        {"pointers": {"left": 0, "right": 5}, "compare": [0, 1, 2, 3, 4, 5], "line": 10, "caption": "Janela \"ADOBEC\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 1, "right": 5}, "compare": [1, 2, 3, 4, 5], "eliminated": [0], "line": 14, "caption": "Sai 'A' pela esquerda. missing = 1. Perdeu cobertura → voltamos a expandir."},
        {"pointers": {"left": 1, "right": 6}, "compare": [1, 2, 3, 4, 5, 6], "line": 7, "caption": "Entra 'O'. Não faltava (sobra) → missing continua 1."},
        {"pointers": {"left": 1, "right": 7}, "compare": [1, 2, 3, 4, 5, 6, 7], "line": 7, "caption": "Entra 'D'. Não faltava (sobra) → missing continua 1."},
        {"pointers": {"left": 1, "right": 8}, "compare": [1, 2, 3, 4, 5, 6, 7, 8], "line": 7, "caption": "Entra 'E'. Não faltava (sobra) → missing continua 1."},
        {"pointers": {"left": 1, "right": 9}, "compare": [1, 2, 3, 4, 5, 6, 7, 8, 9], "line": 7, "caption": "Entra 'B'. Não faltava (sobra) → missing continua 1."},
        {"pointers": {"left": 1, "right": 10}, "compare": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "line": 7, "caption": "Entra 'A'. Era uma letra que faltava → missing = 0."},
        {"pointers": {"left": 1, "right": 10}, "compare": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "line": 10, "caption": "Janela \"DOBECODEBA\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 2, "right": 10}, "compare": [2, 3, 4, 5, 6, 7, 8, 9, 10], "eliminated": [0, 1], "line": 14, "caption": "Sai 'D' pela esquerda. missing = 0. Janela ainda cobre t → continua encolhendo."},
        {"pointers": {"left": 2, "right": 10}, "compare": [2, 3, 4, 5, 6, 7, 8, 9, 10], "line": 10, "caption": "Janela \"OBECODEBA\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 3, "right": 10}, "compare": [3, 4, 5, 6, 7, 8, 9, 10], "eliminated": [0, 1, 2], "line": 14, "caption": "Sai 'O' pela esquerda. missing = 0. Janela ainda cobre t → continua encolhendo."},
        {"pointers": {"left": 3, "right": 10}, "compare": [3, 4, 5, 6, 7, 8, 9, 10], "line": 10, "caption": "Janela \"BECODEBA\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 4, "right": 10}, "compare": [4, 5, 6, 7, 8, 9, 10], "eliminated": [0, 1, 2, 3], "line": 14, "caption": "Sai 'B' pela esquerda. missing = 0. Janela ainda cobre t → continua encolhendo."},
        {"pointers": {"left": 4, "right": 10}, "compare": [4, 5, 6, 7, 8, 9, 10], "line": 10, "caption": "Janela \"ECODEBA\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 5, "right": 10}, "compare": [5, 6, 7, 8, 9, 10], "eliminated": [0, 1, 2, 3, 4], "line": 14, "caption": "Sai 'E' pela esquerda. missing = 0. Janela ainda cobre t → continua encolhendo."},
        {"pointers": {"left": 5, "right": 10}, "compare": [5, 6, 7, 8, 9, 10], "line": 10, "caption": "Janela \"CODEBA\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 6, "right": 10}, "compare": [6, 7, 8, 9, 10], "eliminated": [0, 1, 2, 3, 4, 5], "line": 14, "caption": "Sai 'C' pela esquerda. missing = 1. Perdeu cobertura → voltamos a expandir."},
        {"pointers": {"left": 6, "right": 11}, "compare": [6, 7, 8, 9, 10, 11], "line": 7, "caption": "Entra 'N'. Não faltava (sobra) → missing continua 1."},
        {"pointers": {"left": 6, "right": 12}, "compare": [6, 7, 8, 9, 10, 11, 12], "line": 7, "caption": "Entra 'C'. Era uma letra que faltava → missing = 0."},
        {"pointers": {"left": 6, "right": 12}, "compare": [6, 7, 8, 9, 10, 11, 12], "line": 10, "caption": "Janela \"ODEBANC\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 7, "right": 12}, "compare": [7, 8, 9, 10, 11, 12], "eliminated": [0, 1, 2, 3, 4, 5, 6], "line": 14, "caption": "Sai 'O' pela esquerda. missing = 0. Janela ainda cobre t → continua encolhendo."},
        {"pointers": {"left": 7, "right": 12}, "compare": [7, 8, 9, 10, 11, 12], "line": 10, "caption": "Janela \"DEBANC\" cobre t. Melhor até agora: \"ADOBEC\" (tamanho 6)."},
        {"pointers": {"left": 8, "right": 12}, "compare": [8, 9, 10, 11, 12], "eliminated": [0, 1, 2, 3, 4, 5, 6, 7], "line": 14, "caption": "Sai 'D' pela esquerda. missing = 0. Janela ainda cobre t → continua encolhendo."},
        {"pointers": {"left": 8, "right": 12}, "compare": [8, 9, 10, 11, 12], "line": 10, "caption": "Janela \"EBANC\" cobre t. Melhor até agora: \"EBANC\" (tamanho 5)."},
        {"pointers": {"left": 9, "right": 12}, "compare": [9, 10, 11, 12], "eliminated": [0, 1, 2, 3, 4, 5, 6, 7, 8], "line": 14, "caption": "Sai 'E' pela esquerda. missing = 0. Janela ainda cobre t → continua encolhendo."},
        {"pointers": {"left": 9, "right": 12}, "compare": [9, 10, 11, 12], "line": 10, "caption": "Janela \"BANC\" cobre t. Melhor até agora: \"BANC\" (tamanho 4)."},
        {"pointers": {"left": 10, "right": 12}, "compare": [10, 11, 12], "eliminated": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "line": 14, "caption": "Sai 'B' pela esquerda. missing = 1. Perdeu cobertura → voltamos a expandir."},
        {"pointers": {"left": 9, "right": 12}, "compare": [9, 10, 11, 12], "found": true, "line": 17, "caption": "Retornamos \"BANC\"."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(|s| + |t|).
- **Espaço:** O(alfabeto).

## Erros comuns

- Decrementar `missing` para letras que sobram (só quando `need[c] > 0` antes).
- Registrar o melhor resultado fora do `while (missing == 0)`.
- Não guardar `bestStart` junto com `bestLen`.
