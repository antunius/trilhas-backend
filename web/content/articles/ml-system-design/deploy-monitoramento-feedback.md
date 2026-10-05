---
slug: deploy-monitoramento-feedback
categorySlug: ml-system-design
title: Deploy, Monitoramento e Feedback Loop
summary: Considerar o ciclo de vida do modelo após o deploy inicial
level: intermediario
order: 7
section: framework
---

## Objetivos de aprendizagem

- [ ] Considerar o ciclo de vida do modelo após o deploy inicial
- [ ] Reconhecer o risco de degradação de modelo ao longo do tempo

## Conteúdo

### O trabalho não termina no deploy

Um erro comum é tratar o deploy como a etapa final do processo. Na prática, um modelo em produção precisa ser monitorado continuamente — tanto por métricas de infraestrutura (latência, taxa de erro) quanto por métricas específicas de ML (a qualidade das predições está se mantendo consistente ao longo do tempo?).

### Desvio de dados (data drift) e degradação de modelo

O comportamento do mundo real muda com o tempo — novos padrões de uso, novos tipos de conteúdo, mudanças sazonais — o que faz com que um modelo treinado em dados antigos gradualmente perca precisão, mesmo sem nenhuma mudança no código do sistema. Monitorar essa degradação e ter um plano de retreinamento periódico (ou disparado por um limiar de queda de qualidade) é parte esperada de um bom design.

### O ciclo de feedback

O comportamento dos usuários em resposta às predições do modelo frequentemente se torna, ele mesmo, uma nova fonte de dados de treinamento — fechando um ciclo de feedback contínuo. Vale mencionar explicitamente esse ciclo e também o risco de viés de retroalimentação: se o modelo só aprende com o que ele mesmo já mostrou aos usuários, pode reforçar seus próprios vieses ao longo do tempo.

## Exemplo aplicado

Em um sistema de recomendação, o monitoramento contínuo pode acompanhar se a taxa de cliques nas recomendações está caindo ao longo das semanas (um sinal de possível desvio de dados), disparando um retreinamento programado do modelo com dados mais recentes antes que a degradação afete significativamente a experiência do usuário.

## Erros comuns

- Tratar o deploy como a etapa final, sem mencionar monitoramento contínuo ou retreinamento.
- Ignorar o risco de viés de retroalimentação quando o próprio modelo influencia os dados usados para seu retreinamento futuro.
