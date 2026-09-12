# Trilha 3 — Spring / Spring Boot

**Duração:** 6 semanas · 3 sessões de 45 min.
Pré-requisito: trilha de Java concluída (ao menos semanas 1-3).

> O diferencial em entrevista não é saber *usar* Spring — é saber **por que ele se comporta assim**. Quase toda pergunta boa cai em proxy, ciclo de vida ou transação. Sem o vocabulário do zero (bean, container, proxy, persistence context), `@Transactional` vira magia.

---

## Mapa mental

Spring é um **container de objetos**. Você descreve *o que* precisa; ele cria, injeta e destrói.

```
requisição HTTP
    → Tomcat (thread) → DispatcherServlet
    → Controller (bean) → Service (bean, muitas vezes um **proxy**)
    → transação abre  → Repository → EntityManager / persistence context
    → SQL no banco    → commit ou rollback
    → resposta HTTP
```

O **proxy** é a peça que a maioria ignora: quem chama `pedidoService.salvar()` em geral chama um objeto *falso* na frente, que abre transação, cache, segurança — e só depois delega para a sua classe. Chamada **dentro** da mesma classe (`this.salvar()`) **não** passa pelo proxy. Daí metade dos bugs de entrevista.

---

## Glossário do zero

### IoC (inversão de controle) e DI (injeção de dependência)

**IoC.** Quem decide *quando* e *como* criar objetos deixa de ser o seu `new` e passa a ser o framework.

**DI.** O jeito concreto: a classe declara dependências (melhor: no construtor); o container entrega instâncias.

**Para que serve.** Testar sem banco, trocar implementação, um único lugar que sabe o grafo de objetos.

**Erro comum.** Achar que IoC = “usar Spring”. Dá para fazer IoC na mão. Spring é um container maduro de IoC.

### Bean e ApplicationContext

**Bean.** Objeto gerenciado pelo container: tem ciclo de vida, nome, escopo.

**ApplicationContext.** O container em si: registra beans, injeta, publica eventos, fecha no shutdown. `BeanFactory` é o núcleo mais pobre; o Context é o que você usa de verdade.

**Component scan.** Procura classes com `@Component` (e especializações) num pacote e as registra.

### Escopo

**singleton (padrão).** Uma instância por contexto. **Tem** que ser stateless (sem campo mutável por requisição). Estado compartilhado entre requests = bug de concorrência.

**prototype.** Nova instância a cada pedido ao container.

**request / session.** Uma por requisição HTTP / sessão. Só fazem sentido na web.

### Proxy e AOP

**Proxy.** Objeto que implementa a mesma API e intercepta chamadas. JDK proxy se há interface; CGLIB (subclasse) se não há.

**AOP.** Cortar preocupações transversais (transação, cache, segurança) sem espalhar no negócio. `@Transactional`, `@Cacheable`, `@Async`, `@PreAuthorize` **são** AOP via proxy.

**Auto-invocação.** `this.metodoAnotado()` não atravessa o proxy → anotação ignorada.

### Transação

**O que é.** Unidade de trabalho no banco: ou todas as escritas valem (commit), ou nenhuma (rollback). No Spring, em geral uma transação JDBC/JPA **por thread**, amarrada à conexão.

**Não é.** Transação distribuída mágica cobrindo HTTP e Kafka. A fronteira da transação é o resource manager (quase sempre *um* banco).

**Propagation.** `REQUIRED`: junta-se à transação existente ou abre uma. `REQUIRES_NEW`: transação nova, independente.

### Servlet, DispatcherServlet e MVC

**Servlet.** Contrato Java EE/Jakarta: recebe request/response HTTP.

**DispatcherServlet.** Front controller do Spring MVC: acha o `@RequestMapping`, chama o controller, resolve view/JSON.

**Controller vs RestController.** `@RestController` = `@Controller` + `@ResponseBody` (escreve o retorno no corpo, em geral JSON).

### Spring Boot e auto-configuração

**Boot.** Opinião + fat jar + servidor embutido (Tomcat). Você não monta XML de servlet à mão.

