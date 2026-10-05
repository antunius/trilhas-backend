---
slug: anagramas-na-string
categorySlug: code
title: "Find All Anagrams in a String"
navTitle: "Find All Anagrams in a String"
summary: "Janela de tamanho fixo com contagem de caracteres para achar todas as posições onde começa um anagrama de p."
level: intermediario
order: 19
section: two-pointers
group: Sliding Window
---

## Enunciado

Dadas as strings `s` e `p`, retorne os índices iniciais de todos os **anagramas** de `p` em `s`.

```
Entrada: s = "cbaebabac", p = "abc"
Saída: [0, 6]
```

## Força bruta

Para cada substring de tamanho `|p|`, ordenar e comparar com `p` ordenado: O(n · k log k).

## Abordagem

Um anagrama é definido só pela **contagem de cada letra**. A janela tem tamanho fixo `|p|`; mantemos um vetor de contagens e o atualizamos de forma incremental (entra uma letra, sai outra). Comparar dois vetores de 26 posições é O(26) = O(1).

```visualizer
{
  "title": "find all anagrams — janela fixa + contagem",
  "code": {
    "lang": "java",
    "content": "public List<Integer> findAnagrams(String s, String p) {\n    List<Integer> res = new ArrayList<>();\n    int k = p.length();\n    int[] need = new int[26], win = new int[26];\n    for (char c : p.toCharArray()) need[c - 'a']++;\n    for (int right = 0; right < s.length(); right++) {\n        win[s.charAt(right) - 'a']++;\n        if (right >= k) win[s.charAt(right - k) - 'a']--;\n        if (right >= k - 1 && Arrays.equals(win, need)) res.add(right - k + 1);\n    }\n    return res;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "s = \"cbaebabac\", p = \"abc\"",
      "array": ["c", "b", "a", "e", "b", "a", "b", "a", "c"],
      "steps": [
        {"pointers": {"right": 0}, "line": 5, "caption": "Contamos os caracteres de p = \"abc\": cada letra aparece 1 vez em need."},
        {"pointers": {"left": 0, "right": 0}, "compare": [0], "line": 7, "caption": "Entra 'c' na janela."},
        {"pointers": {"left": 0, "right": 1}, "compare": [0, 1], "line": 7, "caption": "Entra 'b' na janela."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 7, "caption": "Entra 'a' na janela."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 9, "caption": "Janela \"cba\" tem as mesmas contagens de p → anagrama! Guardamos o índice 0."},
        {"pointers": {"left": 0, "right": 3}, "compare": [0, 1, 2, 3], "line": 7, "caption": "Entra 'e' na janela."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "eliminated": [0], "line": 8, "caption": "A janela passou de 3 letras: sai 'c'."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "line": 9, "caption": "Janela \"bae\" tem contagens diferentes de p → não é anagrama."},
        {"pointers": {"left": 1, "right": 4}, "compare": [1, 2, 3, 4], "line": 7, "caption": "Entra 'b' na janela."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "eliminated": [1], "line": 8, "caption": "A janela passou de 3 letras: sai 'b'."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "line": 9, "caption": "Janela \"aeb\" tem contagens diferentes de p → não é anagrama."},
        {"pointers": {"left": 2, "right": 5}, "compare": [2, 3, 4, 5], "line": 7, "caption": "Entra 'a' na janela."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "eliminated": [2], "line": 8, "caption": "A janela passou de 3 letras: sai 'a'."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "line": 9, "caption": "Janela \"eba\" tem contagens diferentes de p → não é anagrama."},
        {"pointers": {"left": 3, "right": 6}, "compare": [3, 4, 5, 6], "line": 7, "caption": "Entra 'b' na janela."},
        {"pointers": {"left": 4, "right": 6}, "compare": [4, 5, 6], "eliminated": [3], "line": 8, "caption": "A janela passou de 3 letras: sai 'e'."},
        {"pointers": {"left": 4, "right": 6}, "compare": [4, 5, 6], "line": 9, "caption": "Janela \"bab\" tem contagens diferentes de p → não é anagrama."},
        {"pointers": {"left": 4, "right": 7}, "compare": [4, 5, 6, 7], "line": 7, "caption": "Entra 'a' na janela."},
        {"pointers": {"left": 5, "right": 7}, "compare": [5, 6, 7], "eliminated": [4], "line": 8, "caption": "A janela passou de 3 letras: sai 'b'."},
        {"pointers": {"left": 5, "right": 7}, "compare": [5, 6, 7], "line": 9, "caption": "Janela \"aba\" tem contagens diferentes de p → não é anagrama."},
        {"pointers": {"left": 5, "right": 8}, "compare": [5, 6, 7, 8], "line": 7, "caption": "Entra 'c' na janela."},
        {"pointers": {"left": 6, "right": 8}, "compare": [6, 7, 8], "eliminated": [5], "line": 8, "caption": "A janela passou de 3 letras: sai 'a'."},
        {"pointers": {"left": 6, "right": 8}, "compare": [6, 7, 8], "line": 9, "caption": "Janela \"bac\" tem as mesmas contagens de p → anagrama! Guardamos o índice 6."},
        {"pointers": {"left": 6, "right": 8}, "found": true, "line": 11, "caption": "Retornamos [0, 6]."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n) (comparação de 26 posições é constante).
- **Espaço:** O(1) — dois vetores de 26.

## Erros comuns

- Começar a comparar antes de a janela ter `k` letras.
- Esquecer de remover a letra que sai quando `right >= k`.
- Usar `==` em arrays em vez de `Arrays.equals`.
