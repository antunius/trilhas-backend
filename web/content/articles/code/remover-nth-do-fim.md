---
slug: remover-nth-do-fim
categorySlug: code
title: "Remove N-th Node From End of List"
navTitle: Remove N-th Node From End
summary: Remover o n-ésimo nó a partir do fim de uma lista encadeada em uma única passada, adiantando um ponteiro em n posições.
level: intermediario
order: 11
section: two-pointers
group: Mesma Direção
---

## Enunciado

Dada a cabeça de uma lista encadeada e um inteiro `n`, remova o n-ésimo nó a partir do **fim** da lista e retorne a nova cabeça.

**Exemplo:**
```
Entrada: head = 1 -> 2 -> 3 -> 4 -> 5, n = 2
Saída: 1 -> 2 -> 3 -> 5
```

## Força bruta

Percorrer a lista para descobrir seu tamanho `L`, depois percorrê-la de novo até o nó `L - n - 1` para removê-lo. Funciona, mas exige duas passadas.

## Ideia: adiantar um ponteiro em n posições

Se movermos um ponteiro `fast` n posições à frente de `slow` e depois avançarmos os dois juntos até `fast` chegar ao fim, a distância constante de n nós entre eles garante que, quando `fast` chega ao fim, `slow` está exatamente no nó anterior ao que precisa ser removido — tudo em uma única passada.

Usamos um nó **dummy** antes da cabeça (nó 0, valor 0) para simplificar o caso em que o próprio primeiro nó precisa ser removido.

```visualizer
{
  "title": "remove n-th from end — ponteiro adiantado em n posições",
  "code": {
    "lang": "java",
    "content": "public ListNode removeNthFromEnd(ListNode head, int n) {\n    ListNode dummy = new ListNode(0, head);\n    ListNode slow = dummy, fast = dummy;\n\n    for (int i = 0; i < n; i++) {\n        fast = fast.next;\n    }\n\n    while (fast.next != null) {\n        slow = slow.next;\n        fast = fast.next;\n    }\n\n    slow.next = slow.next.next;\n    return dummy.next;\n}"
  },
  "examples": [
    {
      "id": "classico",
      "label": "Lista: 1 -> 2 -> 3 -> 4 -> 5, n = 2",
      "array": [0, 1, 2, 3, 4, 5],
      "steps": [
        { "pointers": {}, "array": [0, 1, 2, 3, 4, 5], "line": 2, "caption": "Criamos um nó dummy (nó 0, valor 0) antes da cabeça: dummy.next = head." },
        { "pointers": { "slow": 0, "fast": 0 }, "line": 3, "caption": "Inicializamos slow = dummy e fast = dummy." },
        { "pointers": { "slow": 0, "fast": 0 }, "line": 5, "caption": "i = 0. Como i < n (0 < 2) é verdadeiro, entramos no laço de adiantamento." },
        { "pointers": { "slow": 0, "fast": 1 }, "compare": [1], "line": 6, "caption": "fast = fast.next → fast avança para o nó 1." },
        { "pointers": { "slow": 0, "fast": 1 }, "line": 5, "caption": "i = 1. Como i < n (1 < 2) é verdadeiro, continuamos." },
        { "pointers": { "slow": 0, "fast": 2 }, "compare": [2], "line": 6, "caption": "fast = fast.next → fast avança para o nó 2." },
        { "pointers": { "slow": 0, "fast": 2 }, "line": 5, "caption": "i = 2. Como i < n (2 < 2) é falso, o laço de adiantamento termina. fast já está n nós à frente de slow." },
        { "pointers": { "slow": 0, "fast": 2 }, "line": 9, "caption": "fast.next != null? O nó 2 tem próximo (nó 3) → verdadeiro." },
        { "pointers": { "slow": 1, "fast": 2 }, "compare": [1], "line": 10, "caption": "slow = slow.next → slow avança para o nó 1." },
        { "pointers": { "slow": 1, "fast": 3 }, "compare": [3], "line": 11, "caption": "fast = fast.next → fast avança para o nó 3." },
        { "pointers": { "slow": 1, "fast": 3 }, "line": 9, "caption": "fast.next != null? O nó 3 tem próximo (nó 4) → verdadeiro." },
        { "pointers": { "slow": 2, "fast": 3 }, "compare": [2], "line": 10, "caption": "slow = slow.next → slow avança para o nó 2." },
        { "pointers": { "slow": 2, "fast": 4 }, "compare": [4], "line": 11, "caption": "fast = fast.next → fast avança para o nó 4." },
        { "pointers": { "slow": 2, "fast": 4 }, "line": 9, "caption": "fast.next != null? O nó 4 tem próximo (nó 5) → verdadeiro." },
        { "pointers": { "slow": 3, "fast": 4 }, "compare": [3], "line": 10, "caption": "slow = slow.next → slow avança para o nó 3." },
        { "pointers": { "slow": 3, "fast": 5 }, "compare": [5], "line": 11, "caption": "fast = fast.next → fast avança para o nó 5." },
        { "pointers": { "slow": 3, "fast": 5 }, "line": 9, "caption": "fast.next != null? O nó 5 é o último — fast.next é null → falso, o laço termina. slow está logo antes do nó a remover." },
        { "pointers": { "slow": 3 }, "compare": [3], "eliminated": [4], "line": 14, "caption": "slow.next = slow.next.next → o nó 4 (valor 4) é removido; o nó 3 passa a apontar direto para o nó 5." },
        { "pointers": {}, "found": true, "line": 15, "caption": "Retornamos dummy.next — a nova lista é 1 -> 2 -> 3 -> 5." }
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(L) — uma única passada, onde L é o tamanho da lista.
- **Espaço:** O(1) (fora o nó dummy).

## Erros comuns

- Não usar um nó dummy e esquecer de tratar separadamente o caso em que o nó a remover é a própria cabeça.
- Adiantar `fast` em `n` posições a partir de `head` em vez de a partir de `dummy` — isso desloca a distância final entre `slow` e o nó a remover.
