---
slug: trade-offs-modelos-simples-complexos
categorySlug: ml-system-design
title: Trade-offs entre Modelos Simples e Complexos
summary: Articular os trade-offs entre complexidade de modelo e viabilidade prática
level: intermediario
order: 8
section: core-concepts
---

## Objetivos de aprendizagem

- [ ] Articular os trade-offs entre complexidade de modelo e viabilidade prática
- [ ] Reconhecer quando complexidade adicional não se justifica

## Conteúdo

### Além de precisão pura

Escolher um modelo não é apenas sobre qual tem a melhor métrica de precisão em um benchmark — envolve também interpretabilidade (é possível explicar por que o modelo tomou uma decisão específica, algo importante em contextos regulados ou sensíveis), custo computacional de treinamento e inferência, e a quantidade de dados necessária para treinar bem o modelo escolhido.

### O risco de overfitting em modelos muito complexos

Modelos com muita capacidade, treinados com dados insuficientes, tendem a memorizar padrões específicos do conjunto de treinamento que não generalizam para dados novos (overfitting) — um risco real ao escolher um modelo mais sofisticado sem volume de dados proporcional para sustentá-lo.

### Quando a simplicidade vence

Em contextos com volume de dados limitado, necessidade de baixa latência de inferência, ou necessidade de explicabilidade (ex: decisões de crédito, que frequentemente precisam ser justificáveis), um modelo mais simples pode ser não apenas suficiente, mas a escolha correta mesmo que um modelo mais complexo alcançasse uma métrica de precisão ligeiramente melhor em teoria.

## Exemplo aplicado

Em um sistema de aprovação de crédito, a exigência regulatória de explicar decisões individuais pode favorecer um modelo mais simples e interpretável, mesmo que um modelo mais complexo alcançasse uma precisão marginalmente superior — o trade-off de interpretabilidade supera o ganho de precisão nesse contexto específico.

## Erros comuns

- Escolher o modelo mais complexo disponível assumindo que ele é sempre superior, sem considerar interpretabilidade, custo ou volume de dados disponível.
- Ignorar o risco de overfitting ao propor um modelo com muita capacidade em relação ao volume de dados disponível.
