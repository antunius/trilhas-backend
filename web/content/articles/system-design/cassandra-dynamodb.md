---
slug: cassandra-dynamodb
categorySlug: system-design
title: "Deep Dive: Cassandra e DynamoDB"
navTitle: Cassandra e DynamoDB
summary: Projetar uma chave de partição e chave de clustering para um caso de uso concreto
level: intermediario
order: 47
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Projetar uma chave de partição e chave de clustering para um caso de uso concreto
- [ ] Explicar consistência ajustável com números concretos de réplicas
- [ ] Reconhecer o trade-off entre esse modelo e um banco relacional em termos de consultas suportadas

## Cenário de referência para esta aula

Vamos usar um sistema de histórico de mensagens de chat (estilo WhatsApp), onde cada conversa pode ter milhões de mensagens acumuladas ao longo do tempo, o padrão de leitura mais comum é "as últimas N mensagens de uma conversa específica", e o volume de escrita é extremamente alto (bilhões de mensagens por dia, globalmente).

## Fundamentos: partition key e clustering key

Esse tipo de banco (Cassandra e DynamoDB compartilham o mesmo modelo mental, com nomes ligeiramente diferentes) organiza cada tabela em torno de duas decisões de design:

- **Partition key (chave de partição)**: determina em qual nó do cluster a linha vive — todas as linhas com a mesma partition key ficam fisicamente juntas no mesmo conjunto de nós. No nosso cenário, a escolha natural é o **ID da conversa**: todas as mensagens de uma mesma conversa ficam colocalizadas.
- **Clustering key (chave de clustering)**: dentro de uma mesma partição, determina a ordem física de armazenamento das linhas. Para o nosso cenário, o **timestamp da mensagem** é a escolha natural — as mensagens de uma conversa ficam fisicamente ordenadas por data, tornando "as últimas 50 mensagens desta conversa" uma leitura sequencial barata, em vez de uma busca espalhada.

```
Tabela: mensagens
Partition Key: id_conversa
Clustering Key: timestamp (ordem decrescente)

id_conversa=42, timestamp=2026-09-01T10:00 -> {"remetente": "ana", "texto": "oi"}
id_conversa=42, timestamp=2026-09-01T10:01 -> {"remetente": "bruno", "texto": "tudo bem?"}
id_conversa=99, timestamp=2026-09-01T09:50 -> {"remetente": "carla", "texto": "..."}
```

![Partition key agrupa fisicamente, clustering key ordena dentro do grupo](/diagrams/cassandra-particionamento.svg)

**A implicação prática mais importante**: uma consulta que especifica a partition key completa (`WHERE id_conversa = 42`) é rápida — vai direto ao(s) nó(s) responsável(is) por essa partição. Uma consulta que **não** especifica a partition key (`WHERE remetente = 'ana'`, buscando em todas as conversas) exige varrer o cluster inteiro, e é ativamente desencorajada — em muitos desses bancos, esse tipo de consulta ampla nem é permitida sem uma configuração ou índice secundário explícito. Isso é o oposto de um banco relacional, onde qualquer coluna pode, em princípio, ser filtrada, ao custo de performance.

## Replicação e consistência ajustável

Cada partição é replicada em múltiplos nós (um **fator de replicação**, tipicamente 3). A parte interessante é que, ao contrário de "consistente" ou "eventualmente consistente" como escolha única e global, esses bancos permitem ajustar, **por operação**, quantas réplicas precisam confirmar:

- **Nível de escrita**: se o fator de replicação é 3 e o nível de escrita exigido é 2 (`QUORUM`), a escrita só é confirmada como bem-sucedida depois que 2 das 3 réplicas a receberam.
- **Nível de leitura**: da mesma forma, uma leitura pode exigir resposta de 1, 2, ou todas as 3 réplicas antes de retornar um resultado.

**A matemática da consistência forte "ajustada"**: se `nível_escrita + nível_leitura > fator_de_replicação`, é matematicamente garantido que pelo menos uma réplica consultada na leitura também recebeu a escrita mais recente — obtendo consistência forte sem exigir que todas as réplicas participem de toda operação. No nosso exemplo (fator 3), escrita com nível 2 e leitura com nível 2 (2+2=4 > 3) garante essa propriedade; escrita com nível 1 e leitura com nível 1 (1+1=2, não > 3) não garante, priorizando velocidade sobre essa garantia.

