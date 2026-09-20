---
slug: meio-lista-encadeada
categorySlug: code
title: "Middle of a Linked List"
navTitle: Middle of a Linked List
summary: Encontrar o nó do meio de uma lista encadeada em uma única passada, usando um ponteiro lento e um ponteiro rápido.
level: iniciante
order: 9
section: two-pointers
group: Mesma Direção
---

## Enunciado

Dada a cabeça de uma lista encadeada, retorne o nó do meio. Se houver dois nós do meio (lista de tamanho par), retorne o segundo.

**Exemplo:**
```
Entrada: head = 1 -> 2 -> 3 -> 4 -> 5
Saída: nó com valor 3
```

## Força bruta

Percorrer a lista uma vez para contar o tamanho `n`, depois percorrê-la de novo até a posição `n / 2`. Funciona, mas exige duas passadas — e a segunda só é possível porque a primeira já revelou o tamanho.

## Ideia: ponteiro lento e ponteiro rápido

`fast` avança dois nós por vez enquanto `slow` avança um nó por vez. Como `fast` percorre o dobro da distância de `slow` no mesmo número de passos, quando `fast` chega ao fim da lista, `slow` está exatamente na metade — tudo em uma única passada, sem precisar saber o tamanho de antemão.

Na visualização abaixo, cada célula representa um **nó** da lista (o valor dentro dele), não um índice de array — mas o comportamento dos ponteiros é idêntico ao de um array.

```visualizer
{
  "title": "middle of a linked list — ponteiro lento e rápido",
  "code": {
    "lang": "java",
    "content": "public ListNode middleNode(ListNode head) {\n    ListNode slow = head, fast = head;\n\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n\n    return slow;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Lista: 1 -> 2 -> 3 -> 4 -> 5",
      "array": [1, 2, 3, 4, 5],
      "steps": [
        { "pointers": { "slow": 0, "fast": 0 }, "line": 2, "caption": "Inicializamos slow = head e fast = head (ambos no nó 0)." },
        { "pointers": { "slow": 0, "fast": 0 }, "compare": [0], "line": 4, "caption": "fast != null e fast.next != null? O nó 0 tem próximo (nó 1) → verdadeiro." },
        { "pointers": { "slow": 1, "fast": 0 }, "compare": [1], "line": 5, "caption": "slow = slow.next → slow avança para o nó 1." },
        { "pointers": { "slow": 1, "fast": 2 }, "compare": [2], "line": 6, "caption": "fast = fast.next.next → fast avança dois nós, para o nó 2." },
        { "pointers": { "slow": 1, "fast": 2 }, "compare": [2], "line": 4, "caption": "fast != null e fast.next != null? O nó 2 tem próximo (nó 3) → verdadeiro." },
        { "pointers": { "slow": 2, "fast": 2 }, "compare": [2], "line": 5, "caption": "slow = slow.next → slow avança para o nó 2." },
        { "pointers": { "slow": 2, "fast": 4 }, "compare": [4], "line": 6, "caption": "fast = fast.next.next → fast avança dois nós, para o nó 4." },
        { "pointers": { "slow": 2, "fast": 4 }, "compare": [4], "line": 4, "caption": "fast != null e fast.next != null? O nó 4 é o último — fast.next é null → falso, o laço termina." },
        { "pointers": { "slow": 2 }, "compare": [2], "found": true, "line": 9, "caption": "Retornamos slow — o nó do meio é o nó de valor 3." }
      ]
    }
  ]
}
```

## Código

```java
public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}
```

## Complexidade

- **Tempo:** O(n) — uma única passada.
- **Espaço:** O(1).

## Erros comuns

- Checar apenas `fast != null` na condição do laço, sem checar `fast.next != null` — isso causa um `NullPointerException` ao acessar `fast.next.next` quando a lista tem tamanho par.
- Tentar resolver com duas passadas quando uma única passada com dois ponteiros já resolve, e é o que normalmente se espera em entrevista.
