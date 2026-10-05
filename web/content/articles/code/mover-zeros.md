---
slug: mover-zeros
categorySlug: code
title: "Move Zeroes"
navTitle: Move Zeroes
summary: Usar dois ponteiros na mesma direção (lento/rápido) para mover zeros ao fim do array in-place, preservando a ordem relativa.
level: iniciante
order: 10
section: two-pointers
group: Mesma Direção
---

## Enunciado

Dado um array de inteiros `nums`, mova todos os `0`s para o final, mantendo a ordem relativa dos elementos não-zero. Faça isso **in-place**, sem copiar o array.

**Exemplo:**
```
Entrada: nums = [0, 1, 0, 3, 12]
Saída: [1, 3, 12, 0, 0]
```

## Ideia: ponteiros na mesma direção

Diferente dos problemas anteriores, aqui os dois ponteiros não convergem — eles avançam **na mesma direção**, mas com papéis diferentes:

- `slow` marca a próxima posição livre para receber um elemento não-zero.
- `fast` varre o array procurando elementos não-zero.

Sempre que `fast` encontra um valor diferente de zero, trocamos `nums[slow]` com `nums[fast]` e avançamos `slow`. Isso empurra os não-zeros para o começo do array, na ordem em que aparecem, e empurra os zeros para o final — tudo em uma única passada.

```visualizer
{
  "title": "move zeroes — ponteiro lento e ponteiro rápido",
  "code": {
    "lang": "java",
    "content": "public void moveZeroes(int[] nums) {\n    int slow = 0;\n\n    for (int fast = 0; fast < nums.length; fast++) {\n        if (nums[fast] != 0) {\n            int temp = nums[slow];\n            nums[slow] = nums[fast];\n            nums[fast] = temp;\n            slow++;\n        }\n    }\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Exemplo",
      "array": [0, 1, 0, 3, 12],
      "steps": [
        { "pointers": { "slow": 0 }, "array": [0, 1, 0, 3, 12], "line": 2, "caption": "Inicializamos slow = 0." },
        { "pointers": { "slow": 0, "fast": 0 }, "array": [0, 1, 0, 3, 12], "line": 4, "caption": "Inicializamos fast = 0." },
        { "pointers": { "slow": 0, "fast": 0 }, "array": [0, 1, 0, 3, 12], "compare": [0], "line": 5, "caption": "nums[0] != 0? Não (é zero) → pulamos o bloco." },
        { "pointers": { "slow": 0, "fast": 1 }, "array": [0, 1, 0, 3, 12], "line": 4, "caption": "fast++ → fast = 1." },
        { "pointers": { "slow": 0, "fast": 1 }, "array": [0, 1, 0, 3, 12], "compare": [0, 1], "line": 5, "caption": "nums[1] != 0? Sim." },
        { "pointers": { "slow": 0, "fast": 1 }, "array": [0, 1, 0, 3, 12], "compare": [0, 1], "line": 6, "caption": "temp = nums[slow] = nums[0] = 0." },
        { "pointers": { "slow": 0, "fast": 1 }, "array": [1, 1, 0, 3, 12], "compare": [0, 1], "line": 7, "caption": "nums[slow] = nums[fast] → nums[0] = 1." },
        { "pointers": { "slow": 0, "fast": 1 }, "array": [1, 0, 0, 3, 12], "compare": [0, 1], "line": 8, "caption": "nums[fast] = temp → nums[1] = 0." },
        { "pointers": { "slow": 1, "fast": 1 }, "array": [1, 0, 0, 3, 12], "compare": [1], "line": 9, "caption": "slow++ → slow = 1." },
        { "pointers": { "slow": 1, "fast": 2 }, "array": [1, 0, 0, 3, 12], "line": 4, "caption": "fast++ → fast = 2." },
        { "pointers": { "slow": 1, "fast": 2 }, "array": [1, 0, 0, 3, 12], "compare": [1, 2], "line": 5, "caption": "nums[2] != 0? Não → pulamos." },
        { "pointers": { "slow": 1, "fast": 3 }, "array": [1, 0, 0, 3, 12], "line": 4, "caption": "fast++ → fast = 3." },
        { "pointers": { "slow": 1, "fast": 3 }, "array": [1, 0, 0, 3, 12], "compare": [1, 3], "line": 5, "caption": "nums[3] != 0? Sim." },
        { "pointers": { "slow": 1, "fast": 3 }, "array": [1, 0, 0, 3, 12], "compare": [1, 3], "line": 6, "caption": "temp = nums[slow] = nums[1] = 0." },
        { "pointers": { "slow": 1, "fast": 3 }, "array": [1, 3, 0, 3, 12], "compare": [1, 3], "line": 7, "caption": "nums[slow] = nums[fast] → nums[1] = 3." },
        { "pointers": { "slow": 1, "fast": 3 }, "array": [1, 3, 0, 0, 12], "compare": [1, 3], "line": 8, "caption": "nums[fast] = temp → nums[3] = 0." },
        { "pointers": { "slow": 2, "fast": 3 }, "array": [1, 3, 0, 0, 12], "compare": [2], "line": 9, "caption": "slow++ → slow = 2." },
        { "pointers": { "slow": 2, "fast": 4 }, "array": [1, 3, 0, 0, 12], "line": 4, "caption": "fast++ → fast = 4." },
        { "pointers": { "slow": 2, "fast": 4 }, "array": [1, 3, 0, 0, 12], "compare": [2, 4], "line": 5, "caption": "nums[4] != 0? Sim." },
        { "pointers": { "slow": 2, "fast": 4 }, "array": [1, 3, 0, 0, 12], "compare": [2, 4], "line": 6, "caption": "temp = nums[slow] = nums[2] = 0." },
        { "pointers": { "slow": 2, "fast": 4 }, "array": [1, 3, 12, 0, 12], "compare": [2, 4], "line": 7, "caption": "nums[slow] = nums[fast] → nums[2] = 12." },
        { "pointers": { "slow": 2, "fast": 4 }, "array": [1, 3, 12, 0, 0], "compare": [2, 4], "line": 8, "caption": "nums[fast] = temp → nums[4] = 0." },
        { "pointers": { "slow": 3, "fast": 4 }, "array": [1, 3, 12, 0, 0], "compare": [3], "line": 9, "caption": "slow++ → slow = 3." },
        { "pointers": { "slow": 3, "fast": 5 }, "array": [1, 3, 12, 0, 0], "found": true, "line": 4, "caption": "fast++ → fast = 5. Como 5 < 5 é falso, o laço termina. Array final: [1, 3, 12, 0, 0]." }
      ]
    }
  ]
}
```

## Código

```java
public void moveZeroes(int[] nums) {
    int slow = 0;

    for (int fast = 0; fast < nums.length; fast++) {
        if (nums[fast] != 0) {
            int temp = nums[slow];
            nums[slow] = nums[fast];
            nums[fast] = temp;
            slow++;
        }
    }
}
```

## Complexidade

- **Tempo:** O(n) — uma única passada com `fast`.
- **Espaço:** O(1) — a troca é feita in-place.

## Erros comuns

- Criar um array auxiliar em vez de resolver in-place (funciona, mas não é o que o problema pede e usa espaço extra desnecessário).
- Avançar `slow` mesmo quando `nums[fast]` é zero, o que sobrescreveria elementos não-zero incorretamente.
