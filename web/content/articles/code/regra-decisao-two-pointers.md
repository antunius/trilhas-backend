---
slug: regra-decisao-two-pointers
categorySlug: code
title: "Two Pointers Decision Rule"
navTitle: "Two Pointers Decision Rule"
summary: "Um roteiro para decidir qual variação de dois ponteiros usar diante de um enunciado novo."
level: intermediario
order: 30
section: two-pointers
group: Decision Making
---

## Como decidir

Diante de um problema, faça estas perguntas em ordem.

| # | Pergunta | Se sim |
|---|---|---|
| 1 | O problema pede um **intervalo contíguo** (subarray/substring)? | Sliding window |
| 2 | Os dados têm **negativos** e a condição é uma soma? | Prefix sum + hash map |
| 3 | Há **lista encadeada**, ciclo ou "meio"? | Lento e rápido |
| 4 | A entrada está **ordenada** e busca um par/tripla? | Direção oposta |
| 5 | Pede modificar **in-place** preservando ordem? | Escrita + leitura |
| 6 | Muitas consultas de soma em intervalos fixos? | Prefix sum |

## Dentro de sliding window

- Tamanho `k` dado → fixa.
- "maior/mais longo" → encolhe quando inválida.
- "menor/mais curto" → encolhe enquanto válida.

## A pergunta de fundo

Sempre pergunte: **que informação descarta um ponteiro a cada passo?** Se você não consegue justificar por que mover um ponteiro nunca perde a resposta, o padrão provavelmente não se aplica.

Veja também: [Entendendo Invariantes](/category/code/entendendo-invariantes).
