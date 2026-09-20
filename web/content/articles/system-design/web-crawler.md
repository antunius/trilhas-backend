---
slug: web-crawler
categorySlug: system-design
title: "Exercício: Projetar um Web Crawler Distribuído"
navTitle: Web Crawler Distribuído
summary: Projete um sistema que navega pela web automaticamente, baixando e indexando páginas, seguindo links encontrados em cada página visitada.
level: avancado
order: 32
section: exercicios-praticos
---

## Objetivos de aprendizagem

- [ ] Praticar deduplicação eficiente em larga escala
- [ ] Decidir como distribuir o trabalho de rastreamento entre múltiplos workers

## Enunciado

Projete um sistema que navega pela web automaticamente, baixando e indexando páginas, seguindo links encontrados em cada página visitada.

![Crawler: frontier → fetch → index](/diagrams/sd-web-crawler.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual o volume de páginas a serem rastreadas, e com que frequência páginas já visitadas devem ser revisitadas?
- Como evitar visitar a mesma página múltiplas vezes desnecessariamente?
- É necessário respeitar regras de exclusão de rastreamento definidas pelos sites (ex: robots.txt)?

## Requisitos funcionais (exemplos)

- Baixar uma página a partir de uma URL na fila de rastreamento.
- Extrair links da página baixada e enfileirá-los para visita futura.
- Evitar revisitar uma URL já processada.
- Respeitar as regras de `robots.txt` do domínio antes de rastrear.

## Requisitos não-funcionais (exemplos)

- **Escala:** bilhões de URLs no espaço de rastreamento, com workers rodando em paralelo continuamente.
- **Latência:** não é o foco — o sistema é um pipeline em lote/contínuo, não um caminho de resposta a usuário.
- **Disponibilidade:** tolerante a falha de workers individuais — perder um worker não deve travar o rastreamento.
- **Consistência:** eventual é suficiente — revisitar uma página com atraso não é um problema grave.
- **Educado com os sites:** limite de taxa por domínio para não sobrecarregar um único site.

## Tecnologias que podem ser usadas

- **Fila distribuída:** para a frontier de URLs, particionada por domínio para não sobrecarregar um site só.
- **Deduplicação:** filtro de Bloom para "já visitado?" em memória, sem precisar de uma consulta ao banco por URL.
- **Blobs Grandes:** armazenamento de objetos (S3 ou equivalente) para o conteúdo bruto das páginas.
- **Índice:** Elasticsearch ou motor de busca dedicado, alimentado de forma assíncrona a partir do conteúdo baixado.

## Pontos centrais a explorar (deep dive sugerido)

- Fila de URLs a serem visitadas, distribuída entre múltiplos workers rastreando em paralelo.
- Deduplicação eficiente de URLs já visitadas, mesmo em volume muito grande (estruturas como filtros de Bloom costumam ser mencionadas aqui).

![Frontier distribuída + filtro de Bloom para deduplicação](/diagrams/sd-web-crawler-frontier.svg)

- **Blobs Grandes** (Módulo 6) para armazenar o conteúdo bruto de cada página baixada, separado dos metadados de rastreamento.

## O que revisar depois de resolver

- A deduplicação evita uma consulta cara ao banco por URL visitada?
- A distribuição de trabalho entre workers evita sobrecarregar um único domínio?
- O armazenamento do conteúdo bruto está separado da metadata de rastreamento, e isso foi justificado?
