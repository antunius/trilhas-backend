---
slug: deteccao-fraude-bot
categorySlug: ml-system-design
title: "Exercício: Detecção de Fraude ou Bot"
navTitle: Detecção de Fraude ou Bot
summary: Projete um sistema que identifica contas fraudulentas ou automatizadas (bots) em uma plataforma online.
level: avancado
order: 12
section: question-breakdowns
---

## Enunciado

Projete um sistema que identifica contas fraudulentas ou automatizadas (bots) em uma plataforma online.

## Perguntas orientadoras

- Qual o custo relativo de um falso positivo (bloquear um usuário legítimo) versus um falso negativo (deixar passar um bot)?
- Os bots evoluem seu comportamento ao longo do tempo para evitar detecção?
- Existe uma equipe humana disponível para revisar casos ambíguos antes de uma ação automática?

## Pontos centrais a explorar

- **Desbalanceamento de Classes** (Módulo 2): contas fraudulentas tipicamente representam uma fração muito pequena do total.
- Engenharia de features (Módulo 1) que sejam resistentes à adaptação adversarial dos próprios bots ao longo do tempo.
- **Deploy, Monitoramento e Feedback Loop** (Módulo 1): como o sistema se adapta conforme os bots mudam de comportamento para escapar da detecção.
