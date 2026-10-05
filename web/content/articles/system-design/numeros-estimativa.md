---
slug: numeros-estimativa
categorySlug: system-design
title: "Estimativa de capacidade passo a passo"
navTitle: Estimativa passo a passo
summary: "Estimar requisições por segundo, armazenamento e a capacidade necessária para o encurtador de URLs"
level: intermediario
order: 48
section: tecnologias-chave
group: "Números para saber"
---

## Objetivos de aprendizagem

- [ ] Converter volume mensal em requisições por segundo
- [ ] Estimar armazenamento e decidir se há necessidade de sharding

*Retomando o cenário da unidade: um encurtador de URLs que recebe 100 milhões de links novos por mês, cada um lido em média 100 vezes.*

## Estimativa de capacidade, passo a passo

Vamos resolver o encurtador de URLs. A receita: **escrever as premissas, converter para por segundo, converter para armazenamento**.

### Passo 1: premissas

- 100 milhões de links novos por mês.
- Cada link é lido 100 vezes (razão leitura:escrita de 100:1).
- Cada registro (código curto, URL original, datas) ocupa cerca de 500 bytes.
- Retenção de 5 anos.

### Passo 2: requisições por segundo

Um mês tem cerca de 2,5 milhões de segundos (30 × 24 × 3.600 = 2.592.000; arredondamos para 2,5 milhões).

- **Escritas**: 100.000.000 ÷ 2.500.000 = **40 por segundo** em média.
- **Leituras**: 40 × 100 = **4.000 por segundo** em média.
- **Pico**: costuma-se supor 3 a 5 vezes a média, então leituras de pico de **~15.000 por segundo**.

### Passo 3: armazenamento

- Links em 5 anos: 100 milhões × 12 meses × 5 anos = **6 bilhões** de links.
- Espaço: 6.000.000.000 × 500 bytes = 3.000.000.000.000 bytes = **3 TB**.

### Passo 4: o que isso decide

- **15.000 leituras por segundo** de pico: um único banco relacional, na faixa de 5.000–50.000, aguenta no limite. Um **cache** na frente reduz a carga de leitura (os links populares concentram os acessos) e dá folga confortável.
- **40 escritas por segundo**: trivial, não precisa de sharding por escrita.
- **3 TB**: cabe num servidor com folga, mas é razoável pensar em partição ou réplicas no futuro. **Sharding não é necessário no dia 1.**

Veja o valor da conta: ela mostrou que o problema **não** exige um sistema gigante, e evitou uma complexidade desnecessária.

## Lembre

- Escreva as **premissas**, converta para **por segundo**, depois para **armazenamento**.
- Um mês tem cerca de **2,5 milhões de segundos**.
- A conta pode mostrar que o problema **não** exige um sistema gigante.