**Auto-configuração.** Classes no classpath (`AutoConfiguration.imports`) ligam beans **se** as condições baterem (`@ConditionalOnClass`, `@ConditionalOnMissingBean`, …). Por isso “adicionei a starter e funcionou” — e por isso o *seu* `@Bean` do mesmo tipo costuma ganhar.

**Starter.** POM que puxa dependências coerentes (`spring-boot-starter-web`).

### JPA — o vocabulário que evita N+1 misterioso

**Entidade.** Classe mapeada em tabela (`@Entity`). Tem identidade de banco (id).

**EntityManager / persistence context.** Cache de 1º nível da transação: entidades *gerenciadas*. Mudou o campo → no flush vira UPDATE (**dirty checking**), mesmo sem `save()`.

**Lazy vs eager.** Lazy: associação não vem no SELECT até você acessar. Eager: vem junto (muitas vezes demais). Fora da transação, acessar lazy → `LazyInitializationException`.

**Repositório Spring Data.** Interface que o Boot implementa em runtime (proxy de novo). Não é magia SQL — é geração de query + EntityManager.

### Testes: slice vs contexto cheio

**`@SpringBootTest`.** Sobe o contexto quase inteiro — lento, integração.

**Slice.** `@WebMvcTest`, `@DataJpaTest`: só uma fatia, o resto mockado. Rápido e preciso.

---

## Semana 1 — IoC, beans e injeção de dependência

**1. O que é inversão de controle na prática?**
> Em vez de a classe criar suas dependências (`new PedidoRepository()`), ela declara o que precisa e o container entrega. O controle sobre criação e ciclo de vida sai da classe e vai para o framework. O benefício real: a classe passa a depender de uma abstração e vira testável e substituível.

**2. Injeção por construtor, setter ou campo — qual e por quê?**
> **Construtor, sempre.** Permite campos `final` (imutabilidade), deixa as dependências explícitas na assinatura, quebra o build se houver dependência circular (em vez de esconder o problema), e permite instanciar a classe em teste sem container nenhum. Injeção em campo com `@Autowired` esconde dependências e obriga reflexão para testar. Setter só para dependência genuinamente opcional.

**3. Uma classe com 8 dependências injetadas. O que isso indica?**
> Que ela provavelmente viola o Single Responsibility. O construtor grande é um *cheiro*, não um problema de configuração. A resposta madura é notar isso em vez de sugerir trocar para injeção em campo "para ficar mais limpo".

**4. Quais são os escopos de bean?**
> `singleton` (padrão — uma instância por container), `prototype` (nova a cada injeção), e os web: `request`, `session`, `application`. **A pegadinha:** bean singleton com estado mutável compartilhado entre requisições é bug de concorrência. Beans devem ser stateless.

**5. Como injetar um `prototype` dentro de um `singleton`?**
> Injeção normal não funciona — o prototype seria resolvido uma única vez, na criação do singleton. Soluções: injetar `ObjectProvider<T>` e chamar `getObject()` a cada uso, ou usar `@Lookup`, ou um proxy de escopo.

**6. Descreva o ciclo de vida de um bean.**
> Instanciação → injeção de dependências → `BeanNameAware`/`ApplicationContextAware` → `BeanPostProcessor.postProcessBeforeInitialization` → `@PostConstruct` → `InitializingBean.afterPropertiesSet` → `postProcessAfterInitialization` (**é aqui que os proxies são criados**) → bean pronto → `@PreDestroy` no shutdown.

**7. `@Component`, `@Service`, `@Repository`, `@Controller` — diferença real?**
> Tecnicamente todas são `@Component` e são detectadas pelo component scan. `@Repository` adiciona tradução de exceções de persistência para a hierarquia `DataAccessException` do Spring. As outras são semânticas — comunicam intenção. `@Configuration` é diferente: seus métodos `@Bean` passam por proxy CGLIB para garantir singleton mesmo em chamadas internas.

**8. O que o ApplicationContext faz, numa frase?**
> É o registry vivo dos beans: cria, injeta, intercepta (AOP), publica eventos e coordena o shutdown.

