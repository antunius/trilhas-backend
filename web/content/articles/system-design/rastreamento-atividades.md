---
slug: rastreamento-atividades
categorySlug: system-design
title: "Exercício: Projetar um Sistema de Rastreamento de Atividades (estilo Strava)"
navTitle: Sistema de Rastreamento de Atividades
summary: "Projete um sistema que registra atividades físicas de usuários (corrida, ciclismo), incluindo o trajeto percorrido (uma sequência de coordenadas GPS), distância, tempo e permite comparar desempenho com outros usuários em trechos específicos."
level: avancado
order: 130
section: exercicios-praticos
group: "Dados em larga escala"
---

## Objetivos de aprendizagem

- [ ] Praticar modelagem de dados para séries temporais/geoespaciais longas
- [ ] Decidir o que processar de forma síncrona vs. assíncrona após uma atividade

## Enunciado

Projete um sistema que registra atividades físicas de usuários (corrida, ciclismo), incluindo o trajeto percorrido (uma sequência de coordenadas GPS), distância, tempo e permite comparar desempenho com outros usuários em trechos específicos.

![Atividades: ingestão de pontos GPS](/diagrams/sd-rastreamento-atividades.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Com que frequência o dispositivo do usuário envia atualizações de localização durante a atividade?
- É necessário processar a atividade em tempo real, ou o processamento pode ser feito após o fim da atividade?
- Como funciona a comparação de desempenho entre usuários em um mesmo trecho de rota?

## Requisitos funcionais (exemplos)

- Registrar uma sequência de coordenadas GPS ao longo de uma atividade.
- Calcular distância, tempo e ritmo médio da atividade.
- Detectar quando uma atividade passa por um trecho conhecido e comparar o tempo com outros usuários.
- Exibir um quadro de líderes (leaderboard) por trecho.

## Requisitos não-funcionais (exemplos)

- **Escala:** milhões de atividades por dia, cada uma com centenas a milhares de pontos GPS.
- **Latência:** o registro de pontos durante a atividade pode ser em lote (não precisa ser ponto a ponto síncrono); o resumo final pode levar alguns segundos para processar.
- **Disponibilidade:** alta para salvar a atividade — perder dados de uma corrida é uma péssima experiência.
- **Consistência:** eventual é aceitável para o leaderboard — ele pode demorar um pouco para refletir uma nova atividade.
- **Leitura vs. escrita:** escrita concentrada (pontos GPS durante a atividade), leitura concentrada em consultas de histórico e leaderboard.

## Tecnologias que podem ser usadas

- **Armazenamento de trajeto:** um formato compacto (ex.: polyline codificada) num banco orientado a documentos ou blob storage, separado dos metadados da atividade.
- **Fila de mensagens:** para disparar o processamento assíncrono pós-atividade (cálculo de recordes em trechos).
- **Leaderboard:** conjunto ordenado (sorted set) em Redis por trecho, para inserção e leitura eficientes sem reordenar tudo a cada atualização.
- **Processamento em lote:** job assíncrono (Módulo 6) para os cálculos mais pesados de comparação de trechos.

## Pontos centrais a explorar (deep dive sugerido)

- Modelagem de dados eficiente para uma sequência longa de coordenadas GPS por atividade.
- **Tarefas de Longa Duração** (Módulo 6): cálculos mais pesados (como identificar recordes em trechos específicos) podem ser processados de forma assíncrona após o término da atividade.

![Conjunto ordenado por trecho, atualizado após o fim da atividade](/diagrams/sd-rastreamento-atividades-leaderboard.svg)

- Cache e ranqueamento (Módulo 2 e 6) para os quadros de líderes (leaderboards) de trechos populares, revisitando o mesmo raciocínio de conjuntos ordenados visto no deep dive de Redis (Módulo 5).

## O que revisar depois de resolver

- A sequência de pontos GPS foi modelada separadamente dos metadados de resumo da atividade (distância, tempo)?
- O cálculo de recordes por trecho acontece fora do caminho síncrono de salvar a atividade?
- O leaderboard usa uma estrutura que evita reordenar tudo a cada nova atividade registrada?
