---
slug: uber
categorySlug: system-design
title: "Exercício: Projetar um Serviço de Transporte (estilo Uber)"
navTitle: Serviço de Transporte
summary: Projete um sistema de transporte sob demanda que conecta passageiros a motoristas próximos, calcula uma rota e um preço estimado, e acompanha a corrida em tempo real.
level: avancado
order: 122
section: exercicios-praticos
group: "Localização e entrega"
---

## Objetivos de aprendizagem

- [ ] Praticar busca por proximidade em larga escala e atualização de localização em tempo real
- [ ] Decidir como evitar que dois passageiros sejam associados ao mesmo motorista

## Enunciado

Projete um sistema de transporte sob demanda que conecta passageiros a motoristas próximos, calcula uma rota e um preço estimado, e acompanha a corrida em tempo real.

![Transporte: matching motorista-passageiro](/diagrams/sd-uber.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual a escala esperada de motoristas e passageiros ativos simultaneamente em uma mesma região?
- O sistema precisa lidar com precificação dinâmica (preço variando por demanda)?
- É necessário mostrar a localização do motorista em tempo real para o passageiro?

## Requisitos funcionais (exemplos)

- Solicitar uma corrida a partir da localização atual do passageiro.
- Encontrar e propor o motorista disponível mais próximo.
- Acompanhar a localização do motorista durante o trajeto até o embarque e durante a corrida.
- Calcular e exibir o preço estimado antes da confirmação.

## Requisitos não-funcionais (exemplos)

- **Escala:** dezenas de milhares de motoristas e passageiros ativos por região metropolitana, com atualização de localização a cada poucos segundos por motorista.
- **Latência:** encontrar candidatos próximos e confirmar o match em menos de 1-2 segundos.
- **Disponibilidade:** alta para busca e matching — indisponibilidade nesse fluxo é indisponibilidade do produto inteiro.
- **Consistência:** forte no momento da atribuição do motorista (não pode haver dois passageiros "vencendo" o mesmo motorista); eventual é aceitável para o histórico de localização.
- **Leitura vs. escrita:** escrita constante e intensa (localização de cada motorista, a cada poucos segundos) combinada com leitura sob demanda no momento da busca.

## Tecnologias que podem ser usadas

- **Load balancer:** distribuindo tráfego de API entre instâncias sem estado.
- **Índice de proximidade:** geo-hash ou quadtree em memória (Redis com comandos geo, ou uma estrutura própria) para localizar motoristas próximos rapidamente.
- **Armazenamento:** banco relacional (Postgres) para corridas e pagamentos; banco otimizado para escrita frequente (Cassandra/DynamoDB) para o fluxo contínuo de localização.
- **Tempo real:** WebSockets ou long-polling para atualizar a localização do motorista na tela do passageiro.

## Pontos centrais a explorar (deep dive sugerido)

- **Padrão de Proximidade** (Módulo 6): como encontrar rapidamente os motoristas mais próximos de um passageiro, sem calcular distância para todos os motoristas da cidade.

![Grid geo-particionado + lock de atribuição evita double-match](/diagrams/sd-uber-matching.svg)

- **Atualizações em Tempo Real** (Módulo 6): como a localização do motorista chega ao passageiro durante a corrida.
- **Lidando com Contenção** (Módulo 6): como evitar que dois passageiros sejam associados ao mesmo motorista simultaneamente.

## O que revisar depois de resolver

- O índice de proximidade escolhido evita varrer todos os motoristas da cidade a cada busca?
- O mecanismo de lock/atribuição foi explicado com clareza — o que acontece se o passageiro não confirmar a tempo?
- A separação entre dado de localização (alta escrita) e dado transacional (corrida, pagamento) foi justificada?
