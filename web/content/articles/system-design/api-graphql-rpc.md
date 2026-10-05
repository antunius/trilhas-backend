---
slug: api-graphql-rpc
categorySlug: system-design
title: "GraphQL, RPC e como escolher o estilo"
navTitle: GraphQL, RPC e escolha
summary: "Saber quando GraphQL ou gRPC resolvem um problema real e escolher o estilo por fronteira"
level: intermediario
order: 15
section: tecnologias-chave
group: "Design de API"
---

## Objetivos de aprendizagem

- [ ] Explicar quando GraphQL se justifica e o que custa
- [ ] Explicar o papel do gRPC e escolher o estilo por fronteira

*Retomando o cenário da unidade: uma rede social com app web, app mobile e API pública, e um serviço de feed que conversa com um serviço de recomendação.*

## GraphQL

Em vez de vários endpoints fixos, há **um** endpoint em que o cliente descreve exatamente os campos de que precisa, numa só requisição:

```graphql
query {
  usuario(id: 7) {
    nome
    foto
    posts(first: 3) { titulo curtidas }
  }
}
```

A resposta tem **exatamente** esse formato. Isso resolve over-fetching e under-fetching de uma vez.

**Quando faz sentido**: existem clientes muito diferentes (web, mobile, parceiros) com necessidades de dados distintas, e telas que combinam muitos recursos. O app mobile pede 3 campos e a web pede 15, ambos pelo mesmo endpoint.

**O que custa**:

- **Cache mais difícil**: tudo é `POST /graphql`, então o cache de HTTP por URL não funciona sem trabalho extra.
- **Consultas caras**: o cliente pode pedir uma consulta aninhada e pesada. É preciso limitar profundidade e custo.
- **Problema N+1**: buscar 20 posts e, para cada um, o autor, pode gerar 21 consultas ao banco se o servidor não agrupar (*batching*).
- **Mais complexidade** no servidor e na observabilidade.

Resumindo: GraphQL troca simplicidade do servidor por flexibilidade do cliente. Só vale a troca quando essa flexibilidade é necessária.

## RPC e gRPC

No RPC (*Remote Procedure Call*), o cliente chama diretamente uma **função remota**, como `recomendacao.sugerir(usuarioId, 10)`. O foco é a **ação**, não o recurso.

O **gRPC** é a implementação mais usada: o contrato é definido num arquivo `.proto`, a serialização é binária (Protocol Buffers) e roda sobre HTTP/2. Resultado: mensagens menores e chamadas mais rápidas que REST com JSON, e código cliente/servidor gerado automaticamente a partir do contrato.

**Onde brilha**: comunicação **interna** entre serviços, em que desempenho e contrato forte importam mais que a legibilidade humana. **Onde incomoda**: browsers e parceiros externos, que preferem REST/JSON por ser legível e fácil de testar com `curl`.

## Escolhendo por fronteira

| Fronteira | Estilo comum | Por quê |
|---|---|---|
| App/web → backend (telas simples) | REST | Simples, cacheável, padrão |
| App/web → backend (telas ricas, vários clientes) | GraphQL | Evita várias chamadas e campos inúteis |
| API pública para parceiros | REST | Fácil de documentar e consumir |
| Serviço → serviço interno | gRPC | Rápido, contrato forte |

Os estilos **coexistem**. Na rede social: REST para curtir e comentar, GraphQL para a tela do feed, gRPC entre o serviço de feed e o de recomendação.

## Lembre

- **GraphQL**: o cliente descreve os campos; troca simplicidade do servidor por flexibilidade.
- **gRPC**: contrato forte e serialização binária, para comunicação **interna**.
- Os estilos **coexistem**: REST, GraphQL e gRPC no mesmo sistema.
