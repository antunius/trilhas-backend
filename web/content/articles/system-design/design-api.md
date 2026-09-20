---
slug: design-api
categorySlug: system-design
title: "Design de API: REST, GraphQL e RPC"
navTitle: Design de API
summary: Entender o modelo de recursos do REST
level: intermediario
order: 10
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender o modelo de recursos do REST
- [ ] Entender quando GraphQL resolve um problema real
- [ ] Entender o papel do RPC em comunicação interna

## Conteúdo

### REST

![REST vs GraphQL vs RPC](/diagrams/sd-design-api.svg)

REST organiza a API em torno de recursos (substantivos), manipulados através dos verbos HTTP padrão: `GET` para leitura, `POST` para criação, `PUT`/`PATCH` para atualização, `DELETE` para remoção. É previsível, amplamente compreendido, e deve ser o padrão inicial em praticamente qualquer entrevista, salvo justificativa clara em contrário.

### GraphQL

Em vez de endpoints fixos por recurso, o cliente descreve exatamente quais campos quer receber em uma única requisição. Isso resolve dois problemas comuns do REST: *over-fetching* (receber mais dados do que necessário) e *under-fetching* (precisar de múltiplas chamadas para montar uma tela). Faz mais sentido quando existem clientes muito diferentes entre si (web, mobile, terceiros) com necessidades de dados distintas.

### RPC

Foca em ações (verbos) mais do que em recursos — o cliente chama diretamente uma função remota. Implementações como gRPC usam serialização binária eficiente, o que costuma torná-lo mais rápido que REST/JSON para comunicação interna entre serviços, onde performance importa mais do que legibilidade humana da API.

## Exemplo aplicado

Um app de rede social pode usar REST para operações simples de CRUD (criar post, curtir), GraphQL para a tela principal do feed (que precisa combinar dados de posts, autores e contadores de forma flexível para diferentes clientes), e gRPC internamente entre o serviço de feed e o serviço de recomendação.

## Erros comuns

- Escolher GraphQL só para parecer mais sofisticado, sem um motivo concreto de múltiplos clientes com necessidades diferentes.
- Ignorar REST como padrão razoável na maioria dos casos.
