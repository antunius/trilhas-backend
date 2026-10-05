---
slug: api-gateway-evolucao-entrevista
categorySlug: system-design
title: "API Gateway: evolução de contrato e entrevista"
navTitle: Evolução e entrevista
summary: "Evoluir o contrato do gateway com segurança e saber responder em entrevista"
level: intermediario
order: 102
section: deep-dives-tecnologias
group: "API Gateway"
---

## Objetivos de aprendizagem

- [ ] Evoluir a API exposta sem quebrar clientes
- [ ] Responder com o nível de profundidade de um sênior

*Retomando o cenário da unidade: uma plataforma de streaming de vídeo com microsserviços internos e dois clientes diferentes, o app de TV e o app mobile.*

## Evolução/schema/migração

Um gateway não versiona "schema" no sentido de banco de dados, mas versiona **contratos de rota** conforme os microsserviços de trás evoluem. Duas estratégias comuns:

- **Por header**: `Accept-Version: 2` no request, com o gateway roteando internamente para a versão correspondente do serviço de catálogo, por exemplo — o cliente não muda a URL, apenas o header.
- **Por prefixo de caminho**: `/v1/catalogo/**` e `/v2/catalogo/**` coexistindo como rotas distintas no `RouteLocator`, cada uma apontando para a versão correspondente do serviço, até que os clientes migrem.

Para depreciar `/v1/catalogo/**` sem quebrar clientes de um dia para o outro, o gateway pode logar um aviso de depreciação a cada chamada à rota antiga (incluindo, idealmente, um header de resposta `Deprecation` e `Sunset` com a data-limite), permitindo identificar quais clientes ainda dependem dela antes de remover a rota de fato, meses depois, quando o volume de chamadas à versão antiga cair a zero — o mesmo espírito do padrão expand/contract usado em migrações de schema, aplicado a contratos de API em vez de colunas.

## Principais usos

- Centralizar validação de autenticação e de JWT antes de qualquer requisição chegar aos serviços internos, evitando reimplementar essa lógica em cada um.
- Aplicar rate limiting e cotas por cliente de API, protegendo os serviços internos de uso excessivo por um único consumidor.
- Rotear e compor requisições em uma arquitetura de microsserviços, incluindo agregação de múltiplas chamadas internas em uma única resposta.
- Terminação de TLS e observabilidade centralizada (logging e tracing de todas as requisições) em um único ponto de borda, em vez de espalhada por cada serviço.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "API Gateway centraliza autenticação e roteamento" em termos gerais |
| Sênior | Detalha agregação de respostas com chamadas paralelas, e reconhece o gateway como ponto único de falha exigindo redundância |
| Staff+ | Além do acima, propõe BFFs dedicados quando diferentes tipos de cliente têm necessidades de dados genuinamente diferentes, evitando um gateway genérico que serve mal a todos |

## Erros comuns

- Colocar lógica de negócio pesada dentro do gateway, misturando responsabilidades que deveriam pertencer aos serviços internos.
- Não considerar o gateway como um ponto único de falha que também precisa de redundância.
- Usar um único gateway genérico quando tipos de cliente muito diferentes justificariam BFFs dedicados.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se o serviço de recomendação demorar muito para responder durante a agregação da tela inicial?" (o gateway deveria ter um timeout e retornar o restante da tela sem a seção de recomendação, em vez de travar a resposta inteira esperando por um serviço lento).
- "Quando um BFF dedicado deixa de valer a pena?" (quando os clientes têm necessidades de dados suficientemente parecidas, o custo de manter múltiplos BFFs supera o benefício de personalização).

## Lembre

- O gateway é a **fronteira do contrato**: mudanças ali afetam todos os clientes.
- Proponha **BFFs** só quando as necessidades forem genuinamente diferentes.
- Mencione **redundância** do próprio gateway sem ser perguntado.