**No nosso cenário de chat**: para o envio de uma mensagem, prioriza-se disponibilidade e baixa latência (nível de escrita baixo, ex: 1) — perder momentaneamente a garantia de leitura mais recente em um cenário raro de falha é aceitável, dado que o histórico de chat tolera uma inconsistência breve muito mais do que, digamos, um saldo bancário.

## Hot partitions: o mesmo problema, nova roupagem

Se uma conversa específica (um grupo viral com milhões de participantes, por exemplo) gera volume de mensagens desproporcional, a partição responsável por essa conversa fica sobrecarregada enquanto as demais permanecem ociosas — o mesmo fenômeno de hot partition já visto em Kafka e Elasticsearch, aqui aplicado a esse tipo de banco. Mitigações similares se aplicam: uma chave de partição composta (ex: `id_conversa + intervalo_de_tempo`, quebrando uma conversa gigante em sub-partições por período) é uma técnica comum quando esse cenário é previsível.

## Quando esse modelo não é a escolha certa

Esse tipo de banco não é uma boa escolha quando o problema central envolve relacionamentos complexos entre entidades diferentes (joins), consultas ad-hoc variadas sobre colunas diferentes a cada vez, ou transações que precisam de consistência forte imediata entre múltiplas linhas não relacionadas por uma partition key comum. Nesses casos, um banco relacional continua sendo a escolha mais direta — o trade-off central é: você ganha escala de escrita massiva e previsibilidade de latência, em troca de flexibilidade de consulta.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "Cassandra/DynamoDB escalam bem para NoSQL", menciona "sem esquema fixo" de forma genérica |
| Sênior | Projeta uma partition key e clustering key concretas e justificadas pelo padrão de acesso real do problema |
| Staff+ | Além do acima, usa a matemática de `escrita + leitura > fator de replicação` para justificar o nível de consistência escolhido, e antecipa hot partitions com uma chave composta |

## Na prática

### Subindo no Docker

Para Cassandra, um único nó local:

```yaml
# docker-compose.yml
services:
  cassandra:
    image: cassandra:latest
    ports:
      - "9042:9042"
    environment:
      CASSANDRA_CLUSTER_NAME: chat-cluster
      CASSANDRA_DC: dc1
      CASSANDRA_ENDPOINT_SNITCH: GossipingPropertyFileSnitch
    volumes:
      - cassandra-data:/var/lib/cassandra

volumes:
  cassandra-data:
```

Para DynamoDB, não é preciso conta AWS para desenvolver localmente — a Amazon publica uma imagem que emula a API:

```bash
docker run -d -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```

### Cliente Java: operação central de escrita/leitura

Aplicando ao nosso cenário de histórico de chat (`id_conversa` como partition key, `timestamp` como clustering key).

**Cassandra**, com o driver oficial da DataStax e `PreparedStatement` (evita reparsing da query e é a forma correta de parametrizar, evitando injection):

```java
CqlSession session = CqlSession.builder()
        .addContactPoint(new InetSocketAddress("127.0.0.1", 9042))
        .withLocalDatacenter("dc1")
        .withKeyspace("chat")
        .build();

PreparedStatement insertMsg = session.prepare(
    "INSERT INTO mensagens (id_conversa, timestamp, remetente, texto) VALUES (?, ?, ?, ?)");
session.execute(insertMsg.bind(42, Instant.now(), "ana", "oi"));

PreparedStatement selectUltimas = session.prepare(
    "SELECT * FROM mensagens WHERE id_conversa = ? ORDER BY timestamp DESC LIMIT 50");
ResultSet rs = session.execute(selectUltimas.bind(42));
for (Row row : rs) {
    System.out.println(row.getString("remetente") + ": " + row.getString("texto"));
}
```

**DynamoDB**, com o Enhanced Client (mapeamento objeto-tabela sobre o `DynamoDbClient` base):

