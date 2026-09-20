---
slug: mapa-sliding-window
categorySlug: code
title: "Mapa da Família Sliding Window"
navTitle: "Sliding Window Family Map"
summary: "Mapa dos problemas de janela deslizante: tamanho fixo, mais longa e mais curta, e como reconhecer cada um."
level: intermediario
order: 17
section: two-pointers
group: Sliding Window
---

## A ideia central

Sliding window é a variação de mesma direção em que os dois ponteiros (`left` e `right`) delimitam um **intervalo contíguo**. `right` expande a janela; `left` a contrai. Ninguém volta atrás, então o custo total é O(n).

O que muda entre os problemas é **quando a janela é válida** e **o que queremos otimizar**.

## Três variações

### 1. Janela de tamanho fixo

O tamanho `k` é dado. A cada passo entra um elemento e sai outro; a métrica é atualizada de forma incremental.

- [Subarray Sum - Fixed](/category/code/soma-subarray-fixa)
- [Find All Anagrams in a String](/category/code/anagramas-na-string)

### 2. Janela variável — a mais longa

Expandimos sempre; contraímos **só quando a janela fica inválida**. O resultado é registrado quando ela é válida.

- [Sliding Window - Longest](/category/code/janela-mais-longa)
- [Longest Substring without Repeating Characters](/category/code/substring-sem-repeticao)

### 3. Janela variável — a mais curta

Expandimos até a janela ficar válida; então contraímos **enquanto continuar válida**, registrando o melhor tamanho a cada contração.

- [Sliding Window - Shortest](/category/code/janela-mais-curta)
- [Least Consecutive Cards to Match](/category/code/menor-sequencia-cartas-iguais)

## Como reconhecer no enunciado

| Pista no enunciado | Variação |
|---|---|
| "subarray/substring de tamanho k" | fixa |
| "o maior/mais longo … que satisfaz …" | mais longa |
| "o menor/mais curto … que atinge …" | mais curta |
| "contíguo", "consecutivo", "substring" | qualquer janela |

## Quando NÃO funciona

Se o array tem **números negativos** e a condição depende de soma, encolher a janela não garante que a soma diminua. Nesse caso use [Prefix Sum](/category/code/prefix-sum-introducao) com hash map.
