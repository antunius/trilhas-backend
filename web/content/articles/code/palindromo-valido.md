---
slug: palindromo-valido
categorySlug: code
title: "Valid Palindrome"
navTitle: Valid Palindrome
summary: Verificar se uma string é um palíndromo ignorando pontuação e caixa, comparando de fora para dentro com ponteiros convergentes.
level: iniciante
order: 14
section: two-pointers
group: Direção Oposta
---

## Enunciado

Dada uma string `s`, considerando apenas caracteres alfanuméricos e ignorando maiúsculas/minúsculas, determine se ela é um palíndromo.

**Exemplo:**
```
Entrada: s = ",abba"
Saída: true (ignorando a vírgula, "abba" é um palíndromo)
```

## Ideia: comparar de fora para dentro

`left` começa no início da string, `right` no final. A cada passo:

- Se o caractere em `left` não é alfanumérico, avançamos `left` (ele não conta para a comparação).
- Se o caractere em `right` não é alfanumérico, recuamos `right`.
- Caso contrário, comparamos os dois caracteres (ignorando caixa). Se forem diferentes, não é palíndromo. Se forem iguais, avançamos `left` e recuamos `right` ao mesmo tempo.

O invariante é o mesmo do par convergente: enquanto não encontrarmos uma diferença, tudo fora do intervalo `[left, right]` já foi confirmado como simétrico.

```visualizer
{
  "title": "valid palindrome — comparando de fora para dentro",
  "code": {
    "lang": "java",
    "content": "public boolean isPalindrome(String s) {\n    int left = 0, right = s.length() - 1;\n\n    while (left < right) {\n        if (!Character.isLetterOrDigit(s.charAt(left))) {\n            left++;\n        } else if (!Character.isLetterOrDigit(s.charAt(right))) {\n            right--;\n        } else if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {\n            return false;\n        } else {\n            left++;\n            right--;\n        }\n    }\n\n    return true;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "s = \",abba\"",
      "array": [",", "a", "b", "b", "a"],
      "steps": [
        { "pointers": { "left": 0, "right": 4 }, "line": 2, "caption": "Inicializamos left = 0 e right = 4 (último índice)." },
        { "pointers": { "left": 0, "right": 4 }, "line": 4, "caption": "left (0) < right (4) → verdadeiro, entramos no laço." },
        { "pointers": { "left": 0, "right": 4 }, "compare": [0], "line": 5, "caption": "s[0] = ',' não é letra nem dígito → verdadeiro, precisamos pular este caractere." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1], "line": 6, "caption": "left++ → left avança para o índice 1, pulando a vírgula." },
        { "pointers": { "left": 1, "right": 4 }, "line": 4, "caption": "left (1) < right (4) → verdadeiro, continuamos." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "line": 5, "caption": "s[1] = 'a' é letra ou dígito → falso, não pulamos pela esquerda." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "line": 7, "caption": "s[4] = 'a' é letra ou dígito → falso, não pulamos pela direita." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "line": 9, "caption": "'a' (minúsculo) != 'a' (minúsculo)? Não são diferentes → caem no else." },
        { "pointers": { "left": 2, "right": 4 }, "compare": [2], "line": 12, "caption": "left++ → left avança para o índice 2." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [3], "line": 13, "caption": "right-- → right recua para o índice 3." },
        { "pointers": { "left": 2, "right": 3 }, "line": 4, "caption": "left (2) < right (3) → verdadeiro, continuamos." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [2, 3], "line": 5, "caption": "s[2] = 'b' é letra ou dígito → falso, não pulamos pela esquerda." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [2, 3], "line": 7, "caption": "s[3] = 'b' é letra ou dígito → falso, não pulamos pela direita." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [2, 3], "line": 9, "caption": "'b' != 'b'? Não são diferentes → caem no else." },
        { "pointers": { "left": 3, "right": 3 }, "compare": [3], "line": 12, "caption": "left++ → left avança para o índice 3." },
        { "pointers": { "left": 3, "right": 2 }, "compare": [2], "line": 13, "caption": "right-- → right recua para o índice 2." },
        { "pointers": { "left": 3, "right": 2 }, "line": 4, "caption": "left (3) < right (2) → falso, o laço termina." },
        { "pointers": {}, "found": true, "line": 17, "caption": "Retornamos true — ignorando a pontuação, \",abba\" é um palíndromo." }
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n) — cada ponteiro percorre a string no máximo uma vez.
- **Espaço:** O(1).

## Erros comuns

- Filtrar e normalizar a string inteira antes de comparar (criando uma nova string) — funciona, mas usa O(n) de espaço extra desnecessário quando os ponteiros já resolvem em O(1).
- Esquecer de ignorar a caixa (maiúsculas/minúsculas) na comparação.
