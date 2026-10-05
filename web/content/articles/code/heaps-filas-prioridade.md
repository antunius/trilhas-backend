---
slug: heaps-filas-prioridade
categorySlug: code
title: Heaps e Filas de Prioridade
summary: Reconhecer problemas que se beneficiam de acesso eficiente ao menor/maior elemento
level: intermediario
order: 40
section: patterns
---

## Objetivos de aprendizagem

- [ ] Reconhecer problemas que se beneficiam de acesso eficiente ao menor/maior elemento
- [ ] Aplicar o padrão de "top-k" usando um heap de tamanho limitado

## Conteúdo

### O que é um heap

Um heap é uma estrutura de dados em árvore que mantém, de forma eficiente, acesso rápido ao menor (heap mínimo) ou ao maior (heap máximo) elemento do conjunto, com operações de inserção e remoção desse elemento em tempo logarítmico — muito mais eficiente do que reordenar toda a coleção a cada mudança.

### O padrão "top-k"

Um uso extremamente comum é encontrar os k maiores (ou menores) elementos de uma coleção, sem precisar ordenar a coleção inteira: mantendo um heap de tamanho fixo k, cada novo elemento é comparado com o pior elemento atualmente no heap, substituindo-o apenas se for melhor — resultando em complexidade proporcional a n log k, em vez de n log n de uma ordenação completa.

### Como reconhecer o padrão

Pistas comuns: o problema pede os k maiores/menores elementos, o elemento mediano de um fluxo contínuo de dados, ou processar elementos sempre pela ordem de prioridade (ex: sempre atender a tarefa mais urgente disponível).

## Exemplo aplicado

Para encontrar os 10 maiores valores em um fluxo contínuo de números que chegam um a um, um heap mínimo de tamanho 10 mantém sempre os 10 maiores valores vistos até o momento: qualquer novo valor maior que o menor do heap substitui esse menor valor, mantendo o heap sempre com exatamente os 10 melhores candidatos.

## Erros comuns

- Ordenar a coleção inteira quando apenas os k maiores/menores elementos são realmente necessários, desperdiçando trabalho.
- Usar um heap máximo quando um heap mínimo (ou vice-versa) seria a escolha correta para o padrão de top-k.
