---
slug: orientacao-o-que-e-avaliado
categorySlug: ml-system-design
title: "Orientação: O que essa Entrevista Avalia"
navTitle: Orientação
summary: Diferenciar ML System Design de System Design tradicional e de uma prova teórica de ML
level: intermediario
order: 1
section: framework
---

## Objetivos de aprendizagem

- [ ] Diferenciar ML System Design de System Design tradicional e de uma prova teórica de ML
- [ ] Entender o nível de profundidade esperado em cada etapa

## Conteúdo

### Três entrevistas diferentes, fácil de confundir

System Design tradicional avalia infraestrutura e escala (bancos de dados, cache, sharding). Uma entrevista teórica de ML avalia profundidade matemática e algorítmica (como uma rede neural específica funciona internamente). ML System Design fica no meio: avalia se você consegue pensar de ponta a ponta sobre um problema de ML aplicado — desde entender o objetivo de negócio até considerar como o modelo se comporta em produção — sem exigir nem infraestrutura extremamente detalhada, nem prova matemática rigorosa.

### O que costuma ser avaliado

- Capacidade de traduzir um objetivo de negócio vago em um problema de ML bem definido.
- Julgamento sobre que dados e features são relevantes para o problema.
- Conhecimento prático de seleção e avaliação de modelo (mais aplicado do que teórico).
- Consideração sobre como o sistema se comporta depois de implantado (monitoramento, retreinamento, feedback).

### Cuidado com a profundidade de infraestrutura

Um erro comum é se aprofundar demais em detalhes de infraestrutura pura (qual banco de dados usar, como fazer sharding) — em entrevistas de ML aplicado, isso raramente é o foco central, já que grandes empresas costumam ter equipes de infraestrutura de ML dedicadas para essas decisões. O tempo é mais bem gasto aprofundando questões específicas de ML: escolha de features, trade-offs de modelo, e avaliação.

## Exemplo aplicado

Diante do problema "projete um sistema de recomendação de vídeos", um candidato que gasta a maior parte do tempo discutindo como o banco de dados de vídeos deveria ser particionado está perdendo a oportunidade de discutir o que realmente é avaliado: como definir o objetivo de ML, que sinais (features) indicam que um vídeo é relevante para um usuário, e como validar se o modelo está funcionando bem.

## Erros comuns

- Confundir essa entrevista com System Design tradicional, focando excessivamente em infraestrutura.
- Tentar demonstrar profundidade matemática excessiva, como se fosse uma prova teórica de ML.
