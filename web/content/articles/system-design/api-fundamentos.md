---
slug: api-fundamentos
categorySlug: system-design
title: "API: recursos, verbos HTTP e idempotência"
navTitle: Fundamentos de API
summary: "Entender API, endpoint, recurso, verbos HTTP, idempotência e os problemas de over e under-fetching"
level: intermediario
order: 13
section: tecnologias-chave
group: "Design de API"
---

## Objetivos de aprendizagem

- [ ] Definir API, endpoint, recurso e verbo HTTP
- [ ] Explicar idempotência e over/under-fetching

## Cenário de referência da unidade

Vamos usar uma rede social com um app **web**, um app **mobile** e uma **API pública** para parceiros. As telas principais são: perfil de uma pessoa, feed de posts, e o fluxo de curtir e comentar. Por dentro, o serviço de feed conversa com um serviço de recomendação. São três fronteiras diferentes de API (cliente externo, parceiro, serviço interno), e é por isso que o cenário serve para comparar os estilos.

## Fundamentos: o vocabulário básico, peça por peça

### API, em uma frase

Uma API (interface de programação) é o **contrato** pelo qual um programa pede coisas a outro: o que se pode pedir, em que formato, e o que volta. O contrato importa mais que a tecnologia, porque trocar o contrato quebra quem o usa.

### Endpoint e recurso

Um **recurso** é uma "coisa" do domínio, um substantivo: usuário, post, comentário. Um **endpoint** é o endereço que expõe um recurso, como `/posts/42`. Em REST, pensar em substantivos e não em ações é a ideia central.

### Verbos HTTP

O HTTP já traz um vocabulário de ações, os **verbos**:

| Verbo | Significado | Exemplo |
|---|---|---|
| `GET` | Ler | `GET /posts/42` |
| `POST` | Criar | `POST /posts` |
| `PUT` | Substituir por inteiro | `PUT /posts/42` |
| `PATCH` | Alterar parcialmente | `PATCH /posts/42` |
| `DELETE` | Remover | `DELETE /posts/42` |

### Idempotência

Uma operação é **idempotente** quando repeti-la tem o mesmo efeito que fazê-la uma vez. `DELETE /posts/42` repetido deixa o post apagado, igual a uma vez. `POST /posts` repetido cria dois posts. Isso importa porque redes falham: se o cliente não recebeu a resposta, ele **vai tentar de novo**, e a API precisa estar pronta para isso. `GET`, `PUT` e `DELETE` são idempotentes por definição; `POST` não é.

### Over-fetching e under-fetching

Dois problemas clássicos de telas ligadas a APIs fixas:

- **Over-fetching**: a API devolve mais do que a tela usa. O app só mostra nome e foto, mas o endpoint devolve 40 campos.
- **Under-fetching**: uma tela precisa de dados de vários recursos e faz várias chamadas em sequência. Para o perfil: uma para a pessoa, uma para os posts, uma para as contagens.

### Juntando as peças: uma chamada do começo ao fim

1. O app mobile faz `GET /posts/42` para mostrar um post.
2. A API acha o recurso, monta uma resposta em JSON e devolve com o código `200 OK`.
3. Se o post não existe, devolve `404 Not Found`.
4. Se o usuário não pode ver, devolve `403 Forbidden`.

![REST vs GraphQL vs RPC](/diagrams/sd-design-api.svg)

*A imagem compara os três estilos. Note o padrão: REST expõe recursos em endereços diferentes, GraphQL expõe um único endereço onde o cliente descreve o que quer, e RPC expõe funções que se chamam diretamente.*

## Lembre

- Uma API é um **contrato**; trocá-lo quebra quem o usa.
- `GET`, `PUT` e `DELETE` são **idempotentes**; `POST` não.
- **Over-fetching** devolve campos demais; **under-fetching** exige chamadas demais.
