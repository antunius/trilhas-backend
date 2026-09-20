---
slug: vazamento-de-dados
categorySlug: ml-system-design
title: Vazamento de Dados (Data Leakage)
navTitle: Vazamento de Dados
summary: Reconhecer o que é vazamento de dados e por que ele infla métricas de forma enganosa
level: intermediario
order: 9
section: core-concepts
---

## Objetivos de aprendizagem

- [ ] Reconhecer o que é vazamento de dados e por que ele infla métricas de forma enganosa
- [ ] Identificar fontes comuns de vazamento

## Conteúdo

### O que é vazamento de dados

Acontece quando uma feature usada no treinamento contém informação que, na prática, não estaria disponível no momento real da predição — geralmente porque essa informação só existe depois do evento que o modelo está tentando prever. Isso faz com que o modelo pareça ter um desempenho excelente durante a avaliação offline, mas falhe completamente em produção, onde essa informação não existe no momento da decisão.

### Fontes comuns de vazamento

- Usar uma feature que é, na verdade, derivada do próprio rótulo que está sendo previsto.
- Incluir dados futuros no conjunto de treinamento em relação ao momento da predição simulada (ex: usar informação de um evento que só acontece depois do que está sendo previsto).
- Normalizar ou pré-processar dados usando estatísticas calculadas sobre o conjunto de teste, contaminando a avaliação.

### Como se proteger

Uma boa prática é, para cada feature proposta, perguntar explicitamente: "essa informação estaria realmente disponível no momento exato em que a predição precisa ser feita?" Se a resposta for não, ou for incerta, essa feature é uma candidata a vazamento de dados e deve ser reconsiderada.

## Exemplo aplicado

Em um modelo que prevê se um usuário vai cancelar uma assinatura, incluir como feature "o usuário entrou em contato com o suporte para cancelamento" seria um vazamento clássico — essa informação só existe porque o usuário já estava, na prática, cancelando, tornando a predição trivial e inútil no mundo real.

## Erros comuns

- Não questionar se uma feature promissora realmente estaria disponível no momento real da predição.
- Pré-processar dados usando estatísticas do conjunto de teste, contaminando a avaliação de forma sutil.
