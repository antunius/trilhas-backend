---
slug: postgresql-pratica-docker-java
categorySlug: system-design
title: "PostgreSQL na prática: Docker, cliente e operação"
navTitle: Na prática
summary: "Subir o PostgreSQL localmente, usar o cliente Java e entender a replicação em streaming e o failover"
level: intermediario
order: 58
section: deep-dives-tecnologias
group: "PostgreSQL"
---

## Objetivos de aprendizagem

- [ ] Subir o PostgreSQL com Docker e conectar pelo cliente Java
- [ ] Explicar a replicação em streaming e como promover uma réplica

*Retomando o cenário da unidade: uma plataforma de reviews de restaurantes, com dados relacionais e busca de restaurantes dentro de um raio geográfico.*

## Subindo no Docker

Para experimentar com a tabela `reviews` do nosso cenário localmente, um `docker-compose.yml` mínimo já cobre o essencial — porta exposta, credenciais e um volume para não perder os dados a cada restart do container:

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: reviews_dev
      POSTGRES_DB: reviews_db
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

`docker compose up -d` sobe o banco; `psql -h localhost -U postgres -d reviews_db` conecta nele para testar os índices e consultas discutidos acima.

## Cliente Java: operação central de escrita/leitura

Para o cenário de reviews, a operação central é inserir uma review e buscar reviews por `restaurante_id` (a consulta que o índice B-tree visto nos fundamentos acelera). Com JDBC puro e `PreparedStatement`:

```java
String insertSql = "INSERT INTO reviews (restaurante_id, usuario_id, nota, comentario) VALUES (?, ?, ?, ?)";
try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
    stmt.setLong(1, restauranteId);
    stmt.setLong(2, usuarioId);
    stmt.setInt(3, nota);
    stmt.setString(4, comentario);
    stmt.executeUpdate();
}

String selectSql = "SELECT id, usuario_id, nota, comentario FROM reviews WHERE restaurante_id = ? ORDER BY criado_em DESC";
try (PreparedStatement stmt = connection.prepareStatement(selectSql)) {
    stmt.setLong(1, restauranteId);
    try (ResultSet rs = stmt.executeQuery()) {
        while (rs.next()) {
            // rs.getLong("usuario_id"), rs.getInt("nota"), rs.getString("comentario")
        }
    }
}
```

O `PreparedStatement` evita SQL injection (os valores são enviados separadamente do texto da query, nunca concatenados) e permite que o PostgreSQL reutilize o plano de execução entre chamadas. Em uma aplicação real, essas conexões não são abertas uma a uma — um pool como o **HikariCP** as reutiliza:

```java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost:5432/reviews_db");
config.setMaximumPoolSize(10);   // limite de conexões simultâneas ao banco
config.setMinimumIdle(2);        // conexões mantidas ociosas prontas para uso
```

## Operação avançada específica da tecnologia

**Replicação em streaming e failover.** As réplicas de leitura vistas antes são, na prática, réplicas físicas alimentadas por *streaming replication*: o primário envia continuamente os registros do WAL (write-ahead log) para cada réplica, que os aplica para se manter atualizada. Para bootstrapar uma réplica nova a partir do primário:

```bash
pg_basebackup -h primario.interno -D /var/lib/postgresql/data -U replicator -P -R
```

O `-R` já gera a configuração de conexão com o primário na réplica. Se o primário cair, promover a réplica a novo primário é o que interrompe a replicação e passa a aceitar escritas nela:

```bash
pg_ctl promote -D /var/lib/postgresql/data
```

Esse é exatamente o mecanismo por trás da mitigação de atraso de replicação discutida antes — entender que a promoção existe (e que ela é uma operação manual ou orquestrada, não automática por padrão) é o que separa "sei que réplicas existem" de "sei operar failover".

**Diagnosticando um plano de consulta ruim.** Voltando à consulta `WHERE restaurante_id = 42` vista nos fundamentos, `EXPLAIN ANALYZE` mostra o que o planejador do PostgreSQL realmente fez:

```sql
EXPLAIN ANALYZE SELECT * FROM reviews WHERE restaurante_id = 42;
```

Sem índice, o resultado mostra `Seq Scan on reviews` com um `actual time` proporcional às 10 milhões de linhas da tabela. Depois de `CREATE INDEX idx_reviews_restaurante ON reviews (restaurante_id);`, o mesmo `EXPLAIN ANALYZE` passa a mostrar `Index Scan using idx_reviews_restaurante`, com um `actual time` ordens de grandeza menor — a evidência concreta, em produção, de que o índice está sendo usado (e não apenas criado).

## Lembre

- Um `docker compose` com volume já cobre o ambiente de estudo.
- Use **parâmetros** nas consultas, nunca concatenação de texto.
- A réplica é alimentada pelo **WAL em streaming** e pode ser **promovida** se o primário cair.
