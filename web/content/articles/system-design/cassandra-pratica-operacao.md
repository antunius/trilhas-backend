---
slug: cassandra-pratica-operacao
categorySlug: system-design
title: "Cassandra e DynamoDB na prática: clientes, vnodes e schema"
navTitle: Na prática e operação
summary: "Usar os clientes Java, entender vnodes e partition splits e evoluir o schema com segurança"
level: intermediario
order: 64
section: deep-dives-tecnologias
group: "Cassandra e DynamoDB"
---

## Objetivos de aprendizagem

- [ ] Escrever e ler com o cliente Java do Cassandra e do DynamoDB
- [ ] Evoluir o schema sem downtime

*Retomando o cenário da unidade: o histórico de mensagens de um chat (estilo WhatsApp), com bilhões de escritas por dia e a leitura mais comum sendo "as últimas N mensagens de uma conversa".*

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

## Lembre

- **Vnodes** espalham o rebalanceamento por muitos nós.
- O DynamoDB **divide partições** sozinho, mas uma partição tem teto de throughput.
- No DynamoDB, a migração é da **aplicação**: use `schemaVersion`.
