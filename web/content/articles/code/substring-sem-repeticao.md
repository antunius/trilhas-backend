---
slug: substring-sem-repeticao
categorySlug: code
title: "Longest Substring without Repeating Characters"
navTitle: "Longest Substring without Repeating Characters"
summary: "Janela variável com conjunto de caracteres para achar a maior substring sem letras repetidas."
level: intermediario
order: 21
section: two-pointers
group: Sliding Window
---

## Enunciado

Dada uma string `s`, retorne o tamanho da **maior substring sem caracteres repetidos**.

```
Entrada: s = "abcabcbb"
Saída: 3      // "abc"
```

## Abordagem

É o template da [janela mais longa](/category/code/janela-mais-longa), com uma "condição de validade" diferente: **nenhum caractere aparece duas vezes**. Um `Set` guarda os caracteres da janela.

Ao ler `s[right]`: enquanto ele já estiver no conjunto, remova `s[left]` e avance `left`. Depois adicione `s[right]` e atualize o melhor tamanho.

```visualizer
{
  "title": "longest substring without repeating characters",
  "code": {
    "lang": "java",
    "content": "public int lengthOfLongestSubstring(String s) {\n    Set<Character> window = new HashSet<>();\n    int left = 0, best = 0;\n    for (int right = 0; right < s.length(); right++) {\n        while (window.contains(s.charAt(right))) {\n            window.remove(s.charAt(left));\n            left++;\n        }\n        window.add(s.charAt(right));\n        best = Math.max(best, right - left + 1);\n    }\n    return best;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "s = \"abcabcbb\"",
      "array": ["a", "b", "c", "a", "b", "c", "b", "b"],
      "steps": [
        {"pointers": {"left": 0, "right": 0}, "line": 3, "caption": "Janela vazia, conjunto vazio, best = 0."},
        {"pointers": {"left": 0, "right": 0}, "compare": [0], "line": 9, "caption": "'a' não está mais duplicado: entra na janela → \"a\"."},
        {"pointers": {"left": 0, "right": 0}, "compare": [0], "line": 10, "caption": "Janela sem repetição de tamanho 1 → best = 1."},
        {"pointers": {"left": 0, "right": 1}, "compare": [0, 1], "line": 9, "caption": "'b' não está mais duplicado: entra na janela → \"ab\"."},
        {"pointers": {"left": 0, "right": 1}, "compare": [0, 1], "line": 10, "caption": "Janela sem repetição de tamanho 2 → best = 2."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 9, "caption": "'c' não está mais duplicado: entra na janela → \"abc\"."},
        {"pointers": {"left": 0, "right": 2}, "compare": [0, 1, 2], "line": 10, "caption": "Janela sem repetição de tamanho 3 → best = 3."},
        {"pointers": {"left": 0, "right": 3}, "compare": [0, 1, 2, 3], "line": 5, "caption": "'a' já está na janela → duplicata, precisamos encolher."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "eliminated": [0], "line": 7, "caption": "Removemos 'a' pela esquerda."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "eliminated": [0], "line": 9, "caption": "'a' não está mais duplicado: entra na janela → \"bca\"."},
        {"pointers": {"left": 1, "right": 3}, "compare": [1, 2, 3], "eliminated": [0], "line": 10, "caption": "Janela sem repetição de tamanho 3 → best = 3."},
        {"pointers": {"left": 1, "right": 4}, "compare": [1, 2, 3, 4], "line": 5, "caption": "'b' já está na janela → duplicata, precisamos encolher."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "eliminated": [0, 1], "line": 7, "caption": "Removemos 'b' pela esquerda."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "eliminated": [0, 1], "line": 9, "caption": "'b' não está mais duplicado: entra na janela → \"cab\"."},
        {"pointers": {"left": 2, "right": 4}, "compare": [2, 3, 4], "eliminated": [0, 1], "line": 10, "caption": "Janela sem repetição de tamanho 3 → best = 3."},
        {"pointers": {"left": 2, "right": 5}, "compare": [2, 3, 4, 5], "line": 5, "caption": "'c' já está na janela → duplicata, precisamos encolher."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "eliminated": [0, 1, 2], "line": 7, "caption": "Removemos 'c' pela esquerda."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "eliminated": [0, 1, 2], "line": 9, "caption": "'c' não está mais duplicado: entra na janela → \"abc\"."},
        {"pointers": {"left": 3, "right": 5}, "compare": [3, 4, 5], "eliminated": [0, 1, 2], "line": 10, "caption": "Janela sem repetição de tamanho 3 → best = 3."},
        {"pointers": {"left": 3, "right": 6}, "compare": [3, 4, 5, 6], "line": 5, "caption": "'b' já está na janela → duplicata, precisamos encolher."},
        {"pointers": {"left": 4, "right": 6}, "compare": [4, 5, 6], "eliminated": [0, 1, 2, 3], "line": 7, "caption": "Removemos 'a' pela esquerda."},
        {"pointers": {"left": 4, "right": 6}, "compare": [4, 5, 6], "line": 5, "caption": "'b' já está na janela → duplicata, precisamos encolher."},
        {"pointers": {"left": 5, "right": 6}, "compare": [5, 6], "eliminated": [0, 1, 2, 3, 4], "line": 7, "caption": "Removemos 'b' pela esquerda."},
        {"pointers": {"left": 5, "right": 6}, "compare": [5, 6], "eliminated": [0, 1, 2, 3, 4], "line": 9, "caption": "'b' não está mais duplicado: entra na janela → \"cb\"."},
        {"pointers": {"left": 5, "right": 6}, "compare": [5, 6], "eliminated": [0, 1, 2, 3, 4], "line": 10, "caption": "Janela sem repetição de tamanho 2 → best = 3."},
        {"pointers": {"left": 5, "right": 7}, "compare": [5, 6, 7], "line": 5, "caption": "'b' já está na janela → duplicata, precisamos encolher."},
        {"pointers": {"left": 6, "right": 7}, "compare": [6, 7], "eliminated": [0, 1, 2, 3, 4, 5], "line": 7, "caption": "Removemos 'c' pela esquerda."},
        {"pointers": {"left": 6, "right": 7}, "compare": [6, 7], "line": 5, "caption": "'b' já está na janela → duplicata, precisamos encolher."},
        {"pointers": {"left": 7, "right": 7}, "compare": [7], "eliminated": [0, 1, 2, 3, 4, 5, 6], "line": 7, "caption": "Removemos 'b' pela esquerda."},
        {"pointers": {"left": 7, "right": 7}, "compare": [7], "eliminated": [0, 1, 2, 3, 4, 5, 6], "line": 9, "caption": "'b' não está mais duplicado: entra na janela → \"b\"."},
        {"pointers": {"left": 7, "right": 7}, "compare": [7], "eliminated": [0, 1, 2, 3, 4, 5, 6], "line": 10, "caption": "Janela sem repetição de tamanho 1 → best = 3."},
        {"pointers": {"left": 7, "right": 7}, "found": true, "line": 12, "caption": "Retornamos best = 3."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n) — cada caractere entra e sai do conjunto no máximo uma vez.
- **Espaço:** O(min(n, alfabeto)).

## Erros comuns

- Trocar `while` por `if`: uma duplicata pode exigir várias remoções.
- Adicionar `s[right]` ao conjunto antes de resolver a duplicata.
- Esquecer que `best` se atualiza a cada `right`, não só quando há duplicata.
