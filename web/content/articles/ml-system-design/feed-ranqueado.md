---
slug: feed-ranqueado
categorySlug: ml-system-design
title: "Exercício: Feed Ranqueado"
navTitle: Feed Ranqueado
summary: Projete o sistema de ranqueamento de um feed social, decidindo a ordem em que posts são exibidos a cada usuário.
level: avancado
order: 13
section: question-breakdowns
---

## Enunciado

Projete o sistema de ranqueamento de um feed social, decidindo a ordem em que posts são exibidos a cada usuário.

## Perguntas orientadoras

- Qual sinal de engajamento (curtida, comentário, tempo de visualização) melhor representa o objetivo de negócio da plataforma?
- O sistema precisa considerar diversidade de conteúdo (evitar mostrar sempre o mesmo tipo de post), além de relevância pura?
- Com que frequência o ranqueamento precisa ser recalculado para cada usuário?

## Pontos centrais a explorar

- **Engenharia de Features** (Módulo 1): combinar features do usuário, do post, e de interação prévia entre os dois.
- Trade-off entre relevância pura e diversidade do feed — um objetivo de ML otimizado cegamente por engajamento pode reduzir a diversidade de conteúdo mostrado.
- **Seleção e Treinamento de Modelo** (Módulo 1): considerar arquiteturas de ranqueamento em múltiplos estágios (um estágio inicial mais barato filtrando candidatos, seguido de um estágio final mais sofisticado e custoso sobre um conjunto menor).
