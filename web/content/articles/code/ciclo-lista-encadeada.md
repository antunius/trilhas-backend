---
slug: ciclo-lista-encadeada
categorySlug: code
title: "Linked List Cycle"
navTitle: "Linked List Cycle"
summary: "Detectar ciclo em lista encadeada com dois ponteiros de velocidades diferentes, em O(1) de espaço."
level: iniciante
order: 29
section: two-pointers
group: Cycle Finding
---

## Enunciado

Dada a cabeça de uma lista encadeada, retorne `true` se ela tem um **ciclo** (algum nó aponta de volta para um nó anterior).

```
3 → 2 → 0 → -4 → (volta ao nó 2)   → true
1 → 2 → 3 → 4 → null               → false
```

## Força bruta

Guardar os nós visitados em um `HashSet` e retornar `true` ao repetir um: O(n) tempo, **O(n) espaço**.

## Abordagem

`slow` anda 1 nó, `fast` anda 2. Sem ciclo, `fast` chega ao `null`. Com ciclo, os dois entram nele e `fast` ganha 1 nó de distância por passo, então **inevitavelmente encontra `slow`**.

```visualizer
{
  "title": "linked list cycle — lento e rápido",
  "code": {
    "lang": "java",
    "content": "public boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}"
  },
  "examples": [
    {
      "id": "com-ciclo",
      "label": "Lista 3 → 2 → 0 → -4 → (volta ao nó 1)",
      "array": [3, 2, 0, -4],
      "steps": [
        {"pointers": {"slow": 0, "fast": 0}, "compare": [0], "line": 2, "caption": "slow e fast começam na cabeça da lista."},
        {"pointers": {"slow": 0, "fast": 0}, "compare": [0], "line": 3, "caption": "fast (0) e fast.next não são nulos → continuamos."},
        {"pointers": {"slow": 1, "fast": 0}, "compare": [1], "line": 4, "caption": "slow avança 1 nó → nó 1."},
        {"pointers": {"slow": 1, "fast": 2}, "compare": [2], "line": 5, "caption": "fast avança 2 nós → nó 2."},
        {"pointers": {"slow": 1, "fast": 2}, "line": 6, "caption": "slow != fast → seguimos."},
        {"pointers": {"slow": 1, "fast": 2}, "compare": [2], "line": 3, "caption": "fast (2) e fast.next não são nulos → continuamos."},
        {"pointers": {"slow": 2, "fast": 2}, "compare": [2], "line": 4, "caption": "slow avança 1 nó → nó 2."},
        {"pointers": {"slow": 2, "fast": 1}, "compare": [1], "line": 5, "caption": "fast avança 2 nós → nó 1."},
        {"pointers": {"slow": 2, "fast": 1}, "line": 6, "caption": "slow != fast → seguimos."},
        {"pointers": {"slow": 2, "fast": 1}, "compare": [1], "line": 3, "caption": "fast (1) e fast.next não são nulos → continuamos."},
        {"pointers": {"slow": 3, "fast": 1}, "compare": [3], "line": 4, "caption": "slow avança 1 nó → nó 3."},
        {"pointers": {"slow": 3, "fast": 3}, "compare": [3], "line": 5, "caption": "fast avança 2 nós → nó 3."},
        {"pointers": {"slow": 3, "fast": 3}, "compare": [3], "found": true, "line": 6, "caption": "slow == fast no nó 3 → só pode acontecer se houver ciclo."}
      ]
    },
    {
      "id": "sem-ciclo",
      "label": "Lista 1 → 2 → 3 → 4 → null",
      "array": [1, 2, 3, 4],
      "steps": [
        {"pointers": {"slow": 0, "fast": 0}, "compare": [0], "line": 2, "caption": "slow e fast começam na cabeça da lista."},
        {"pointers": {"slow": 0, "fast": 0}, "compare": [0], "line": 3, "caption": "fast (0) e fast.next não são nulos → continuamos."},
        {"pointers": {"slow": 1, "fast": 0}, "compare": [1], "line": 4, "caption": "slow avança 1 nó → nó 1."},
        {"pointers": {"slow": 1, "fast": 2}, "compare": [2], "line": 5, "caption": "fast avança 2 nós → nó 2."},
        {"pointers": {"slow": 1, "fast": 2}, "line": 6, "caption": "slow != fast → seguimos."},
        {"pointers": {"slow": 1, "fast": 2}, "compare": [2], "line": 3, "caption": "fast (2) e fast.next não são nulos → continuamos."},
        {"pointers": {"slow": 2, "fast": 2}, "compare": [2], "line": 4, "caption": "slow avança 1 nó → nó 2."},
        {"pointers": {"slow": 2, "fast": 2}, "line": 5, "caption": "fast avança 2 nós → chegou ao fim (null)."},
        {"pointers": {"slow": 2, "fast": 2}, "line": 6, "caption": "slow != fast → seguimos."},
        {"pointers": {"slow": 2, "fast": 2}, "found": true, "line": 8, "caption": "fast chegou ao fim da lista: não há ciclo → false."}
      ]
    }
  ]
}
```

## Complexidade

- **Tempo:** O(n).
- **Espaço:** O(1).

## Erros comuns

- Acessar `fast.next.next` sem checar `fast.next`.
- Comparar valores (`slow.val == fast.val`) em vez de nós.
