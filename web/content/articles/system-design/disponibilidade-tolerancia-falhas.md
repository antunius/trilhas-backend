---
slug: disponibilidade-tolerancia-falhas
categorySlug: system-design
title: Disponibilidade e Tolerância a Falhas
summary: Entender como disponibilidade costuma ser medida
level: intermediario
order: 20
section: conceitos-centrais
---

## Objetivos de aprendizagem

- [ ] Entender como disponibilidade costuma ser medida
- [ ] Conhecer técnicas comuns para aumentar tolerância a falhas

## Conteúdo

### Medindo disponibilidade

![Redundância e failover](/diagrams/sd-disponibilidade.svg)

Disponibilidade é geralmente expressa em porcentagem de tempo no ar durante um período (ex: 99,9%), frequentemente descrita informalmente pelo número de "noves". Cada nove adicional reduz drasticamente o tempo de indisponibilidade tolerado: 99% permite quase 4 dias de indisponibilidade por ano, enquanto 99,99% permite pouco mais de 50 minutos — a diferença entre esses níveis muda completamente os requisitos de arquitetura.

### Técnicas comuns de tolerância a falhas

- **Redundância**: manter múltiplas instâncias de um mesmo componente, para que a falha de uma não derrube o sistema.
- **Réplicas de dados**: manter cópias dos dados em múltiplos nós, permitindo continuar operando mesmo com a perda de um deles.
- **Health checks e failover automático**: detectar automaticamente quando um componente falhou e redirecionar tráfego para instâncias saudáveis.
- **Distribuição geográfica**: espalhar componentes por múltiplas regiões, reduzindo o impacto de uma falha localizada (ex: queda de um data center inteiro).

### O trade-off

Cada nível adicional de disponibilidade normalmente exige mais redundância — e mais redundância significa mais custo de infraestrutura e mais complexidade operacional. A pergunta relevante em uma entrevista não é "como atingir 100% de disponibilidade" (o que não existe na prática), mas "qual nível de disponibilidade os requisitos do sistema realmente justificam".

## Exemplo aplicado

Um sistema de pagamentos provavelmente justifica múltiplas réplicas em diferentes regiões geográficas, dado o alto custo de indisponibilidade. Já uma ferramenta interna usada por poucos funcionários, fora do horário comercial, provavelmente não justifica esse mesmo nível de investimento em redundância.

## Erros comuns

- Propor disponibilidade máxima ("cinco noves") para qualquer sistema, sem considerar se o requisito real justifica esse custo.
- Ignorar completamente redundância em sistemas onde a indisponibilidade tem custo alto e claro.
