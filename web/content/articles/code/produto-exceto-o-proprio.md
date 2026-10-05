---
slug: produto-exceto-o-proprio
categorySlug: code
title: "Product of Array Except Self"
navTitle: "Product of Array Except Self"
summary: "Prefixos e sufixos de produto para calcular, sem divisão, o produto de todos os elementos exceto o atual."
level: intermediario
order: 27
section: two-pointers
group: Prefix Sum
---

## Enunciado

Dado `nums`, retorne `out` onde `out[i]` é o produto de todos os elementos exceto `nums[i]`. **Sem usar divisão**, em O(n).

```
Entrada: nums = [1, 2, 3, 4]
Saída: [24, 12, 8, 6]
```

## Ideia

O produto sem `nums[i]` é `(produto à esquerda de i) × (produto à direita de i)`. É um prefix sum, só que com multiplicação e nas duas direções.

1. Primeira passada (esquerda → direita): `out[i]` = produto de tudo à esquerda.
2. Segunda passada (direita → esquerda): mantenha `suffix` e multiplique `out[i] *= suffix`.

Assim não precisamos de um segundo array: reaproveitamos `out`.

```visualizer
{
  "title": "product of array except self — prefixo × sufixo",
  "code": {
    "lang": "java",
    "content": "public int[] productExceptSelf(int[] nums) {\n    int n = nums.length;\n    int[] out = new int[n];\n    out[0] = 1;\n    for (int i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];\n    int suffix = 1;\n    for (int i = n - 1; i >= 0; i--) {\n        out[i] *= suffix;\n        suffix *= nums[i];\n    }\n    return out;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "nums = [1, 2, 3, 4]  (a tela mostra out[] sendo preenchido)",
      "array": [1, 2, 3, 4],
      "steps": [
        {"pointers": {"i": 0}, "compare": [0], "array": [1, 0, 0, 0], "line": 4, "caption": "out[i] vai guardar o produto de tudo à ESQUERDA de i. À esquerda de 0 não há nada: 1."},
        {"pointers": {"i": 1}, "compare": [0, 1], "array": [1, 1, 0, 0], "line": 5, "caption": "out[1] = out[0] × nums[0] = 1."},
        {"pointers": {"i": 2}, "compare": [1, 2], "array": [1, 1, 2, 0], "line": 5, "caption": "out[2] = out[1] × nums[1] = 2."},
        {"pointers": {"i": 3}, "compare": [2, 3], "array": [1, 1, 2, 6], "line": 5, "caption": "out[3] = out[2] × nums[2] = 6."},
        {"pointers": {"i": 3}, "compare": [3], "array": [1, 1, 2, 6], "line": 8, "caption": "out[3] × suffix (1) = 6: esquerda × direita."},
        {"pointers": {"i": 3}, "compare": [3], "array": [1, 1, 2, 6], "line": 9, "caption": "suffix passa a ser 4 (produto de tudo de 3 em diante)."},
        {"pointers": {"i": 2}, "compare": [2], "array": [1, 1, 8, 6], "line": 8, "caption": "out[2] × suffix (4) = 8: esquerda × direita."},
        {"pointers": {"i": 2}, "compare": [2], "array": [1, 1, 8, 6], "line": 9, "caption": "suffix passa a ser 12 (produto de tudo de 2 em diante)."},
        {"pointers": {"i": 1}, "compare": [1], "array": [1, 12, 8, 6], "line": 8, "caption": "out[1] × suffix (12) = 12: esquerda × direita."},
        {"pointers": {"i": 1}, "compare": [1], "array": [1, 12, 8, 6], "line": 9, "caption": "suffix passa a ser 24 (produto de tudo de 1 em diante)."},
        {"pointers": {"i": 0}, "compare": [0], "array": [24, 12, 8, 6], "line": 8, "caption": "out[0] × suffix (24) = 24: esquerda × direita."},
        {"pointers": {"i": 0}, "compare": [0], "array": [24, 12, 8, 6], "line": 9, "caption": "suffix passa a ser 24 (produto de tudo de 0 em diante)."},
        {"pointers": {"i": 0}, "found": true, "array": [24, 12, 8, 6], "line": 11, "caption": "Resultado: [24, 12, 8, 6]."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(1) extra (a saída não conta).

## Erros comuns

- Dividir pelo total: quebra com zeros.
- Inicializar `out[0]` com 0 em vez de 1 (o produto vazio é 1).
- Atualizar `suffix` antes de usá-lo em `out[i]`.