---

## Semana 2 — Proxies, AOP e transações ⭐

> **Este é o tema mais perguntado em entrevista de Spring sênior.**

**1. Como o `@Transactional` funciona por baixo?**
> O Spring cria um **proxy** em volta do bean (JDK dynamic proxy se houver interface, CGLIB via subclasse caso contrário). Quem chama o bean está na verdade chamando o proxy, que abre a transação, delega para o método real, e faz commit ou rollback conforme o resultado.

**2. Por que `@Transactional` "não funciona" em algumas situações?**
> Porque a chamada não passou pelo proxy. Os três casos:
> - **Auto-invocação:** um método público chama outro método `@Transactional` da mesma classe. A chamada é direta (`this.metodo()`), o proxy não é envolvido, a anotação é ignorada.
> - **Método não-público:** proxy CGLIB não intercepta `private`/`final`/`static`.
> - **Classe `final`:** CGLIB não consegue criar subclasse.
>
> Solução para auto-invocação: extrair o método para outro bean, ou auto-injetar o próprio bean (feio), ou usar AspectJ com weaving.

```java
@Service
public class PedidoService {
    public void processar() { salvar(); }        // salvar() NÃO é transacional
    @Transactional public void salvar() { ... }
}
```

**3. `REQUIRED` vs `REQUIRES_NEW`.**
> `REQUIRED` (padrão): junta-se à transação em curso, ou cria uma se não houver. Tudo commita ou tudo faz rollback junto. `REQUIRES_NEW`: suspende a transação atual e abre uma independente — commita mesmo se a externa der rollback. Usado para auditoria e log que precisam sobreviver ao rollback. Cuidado: consome duas conexões do pool simultaneamente, e pode causar deadlock se as duas tocarem a mesma linha.

**4. Quando o rollback acontece automaticamente?**
> Só em `RuntimeException` e `Error`. Exceção *checked* **não** dispara rollback por padrão — é preciso `@Transactional(rollbackFor = MinhaExcecao.class)`. Pega muita gente.

**5. Explique os níveis de isolamento e os problemas que resolvem.**
> - `READ_UNCOMMITTED` → permite *dirty read* (ler dado não commitado).
> - `READ_COMMITTED` → evita dirty read. Padrão no PostgreSQL.
> - `REPEATABLE_READ` → evita *non-repeatable read* (mesma query, resultado diferente na mesma transação). Padrão no MySQL/InnoDB.
> - `SERIALIZABLE` → evita *phantom read*, ao custo de muito bloqueio.

**6. Transação cobre chamada HTTP e publicação no Kafka?**
> Não. A transação do banco não tem controle nenhum sobre I/O externo. Se o commit falha depois de publicar no Kafka, os sistemas ficam inconsistentes. É exatamente o problema que o padrão **Outbox** resolve. (Ver trilha de Kafka.)

**7. O que é AOP e onde ela já usa sem perceber?**
> Separar preocupações transversais (transação, cache, segurança, log, métrica) do código de negócio, aplicando-as por interceptação. `@Transactional`, `@Cacheable`, `@Async`, `@PreAuthorize` e `@Timed` são todos AOP.

---

## Semana 3 — Spring Boot, configuração e web

**1. O que a auto-configuração faz e como?**
> `@EnableAutoConfiguration` carrega classes de configuração listadas nos metadados dos jars (`AutoConfiguration.imports`) e as aplica **condicionalmente**: `@ConditionalOnClass` (a lib está no classpath?), `@ConditionalOnMissingBean` (o usuário já definiu o bean?), `@ConditionalOnProperty`. É por isso que basta adicionar uma dependência e tudo funciona — e por isso declarar o próprio bean sobrescreve o padrão sem conflito.

**2. Como debugar auto-configuração?**
> Rodar com `--debug` e ler o *Condition Evaluation Report*: mostra o que foi aplicado, o que não foi, e o motivo exato.

