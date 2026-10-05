---
slug: container-com-mais-agua
categorySlug: code
title: "Container com Mais Água"
navTitle: Container com Mais Água
summary: Aplicar ponteiros convergentes para encontrar o par de paredes que forma o maior reservatório de água possível.
level: intermediario
order: 15
section: two-pointers
group: Direção Oposta
---

## Enunciado

Você recebe um array `height` de `n` inteiros não-negativos, onde `height[i]` representa a altura de uma parede vertical na posição `i`. Duas paredes, junto com o eixo x, formam um recipiente. Encontre duas paredes que, juntas, armazenem a maior quantidade de água possível, e retorne essa quantidade.

**Exemplo:**
```
Entrada: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Saída: 49
```
A água entre os índices 1 (altura 8) e 8 (altura 7) tem área `min(8, 7) * (8 - 1) = 7 * 7 = 49`.

## Força bruta

Testar todos os pares de paredes `(i, j)` e calcular `min(height[i], height[j]) * (j - i)` para cada um, mantendo o maior valor. São O(n²) pares — funciona, mas é lento para arrays grandes.

## Abordagem com dois ponteiros

Comece com um ponteiro em cada extremidade do array. A área de um par é limitada pela **parede mais baixa** das duas. Isso dá uma pista importante: se mantivermos a parede mais alta fixa e movermos a mais baixa, talvez encontremos algo melhor — mas se movermos a mais alta, a área só pode piorar ou ficar igual (porque a largura diminui e a altura limitante continua sendo a mais baixa, ou pior).

Por isso, a cada passo, **sempre movemos o ponteiro da parede mais baixa** para dentro. Isso descarta, de uma vez, todos os pares que usariam aquela parede baixa com uma largura menor (que já sabemos que não podem superar a área atual).

```visualizer
{
  "title": "container com mais água",
  "code": {
    "lang": "java",
    "content": "public int maxArea(int[] height) {\n    int left = 0, right = height.length - 1;\n    int maxArea = 0;\n\n    while (left < right) {\n        int width = right - left;\n        int area = Math.min(height[left], height[right]) * width;\n        maxArea = Math.max(maxArea, area);\n\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n\n    return maxArea;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Exemplo (array menor, para clareza)",
      "array": [1, 8, 6, 2, 5],
      "steps": [
        { "pointers": { "left": 0, "right": 4 }, "line": 2, "caption": "Inicializamos left = 0 e right = 4." },
        { "pointers": { "left": 0, "right": 4 }, "line": 3, "caption": "maxArea = 0." },
        { "pointers": { "left": 0, "right": 4 }, "line": 5, "caption": "left (0) < right (4) → verdadeiro, entramos no laço." },
        { "pointers": { "left": 0, "right": 4 }, "compare": [0, 4], "line": 6, "caption": "width = right - left = 4 - 0 = 4." },
        { "pointers": { "left": 0, "right": 4 }, "compare": [0, 4], "line": 7, "caption": "area = min(height[0], height[4]) × width = min(1, 5) × 4 = 4." },
        { "pointers": { "left": 0, "right": 4 }, "compare": [0, 4], "line": 8, "caption": "maxArea = max(0, 4) = 4." },
        { "pointers": { "left": 0, "right": 4 }, "compare": [0, 4], "line": 10, "caption": "height[0] (1) < height[4] (5)? Sim." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "eliminated": [0], "line": 11, "caption": "left++ → left agora aponta para o índice 1." },
        { "pointers": { "left": 1, "right": 4 }, "line": 5, "caption": "left (1) < right (4) → verdadeiro, continuamos." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "line": 6, "caption": "width = 4 - 1 = 3." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "line": 7, "caption": "area = min(8, 5) × 3 = 15 (novo máximo)." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "line": 8, "caption": "maxArea = max(4, 15) = 15." },
        { "pointers": { "left": 1, "right": 4 }, "compare": [1, 4], "line": 10, "caption": "height[1] (8) < height[4] (5)? Não." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "eliminated": [0, 4], "line": 13, "caption": "right-- → right agora aponta para o índice 3." },
        { "pointers": { "left": 1, "right": 3 }, "line": 5, "caption": "left (1) < right (3) → verdadeiro, continuamos." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "line": 6, "caption": "width = 3 - 1 = 2." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "line": 7, "caption": "area = min(8, 2) × 2 = 4." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "line": 8, "caption": "maxArea = max(15, 4) = 15 (sem mudança)." },
        { "pointers": { "left": 1, "right": 3 }, "compare": [1, 3], "line": 10, "caption": "height[1] (8) < height[3] (2)? Não." },
        { "pointers": { "left": 1, "right": 2 }, "compare": [1, 2], "eliminated": [0, 3, 4], "line": 13, "caption": "right-- → right agora aponta para o índice 2." },
        { "pointers": { "left": 1, "right": 2 }, "line": 5, "caption": "left (1) < right (2) → verdadeiro, continuamos." },
        { "pointers": { "left": 1, "right": 2 }, "compare": [1, 2], "line": 6, "caption": "width = 2 - 1 = 1." },
        { "pointers": { "left": 1, "right": 2 }, "compare": [1, 2], "line": 7, "caption": "area = min(8, 6) × 1 = 6." },
        { "pointers": { "left": 1, "right": 2 }, "compare": [1, 2], "line": 8, "caption": "maxArea = max(15, 6) = 15 (sem mudança)." },
        { "pointers": { "left": 1, "right": 2 }, "compare": [1, 2], "line": 10, "caption": "height[1] (8) < height[2] (6)? Não." },
        { "pointers": { "left": 1, "right": 1 }, "compare": [1], "eliminated": [0, 2, 3, 4], "line": 13, "caption": "right-- → right encontra left no índice 1." },
        { "pointers": { "left": 1, "right": 1 }, "line": 5, "caption": "left (1) < right (1) → falso, o laço termina." },
        { "pointers": { "left": 1, "right": 1 }, "compare": [1], "found": true, "line": 17, "caption": "Retornamos maxArea = 15." }
      ]
    }
  ]
}
```

## Código

```java
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;

    while (left < right) {
        int width = right - left;
        int area = Math.min(height[left], height[right]) * width;
        maxArea = Math.max(maxArea, area);

        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}
```

## Complexidade

- **Tempo:** O(n) — cada ponteiro percorre o array no máximo uma vez.
- **Espaço:** O(1) — apenas variáveis auxiliares.

## Erros comuns

- Mover o ponteiro da parede mais alta em vez da mais baixa (isso quebra a garantia de que nenhum par melhor está sendo descartado).
- Recalcular a área sem considerar a largura atual (`right - left`), usando apenas as alturas.
