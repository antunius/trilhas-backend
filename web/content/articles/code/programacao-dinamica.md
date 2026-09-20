---
slug: programacao-dinamica
categorySlug: code
title: Programação Dinâmica
summary: Reconhecer problemas com subestrutura ótima e subproblemas sobrepostos
level: intermediario
order: 39
section: patterns
---

## Objetivos de aprendizagem

- [ ] Reconhecer problemas com subestrutura ótima e subproblemas sobrepostos
- [ ] Diferenciar memoização (top-down) de tabulação (bottom-up)

## Conteúdo

### As duas condições necessárias

Programação dinâmica se aplica a problemas com duas propriedades: subestrutura ótima (a solução ótima do problema pode ser construída a partir de soluções ótimas de subproblemas menores) e subproblemas sobrepostos (os mesmos subproblemas menores são recalculados repetidamente em uma solução recursiva ingênua). Quando ambas as condições existem, guardar o resultado de subproblemas já resolvidos evita recomputação redundante.

### Memoização (top-down)

Mantém a estrutura recursiva natural do problema, mas guarda ("memoriza") o resultado de cada subproblema já resolvido em uma estrutura auxiliar (como um dicionário), retornando o valor guardado em vez de recalcular quando o mesmo subproblema aparece novamente.

### Tabulação (bottom-up)

Resolve os subproblemas menores primeiro, construindo iterativamente a solução dos problemas maiores a partir deles, normalmente usando uma tabela (array uni ou multidimensional). Costuma ser mais eficiente em espaço do que a memoização (evita a pilha de recursão), mas exige identificar a ordem correta de preenchimento da tabela.

### Como reconhecer o padrão

Pistas comuns: o problema pede um valor ótimo (máximo, mínimo, contagem de formas) sobre escolhas que se repetem em subproblemas menores, e uma solução recursiva ingênua claramente recalcularia os mesmos subproblemas várias vezes.

## Exemplo aplicado

No problema clássico da mochila (knapsack), decidir se um item específico entra ou não na mochila gera dois subproblemas menores (com ou sem aquele item, para a capacidade restante) — esses subproblemas se repetem em diferentes combinações de escolhas, tornando o problema um candidato natural a programação dinâmica, seja via memoização ou tabulação.

## Erros comuns

- Tentar resolver um problema com programação dinâmica quando ele não tem subproblemas realmente sobrepostos.
- Implementar apenas a versão recursiva ingênua, sem adicionar memoização, resultando em complexidade exponencial desnecessária.
