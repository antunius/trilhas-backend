---
slug: api-pratica-entrevista
categorySlug: system-design
title: "Design de API na prática e na entrevista"
navTitle: Na prática e na entrevista
summary: "Implementar REST, GraphQL e gRPC com Spring e saber responder em entrevista"
level: intermediario
order: 16
section: tecnologias-chave
group: "Design de API"
---

## Objetivos de aprendizagem

- [ ] Escrever endpoints REST, GraphQL e gRPC com Spring
- [ ] Reconhecer o que diferencia respostas média e sênior

*Retomando o cenário da unidade: uma rede social com app web, app mobile e API pública, e um serviço de feed que conversa com um serviço de recomendação.*

## Na prática

### REST com Spring Boot

```java
@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService service;

    public PostController(PostService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public PostResponse buscar(@PathVariable long id) {
        return service.buscar(id); // lança 404 se não existir
    }

    @PostMapping
    public ResponseEntity<PostResponse> criar(
            @RequestHeader("Idempotency-Key") String chave,
            @Valid @RequestBody NovoPost novo) {
        PostResponse criado = service.criar(chave, novo); // repete a chave => devolve o mesmo post
        return ResponseEntity.created(URI.create("/posts/" + criado.id())).body(criado);
    }

    @GetMapping
    public CursorPage<PostResponse> listar(
            @RequestParam(required = false) String after,
            @RequestParam(defaultValue = "20") int limit) {
        return service.listar(after, Math.min(limit, 100)); // limita o tamanho da página
    }
}
```

### GraphQL com Spring for GraphQL

```java
@Controller
public class UsuarioGraphQL {

    @QueryMapping
    public Usuario usuario(@Argument long id) {
        return usuarios.buscar(id);
    }

    // BatchMapping resolve o N+1: carrega os autores de VÁRIOS posts numa só consulta
    @BatchMapping
    public Map<Post, Usuario> autor(List<Post> posts) {
        return usuarios.buscarAutores(posts);
    }
}
```

### gRPC com Spring Boot

O contrato:

```
service Recomendacao {
  rpc Sugerir (SugestaoRequest) returns (SugestaoResponse);
}
message SugestaoRequest  { int64 usuario_id = 1; int32 quantidade = 2; }
message SugestaoResponse { repeated int64 post_ids = 1; }
```

E o cliente injetado pelo Spring (com a biblioteca `grpc-spring-boot-starter`):

```java
@Service
public class FeedService {

    @GrpcClient("recomendacao")
    private RecomendacaoGrpc.RecomendacaoBlockingStub recomendacao;

    public List<Long> sugestoes(long usuarioId) {
        SugestaoResponse r = recomendacao.sugerir(
            SugestaoRequest.newBuilder().setUsuarioId(usuarioId).setQuantidade(10).build());
        return r.getPostIdsList();
    }
}
```

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Lista recursos, verbos e códigos de status de uma API REST |
| Sênior | Acrescenta paginação por cursor, idempotência em `POST`, versionamento, e justifica GraphQL ou gRPC com um motivo concreto |
| Staff+ | Discute evolução compatível do contrato, limites de custo em GraphQL, autenticação e limite de taxa, e como isolar clientes externos dos serviços internos (gateway) |

## Erros comuns

- Escolher GraphQL só para parecer sofisticado, sem clientes com necessidades diferentes.
- Ignorar REST como padrão razoável na maioria dos casos.
- Usar verbos nas URLs (`/criarPost`) em vez de recursos e verbos HTTP.
- Devolver listas sem paginação, ou paginar por offset num feed que muda.
- Deixar `POST` de pagamento sem proteção contra repetição.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que `PUT` e `DELETE` são idempotentes e `POST` não?" (repetir `PUT`/`DELETE` leva ao mesmo estado final; repetir `POST` cria outro recurso.)
- "Offset ou cursor para o feed?" (cursor: estável com inserções e eficiente em páginas distantes.)
- "O que é o problema N+1 no GraphQL?" (um campo aninhado dispara uma consulta por item; resolve-se agrupando as buscas em lote.)
- "Por que não usar gRPC direto no navegador?" (browsers não expõem o HTTP/2 completo exigido; usa-se gRPC-Web ou um gateway que traduz.)

## Lembre

- **@BatchMapping** resolve o N+1 do GraphQL agrupando as buscas.
- Limite o **tamanho da página** no servidor.
- Escolher GraphQL "para parecer sofisticado" é o erro clássico.
