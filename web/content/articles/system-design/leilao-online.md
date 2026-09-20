---
slug: leilao-online
categorySlug: system-design
title: "Exercício: Projetar um Sistema de Leilão Online"
navTitle: Sistema de Leilão Online
summary: Projete um sistema de leilão online, onde usuários fazem lances por um item dentro de um período de tempo definido, e o maior lance ao final do prazo vence.
level: avancado
order: 39
section: exercicios-praticos
---

## Objetivos de aprendizagem

- [ ] Praticar serialização de operações concorrentes sobre o mesmo recurso
- [ ] Decidir o nível de consistência necessário quando o erro tem consequência financeira

## Enunciado

Projete um sistema de leilão online, onde usuários fazem lances por um item dentro de um período de tempo definido, e o maior lance ao final do prazo vence.

![Leilão: lances com ordenação](/diagrams/sd-leilao-online.svg)

## Perguntas orientadoras (levantamento de requisitos)

- O que acontece quando dois lances muito próximos no tempo competem pelo mesmo item?
- Os participantes precisam ver os lances de outros em tempo real?
- Existe alguma regra de extensão automática do prazo se um lance for feito nos últimos segundos?

## Requisitos funcionais (exemplos)

- Fazer um lance em um item de leilão ativo.
- Rejeitar um lance que não seja maior que o lance atual.
- Exibir o lance atual e o histórico de lances em tempo real.
- Encerrar o leilão no prazo e declarar o lance vencedor.

## Requisitos não-funcionais (exemplos)

- **Escala:** picos de lances concentrados nos últimos segundos de leilões concorridos.
- **Latência:** confirmação de lance em menos de 1 segundo, para não frustrar quem está disputando ativamente.
- **Disponibilidade:** alta, mas nunca à custa de aceitar dois lances vencedores simultâneos.
- **Consistência:** forte sobre o "lance atual" de um item — dois lances concorrentes não podem os dois ler o mesmo estado desatualizado e passar.
- **Leitura vs. escrita:** leitura (acompanhar o leilão) muito maior que escrita (dar lance), mas a escrita é o ponto crítico de corretude.

## Tecnologias que podem ser usadas

- **Armazenamento:** banco relacional (Postgres) com transação serializada por item de leilão para validar e registrar cada lance.
- **Fila por item:** serializar lances concorrentes do mesmo item numa fila lógica, processando em ordem de chegada.
- **Tempo real:** WebSockets para propagar o lance atual a todos os participantes assistindo o leilão.
- **Cache:** valor do lance atual em memória (Redis) para leitura rápida, sempre atualizado após a escrita confirmada.

## Pontos centrais a explorar (deep dive sugerido)

- **Lidando com Contenção** (Módulo 6): garantir que, entre dois lances concorrentes muito próximos, apenas o maior seja aceito como válido, sem condição de corrida.

![Dois lances quase simultâneos, serializados por fila/lock](/diagrams/sd-leilao-online-contencao.svg)

- **Atualizações em Tempo Real** (Módulo 6) para notificar todos os participantes sobre novos lances no leilão.
- Consistência forte (Módulo 3) para o valor do lance vencedor, já que um erro aqui tem consequência financeira direta.

## O que revisar depois de resolver

- A validação "este lance é maior que o atual" e o registro do lance acontecem de forma atômica, sem janela de corrida?
- A propagação em tempo real do lance atual foi desenhada sem atrasar a validação do próximo lance?
- A regra de extensão de prazo (se existir) foi tratada como parte do mesmo fluxo consistente?
