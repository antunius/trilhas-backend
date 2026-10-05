---
slug: api-rest
categorySlug: system-design
title: "REST: recursos, paginação e idempotência em POST"
navTitle: REST
summary: "Desenhar uma API REST com recursos, códigos de status, paginação por cursor e proteção contra repetição"
level: intermediario
order: 14
section: tecnologias-chave
group: "Design de API"
---

## Objetivos de aprendizagem

- [ ] Desenhar recursos e verbos de uma API REST
- [ ] Escolher a paginação e proteger POST contra repetição

*Retomando o cenário da unidade: uma rede social com app web, app mobile e API pública, e um serviço de feed que conversa com um serviço de recomendação.*

## REST

REST organiza a API em **recursos**, endereçados por URL e manipulados pelos verbos HTTP. É previsível, amplamente conhecido e funciona com o cache do próprio HTTP. Deve ser o **padrão inicial** em quase qualquer entrevista, salvo justificativa clara.

### Desenho de recursos

```
GET    /users/7                 perfil de uma pessoa
GET    /users/7/posts           posts de uma pessoa
POST   /posts                   criar um post
POST   /posts/42/likes          curtir (cria uma curtida)
DELETE /posts/42/likes          descurtir
GET    /posts/42/comments       comentários de um post
```

Regras práticas: use **substantivos no plural**, aninhe um nível só quando o recurso filho não existe sem o pai (comentário de um post), e use o código de status correto (`201 Created` na criação, `400` em dado inválido, `404` ausente, `409` em conflito).

### Paginação

Uma lista nunca deve voltar inteira. Duas formas comuns:

- **Offset** (`?page=3&size=20`): simples, mas lento em páginas distantes e instável se itens entram enquanto o usuário navega (itens repetidos ou pulados).
- **Cursor** (`?after=post_981&limit=20`): o cliente pede "o que vem depois deste item". É estável e eficiente, e é a escolha para feeds.

### Idempotência em `POST`

Para tornar `POST` seguro contra repetição (cobrar um pagamento duas vezes seria grave), o cliente envia um cabeçalho `Idempotency-Key` com um valor único. O servidor guarda a chave e, se receber a mesma de novo, devolve o resultado anterior sem repetir a ação.

### Limites do REST

O custo aparece em telas ricas: o perfil exige 3 chamadas (under-fetching) e cada endpoint devolve campos de que a tela não precisa (over-fetching). Em redes móveis lentas, cada chamada extra pesa.

## Lembre

- Use **substantivos no plural** e os verbos HTTP para as ações.
- Para feeds, prefira **paginação por cursor**.
- `Idempotency-Key` torna o `POST` seguro contra repetição.