**3. `@Value` ou `@ConfigurationProperties`?**
> `@ConfigurationProperties` para qualquer conjunto de configurações relacionadas: tipado, validável com `@Validated`, agrupado, documentável, testável. `@Value` só para valor isolado.

**4. Como você gerencia configuração por ambiente?**
> Profiles (`application-prod.yml`), variáveis de ambiente sobrepondo o arquivo (ordem de precedência do Boot), segredos fora do repositório (Secret do K8s, Vault). Nunca senha em `application.yml` versionado.

**5. Como você trata erros numa API REST?**
> `@RestControllerAdvice` centralizando o tratamento, mapeando exceção de domínio para status HTTP correto, e devolvendo um corpo padronizado — de preferência **Problem Details (RFC 7807)**: `type`, `title`, `status`, `detail`, `instance`. Nunca vazar stack trace nem mensagem de exceção interna para o cliente.

**6. Quais códigos HTTP você usa e quando?**
> 200/201/204 no sucesso (201 com `Location` em criação); 400 (sintaxe/payload inválido) vs 422 (semanticamente inválido); 401 (não autenticado) vs 403 (autenticado sem permissão); 404; 409 (conflito de estado, ex.: versão otimista); 429 (rate limit, com `Retry-After`); 5xx só para falha do servidor.

**7. Spring MVC ou WebFlux?**
> MVC é bloqueante, uma thread por requisição — simples de escrever e depurar. WebFlux é reativo, poucas threads num event loop — ganha quando há **muita** I/O concorrente com recursos limitados, mas custa complexidade alta (stack trace ruim, curva de aprendizado, toda a cadeia precisa ser não-bloqueante). Com **Virtual Threads no Java 21**, boa parte do ganho do WebFlux é alcançável mantendo o modelo bloqueante — o argumento pró-WebFlux ficou bem mais estreito.

**8. Como validar entrada?**
> Bean Validation (`@NotNull`, `@Size`, `@Email`) no DTO + `@Valid` no controller, capturando `MethodArgumentNotValidException` no advice para devolver a lista de erros de campo. Validação de regra de negócio fica no domínio, não em anotação.

---

## Semana 4 — Spring Data JPA (onde nascem os problemas de performance)

**1. O que é o problema N+1 e como você o resolve?**
> Buscar N entidades e depois acessar uma associação lazy de cada uma dispara 1 + N queries. Diagnóstico: ligar `spring.jpa.show-sql` ou usar um contador de queries no teste. Soluções: `JOIN FETCH` na query, `@EntityGraph`, projeção (interface ou DTO) trazendo só o necessário, ou `@BatchSize` para agrupar. **Nunca** resolver trocando tudo para `EAGER`.

**2. Lazy ou eager por padrão?**
> Lazy sempre, e buscar explicitamente o que precisa. `EAGER` traz dado que ninguém pediu e torna impossível otimizar por caso de uso. Lembrando que `@ManyToOne` e `@OneToOne` são EAGER por padrão na JPA — normalmente é preciso marcar `FetchType.LAZY` à mão.

**3. O que causa `LazyInitializationException`?**
> Acessar uma associação lazy depois que a sessão/transação foi fechada — tipicamente na camada de apresentação. A correção certa é buscar o dado dentro da transação (fetch join ou DTO), não ligar `open-in-view` (que é o padrão do Boot e deveria ser desligado: ele mantém a conexão aberta durante a renderização e esconde N+1).

**4. O que é dirty checking?**
> Dentro de uma transação, alterar um campo de entidade gerenciada já persiste no flush — sem chamar `save()`. Poderoso e perigoso: uma alteração acidental em objeto gerenciado vai para o banco.

**5. Por que paginação com `OFFSET` grande é lenta?**
> O banco precisa varrer e descartar todas as linhas anteriores ao offset. Na página 10.000 isso é caríssimo. Alternativa: **keyset pagination** (`WHERE id > ultimo_id ORDER BY id LIMIT n`), que usa índice e tem custo constante.

