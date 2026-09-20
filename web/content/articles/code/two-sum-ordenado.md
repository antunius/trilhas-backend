---
slug: two-sum-ordenado
categorySlug: code
title: "Two Sum Sorted"
navTitle: Two Sum Sorted
summary: Encontrar um par que soma um alvo em um array ordenado, usando ponteiros convergentes para eliminar pares em O(n).
level: intermediario
order: 13
section: two-pointers
group: Direção Oposta
---

## Enunciado

Dado um array `nums` ordenado em ordem crescente e um `target`, determine se existe um par de números cuja soma seja igual a `target`.

**Exemplo:**
```
Entrada: nums = [1, 3, 4, 6, 8, 10, 13], target = 13
Saída: true (3 + 10 = 13)
```

## Força bruta

Testar todos os pares com dois loops aninhados — O(n²) pares considerados.

## Abordagem com ponteiros convergentes

O array estar ordenado nos dá uma informação valiosa: se um par tem soma grande demais, todo par "parecido" (com um dos lados ainda maior) também terá soma grande demais. Isso permite **eliminar vários pares de uma vez**, sem testá-los individualmente — exatamente o invariante descrito na [Introduction](/category/code/two-pointers).

Colocamos um ponteiro em cada extremidade do array. A cada passo:

- Se a soma atual é maior que o alvo, `right` recua (a única forma de diminuir a soma).
- Se a soma atual é menor que o alvo, `left` avança (a única forma de aumentar a soma).
- Se a soma é igual ao alvo, encontramos o par.

```visualizer
{
  "title": "two sum ordenado — ponteiros convergentes",
  "code": {
    "lang": "java",
    "content": "public boolean isPairSum(int[] nums, int target) {\n    int left = 0, right = nums.length - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if (sum == target) {\n            return true;\n        } else if (sum > target) {\n            right--;\n        } else {\n            left++;\n        }\n    }\n    return false;\n}"
  },
  "examples": [
    {
      "id": "tem-par",
      "label": "Tem par (target = 13)",
      "array": [1, 3, 4, 6, 8, 10, 13],
      "target": 13,
      "steps": [
        { "pointers": { "left": 0, "right": 6 }, "line": 2, "caption": "Inicializamos left = 0 e right = 6 (último índice)." },
        { "pointers": { "left": 0, "right": 6 }, "line": 3, "caption": "left (0) < right (6) → verdadeiro, entramos no laço." },
        { "pointers": { "left": 0, "right": 6 }, "compare": [0, 6], "line": 4, "caption": "sum = nums[0] + nums[6] = 1 + 13 = 14." },
        { "pointers": { "left": 0, "right": 6 }, "compare": [0, 6], "line": 5, "caption": "14 == 13? Não." },
        { "pointers": { "left": 0, "right": 6 }, "compare": [0, 6], "line": 7, "caption": "14 > 13? Sim → entramos neste ramo." },
        { "pointers": { "left": 0, "right": 5 }, "compare": [0, 5], "eliminated": [6], "line": 8, "caption": "right-- → right agora aponta para o índice 5." },
        { "pointers": { "left": 0, "right": 5 }, "line": 3, "caption": "left (0) < right (5) → verdadeiro, continuamos." },
        { "pointers": { "left": 0, "right": 5 }, "compare": [0, 5], "line": 4, "caption": "sum = nums[0] + nums[5] = 1 + 10 = 11." },
        { "pointers": { "left": 0, "right": 5 }, "compare": [0, 5], "line": 5, "caption": "11 == 13? Não." },
        { "pointers": { "left": 0, "right": 5 }, "compare": [0, 5], "line": 7, "caption": "11 > 13? Não." },
        { "pointers": { "left": 1, "right": 5 }, "compare": [1, 5], "eliminated": [0, 6], "line": 10, "caption": "left++ → left agora aponta para o índice 1." },
        { "pointers": { "left": 1, "right": 5 }, "line": 3, "caption": "left (1) < right (5) → verdadeiro, continuamos." },
        { "pointers": { "left": 1, "right": 5 }, "compare": [1, 5], "line": 4, "caption": "sum = nums[1] + nums[5] = 3 + 10 = 13." },
        { "pointers": { "left": 1, "right": 5 }, "compare": [1, 5], "line": 5, "caption": "13 == 13? Sim!" },
        { "pointers": { "left": 1, "right": 5 }, "compare": [1, 5], "eliminated": [0, 6], "found": true, "line": 6, "caption": "Retornamos true — par encontrado: 3 + 10 = 13." }
      ]
    },
    {
      "id": "sem-par",
      "label": "Sem par (target = 100)",
      "array": [2, 4, 6, 8],
      "target": 100,
      "steps": [
        { "pointers": { "left": 0, "right": 3 }, "line": 2, "caption": "Inicializamos left = 0 e right = 3." },
        { "pointers": { "left": 0, "right": 3 }, "line": 3, "caption": "left (0) < right (3) → verdadeiro, entramos no laço." },
        { "pointers": { "left": 0, "right": 3 }, "compare": [0, 3], "line": 4, "caption": "sum = nums[0] + nums[3] = 2 + 8 = 10." },
        { "pointers": { "left": 0, "right": 3 }, "compare": [0, 3], "line": 5, "caption": "10 == 100? Não." },
        { "pointers": { "left": 0, "right": 3 }, "compare": [0, 3], "line": 7, "caption": "10 > 100? Não." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "eliminated": [0], "line": 10, "caption": "left++ → left agora aponta para o índice 1." },
        { "pointers": { "left": 1, "right": 3 }, "line": 3, "caption": "left (1) < right (3) → verdadeiro, continuamos." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "line": 4, "caption": "sum = nums[1] + nums[3] = 4 + 8 = 12." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "line": 5, "caption": "12 == 100? Não." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "line": 7, "caption": "12 > 100? Não." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [2, 3], "eliminated": [0, 1], "line": 10, "caption": "left++ → left agora aponta para o índice 2." },
        { "pointers": { "left": 2, "right": 3 }, "line": 3, "caption": "left (2) < right (3) → verdadeiro, continuamos." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [2, 3], "line": 4, "caption": "sum = nums[2] + nums[3] = 6 + 8 = 14." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [2, 3], "line": 5, "caption": "14 == 100? Não." },
        { "pointers": { "left": 2, "right": 3 }, "compare": [2, 3], "line": 7, "caption": "14 > 100? Não." },
        { "pointers": { "left": 3, "right": 3 }, "compare": [3], "eliminated": [0, 1, 2], "line": 10, "caption": "left++ → left encontra right no índice 3." },
        { "pointers": { "left": 3, "right": 3 }, "line": 3, "caption": "left (3) < right (3) → falso, o laço termina." },
        { "pointers": { "left": 3, "right": 3 }, "compare": [3], "line": 13, "caption": "Retornamos false — não existe par que some 100." }
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n) — cada ponteiro percorre o array no máximo uma vez.
- **Espaço:** O(1).

## Erros comuns

- Tentar aplicar essa técnica em um array não ordenado sem primeiro considerar ordená-lo.
- Mover o ponteiro errado: quando a soma é maior que o alvo, é `right` que deve recuar, nunca `left`.
