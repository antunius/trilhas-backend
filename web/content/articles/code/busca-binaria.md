---
slug: busca-binaria
categorySlug: code
title: Busca Binária
summary: Reconhecer problemas que se beneficiam de busca binária além da busca clássica em array ordenado
level: intermediario
order: 36
section: patterns
---

## Objetivos de aprendizagem

- [ ] Reconhecer problemas que se beneficiam de busca binária além da busca clássica em array ordenado
- [ ] Aplicar busca binária sobre a resposta, não apenas sobre um array

## Conteúdo

### A ideia central

Busca binária reduz o espaço de busca pela metade a cada passo, ao invés de examinar elemento por elemento — o que exige que exista alguma forma de ordenação ou monotonicidade no espaço de busca (se uma posição não satisfaz a condição, é possível eliminar toda uma metade do espaço de uma vez).

### Além da busca em array

Um uso menos óbvio, mas muito comum em entrevistas mais avançadas, é a busca binária "sobre a resposta": em vez de buscar um elemento em um array, busca-se o menor (ou maior) valor de uma variável que satisfaz uma condição, quando essa condição é monotônica (se um valor funciona, todo valor maior — ou menor — também funciona).

### Como reconhecer o padrão

Pistas comuns: o problema envolve uma estrutura ordenada, ou envolve encontrar o valor mínimo/máximo que satisfaz uma condição onde "testar" um valor específico é mais fácil do que calcular a resposta diretamente.

## Exemplo aplicado

Em um problema de "qual a velocidade mínima necessária para completar uma tarefa dentro de um prazo", em vez de calcular diretamente essa velocidade, é possível testar candidatos com busca binária: se uma velocidade V é suficiente, qualquer velocidade maior que V também será — essa monotonicidade permite aplicar busca binária sobre o valor da resposta, não sobre um array.

## Erros comuns

- Restringir a busca binária apenas a arrays ordenados, sem reconhecer sua aplicação em busca sobre a resposta.
- Aplicar busca binária a um espaço sem monotonicidade real, onde a técnica simplesmente não funciona.
