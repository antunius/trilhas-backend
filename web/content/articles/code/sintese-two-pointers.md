---
slug: sintese-two-pointers
categorySlug: code
title: "Two Pointers Synthesis"
navTitle: "Two Pointers Synthesis"
summary: "Síntese de todas as variações de dois ponteiros, com o invariante de cada uma."
level: avancado
order: 33
section: two-pointers
group: Advanced
---

## Visão geral

| Variação | Ponteiros | Invariante | Custo |
|---|---|---|---|
| Escrita + leitura | mesma direção | `[0, slow)` já está no estado final | O(n) |
| Lento e rápido | velocidades diferentes | posição relativa codifica a resposta | O(n) |
| Direção oposta | extremos → centro | o par ótimo está dentro de `[left, right]` | O(n) |
| Janela fixa | `right - left + 1 = k` | métrica = soma dos `k` últimos | O(n) |
| Janela variável | `left ≤ right` | janela é válida após o `while` | O(n) |
| Prefix sum | um índice + acumulado | `prefix[i]` = resumo de `[0, i)` | O(n) |

## Fio condutor

Todas as variações trocam **uma busca em O(n²)** por um invariante que permite **descartar candidatos** em bloco.

- Direção oposta: descarta todos os pares com a parede mais baixa.
- Janela: descarta todos os inícios antes de `left`.
- Prefix sum: descarta a recomputação de somas parciais.

## Checklist antes de codar

1. Qual é o invariante, em uma frase?
2. O que cada movimento de ponteiro descarta, e por que é seguro?
3. Quando o laço termina?
4. Casos de borda: vazio, um elemento, tudo igual, negativos.

Revise: [Regra de decisão](/category/code/regra-decisao-two-pointers) e [Mapa Sliding Window](/category/code/mapa-sliding-window).