```java
DynamoDbEnhancedClient enhancedClient = DynamoDbEnhancedClient.builder()
        .dynamoDbClient(DynamoDbClient.create())
        .build();

DynamoDbTable<Mensagem> tabela = enhancedClient.table("mensagens", TableSchema.fromBean(Mensagem.class));

Mensagem msg = new Mensagem();
msg.setIdConversa(42);         // partition key
msg.setTimestamp(Instant.now().toString()); // sort key
msg.setRemetente("ana");
msg.setTexto("oi");
tabela.putItem(msg);

Mensagem lida = tabela.getItem(Key.builder()
        .partitionValue(42)
        .sortValue(msg.getTimestamp())
        .build());
```

### Operação avançada específica da tecnologia: rebalanceamento de partições ao escalar o cluster

**Cassandra** usa **vnodes** (virtual nodes) sobre um anel de hash consistente: em vez de cada servidor físico possuir um único intervalo contíguo de tokens, cada servidor recebe várias centenas de pequenos intervalos espalhados pelo anel. Isso faz com que, ao adicionar um novo nó ao cluster, o trabalho de redistribuir dados fique espalhado por praticamente todos os nós existentes (cada um cede vários pequenos pedaços), em vez de sobrecarregar apenas os dois vizinhos imediatos do novo nó — tornando o processo de scale-out mais rápido e com impacto mais uniforme na latência.

**DynamoDB** faz esse particionamento de forma totalmente gerenciada: quando uma partição cresce além dos limites de tamanho (10 GB) ou throughput, a AWS a divide automaticamente em duas (partition split), de forma transparente para a aplicação. O problema operacional real é a **hot partition**: se uma partition key concentra tráfego desproporcional (nosso caso do grupo viral), throughput provisionado é consumido de forma desigual, e mesmo com **adaptive capacity** (que redistribui capacidade não usada de partições frias para partições quentes de forma automática desde 2019) uma partição isolada tem um teto físico de throughput — daí a mesma recomendação vista antes, de compor a partition key para espalhar uma chave "quente" prevista.

### Evolução/schema/migração

**Cassandra** tem schema declarado (diferente do DynamoDB), mas alterá-lo não exige downtime nem migração de dados existentes — `ALTER TABLE` apenas registra a nova coluna, que passa a existir como `null` para linhas antigas:

```sql
ALTER TABLE mensagens ADD editada boolean;
ALTER TABLE mensagens ADD reacoes map<text, int>;
```

Consumidores antigos que não conhecem `editada` simplesmente ignoram a coluna; não é preciso coordenar um deploy simultâneo de schema e código.

**DynamoDB** não tem schema de tabela para colunas (apenas para a chave), então a "migração" é inteiramente uma responsabilidade da aplicação. O padrão recomendado é um atributo `schemaVersion` em cada item, com código de leitura tolerante a formatos antigos:

```java
Map<String, AttributeValue> item = response.item();
int versao = item.containsKey("schemaVersion")
        ? Integer.parseInt(item.get("schemaVersion").n())
        : 1; // itens antigos, gravados antes do campo existir

String texto;
if (versao >= 2) {
    texto = item.get("conteudo").m().get("texto").s(); // formato novo: campo aninhado
} else {
    texto = item.get("texto").s(); // formato antigo: campo plano
}
```

Novas escritas sempre gravam com `schemaVersion` atual; a aplicação mantém esse código de leitura dupla até que uma migração em background (ou o TTL natural dos dados antigos) elimine os itens no formato legado.

### Principais usos

- Sistemas de altíssimo throughput de escrita, como telemetria de IoT e dados de série temporal.
- Carrinho de compras e estado de sessão em plataformas de e-commerce de grande escala.
- Sistemas que precisam de consistência ajustável por operação e escrita ativa-ativa multi-região.
- Armazenamento de feature flags e perfis de usuário lidos com latência de milissegundos em escala massiva.

## Erros comuns

- Escolher uma partition key que não corresponde ao padrão de consulta mais frequente do sistema (ex: particionar por remetente quando a consulta principal é por conversa).
- Tratar consistência como uma escolha binária ("forte" ou "eventual"), sem reconhecer que é ajustável por operação nesses bancos.
- Propor uma consulta que filtra por uma coluna que não é a partition key, sem reconhecer o custo (ou a impossibilidade, sem configuração adicional) dessa operação.
