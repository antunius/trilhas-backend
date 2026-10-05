---
slug: selecao-treinamento-modelo
categorySlug: ml-system-design
title: Seleção e Treinamento de Modelo
summary: Justificar a escolha de um modelo com base nos requisitos do problema, não em modismo
level: intermediario
order: 5
section: framework
---

## Objetivos de aprendizagem

- [ ] Justificar a escolha de um modelo com base nos requisitos do problema, não em modismo
- [ ] Começar por um modelo de referência (baseline) antes de propor algo mais complexo

## Conteúdo

### Começando por um baseline simples

Uma prática valorizada é propor primeiro um modelo simples e bem compreendido (ex: regressão logística com poucas features) como ponto de partida, antes de avançar para algo mais sofisticado. Isso demonstra maturidade: reconhece que soluções simples às vezes já resolvem boa parte do problema, e cria uma referência clara para avaliar se a complexidade adicional realmente compensa.

### Escolhendo além do baseline

Ao propor um modelo mais complexo, a justificativa deve vir dos requisitos do problema — volume de dados disponível, necessidade de capturar interações complexas entre features, restrições de latência de inferência — não da popularidade da técnica. Um modelo mais sofisticado que não pode ser servido dentro do orçamento de latência do produto não é uma escolha viável, por mais preciso que seja.

### Trade-offs comuns a mencionar

Modelos mais simples tendem a ser mais rápidos de treinar e servir, mais fáceis de interpretar e depurar, mas podem deixar poder preditivo na mesa se o problema realmente exige capturar relações complexas. Modelos mais sofisticados podem capturar mais nuance, ao custo de maior latência, maior necessidade de dados, e menor interpretabilidade.

## Exemplo aplicado

Em um sistema de recomendação, começar com um modelo simples baseado em popularidade e filtragem colaborativa básica, e só then propor um modelo mais sofisticado (que capture interações mais complexas entre usuário e item) se o baseline demonstrar limitações claras que justifiquem a complexidade adicional.

## Erros comuns

- Propor diretamente o modelo mais complexo e "moderno" disponível, sem justificar por que ele é necessário além de um baseline mais simples.
- Ignorar restrições de latência de produção ao escolher um modelo mais pesado computacionalmente.
