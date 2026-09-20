---
slug: formas-de-invariante
categorySlug: code
title: "Formatos Comuns de Invariante"
navTitle: Formatos Comuns de Invariante
summary: Catálogo dos formatos de invariante mais comuns em problemas de dois ponteiros, para reconhecer rapidamente qual se aplica a um problema novo.
level: intermediario
order: 6
section: two-pointers
group: Conceitos Centrais
---

## Por que catalogar formatos

A maioria dos problemas de dois ponteiros reutiliza um pequeno número de "formatos" de invariante. Reconhecer qual formato se aplica a um problema novo é geralmente o passo mais difícil — depois disso, o resto do algoritmo costuma ser mecânico.

## Par convergente

**Invariante:** a resposta, se existir, está em algum par dentro do intervalo `[left, right]`.

Usado quando dois ponteiros começam nos extremos e se movem um em direção ao outro. Típico de: encontrar um par com soma-alvo em array ordenado ([Two Sum Sorted](/category/code/two-sum-ordenado)), verificar palíndromos ([Valid Palindrome](/category/code/palindromo-valido)), maximizar uma área entre duas posições ([Container With Most Water](/category/code/container-com-mais-agua)).

## Fronteira de partição

**Invariante:** tudo à esquerda de um ponteiro (`slow`, `low`, etc.) já satisfaz uma propriedade; tudo entre os ponteiros ainda não foi classificado.

Usado em modificações in-place que reorganizam elementos em regiões, como mover todos os zeros para o fim de um array ([Move Zeroes](/category/code/mover-zeros)) ou remover duplicatas de um array ordenado ([Remove Duplicates](/category/code/remover-duplicatas)).

## Par lento/rápido

**Invariante:** a distância (ou razão de velocidade) entre os dois ponteiros codifica uma informação útil sobre a estrutura — por exemplo, quando o ponteiro rápido percorreu o dobro da distância do lento, o lento está na metade do caminho.

Usado em listas encadeadas quando não se conhece o tamanho de antemão: encontrar o meio ([Middle of a Linked List](/category/code/meio-lista-encadeada)), encontrar o n-ésimo nó a partir do fim ([Remove N-th Node From End of List](/category/code/remover-nth-do-fim)), ou detectar ciclos.

## Janela deslizante

**Invariante:** o intervalo `[left, right]` sempre satisfaz (ou está prestes a deixar de satisfazer) uma condição sobre seu conteúdo.

É uma variação do par convergente onde os dois ponteiros se movem na **mesma direção**, geralmente só para frente, expandindo e contraindo uma "janela" contígua. Cobrimos essa família com mais detalhe na seção de Sliding Window (em uma próxima página desta trilha).

## Como usar este catálogo

Diante de um problema novo, pergunte: qual desses formatos de invariante parece descrever a estrutura da resposta que estou procurando? Isso reduz drasticamente o espaço de algoritmos a considerar — o trabalho que sobra é adaptar os detalhes (condição de movimento, condição de parada) ao problema específico.
