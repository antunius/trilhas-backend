---
slug: complexidade-tempo-espaco
categorySlug: code
title: Analisando Complexidade de Tempo e Espaço
summary: Analisar a complexidade de tempo e espaço de uma solução de forma prática
level: intermediario
order: 3
section: fundamentals
---

## Objetivos de aprendizagem

- [ ] Analisar a complexidade de tempo e espaço de uma solução de forma prática
- [ ] Comunicar essa análise de forma natural ao final da resolução

## Conteúdo

### Por que isso é avaliado

Complexidade de tempo e espaço (normalmente expressa em notação Big O) descreve como o custo de uma solução cresce conforme o tamanho da entrada aumenta. Uma solução correta, mas com complexidade muito pior do que o necessário, é um sinal de que o candidato não considerou alternativas mais eficientes — algo que entrevistadores costumam perguntar explicitamente ao final da resolução.

### Como analisar na prática

Uma boa heurística é examinar os loops e estruturas de dados usados: um loop simples sobre a entrada é geralmente O(n); loops aninhados sobre a mesma entrada tendem a O(n²); uma busca em uma estrutura ordenada usando divisão do espaço de busca pela metade a cada passo tende a O(log n). Para espaço, a pergunta central é: quanto de memória adicional (além da própria entrada) a solução usa, e essa memória cresce com o tamanho da entrada ou é constante?

### Comunicando a análise

Ao final da solução, é uma boa prática mencionar proativamente a complexidade de tempo e espaço da abordagem escolhida, e — quando relevante — comparar com a complexidade de uma abordagem alternativa mais ingênua que foi descartada, demonstrando que a escolha foi consciente.

## Exemplo aplicado

Ao resolver um problema de busca de um par de números que somam um valor-alvo em uma lista, uma solução com dois loops aninhados tem complexidade O(n²) — mencionar explicitamente que uma abordagem com uma tabela hash reduz isso para O(n) de tempo, ao custo de O(n) de espaço adicional, demonstra domínio consciente do trade-off.

## Erros comuns

- Não mencionar a complexidade da solução proativamente, esperando que o entrevistador sempre pergunte.
- Analisar apenas o tempo, esquecendo de considerar o espaço adicional usado pela solução.
