---
slug: api-gateway-bff-spof
categorySlug: system-design
title: "BFF e o gateway como ponto único de falha"
navTitle: BFF e ponto único de falha
summary: "Saber quando um gateway genérico não basta e como evitar que ele derrube a plataforma"
level: intermediario
order: 100
section: deep-dives-tecnologias
group: "API Gateway"
---

## Objetivos de aprendizagem

- [ ] Explicar o padrão Backend for Frontend
- [ ] Mitigar o gateway como ponto único de falha

*Retomando o cenário da unidade: uma plataforma de streaming de vídeo com microsserviços internos e dois clientes diferentes, o app de TV e o app mobile.*

## Backend for Frontend (BFF): quando um gateway genérico não basta

No nosso cenário, o app de TV e o app mobile têm necessidades de dados muito diferentes para a mesma tela conceitual ("continuar assistindo"): a TV quer poucos itens com imagens de alta resolução; o mobile quer uma lista mais longa com imagens leves e otimizadas para rolagem rápida. Um único gateway genérico, tentando servir os dois formatos igualmente bem, tende a virar um meio-termo insatisfatório para ambos.

O padrão **Backend for Frontend** resolve isso criando uma camada de agregação **dedicada por tipo de cliente** — um BFF para TV, outro para mobile — cada um moldando a resposta especificamente para as necessidades daquele cliente, enquanto ambos continuam chamando os mesmos microsserviços internos por trás. Isso evita que a lógica de "o que a TV precisa" e "o que o mobile precisa" fique misturada em um único componente genérico, ao custo de manter mais de um componente de borda.

![Um API Gateway genérico vs. BFFs dedicados por tipo de cliente](/diagrams/api-gateway-bff.svg)

## O gateway como ponto único de falha

Como toda requisição externa passa pelo gateway, ele próprio se torna um componente crítico — se cair, toda a plataforma fica inacessível, mesmo que todos os microsserviços internos estejam saudáveis. A mitigação padrão é a mesma de qualquer componente crítico: múltiplas instâncias do gateway rodando atrás de um load balancer (Módulo 2), sem estado compartilhado entre elas que impeça escalar horizontalmente.

**Um erro sutil a evitar**: colocar lógica de negócio pesada dentro do gateway (não apenas roteamento, autenticação e agregação leve) o transforma, na prática, em mais um microsserviço monolítico crítico — dificultando escalar e implantar mudanças de negócio de forma independente dos demais serviços.

## Lembre

- **BFF**: uma camada de agregação por tipo de cliente.
- O gateway deve ser **fino**; lógica de negócio fica nos serviços.
- Evite a falha única com **várias instâncias sem estado** atrás de um balanceador.
