---
slug: backtracking
categorySlug: code
title: Backtracking
summary: Reconhecer problemas que pedem todas as combinações/permutações possíveis satisfazendo uma condição
level: intermediario
order: 38
section: patterns
---

## Objetivos de aprendizagem

- [ ] Reconhecer problemas que pedem todas as combinações/permutações possíveis satisfazendo uma condição
- [ ] Estruturar uma solução de backtracking com poda eficiente

## Conteúdo

### A ideia central

Backtracking constrói uma solução incrementalmente, testando uma escolha por vez, e desfazendo ("retrocedendo") essa escolha assim que se percebe que ela não pode levar a uma solução válida — evitando explorar exaustivamente todo o espaço de possibilidades quando parte dele já pode ser descartada cedo.

### A estrutura típica

Um algoritmo de backtracking normalmente segue: escolher uma opção disponível, explorar recursivamente a partir dessa escolha, e desfazer a escolha ao retornar dessa exploração (para testar a próxima opção disponível no mesmo ponto). A "poda" — interromper um ramo assim que se sabe que ele não pode gerar uma solução válida — é o que torna a técnica eficiente na prática, mesmo com complexidade de pior caso exponencial.

### Como reconhecer o padrão

Pistas comuns: o problema pede para gerar todas as combinações, permutações ou subconjuntos possíveis que satisfazem uma restrição (ex: todas as formas de posicionar N rainhas em um tabuleiro sem que se ataquem).

## Exemplo aplicado

No problema clássico de gerar todas as permutações possíveis de um conjunto de números, backtracking escolhe um número não usado ainda, adiciona à permutação parcial, recursivamente continua a partir daí, e remove esse número ao retornar — testando a próxima opção disponível naquele ponto da recursão.

## Erros comuns

- Não implementar poda alguma, explorando ramos que já poderiam ser descartados cedo por violarem uma restrição do problema.
- Esquecer de desfazer a escolha ao retornar da recursão, corrompendo o estado usado nas próximas tentativas.
