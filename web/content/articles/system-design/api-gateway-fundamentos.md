---
slug: api-gateway-fundamentos
categorySlug: system-design
title: "API Gateway: o que é e como funciona"
navTitle: O que é um API Gateway
summary: "Entender o gateway como ponto de entrada único e o vocabulário de borda, token, rate limit e circuit breaker"
level: intermediario
order: 98
section: deep-dives-tecnologias
group: "API Gateway"
---

## Objetivos de aprendizagem

- [ ] Definir API Gateway, borda e serviço interno
- [ ] Descrever o caminho de uma requisição pelo gateway

## Cenário de referência da unidade

Vamos usar uma plataforma de streaming de vídeo com múltiplos microsserviços internos (catálogo, perfil de usuário, histórico de visualização, recomendação) e dois tipos de cliente muito diferentes: o app de TV (tela grande, controle remoto, poucas interações por sessão) e o app mobile (tela pequena, muitas interações rápidas).

## Fundamentos: o vocabulário básico, peça por peça

### O que é um API Gateway, em uma frase

Um API Gateway é o **ponto de entrada único** de um sistema de microsserviços: todo cliente externo (app, navegador, parceiro) fala com ele, e ele repassa cada requisição ao serviço interno certo. A analogia é a recepção de um prédio comercial: o visitante não percorre os andares procurando a sala, ele fala com a recepção, que confere o crachá e o encaminha.

### Serviço interno e borda

Os **serviços internos** (catálogo, perfil, histórico, recomendação) ficam numa rede privada, sem exposição direta à internet. A **borda** é a fronteira entre o mundo externo e essa rede privada, e é onde o gateway mora.

### Token

Para provar quem é, o cliente envia um **token** (em geral um JWT) a cada requisição. O token é um texto assinado que diz "este é o usuário 7, válido até as 15h". Validar o token é checar a assinatura e a validade, sem consultar um banco a cada chamada.

### Rate limit e circuit breaker

**Rate limiting** limita quantas requisições um cliente pode fazer em um período (por exemplo, 100 por minuto), para impedir abuso. **Circuit breaker** é um disjuntor: se um serviço interno falha muitas vezes seguidas, o gateway para de chamá-lo por alguns segundos e responde um erro rápido, em vez de acumular chamadas penduradas.

### Juntando as peças: o caminho de uma requisição

1. O app de TV chama `GET /home` no gateway.
2. O gateway valida o token e confere o limite de taxa do usuário.
3. Ele chama em paralelo o catálogo, o histórico e a recomendação (rede interna).
4. Combina as três respostas em um único JSON e devolve ao app.

## Lembre

- O gateway é o **ponto de entrada único** dos clientes externos.
- O token é validado **uma vez**, na borda.
- O **circuit breaker** para de chamar um serviço que falha, em vez de acumular chamadas.
