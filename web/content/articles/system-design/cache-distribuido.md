---
slug: cache-distribuido
categorySlug: system-design
title: "Exercício: Projetar um Sistema de Cache Distribuído"
navTitle: Sistema de Cache Distribuído
summary: Projete o próprio serviço de cache distribuído (não um sistema que apenas *usa* cache) — pense em como um Redis ou Memcached são construídos por dentro, capaz de escalar entre múltiplos nós.
level: avancado
order: 134
section: exercicios-praticos
group: "Infraestrutura e ferramentas"
---

## Objetivos de aprendizagem

- [ ] Praticar a técnica de distribuir chaves entre nós minimizando redistribuição
- [ ] Decidir o trade-off entre simplicidade e disponibilidade num serviço que é, ele mesmo, infraestrutura de cache

## Enunciado

Projete o próprio serviço de cache distribuído (não um sistema que apenas *usa* cache) — pense em como um Redis ou Memcached são construídos por dentro, capaz de escalar entre múltiplos nós.

![Cache distribuído: nós + hashing](/diagrams/sd-cache-distribuido.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual política de expiração e remoção de itens o cache deve suportar (TTL, LRU)?
- Como os dados devem ser distribuídos entre múltiplos nós de cache?
- O que acontece quando um nó de cache falha — os dados nele são perdidos, ou existe réplica?

## Requisitos funcionais (exemplos)

- Armazenar um par chave-valor com TTL opcional.
- Buscar um valor por chave, roteando para o nó correto.
- Remover itens quando a capacidade máxima do nó é atingida.
- Redistribuir chaves de forma mínima quando um nó é adicionado ou removido.

## Requisitos não-funcionais (exemplos)

- **Escala:** o próprio cache precisa escalar horizontalmente conforme o volume de chaves cresce — é o produto, não um componente auxiliar.
- **Latência:** leitura e escrita em microssegundos/poucos milissegundos — essa é a razão de existir de um cache.
- **Disponibilidade:** alta é desejável, mas o exercício pede para decidir explicitamente o quanto vale a pena pagar por réplicas.
- **Consistência:** fraca é aceitável — um cache que serve um valor ligeiramente desatualizado raramente é um problema grave.
- **Leitura vs. escrita:** tipicamente dominado por leitura, mas o desenho precisa suportar escrita rápida também.

## Tecnologias que podem ser usadas

- **Distribuição de chaves:** consistent hashing para minimizar redistribuição ao escalar nós.
- **Armazenamento em memória:** estrutura de hash table por nó, com política de remoção (LRU, LFU) configurável.
- **Réplicas:** replicação assíncrona entre nós vizinhos no anel, como decisão explícita de trade-off.
- **Descoberta de nós:** um serviço leve de membership (gossip protocol ou um coordenador central simples) para saber quais nós estão ativos.

## Pontos centrais a explorar (deep dive sugerido)

- **Consistent Hashing** (Módulo 2): a técnica central para distribuir chaves entre nós de cache, minimizando redistribuição quando nós são adicionados ou removidos.

![Consistent hashing: chave no anel → próximo nó](/diagrams/sd-consistent-hashing.svg)

- Política de remoção quando o cache atinge sua capacidade máxima (ex: LRU — remover o item menos recentemente usado).
- Trade-off entre simplicidade (aceitar perda de dados de um nó que cai, já que é "apenas" cache) e réplicas (mais complexidade, porém maior disponibilidade).

## O que revisar depois de resolver

- O roteamento de uma chave para o nó correto foi explicado de ponta a ponta (cliente → hash → nó)?
- A política de remoção escolhida (LRU ou outra) foi justificada, não apenas nomeada?
- A decisão sobre réplicas foi explicitamente comparada com o custo de simplesmente aceitar perda de dados num nó?
