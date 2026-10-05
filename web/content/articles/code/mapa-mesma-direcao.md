---
slug: mapa-mesma-direcao
categorySlug: code
title: "Mapa da Família de Mesma Direção"
navTitle: Mapa da Família de Mesma Direção
summary: Mapa dos problemas que usam ponteiros de mesma direção e como reconhecê-los pelo enunciado.
level: intermediario
order: 7
section: two-pointers
group: Mesma Direção
---

## A ideia central

Nos problemas de mesma direção, os dois ponteiros começam (geralmente) no início da estrutura e avançam para frente — nunca recuam. O que muda entre os problemas é **o que cada ponteiro representa** e **a regra que decide quando cada um avança**.

## Variações desta família

### Ponteiro de escrita + ponteiro de leitura

Um ponteiro (`slow`) marca a próxima posição livre para escrever um resultado; o outro (`fast`) varre a estrutura decidindo o que deve ser escrito ali. Usado para modificações in-place:

- [Remove Duplicates](/category/code/remover-duplicatas) — `slow` marca o fim da porção sem duplicatas; `fast` procura o próximo valor distinto.
- [Move Zeroes](/category/code/mover-zeros) — `slow` marca a próxima posição para um valor não-zero; `fast` procura o próximo valor não-zero.

### Ponteiro lento + ponteiro rápido (listas encadeadas)

O ponteiro `fast` avança duas vezes mais rápido que `slow` (ou o problema usa um ponteiro auxiliar adiantado em N posições). A relação de velocidade (ou distância) entre os dois codifica uma posição relativa na lista:

- [Middle of a Linked List](/category/code/meio-lista-encadeada) — quando `fast` chega ao fim, `slow` está exatamente no meio.
- [Remove N-th Node From End of List](/category/code/remover-nth-do-fim) — um ponteiro adiantado em N posições atinge o fim exatamente quando o outro está no nó a remover.

## Como reconhecer essa família no enunciado

- "Modifique o array in-place" / "sem usar espaço extra O(n)" → forte sinal de ponteiro de escrita + leitura.
- "Lista encadeada", combinado com "sem saber o tamanho de antemão" ou "em uma única passada" → forte sinal de ponteiro lento/rápido.
- Ambas as variações processam a estrutura **uma única vez**, em O(n) — se sua solução envolve múltiplas passadas ou ponteiros que recuam, provavelmente não é esse o padrão certo.
