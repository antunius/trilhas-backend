---
slug: escalando-leituras
categorySlug: system-design
title: "Padrão: Escalando Leituras"
navTitle: Escalando Leituras
summary: Reconhecer quando um problema é, no fundo, um problema de escala de leitura
level: intermediario
order: 51
section: padroes-recorrentes
---

## Objetivos de aprendizagem

- [ ] Reconhecer quando um problema é, no fundo, um problema de escala de leitura
- [ ] Aplicar a progressão natural de soluções, da mais simples à mais complexa

## Conteúdo

### Reconhecendo o padrão

![Réplicas e cache para leitura](/diagrams/sd-escalando-leituras.svg)

Muitos sistemas têm uma proporção de leitura muito maior que a de escrita — um feed social, um catálogo de produtos, o redirecionamento de um encurtador de URLs. Quando o enunciado ou as estimativas de capacidade revelam essa assimetria, o problema central deixa de ser "como escrever dados" e passa a ser "como servir um volume enorme de leituras sem sobrecarregar o sistema".

### A progressão natural de soluções

Um erro comum é pular direto para a solução mais sofisticada. A progressão mais defensável em uma entrevista é: primeiro otimizar o próprio banco (índices, consultas mais eficientes, desnormalização pontual); depois adicionar réplicas de leitura, distribuindo a carga entre múltiplas cópias do banco; e só então introduzir cache, aceitando algum grau de inconsistência em troca de performance. Pular direto para cache sem justificar por que as etapas anteriores não seriam suficientes costuma soar como memorização de solução, não como raciocínio.

### Os trade-offs que valem a pena mencionar

Réplicas de leitura introduzem atraso de replicação (uma leitura pode não refletir a escrita mais recente). Cache introduz o problema de invalidação (já visto no Módulo 2) e o risco de "chaves quentes" — quando um item específico é acessado com tanta frequência que sobrecarrega um único nó de cache, mesmo com o restante do sistema saudável.

## Exemplo aplicado

Em um feed social, em vez de ir direto para "vamos cachear tudo", uma resposta mais forte reconhece a progressão: primeiro garantir bons índices nas consultas mais frequentes, depois adicionar réplicas de leitura para distribuir a carga, e só então introduzir cache para os posts mais acessados — justificando cada etapa pelo volume de leitura estimado anteriormente.

## Implementando na prática (Java + Spring Boot)

### Como implementar

Depois de esgotar índices e otimizações de consulta, o próximo passo natural em uma aplicação Spring Boot é o roteamento de leitura/escrita: escritas sempre vão para o banco primário, e leituras (idealmente marcadas como `readOnly`) são direcionadas a uma ou mais réplicas. O Spring já oferece o mecanismo certo para isso — uma `AbstractRoutingDataSource` que escolhe a fonte de dados com base no contexto da transação atual, sem que o código de negócio precise saber da existência de réplicas. Quando o volume de leitura justifica ir além das réplicas, adiciona-se uma camada de cache (Spring Cache com Redis) na frente das consultas mais repetidas, como o feed de posts mais acessados.

### Como usar em Java com Spring Boot

```java
public class ReplicaRoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        boolean readOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
        return readOnly ? "replica" : "primary";
    }
}

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource routingDataSource(
            @Qualifier("primaryDataSource") DataSource primary,
            @Qualifier("replicaDataSource") DataSource replica) {

        ReplicaRoutingDataSource routingDataSource = new ReplicaRoutingDataSource();
        routingDataSource.setDefaultTargetDataSource(primary);
        routingDataSource.setTargetDataSources(Map.of(
                "primary", primary,
                "replica", replica));
        return routingDataSource;
    }
}

@Service
public class FeedService {

    private final PostRepository postRepository;

    public FeedService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // readOnly = true faz a transação ser roteada para a réplica
    @Transactional(readOnly = true)
    @Cacheable(value = "feed", key = "#userId")
    public List<Post> getFeed(Long userId) {
        return postRepository.findRecentByUserId(userId);
    }
}
```

### Como configurar

```yaml
spring:
  datasource:
    primary:
      jdbc-url: jdbc:postgresql://db-primary:5432/app
      username: app
      password: ${DB_PRIMARY_PASSWORD}
      hikari:
        maximum-pool-size: 20
    replica:
      jdbc-url: jdbc:postgresql://db-replica:5432/app
      username: app
      password: ${DB_REPLICA_PASSWORD}
      hikari:
        maximum-pool-size: 30
  cache:
    type: redis
    redis:
      time-to-live: 30s
  data:
    redis:
      host: redis
      port: 6379
```

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## Erros comuns

- Propor cache como primeira e única solução, sem mencionar réplicas ou otimizações mais simples do próprio banco.
- Ignorar o problema de chaves quentes ao propor cache para conteúdo com distribuição de acesso muito desigual.
