---
slug: avaliacao-offline-online
categorySlug: ml-system-design
title: Avaliação Offline e Online
summary: Diferenciar avaliação offline de avaliação online
level: intermediario
order: 6
section: framework
---

## Objetivos de aprendizagem

- [ ] Diferenciar avaliação offline de avaliação online
- [ ] Escolher métricas apropriadas para cada tipo de avaliação

## Conteúdo

### Avaliação offline

Acontece antes do modelo ser exposto a usuários reais, usando dados históricos já rotulados (um conjunto de teste separado do treinamento). Métricas comuns incluem precisão, recall, F1, ou métricas específicas de ranqueamento, dependendo da natureza do problema. A vantagem é a rapidez e o baixo risco — nenhum usuário real é afetado. A limitação é que desempenho offline não garante desempenho real em produção, já que o comportamento do usuário pode mudar em resposta ao próprio modelo.

### Avaliação online

Acontece com o modelo já exposto a uma fração real de usuários, tipicamente através de um teste controlado (A/B test), comparando uma métrica de negócio relevante entre o grupo que recebe o novo modelo e um grupo de controle. É a validação mais próxima da realidade, mas mais lenta, mais arriscada (usuários reais são afetados), e mais cara de conduzir.

### Como essas duas etapas se complementam

A prática recomendada é usar avaliação offline para filtrar candidatos claramente ruins antes de qualquer teste com usuários reais, reservando a avaliação online (mais custosa e arriscada) para validar candidatos que já passaram no crivo offline — nunca pular direto para produção sem alguma validação offline prévia.

## Exemplo aplicado

Um novo modelo de recomendação é primeiro avaliado offline contra um conjunto de teste histórico, comparando sua métrica de ranqueamento com a do modelo atual em produção; só depois de superar esse crivo inicial, ele é testado em um A/B test com uma pequena fração de usuários reais, medindo o impacto em uma métrica de negócio como tempo de engajamento.

## Erros comuns

- Confiar apenas em avaliação offline, ignorando que o comportamento real do usuário pode diferir do previsto pelos dados históricos.
- Pular direto para um teste com usuários reais sem qualquer validação offline prévia, expondo um modelo potencialmente ruim a um risco desnecessário.
