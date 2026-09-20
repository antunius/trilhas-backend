---
slug: busca-locais-proximos
categorySlug: system-design
title: "Exercício: Projetar um Sistema de Busca de Locais Próximos (estilo Yelp)"
navTitle: Sistema de Busca de Locais Próximos
summary: Projete um sistema que permite buscar estabelecimentos (restaurantes, lojas) próximos a uma localização, filtrando por categoria e ordenando por avaliação ou distância.
level: avancado
order: 40
section: exercicios-praticos
---

## Objetivos de aprendizagem

- [ ] Praticar combinação de índice geográfico com busca textual/estruturada
- [ ] Decidir como manter dois sistemas (índice de busca e banco principal) consistentes entre si

## Enunciado

Projete um sistema que permite buscar estabelecimentos (restaurantes, lojas) próximos a uma localização, filtrando por categoria e ordenando por avaliação ou distância.

![Yelp-like: geo + ranking](/diagrams/sd-busca-locais-proximos.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual o volume de estabelecimentos cadastrados, e com que frequência novos são adicionados?
- A busca precisa combinar texto livre (nome do estabelecimento) com filtros estruturados (categoria, distância)?
- As avaliações e notas são atualizadas com que frequência?

## Requisitos funcionais (exemplos)

- Buscar estabelecimentos próximos a uma localização.
- Filtrar por categoria e ordenar por avaliação ou distância.
- Combinar busca textual livre com os filtros estruturados.
- Atualizar a avaliação média de um estabelecimento conforme novas avaliações chegam.

## Requisitos não-funcionais (exemplos)

- **Escala:** milhões de estabelecimentos cadastrados; buscas concentradas em áreas urbanas densas.
- **Latência:** resultado de busca em poucas centenas de milissegundos.
- **Disponibilidade:** alta para leitura (busca); atualização de cadastro pode tolerar propagação com pequeno atraso.
- **Consistência:** eventual entre o índice de busca e o banco principal é aceitável.
- **Leitura vs. escrita:** fortemente dominado por leitura (buscas) sobre escrita (novos cadastros, novas avaliações).

## Tecnologias que podem ser usadas

- **Índice de proximidade:** geo-hash para recortar candidatos próximos antes de qualquer outro filtro.
- **Busca:** Elasticsearch para combinar texto livre com filtros estruturados (categoria) sobre os candidatos já recortados.
- **Armazenamento:** banco relacional (Postgres) como fonte de verdade dos estabelecimentos.
- **Sincronização:** CDC ou job assíncrono para propagar mudanças do banco principal para o índice de busca.
- **Cache:** resultados de buscas populares (ex.: "restaurantes italianos" numa região de alta demanda).

## Pontos centrais a explorar (deep dive sugerido)

- **Proximidade** (Módulo 6) combinada com **Elasticsearch** (Módulo 5) quando a busca também envolve texto livre e múltiplos filtros combinados.

![Grade geohash filtra candidatos antes do ranqueamento por texto](/diagrams/sd-busca-locais-proximos-geoindex.svg)

- Estratégia de cache para resultados de busca populares (ex.: "restaurantes italianos" em uma região de alta demanda).
- Como manter a consistência entre o índice de busca e o banco principal de estabelecimentos, dado que provavelmente são sistemas separados.

## O que revisar depois de resolver

- A busca recorta candidatos por proximidade antes de aplicar o ranqueamento por texto/avaliação, em vez de pontuar a cidade inteira?
- O mecanismo de sincronização entre banco principal e índice de busca foi explicado (CDC, job, dupla escrita)?
- O cache de buscas populares foi justificado pelo padrão de leitura, e invalidado quando o dado muda?
