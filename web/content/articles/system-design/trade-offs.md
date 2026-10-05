---
slug: trade-offs
categorySlug: system-design
title: "Trade-offs de Design: o Porquê por Trás de Cada Escolha"
navTitle: Trade-offs de Design
summary: Internalizar que toda decisão técnica envolve um custo
level: intermediario
order: 53
section: conceitos-centrais
group: "Fundamentos de sistemas distribuídos"
---

## Objetivos de aprendizagem

- [ ] Internalizar que toda decisão técnica envolve um custo
- [ ] Praticar a estrutura de argumentação "escolhi X em troca de Y, porque Z"

## Conteúdo

### Por que trade-offs são o coração da entrevista

![Todo design é troca](/diagrams/sd-trade-offs.svg)

Praticamente todo conceito visto neste curso pode ser resumido como uma troca: mais consistência custa disponibilidade; mais cache custa risco de dado desatualizado; mais índices custam escrita mais lenta; mais réplicas custam complexidade operacional. Não existe solução sem custo — existe apenas a escolha de qual custo é mais aceitável dado o problema em questão.

### Uma estrutura simples de argumentação

Uma forma eficaz de comunicar uma decisão técnica é seguir o formato: "Eu escolhi [decisão] em vez de [alternativa], porque [requisito específico] torna esse trade-off aceitável no nosso caso — mesmo sabendo que isso custa [desvantagem reconhecida]." Essa estrutura demonstra que a decisão não foi arbitrária, e que as desvantagens foram consideradas conscientemente, não ignoradas.

### Praticando isso ao longo do curso

Cada aula técnica deste curso (cache, sharding, consistência, disponibilidade) foi construída em torno de um trade-off central. Revisitar essas aulas com essa lente — "qual foi o custo aceito em cada uma?" — é uma forma eficaz de consolidar o aprendizado antes de partir para os exercícios práticos do próximo módulo.

## Exemplo aplicado

"Optei por consistência eventual para o contador de curtidas, em vez de consistência forte, porque um pequeno atraso na atualização é imperceptível para o usuário, e essa escolha nos permite manter alta disponibilidade e baixa latência mesmo sob alta carga — o custo aceito é a possibilidade de exibir um número levemente desatualizado por alguns segundos."

## Erros comuns

- Apresentar uma decisão técnica sem mencionar nenhuma desvantagem, como se fosse uma solução sem custo algum.
- Escolher uma solução por familiaridade, sem conseguir articular o trade-off real por trás dela.
