---
slug: elasticsearch-shards-busca
categorySlug: system-design
title: "Shards, réplicas e o caminho de uma busca"
navTitle: Shards e scatter-gather
summary: "Entender como o índice é dividido em shards e como o coordenador espalha e reúne uma busca"
level: intermediario
order: 74
section: deep-dives-tecnologias
group: "Elasticsearch"
---

## Objetivos de aprendizagem

- [ ] Diferenciar shards primários e réplicas
- [ ] Descrever o scatter-gather de uma busca distribuída

*Retomando o cenário da unidade: uma plataforma de vagas de emprego, em que candidatos buscam por palavra-chave, com filtros de localização e salário e ordenação por relevância.*

## Arquitetura distribuída: shards, réplicas e o coordinating node

### Shards: dividindo o índice

Assim como um banco de dados particionado (Módulo 2), um índice do Elasticsearch é dividido em **shards primários**, cada um hospedado potencialmente em um nó diferente do cluster — cada shard é, na prática, seu próprio índice invertido menor e independente. Isso permite que o índice inteiro (e a carga de busca sobre ele) seja distribuído entre múltiplas máquinas.

### Réplicas: disponibilidade e throughput extra

Cada shard primário pode ter uma ou mais **réplicas** — cópias completas daquele shard em outros nós. Réplicas servem dois propósitos: tolerância a falha (se o nó com o shard primário cair, uma réplica assume) e throughput adicional de leitura (buscas podem ser atendidas por qualquer réplica, distribuindo a carga).

### O caminho de uma busca: scatter-gather

Quando uma busca chega, um nó **coordenador** a recebe, a distribui ("scatter") para uma cópia (primária ou réplica) de cada shard relevante do índice, e cada shard executa a busca localmente sobre seu próprio índice invertido, retornando seus melhores resultados locais com uma pontuação de relevância. O coordenador então combina ("gather") esses resultados parciais de todos os shards, ordena globalmente por relevância, e devolve apenas o topo dessa lista combinada ao cliente.

![Busca distribuída: scatter para os shards, gather no coordenador](/diagrams/elasticsearch-scatter-gather.svg)

**Uma implicação prática que vale mencionar**: como cada shard calcula sua pontuação de relevância isoladamente (sem saber a distribuição de termos nos outros shards), a relevância de um documento pode, em teoria, variar ligeiramente dependendo de como os documentos foram distribuídos entre shards — um detalhe fino que raramente importa na prática, mas que demonstra entendimento de como o sistema realmente funciona por dentro.

## Lembre

- Cada **shard** é um índice invertido menor e independente.
- **Réplicas** dão tolerância a falhas e leitura extra.
- Busca = **scatter** (espalhar aos shards) + **gather** (reunir e ordenar no coordenador).
