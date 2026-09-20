---
slug: postgresql
categorySlug: system-design
title: "Deep Dive: PostgreSQL em Profundidade"
navTitle: PostgreSQL em Profundidade
summary: Explicar índices B-tree e quando eles realmente ajudam (e quando não)
level: intermediario
order: 48
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Explicar índices B-tree e quando eles realmente ajudam (e quando não)
- [ ] Escolher entre JSONB e uma tabela normalizada com justificativa
- [ ] Discutir réplicas de leitura e o atraso de replicação com um exemplo numérico
- [ ] Reconhecer quando estender o PostgreSQL evita introduzir uma tecnologia especializada nova

![PostgreSQL: conexões, índices, WAL](/diagrams/sd-postgresql.svg)

## Cenário de referência para esta aula

Vamos usar uma plataforma de reviews de restaurantes, com dados razoavelmente relacionais (usuários, restaurantes, reviews) e um requisito específico: buscar restaurantes dentro de um raio geográfico de uma localização.

## Índices B-tree: o que realmente acontece por baixo

Um índice B-tree (o tipo padrão no PostgreSQL) organiza os valores de uma coluna em uma estrutura de árvore balanceada, permitindo localizar um valor específico em tempo logarítmico, em vez de examinar cada linha da tabela sequencialmente.

**Exemplo concreto**: uma tabela `reviews` com 10 milhões de linhas, buscando reviews de um restaurante específico (`WHERE restaurante_id = 42`). Sem índice, o banco faz um *sequential scan* — examina as 10 milhões de linhas, uma a uma, para saber quais correspondem. Com um índice B-tree em `restaurante_id`, o banco desce a árvore em poucos passos (para 10 milhões de linhas, algo como log₂(10.000.000) ≈ 23 comparações) até localizar diretamente as linhas relevantes.

**Quando um índice NÃO ajuda**: se a consulta busca `WHERE UPPER(nome_restaurante) = 'PIZZARIA X'`, um índice comum em `nome_restaurante` não é usado, porque o banco precisaria aplicar a função `UPPER` a cada linha antes de comparar — o índice guarda os valores originais, não os valores transformados. A solução, quando esse padrão de consulta é frequente, é um índice de expressão (indexando o resultado de `UPPER(nome_restaurante)` diretamente) — um detalhe que separa quem só sabe "adicionar índice" de quem entende como índices realmente funcionam.

**O custo, sempre presente**: cada índice adicional torna cada `INSERT`/`UPDATE`/`DELETE` na tabela mais lento (o índice também precisa ser atualizado), e ocupa espaço em disco adicional — a decisão de indexar deve vir de um padrão de leitura real e frequente, não "por precaução".

## JSONB: flexibilidade dentro de um banco relacional

PostgreSQL suporta uma coluna do tipo `JSONB` (JSON armazenado em formato binário, indexável), permitindo guardar dados semi-estruturados dentro de uma tabela relacional comum. Para o nosso cenário, os metadados variáveis de um restaurante (horário de funcionamento, que muda de formato dependendo do tipo de estabelecimento, opções de comodidade como "aceita pets" ou "tem estacionamento") são um bom candidato a `JSONB` — tentar normalizar cada variação possível em colunas ou tabelas separadas geraria um esquema excessivamente complexo para um dado que, na prática, é consultado como um bloco só.

**O limite dessa flexibilidade**: dados centrais e consultados constantemente com filtros específicos (como o próprio `restaurante_id`, nome, localização) devem continuar em colunas normais e indexadas normalmente — `JSONB` é um complemento para dados variáveis e secundários, não um substituto geral para modelagem relacional adequada.

## Estendendo o PostgreSQL antes de introduzir uma tecnologia nova

### Busca geoespacial com PostGIS

Para "restaurantes num raio de 2km", a extensão PostGIS adiciona tipos de dados geoespaciais e índices especializados (baseados em uma estrutura chamada GiST) que tornam essa consulta eficiente — sem precisar introduzir um banco especializado adicional só para esse requisito. `SELECT * FROM restaurantes WHERE ST_DWithin(localizacao, ponto_usuario, 2000)` (2000 metros) é o tipo de consulta que o PostGIS resolve de forma nativa e performática.

### Busca textual com índices GIN

Para uma busca textual básica no nome ou na descrição do restaurante (sem a sofisticação de relevância avançada do Elasticsearch, mas suficiente para volumes moderados), um índice GIN sobre um campo de busca de texto completo do próprio PostgreSQL resolve isso sem introduzir o Elasticsearch — que só se justificaria se a busca precisasse de recursos mais avançados (tolerância a erros de digitação, ranqueamento sofisticado, agregações complexas) em um volume que realmente sobrecarregasse essa solução mais simples.

