---
slug: ticketmaster
categorySlug: system-design
title: "Exercício: Projetar um Sistema de Venda de Ingressos (estilo Ticketmaster)"
navTitle: Sistema de Venda de Ingressos
summary: Projete um sistema de venda de ingressos para eventos, onde múltiplos usuários competem por um número limitado de assentos, sem permitir venda duplicada do mesmo assento.
level: avancado
order: 125
section: exercicios-praticos
group: "Transações e concorrência"
---

## Objetivos de aprendizagem

- [ ] Praticar controle de contenção sob alta concorrência
- [ ] Decidir como escalar leitura de disponibilidade separadamente da escrita de compra

## Enunciado

Projete um sistema de venda de ingressos para eventos, onde múltiplos usuários competem por um número limitado de assentos, sem permitir venda duplicada do mesmo assento.

![Ingressos: inventário sob contenção](/diagrams/sd-ticketmaster.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Os assentos são numerados individualmente, ou existem apenas categorias/lotes sem assento específico?
- Quanto tempo um usuário tem para concluir a compra depois de selecionar um assento?
- O sistema precisa suportar picos extremos de tráfego no início da venda de um evento popular?

## Requisitos funcionais (exemplos)

- Visualizar o mapa de assentos disponíveis de um evento.
- Reservar temporariamente um assento por um tempo limitado.
- Confirmar a compra dentro da janela de reserva.
- Liberar automaticamente o assento se o pagamento não for concluído a tempo.

## Requisitos não-funcionais (exemplos)

- **Escala:** picos de dezenas de milhares de usuários simultâneos disputando os mesmos assentos no lançamento de um evento popular.
- **Latência:** confirmação de reserva precisa ser rápida (segundos), mesmo sob pico.
- **Disponibilidade:** alta para visualização de assentos; a etapa de reserva pode aplicar fila/espera controlada em vez de cair.
- **Consistência:** forte na reserva do assento — é o requisito central do exercício, nunca vender o mesmo assento duas vezes.
- **Leitura vs. escrita:** leitura (visualizar mapa) muito maior que escrita (comprar de fato).

## Tecnologias que podem ser usadas

- **Armazenamento:** banco relacional (Postgres) com transações e lock otimista (coluna de versão) para o estado do assento.
- **Cache:** Redis com TTL para representar o "hold" temporário, evitando escrever no banco principal a cada tentativa.
- **Fila de espera:** um mecanismo de fila virtual (sala de espera) na frente do checkout durante picos extremos.
- **Escalando leituras:** réplicas de leitura ou cache para a página de mapa de assentos, separada do caminho de escrita da compra.

## Pontos centrais a explorar (deep dive sugerido)

- **Lidando com Contenção** (Módulo 6): esse é o problema central do exercício — como reservar temporariamente um assento sem permitir dupla venda, e como liberar a reserva automaticamente se o pagamento não for concluído a tempo.

![Máquina de estados do assento](/diagrams/sd-ticketmaster-reserva.svg)

- Modelagem de dados para o estado do assento (disponível, reservado temporariamente, vendido).
- Escalando leituras (Módulo 6) para a página de visualização de assentos disponíveis, que recebe tráfego muito maior que o de compras efetivas.

## O que revisar depois de resolver

- A transição de "disponível" para "reservado" foi desenhada como uma operação atômica, sem janela para condição de corrida?
- O mecanismo de expiração do hold foi explicado (quem libera o assento, e quando)?
- A separação entre tráfego de leitura (mapa de assentos) e escrita (compra) foi justificada com a proporção esperada entre os dois?
