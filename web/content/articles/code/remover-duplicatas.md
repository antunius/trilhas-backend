---
slug: remover-duplicatas
categorySlug: code
title: "Remove Duplicates"
navTitle: Remove Duplicates
summary: Remover duplicatas de um array ordenado in-place, usando um ponteiro de escrita e um ponteiro de leitura.
level: iniciante
order: 8
section: two-pointers
group: Mesma Direção
---

## Enunciado

Dado um array `nums` ordenado em ordem crescente, remova as duplicatas **in-place** de forma que cada elemento apareça apenas uma vez. Retorne o número `k` de elementos únicos; os primeiros `k` elementos de `nums` devem conter esses valores, na ordem original.

**Exemplo:**
```
Entrada: nums = [1, 1, 2, 2, 3]
Saída: k = 3, nums = [1, 2, 3, _, _]
```

## Ideia: ponteiro de escrita e ponteiro de leitura

`slow` aponta sempre para o último valor único já colocado no array; `fast` varre o array procurando o próximo valor diferente de `nums[slow]`. Como o array está ordenado, todo valor igual a `nums[slow]` é necessariamente uma duplicata consecutiva — basta ignorá-lo. Quando `fast` encontra um valor diferente, avançamos `slow` e copiamos esse valor para lá.

```visualizer
{
  "title": "remove duplicates — ponteiro de escrita e leitura",
  "code": {
    "lang": "java",
    "content": "public int removeDuplicates(int[] nums) {\n    int slow = 0;\n\n    for (int fast = 1; fast < nums.length; fast++) {\n        if (nums[fast] != nums[slow]) {\n            slow++;\n            nums[slow] = nums[fast];\n        }\n    }\n\n    return slow + 1;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Exemplo",
      "array": [1, 1, 2, 2, 3],
      "steps": [
        { "pointers": { "slow": 0 }, "array": [1, 1, 2, 2, 3], "line": 2, "caption": "Inicializamos slow = 0 (aponta para o último valor único colocado)." },
        { "pointers": { "slow": 0, "fast": 1 }, "array": [1, 1, 2, 2, 3], "line": 4, "caption": "Inicializamos fast = 1." },
        { "pointers": { "slow": 0, "fast": 1 }, "array": [1, 1, 2, 2, 3], "compare": [0, 1], "line": 5, "caption": "nums[1] != nums[0]? 1 != 1 → falso, é duplicata. Pulamos o bloco." },
        { "pointers": { "slow": 0, "fast": 2 }, "array": [1, 1, 2, 2, 3], "line": 4, "caption": "fast++ → fast = 2." },
        { "pointers": { "slow": 0, "fast": 2 }, "array": [1, 1, 2, 2, 3], "compare": [0, 2], "line": 5, "caption": "nums[2] != nums[0]? 2 != 1 → verdadeiro." },
        { "pointers": { "slow": 1, "fast": 2 }, "array": [1, 1, 2, 2, 3], "compare": [1, 2], "line": 6, "caption": "slow++ → slow = 1." },
        { "pointers": { "slow": 1, "fast": 2 }, "array": [1, 2, 2, 2, 3], "compare": [1, 2], "line": 7, "caption": "nums[slow] = nums[fast] → nums[1] = 2." },
        { "pointers": { "slow": 1, "fast": 3 }, "array": [1, 2, 2, 2, 3], "line": 4, "caption": "fast++ → fast = 3." },
        { "pointers": { "slow": 1, "fast": 3 }, "array": [1, 2, 2, 2, 3], "compare": [1, 3], "line": 5, "caption": "nums[3] != nums[1]? 2 != 2 → falso, é duplicata. Pulamos." },
        { "pointers": { "slow": 1, "fast": 4 }, "array": [1, 2, 2, 2, 3], "line": 4, "caption": "fast++ → fast = 4." },
        { "pointers": { "slow": 1, "fast": 4 }, "array": [1, 2, 2, 2, 3], "compare": [1, 4], "line": 5, "caption": "nums[4] != nums[1]? 3 != 2 → verdadeiro." },
        { "pointers": { "slow": 2, "fast": 4 }, "array": [1, 2, 2, 2, 3], "compare": [2, 4], "line": 6, "caption": "slow++ → slow = 2." },
        { "pointers": { "slow": 2, "fast": 4 }, "array": [1, 2, 3, 2, 3], "compare": [2, 4], "line": 7, "caption": "nums[slow] = nums[fast] → nums[2] = 3." },
        { "pointers": { "slow": 2, "fast": 5 }, "array": [1, 2, 3, 2, 3], "line": 4, "caption": "fast++ → fast = 5. Como 5 < 5 é falso, o laço termina." },
        { "pointers": { "slow": 2 }, "array": [1, 2, 3, 2, 3], "found": true, "line": 11, "caption": "Retornamos slow + 1 = 3. Os 3 primeiros elementos são os únicos: [1, 2, 3]." }
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n) — uma única passada com `fast`.
- **Espaço:** O(1) — a modificação é feita in-place.

## Erros comuns

- Comparar `nums[fast]` com `nums[fast - 1]` em vez de `nums[slow]` — funciona neste problema por coincidência, mas quebra a intenção do invariante e é mais difícil de generalizar.
- Esquecer que o array precisa estar ordenado para que "duplicata" signifique "valor igual ao anterior imediato".