**O critério prático**: introduzir uma tecnologia especializada nova tem um custo real de complexidade operacional — vale reservar essa introdução para quando o requisito realmente ultrapassa o que uma extensão bem escolhida do PostgreSQL entrega.

## Réplicas de leitura e o atraso de replicação, com números

Para escalar leitura antes de considerar sharding (Módulo 2), réplicas de leitura recebem as escritas do banco primário de forma assíncrona e atendem consultas de leitura, distribuindo a carga.

**Um exemplo numérico concreto**: se a replicação assíncrona tem um atraso típico de 50-200ms (variando com carga e distância de rede), um usuário que acabou de publicar uma review e imediatamente recarrega a página pode, na pior das hipóteses, não ver sua própria review ainda — porque a leitura foi atendida por uma réplica que ainda não recebeu essa escrita específica. Uma mitigação comum é rotear a leitura imediatamente após uma escrita do próprio usuário para o banco primário (ou para uma réplica com garantia mais forte de estar atualizada), e só usar réplicas comuns para leituras que toleram esse atraso.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "índices aceleram consultas" e que "réplicas ajudam a escalar leitura", em termos gerais |
| Sênior | Explica por que uma função aplicada a uma coluna impede o uso de um índice comum, e propõe extensões (PostGIS, GIN) antes de saltar para uma tecnologia especializada nova |
| Staff+ | Além do acima, quantifica o atraso de replicação e propõe uma estratégia concreta de roteamento de leitura pós-escrita para o próprio usuário |

## Na prática

### Subindo no Docker

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

### Cliente Java: operação central de escrita/leitura

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

### Operação avançada específica da tecnologia

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

### Evolução/schema/migração

Mudanças de schema em produção usam uma ferramenta de migração versionada como **Flyway**, em vez de alterar tabelas manualmente. Um arquivo `V1__adiciona_indice_restaurante.sql`:

```sql
CREATE INDEX CONCURRENTLY idx_reviews_restaurante ON reviews (restaurante_id);
```

(`CONCURRENTLY` evita travar a tabela inteira durante a criação do índice — importante em uma tabela de 10 milhões de linhas já em produção.)

Para mudar o formato de uma coluna existente sem quebrar consumidores que ainda leem o formato antigo, o padrão é **expand/contract**: se a coluna `nota` precisasse migrar de inteiro (1-5) para decimal (permitindo meias notas), o deploy seria feito em etapas —

1. **Expand**: adicionar a nova coluna `nota_decimal NUMERIC(2,1)`, mantendo `nota` intacta.
2. **Dual-write**: a aplicação passa a escrever em ambas as colunas a cada novo insert/update.
3. **Backfill**: um job popula `nota_decimal` para as linhas antigas a partir de `nota`.
4. **Contract**: só em um deploy posterior, depois que todo consumidor já lê `nota_decimal`, a coluna `nota` é removida.

Esse faseamento evita o cenário em que um deploy de schema e um deploy de código precisam ser perfeitamente simultâneos — cada etapa é, isoladamente, compatível com a versão anterior da aplicação.

### Principais usos

- Sistema de registro (*system of record*) transacional para pedidos, contas e inventário, onde consistência forte em escritas é indispensável.
- Relatórios e analytics internos usando *materialized views*, pré-computando agregações pesadas sem sobrecarregar as tabelas transacionais.
- Dados geoespaciais com PostGIS (busca por raio, rotas, cálculo de área) sem introduzir um banco especializado à parte.
- Campos semi-estruturados e variáveis (metadados, preferências, payloads de eventos) em `JSONB`, convivendo com o restante do dado relacional na mesma tabela.

## Erros comuns

- Adicionar índices sem considerar o padrão de escrita, ignorando o custo de manutenção de cada índice.
- Assumir automaticamente que um requisito de busca ou geolocalização exige uma tecnologia nova, sem considerar extensões do próprio PostgreSQL.
- Ignorar completamente o atraso de replicação ao propor réplicas de leitura como solução de escala.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que um índice em `nome_restaurante` não ajuda uma busca por `UPPER(nome_restaurante) = 'X'`?" (o índice armazena valores originais; um índice de expressão seria necessário para esse padrão específico).
- "O que aconteceria se um usuário lesse imediatamente após escrever, e a leitura fosse servida por uma réplica atrasada?" (risco de não ver a própria mudança — mitigado roteando essa leitura específica para o primário).