**6. Bloqueio otimista ou pessimista?**
> Otimista (`@Version`): sem lock no banco, detecta conflito no commit e lança `OptimisticLockException` → o cliente recebe 409 e tenta de novo. Padrão para a maioria dos casos web. Pessimista (`SELECT ... FOR UPDATE`): bloqueia a linha, para quando o conflito é frequente e o retry é caro. Custa contenção.

**7. Quando você não usaria JPA?**
> Consultas analíticas complexas, operações em lote grandes, ou quando o mapeamento objeto-relacional atrapalha mais que ajuda. Nesses casos: JdbcTemplate, jOOQ ou SQL nativo. Saber dizer isso mostra maturidade — JPA não é obrigatória.

**8. O que é o persistence context, numa frase?**
> O conjunto de entidades gerenciadas nesta transação/sessão: identidade, dirty checking e cache de 1º nível.

---

## Semana 5 — Testes

**1. `@SpringBootTest` ou slices?**
> Slices sempre que possível: `@WebMvcTest` (só a camada web, com o resto mockado), `@DataJpaTest` (só JPA, com banco em memória ou Testcontainers), `@JsonTest`. Sobem em segundos em vez de minutos. `@SpringBootTest` só para teste de integração de ponta a ponta.

**2. O que é Testcontainers e por que usar?**
> Sobe dependências reais (Postgres, Kafka, Redis) em Docker durante o teste, descartadas ao final. Elimina a divergência entre H2 e o banco de produção — que sempre aparece em SQL específico do dialeto. É o padrão de mercado atual e diferencia em entrevista.

**3. O que você mocka e o que não mocka?**
> Mocka fronteira: chamada HTTP externa, serviço de terceiro, relógio. Não mocka o que está sendo testado, nem repositório em teste de integração (usar banco real via Testcontainers). Teste que só verifica `verify(mock).metodo()` não prova comportamento — prova que o código chama o que ele chama.

**4. Como testar código que depende de tempo?**
> Injetar um `Clock` e usar `Clock.fixed()` no teste. Nunca `LocalDateTime.now()` espalhado pelo código.

**5. Como você garante que um teste não é *flaky*?**
> Sem dependência de ordem entre testes, sem `Thread.sleep` (usar Awaitility), estado isolado por teste (transação com rollback ou limpeza explícita), sem dependência de rede externa real.

### Laboratório da trilha
Montar um serviço pequeno com: injeção por construtor, `@ConfigurationProperties` validado, `@RestControllerAdvice` com Problem Details, uma consulta com N+1 **e** sua versão corrigida (medindo o número de queries nos dois casos), teste com `@WebMvcTest` e teste de integração com Testcontainers + Postgres.

---

## Semana 6 — Síntese

Releia o glossário sem olhar as perguntas. Desenhe no papel o caminho HTTP → proxy → transação → persistence context.

### Perguntas-síntese (nível sênior)

- Sua API responde em 40ms no teste e 900ms em produção com o mesmo volume de dados. Por onde você começa?
- Um endpoint às vezes grava dado parcial no banco. Que hipóteses você levanta?
- Como você faria um deploy de mudança de schema sem downtime?
- Explique o caminho completo de uma requisição HTTP desde o Tomcat até o repositório.
- Você precisa de cache num método. Quais são as armadilhas de `@Cacheable`? *(auto-invocação de novo, invalidação, chave mal escolhida, cache de `null`, serialização.)*
- Por que `open-in-view=true` esconde N+1 e ainda prende conexão?

### Checklist de fluência (60 segundos)

- [ ] IoC vs DI vs bean vs ApplicationContext
- [ ] Por que construtor, não campo
- [ ] Singleton + estado mutável
- [ ] Proxy, AOP, auto-invocação
- [ ] REQUIRED vs REQUIRES_NEW; rollback só em runtime
- [ ] Auto-configuração condicional
- [ ] Persistence context, lazy, N+1, dirty checking
- [ ] Slice vs `@SpringBootTest`

## Recursos
- Spring Framework Reference — seções *The IoC Container* e *Transaction Management*.
- Spring Boot Reference — *Auto-configuration* e *Externalized Configuration*.
