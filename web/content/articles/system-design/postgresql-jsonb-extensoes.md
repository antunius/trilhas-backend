---
slug: postgresql-jsonb-extensoes
categorySlug: system-design
title: "JSONB e extensões: PostGIS e GIN"
navTitle: JSONB e extensões
summary: "Saber quando guardar JSON no PostgreSQL e como estendê-lo para busca geográfica e textual antes de adotar outra tecnologia"
level: intermediario
order: 56
section: deep-dives-tecnologias
group: "PostgreSQL"
---

## Objetivos de aprendizagem

- [ ] Escolher entre JSONB e colunas normais
- [ ] Usar PostGIS e GIN antes de introduzir uma tecnologia especializada

*Retomando o cenário da unidade: uma plataforma de reviews de restaurantes, com dados relacionais e busca de restaurantes dentro de um raio geográfico.*

## JSONB: flexibilidade dentro de um banco relacional

PostgreSQL suporta uma coluna do tipo `JSONB` (JSON armazenado em formato binário, indexável), permitindo guardar dados semi-estruturados dentro de uma tabela relacional comum. Para o nosso cenário, os metadados variáveis de um restaurante (horário de funcionamento, que muda de formato dependendo do tipo de estabelecimento, opções de comodidade como "aceita pets" ou "tem estacionamento") são um bom candidato a `JSONB` — tentar normalizar cada variação possível em colunas ou tabelas separadas geraria um esquema excessivamente complexo para um dado que, na prática, é consultado como um bloco só.

**O limite dessa flexibilidade**: dados centrais e consultados constantemente com filtros específicos (como o próprio `restaurante_id`, nome, localização) devem continuar em colunas normais e indexadas normalmente — `JSONB` é um complemento para dados variáveis e secundários, não um substituto geral para modelagem relacional adequada.

## Estendendo o PostgreSQL antes de introduzir uma tecnologia nova

### Busca geoespacial com PostGIS

Para "restaurantes num raio de 2km", a extensão PostGIS adiciona tipos de dados geoespaciais e índices especializados (baseados em uma estrutura chamada GiST) que tornam essa consulta eficiente — sem precisar introduzir um banco especializado adicional só para esse requisito. `SELECT * FROM restaurantes WHERE ST_DWithin(localizacao, ponto_usuario, 2000)` (2000 metros) é o tipo de consulta que o PostGIS resolve de forma nativa e performática.

### Busca textual com índices GIN

Para uma busca textual básica no nome ou na descrição do restaurante (sem a sofisticação de relevância avançada do Elasticsearch, mas suficiente para volumes moderados), um índice GIN sobre um campo de busca de texto completo do próprio PostgreSQL resolve isso sem introduzir o Elasticsearch — que só se justificaria se a busca precisasse de recursos mais avançados (tolerância a erros de digitação, ranqueamento sofisticado, agregações complexas) em um volume que realmente sobrecarregasse essa solução mais simples.

**O critério prático**: introduzir uma tecnologia especializada nova tem um custo real de complexidade operacional — vale reservar essa introdução para quando o requisito realmente ultrapassa o que uma extensão bem escolhida do PostgreSQL entrega.

## Lembre

- **JSONB** serve a dados variáveis e secundários; o central continua em colunas normais.
- **PostGIS** (índice GiST) resolve "restaurantes num raio de 2 km".
- Antes de introduzir uma tecnologia nova, pergunte se uma **extensão** já basta.
