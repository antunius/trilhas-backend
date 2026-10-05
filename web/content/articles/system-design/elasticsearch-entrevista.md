---
slug: elasticsearch-entrevista
categorySlug: system-design
title: "Elasticsearch na entrevista"
navTitle: Na entrevista
summary: "Saber os usos do Elasticsearch, o que diferencia respostas média e sênior e as perguntas de aprofundamento"
level: intermediario
order: 79
section: deep-dives-tecnologias
group: "Elasticsearch"
---

## Objetivos de aprendizagem

- [ ] Reconhecer os usos típicos do Elasticsearch
- [ ] Responder com o nível de profundidade esperado de um sênior

*Retomando o cenário da unidade: uma plataforma de vagas de emprego, em que candidatos buscam por palavra-chave, com filtros de localização e salário e ordenação por relevância.*

## Principais usos

- **Busca textual em e-commerce e catálogos de produtos**, combinando relevância com filtros de preço, categoria e disponibilidade.
- **Agregação de logs e observabilidade** — a pilha ELK (Elasticsearch, Logstash/Beats, Kibana) é um padrão de mercado para centralizar e consultar logs de aplicações distribuídas.
- **Autocomplete e sugestões de busca**, usando analyzers especializados (ex: edge n-grams) para responder a buscas parciais em tempo real.
- **Dashboards analíticos sobre dados semiestruturados**, agregando métricas (contagens, médias, percentis) sobre grandes volumes de documentos sem um schema relacional rígido.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "Elasticsearch serve para busca rápida" e menciona "índice invertido" de forma genérica |
| Sênior | Explica o índice invertido com um exemplo concreto, descreve o fluxo scatter-gather, e reconhece explicitamente o atraso de sincronização entre o banco principal e o índice |
| Staff+ | Além do acima, discute hot shards e como mitigá-los, menciona o trade-off entre número de shards (mais paralelismo) e overhead de coordenação (mais shards para consultar e combinar por busca), e propõe reconciliação periódica para lidar com drift entre fonte de verdade e índice |

## Erros comuns

- Tratar Elasticsearch como um substituto do banco de dados principal, e não como um índice derivado, alimentado a partir dele.
- Não mencionar o atraso de sincronização (near-real-time) entre uma escrita e ela se tornar buscável.
- Ignorar completamente como a relevância é calculada, tratando a busca como puramente binária (corresponde ou não corresponde).

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se o pipeline que sincroniza o banco principal com o Elasticsearch cair por uma hora?" (o índice fica desatualizado por esse período; um mecanismo de reconciliação ou reprocessamento é necessário para recuperar).
- "Por que aumentar o número de shards não melhora a performance indefinidamente?" (mais shards significa mais overhead de coordenação — o coordenador precisa consultar e combinar resultados de cada um).
- "Como você lidaria com uma busca que corresponde a milhões de documentos?" (paginação, e cuidado especial com paginação profunda, que é computacionalmente cara nesse tipo de sistema).

## Lembre

- Elasticsearch costuma ser um **índice derivado**, com a fonte de verdade em outro banco.
- Fale de **near-real-time** e **hot shards** sem ser perguntado.
- Busca com relevância e filtros é o seu ponto forte; transação, não.
