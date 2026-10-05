---
slug: mapa-lento-rapido
categorySlug: code
title: "Mapa da Família Lento e Rápido"
navTitle: "Fast and Slow Family Map"
summary: "Mapa dos problemas em que dois ponteiros andam em velocidades diferentes e como reconhecê-los."
level: intermediario
order: 28
section: two-pointers
group: Cycle Finding
---

## A ideia central

Dois ponteiros percorrem a mesma estrutura, mas `fast` anda mais rápido que `slow`. A **diferença de velocidade** transforma perguntas sobre estrutura em perguntas sobre encontro:

- Se `fast` chega ao fim, `slow` está na metade.
- Se há ciclo, `fast` acaba alcançando `slow` dentro dele.

## Problemas da família

- [Middle of a Linked List](/category/code/meio-lista-encadeada) — `slow` para no meio quando `fast` termina.
- [Remove N-th Node From End](/category/code/remover-nth-do-fim) — distância fixa entre os ponteiros.
- [Linked List Cycle](/category/code/ciclo-lista-encadeada) — encontro dentro do ciclo prova que ele existe.

## Como reconhecer

- "lista encadeada" + "detectar ciclo" ou "achar o meio" → lento/rápido.
- "sem espaço extra" onde a solução óbvia usa um `HashSet` de nós visitados.
- Sequências que se repetem (ex.: números felizes) também têm ciclo implícito.

## Erros comuns

- Não checar `fast != null && fast.next != null` antes de andar dois passos.
- Começar `fast` e `slow` em posições diferentes sem justificativa.
