---
slug: desbalanceamento-classes
categorySlug: ml-system-design
title: Desbalanceamento de Classes
summary: Reconhecer o problema de classes desbalanceadas em problemas de classificação
level: intermediario
order: 10
section: core-concepts
---

## Objetivos de aprendizagem

- [ ] Reconhecer o problema de classes desbalanceadas em problemas de classificação
- [ ] Conhecer estratégias comuns para lidar com esse desafio

## Conteúdo

### O problema

Muitos problemas de ML aplicado envolvem eventos raros: fraude, cliques em anúncios, contas fraudulentas. Quando a classe de interesse representa uma fração muito pequena dos dados, um modelo que simplesmente prevê sempre "não é fraude" pode alcançar uma métrica de acurácia altíssima, sem realmente ser útil — um sinal de que acurácia sozinha é uma métrica enganosa nesse cenário.

### Métricas mais apropriadas

Em problemas desbalanceados, métricas como precisão, recall, e a área sob a curva precisão-recall costumam ser mais informativas do que acurácia simples, já que capturam melhor o desempenho do modelo especificamente sobre a classe rara de interesse.

### Estratégias de mitigação

- **Reamostragem**: aumentar artificialmente a representação da classe rara no treinamento (oversampling), ou reduzir a representação da classe majoritária (undersampling).
- **Ponderação de classe**: ajustar a função de custo do modelo para penalizar mais fortemente erros na classe rara.
- **Ajuste de limiar de decisão**: em vez de usar o limiar padrão de 50% de probabilidade, ajustar esse limiar considerando o custo relativo de falsos positivos versus falsos negativos no contexto específico do problema.

## Exemplo aplicado

Em um sistema de detecção de fraude, onde apenas uma fração muito pequena das transações é realmente fraudulenta, um modelo avaliado por acurácia poderia parecer excelente apenas prevendo "não fraude" sempre — métricas como recall (quantas fraudes reais o modelo consegue capturar) são muito mais relevantes para avaliar sua utilidade real.

## Erros comuns

- Usar acurácia como métrica principal em um problema com classes fortemente desbalanceadas.
- Não considerar o custo relativo entre falsos positivos e falsos negativos ao ajustar o limiar de decisão do modelo.
