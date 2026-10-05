---
slug: entrega-local
categorySlug: system-design
title: "Exercício: Projetar um Serviço de Entrega Local (estilo Gopuff/iFood)"
navTitle: Serviço de Entrega Local
summary: Projete um serviço que conecta usuários a lojas ou restaurantes próximos, permite fazer um pedido, e acompanha a entrega até o endereço do usuário.
level: avancado
order: 122
section: exercicios-praticos
group: "Localização e entrega"
---

## Objetivos de aprendizagem

- [ ] Praticar busca por proximidade combinada com controle de estoque sob concorrência
- [ ] Decidir como rastrear a entrega em tempo real

## Enunciado

Projete um serviço que conecta usuários a lojas ou restaurantes próximos, permite fazer um pedido, e acompanha a entrega até o endereço do usuário.

![Entrega: pedidos + rastreio](/diagrams/sd-entrega-local.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Como o sistema decide quais lojas/restaurantes mostrar para um usuário, com base em sua localização?
- É necessário mostrar a localização do entregador em tempo real?
- Como lidar com a disponibilidade de itens no estoque de uma loja específica no momento do pedido?

## Requisitos funcionais (exemplos)

- Listar lojas/restaurantes próximos à localização do usuário.
- Fazer um pedido com itens disponíveis em uma loja específica.
- Acompanhar o status e a localização da entrega em tempo real.
- Recusar um item que ficou indisponível entre a navegação e a confirmação do pedido.

## Requisitos não-funcionais (exemplos)

- **Escala:** dezenas de milhares de pedidos simultâneos por região metropolitana em horário de pico.
- **Latência:** listagem de lojas próximas e confirmação de pedido em poucos segundos.
- **Disponibilidade:** alta para navegação e pedido; rastreamento pode tolerar atraso momentâneo sem quebrar a experiência.
- **Consistência:** forte no decremento de estoque de um item (não pode vender o mesmo item esgotado duas vezes); eventual é aceitável para a localização do entregador.
- **Leitura vs. escrita:** leitura (navegar cardápio/estoque) muito maior que escrita (pedido efetivo).

## Tecnologias que podem ser usadas

- **Índice de proximidade:** geo-hash para localizar lojas próximas ao usuário.
- **Armazenamento:** banco relacional (Postgres) com transações para o estoque por loja, evitando venda duplicada do último item.
- **Tempo real:** WebSockets ou push notification para a localização do entregador durante a entrega.
- **Fila de mensagens:** para desacoplar a confirmação do pedido do processamento pela loja.

## Pontos centrais a explorar (deep dive sugerido)

- **Proximidade** (Módulo 6): filtrar lojas/restaurantes próximos ao usuário de forma eficiente.
- **Atualizações em Tempo Real** (Módulo 6) para o rastreamento da entrega.
- **Lidando com Contenção** (Módulo 6) para evitar vender um item que acabou de esgotar no estoque de uma loja específica.

![Decremento de estoque sob contenção: último item, duas compras](/diagrams/sd-entrega-local-estoque.svg)

## O que revisar depois de resolver

- O decremento de estoque é uma operação atômica, sem janela para dupla venda do último item?
- O rastreamento em tempo real foi desenhado sem exigir polling agressivo do cliente?
- A busca por lojas próximas evita calcular distância contra todas as lojas cadastradas?
