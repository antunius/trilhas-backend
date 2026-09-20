---
slug: mapa-direcao-oposta
categorySlug: code
title: "Mapa da Família de Direção Oposta"
navTitle: Mapa da Família de Direção Oposta
summary: Mapa dos problemas que usam ponteiros convergentes e como reconhecê-los pelo enunciado.
level: intermediario
order: 12
section: two-pointers
group: Direção Oposta
---

## A ideia central

Nos problemas de direção oposta, um ponteiro começa no início da estrutura, o outro no final, e eles se movem um em direção ao outro até se encontrarem (ou até satisfazerem alguma condição de parada). O invariante compartilhado por toda essa família é do tipo "par convergente": **a resposta, se existir, está em algum par dentro do intervalo `[left, right]`** — descrito em [Entendendo Invariantes](/category/code/entendendo-invariantes).

## Variações desta família

### Buscar um par com uma propriedade de soma

`left` e `right` representam o par sendo considerado; a cada passo, comparamos uma métrica do par (soma, produto, distância) com um alvo, e movemos o ponteiro que só pode piorar a métrica na direção errada:

- [Two Sum Sorted](/category/code/two-sum-ordenado) — busca um par cuja soma é exatamente o alvo.
- [Container With Most Water](/category/code/container-com-mais-agua) — busca o par que maximiza uma área.

### Comparar de fora para dentro

`left` e `right` comparam os elementos nas duas pontas da estrutura, avançando apenas quando o par atual satisfaz a condição:

- [Valid Palindrome](/category/code/palindromo-valido) — compara caracteres simétricos até o meio da string.

## Como reconhecer essa família no enunciado

- A estrutura de entrada está ordenada (ou pode ser ordenada sem perder informação relevante) e o problema pede um par ou trio que satisfaça uma condição.
- O problema pede para verificar uma propriedade simétrica de fora para dentro (palíndromos).
- O problema pede para maximizar ou minimizar uma métrica que depende de duas posições simultaneamente (como uma área ou distância).
- Ao contrário da família de mesma direção, aqui os ponteiros **se aproximam um do outro** — se sua solução tem os dois ponteiros andando na mesma direção, provavelmente é a outra família.
