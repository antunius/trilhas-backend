---
slug: api-gateway-por-que-responsabilidades
categorySlug: system-design
title: "Por que usar um gateway e o que ele centraliza"
navTitle: Por que e responsabilidades
summary: "Ver com números por que não deixar o cliente chamar os serviços direto e o que o gateway centraliza"
level: intermediario
order: 99
section: deep-dives-tecnologias
group: "API Gateway"
---

## Objetivos de aprendizagem

- [ ] Comparar chamadas diretas e via gateway com números de latência
- [ ] Listar as responsabilidades concretas do gateway

*Retomando o cenário da unidade: uma plataforma de streaming de vídeo com microsserviços internos e dois clientes diferentes, o app de TV e o app mobile.*

## Por que não deixar o cliente chamar os serviços direto

Sem gateway, o app precisaria conhecer o endereço de cada serviço e fazer várias chamadas pela internet. Os números mostram o custo. Num celular com 4G, uma ida e volta até o servidor leva uns 100 ms; dentro do data center, uma chamada entre serviços leva uns 1 a 5 ms.

| Cenário | Cálculo | Latência para montar a tela |
|---|---|---|
| App chama 3 serviços em sequência | 3 × 100 ms | ~300 ms |
| App chama 3 serviços em paralelo | maior das três, mas 3 conexões na rede móvel | ~100 ms, com mais bateria e conexões |
| App chama o gateway, que chama 3 serviços em paralelo | 100 ms + ~5 ms interno | ~105 ms, com 1 conexão |

Há quatro outros motivos: a segurança fica concentrada num lugar só (os serviços internos não ficam expostos), os serviços podem mudar de endereço ou ser divididos sem quebrar os apps, a autenticação não precisa ser reimplementada em cada serviço, e é possível medir e limitar o tráfego em um ponto único.

## Responsabilidades concretas centralizadas no gateway

- **Autenticação e autorização**: o gateway valida o token do usuário uma única vez, antes de rotear a chamada para qualquer serviço interno — os serviços internos podem confiar que uma requisição que chegou até eles já foi autenticada, sem reimplementar essa lógica.
- **Rate limiting**: aplicado no ponto de entrada, antes que uma requisição excessiva consuma recursos de qualquer serviço interno.
- **Roteamento**: decide, com base no caminho da URL (ou outros critérios), para qual serviço interno uma requisição deve ir — `/catalogo/*` vai para o serviço de catálogo, `/perfil/*` para o serviço de perfil.
- **Agregação de respostas**: para a tela inicial (que precisa de dados de catálogo, histórico e recomendação simultaneamente), o gateway pode fazer as três chamadas internas em paralelo e combinar o resultado em uma única resposta ao cliente — uma única chamada de rede do ponto de vista do app, mesmo que internamente sejam três.

## Lembre

- Uma chamada externa custa ~100 ms; uma interna ~5 ms.
- O gateway **agrega** respostas em paralelo pela rede interna.
- Autenticação, limite de taxa, roteamento e agregação ficam no gateway.
