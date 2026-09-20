---
slug: outros-problemas
categorySlug: system-design
title: Outros Problemas Clássicos (Rate Limiter, Busca, etc.)
navTitle: Outros Problemas Clássicos
summary: Praticar o framework em problemas variados, fora dos exercícios já detalhados
level: avancado
order: 26
section: exercicios-praticos
---

## Objetivos de aprendizagem

- [ ] Praticar o framework em problemas variados, fora dos exercícios já detalhados
- [ ] Ganhar repertório para lidar com enunciados menos familiares

![Problemas clássicos: rate limit / busca / reservas](/diagrams/sd-outros-problemas.svg)

## Enunciados sugeridos para prática adicional

### Rate limiter (limitador de requisições)

Projete um sistema que limita o número de requisições que um cliente pode fazer a uma API em um determinado intervalo de tempo. Pontos a explorar: onde o limitador deve viver (na borda, próximo ao load balancer, ou dentro de cada serviço?), como manter contagem de requisições de forma eficiente e distribuída entre múltiplas instâncias.

**Requisitos funcionais (exemplos):** aceitar ou rejeitar uma requisição com base no limite do cliente; informar ao cliente quantas requisições ainda restam (ex.: headers `X-RateLimit-*`); permitir limites diferentes por cliente/plano.

**Requisitos não-funcionais (exemplos):** decisão de aceitar/rejeitar em microssegundos, sem virar gargalo; alta disponibilidade (um limitador fora do ar não pode derrubar a API inteira); consistência aproximada é aceitável — errar por 1-2 requisições a mais não é grave.

**Tecnologias que podem ser usadas:** Redis como contador compartilhado (`INCR` + TTL) entre instâncias; camada de borda (API Gateway, Envoy) como local natural do limitador.

![Token bucket vs. sliding window](/diagrams/sd-outros-problemas-rate-limiter.svg)

### Sistema de busca

Projete um sistema de busca por texto sobre um grande volume de documentos. Pontos a explorar: a diferença entre buscar por igualdade exata (favorecendo índices tradicionais) e busca textual livre (favorecendo índices invertidos), e como manter esse índice atualizado conforme novos documentos são adicionados.

**Requisitos funcionais (exemplos):** buscar documentos por termo livre; ordenar resultados por relevância; filtrar por metadados estruturados (categoria, data).

**Requisitos não-funcionais (exemplos):** latência de busca abaixo de algumas centenas de milissegundos; leitura domina fortemente sobre escrita; consistência eventual entre o índice de busca e a fonte de dados é aceitável.

**Tecnologias que podem ser usadas:** Elasticsearch/OpenSearch para o índice invertido; um banco relacional ou de documentos como fonte de verdade, sincronizado por CDC ou job assíncrono.

### Sistema de reservas (ingressos, assentos, hotéis)

Projete um sistema onde múltiplos usuários competem por um número limitado de recursos (assentos, quartos). Pontos a explorar: como evitar que duas pessoas reservem o mesmo recurso simultaneamente (problema clássico de condição de corrida), e qual nível de consistência é necessário nesse fluxo específico.

**Requisitos funcionais (exemplos):** consultar disponibilidade; reservar temporariamente um recurso; confirmar ou expirar a reserva.

**Requisitos não-funcionais (exemplos):** consistência forte na reserva do recurso (nunca vender o mesmo assento duas vezes); disponibilidade alta na consulta; picos de tráfego concentrados no lançamento.

**Tecnologias que podem ser usadas:** banco relacional com transações e lock otimista/pessimista (Postgres); Redis com TTL para reservas temporárias.

## Como praticar

Para cada enunciado, siga o framework completo do Módulo 1 do início ao fim, cronometrando o tempo. Ao final, revise: quais tecnologias do Módulo 2 e quais conceitos do Módulo 3 foram efetivamente usados na justificativa das suas decisões — se a resposta for "nenhum", provavelmente o design ficou raso demais em algum ponto.
