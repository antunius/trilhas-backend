---
slug: sistema-recomendacao
categorySlug: ml-system-design
title: "Exercício: Sistema de Recomendação"
navTitle: Sistema de Recomendação
summary: Projete um sistema de recomendação de conteúdo (vídeos, produtos, ou posts) para os usuários de uma plataforma.
level: avancado
order: 11
section: question-breakdowns
---

## Enunciado

Projete um sistema de recomendação de conteúdo (vídeos, produtos, ou posts) para os usuários de uma plataforma.

## Perguntas orientadoras

- Qual objetivo de negócio a recomendação deve otimizar (engajamento, tempo de sessão, conversão)?
- O sistema precisa lidar com o problema de "usuário novo" ou "item novo" sem histórico de interação (cold start)?
- A recomendação precisa ser gerada em tempo real, ou pode ser pré-computada periodicamente?

## Pontos centrais a explorar

- **Do Objetivo de Negócio ao Objetivo de ML** (Módulo 1): traduzir o objetivo de negócio em uma métrica concreta de ML, reconhecendo os riscos de otimizar um proxy imperfeito.
- Estratégias para o problema de cold start, quando não há histórico suficiente de interação.
- **Avaliação Offline e Online** (Módulo 1): como validar o sistema antes e depois do lançamento.
