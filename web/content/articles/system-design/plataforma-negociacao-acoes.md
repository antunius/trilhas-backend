---
slug: plataforma-negociacao-acoes
categorySlug: system-design
title: "Exercício: Projetar uma Plataforma de Negociação de Ações (estilo Robinhood)"
navTitle: Plataforma de Negociação de Ações
summary: Projete uma plataforma onde usuários podem comprar e vender ações, vendo preços em tempo real e executando ordens de compra/venda.
level: avancado
order: 126
section: exercicios-praticos
group: "Transações e concorrência"
---

## Objetivos de aprendizagem

- [ ] Praticar consistência forte num fluxo onde erro tem custo financeiro direto
- [ ] Entender por que a execução de ordens precisa de sequência estrita, não paralelismo

## Enunciado

Projete uma plataforma onde usuários podem comprar e vender ações, vendo preços em tempo real e executando ordens de compra/venda.

![Trading: order book + matching](/diagrams/sd-plataforma-negociacao-acoes.svg)

## Perguntas orientadoras (levantamento de requisitos)

- O sistema precisa exibir preços em tempo real para múltiplos usuários simultaneamente?
- Como uma ordem de compra é validada contra o saldo disponível do usuário antes de ser executada?
- É aceitável qualquer atraso entre o preço exibido e o preço realmente executado, ou isso precisa ser rigorosamente consistente?

## Requisitos funcionais (exemplos)

- Exibir o preço atual de uma ação para múltiplos usuários.
- Submeter uma ordem de compra ou venda.
- Validar a ordem contra o saldo/posição disponível do usuário antes de executar.
- Casar ordens de compra e venda compatíveis (order matching).

## Requisitos não-funcionais (exemplos)

- **Escala:** picos de altíssimo volume de ordens em momentos de volatilidade do mercado.
- **Latência:** exibição de preço em tempo real (sub-segundo); execução de ordem em uma janela curta e previsível.
- **Disponibilidade:** alta, mas nunca à custa de executar uma ordem com saldo insuficiente.
- **Consistência:** forte — mesmo cenário do exercício de Pagamentos, com o agravante de exigir sequência estrita de execução (ordem de chegada importa).
- **Leitura vs. escrita:** leitura de preço (exibição) muito maior que escrita (ordens efetivamente submetidas).

## Tecnologias que podem ser usadas

- **Motor de matching:** um processo único e sequencial por ativo (não paralelo) para processar o order book sem condição de corrida.
- **Armazenamento:** banco relacional (Postgres) com transações para saldo, posições e histórico de ordens.
- **Tempo real:** WebSockets para propagar atualizações de preço a todos os usuários observando um ativo.
- **Fila de mensagens:** para desacoplar submissão de ordem (rápida) de confirmação de execução (processada pelo motor de matching).

## Pontos centrais a explorar (deep dive sugerido)

- **Atualizações em Tempo Real** (Módulo 6) para a exibição contínua de preços de ações a múltiplos usuários.
- **Consistência forte** (Módulo 3) para o saldo do usuário e a execução de ordens — um erro aqui tem consequência financeira direta, similar ao exercício de Sistema de Pagamentos.

![Order book: ordens casadas em sequência estrita](/diagrams/sd-plataforma-negociacao-acoes-matching.svg)

- **Lidando com Contenção** (Módulo 6) para evitar que o mesmo saldo seja usado para executar duas ordens simultâneas que, juntas, ultrapassariam o valor disponível.

## O que revisar depois de resolver

- O motor de matching processa ordens em sequência estrita, sem permitir que duas ordens concorrentes leiam o mesmo estado desatualizado do order book?
- A validação de saldo/posição acontece atomicamente com a execução da ordem, não antes dela?
- A separação entre exibição de preço (alta leitura) e execução de ordem (crítica, sequencial) foi justificada?
