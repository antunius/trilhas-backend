---
slug: agregador-cliques-anuncios
categorySlug: system-design
title: "Exercício: Projetar um Agregador de Cliques em Anúncios"
navTitle: Agregador de Cliques em Anúncios
summary: "Projete um sistema que recebe um volume altíssimo de eventos de clique em anúncios, e produz métricas agregadas (ex: cliques por anúncio, por minuto) quase em tempo real."
level: avancado
order: 37
section: exercicios-praticos
---

## Objetivos de aprendizagem

- [ ] Praticar agregação em janelas de tempo sobre um stream de alto volume
- [ ] Decidir como deduplicar eventos sem inflar métricas

## Enunciado

Projete um sistema que recebe um volume altíssimo de eventos de clique em anúncios, e produz métricas agregadas (ex: cliques por anúncio, por minuto) quase em tempo real.

![Cliques: ingestão → agregação](/diagrams/sd-agregador-cliques-anuncios.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual o volume esperado de eventos de clique por segundo?
- Que tipo de agregação é necessária (por anúncio, por campanha, por período de tempo)?
- É aceitável que a métrica agregada tenha um pequeno atraso em relação ao clique real?

## Requisitos funcionais (exemplos)

- Receber um evento de clique em um anúncio.
- Agregar cliques por anúncio (e por campanha) em janelas de tempo.
- Expor a métrica agregada para consulta (dashboard, API).
- Evitar contar o mesmo clique duas vezes.

## Requisitos não-funcionais (exemplos)

- **Escala:** volume altíssimo de eventos por segundo, com picos correlacionados a campanhas populares.
- **Latência:** "quase em tempo real" — segundos a poucos minutos de atraso na métrica agregada é aceitável.
- **Disponibilidade:** a ingestão não pode perder eventos mesmo sob pico; atraso é preferível a perda.
- **Consistência:** eventual — a métrica pode demorar para refletir o clique mais recente, mas precisa convergir para o valor correto.
- **Leitura vs. escrita:** escrita (ingestão) domina em volume; leitura (consulta da métrica agregada) é bem menor e menos frequente.

## Tecnologias que podem ser usadas

- **Filas e Sistemas de Mensageria** (Módulo 2): Kafka ou equivalente para absorver o volume de eventos sem perder nenhum.
- **Processamento de stream:** Flink ou motor equivalente (Módulo 5) para calcular agregações em janelas de tempo continuamente.
- **Armazenamento do agregado:** banco otimizado para série temporal ou um banco chave-valor simples, indexado por anúncio + janela de tempo.
- **Deduplicação:** um cache de IDs de evento recentes (Redis com TTL) para descartar reenvios.

## Pontos centrais a explorar (deep dive sugerido)

- **Filas e Sistemas de Mensageria** (Módulo 2) para absorver o volume de eventos de clique sem perder nenhum.
- **Flink** ou motor de processamento de stream equivalente (Módulo 5) para calcular agregações em janelas de tempo continuamente.

![Janelas de agregação no stream + deduplicação de eventos](/diagrams/sd-agregador-cliques-anuncios-janelas.svg)

- Como lidar com eventos duplicados (ex: o mesmo clique reportado duas vezes por uma falha de rede) sem inflar as métricas finais.

## O que revisar depois de resolver

- O tipo de janela (tumbling, sliding, etc.) foi escolhido e justificado para o caso de uso?
- A deduplicação foi resolvida sem exigir guardar todo o histórico de eventos indefinidamente?
- O que acontece com um evento que chega atrasado, depois que a janela correspondente já fechou, foi decidido explicitamente?
