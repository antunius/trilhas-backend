# Lab Kafka — pedidos

Cluster local (KRaft + Schema Registry) e um Spring Boot que **escreve** e **lê** o tópico `pedidos.criados` com **3 partições**. A trilha cita estes arquivos; não invente outro projeto.

## Sobe o cluster

```bash
cd labs/kafka
docker compose up -d
```

Espere o Registry: `curl -s http://localhost:8081/subjects`.

## Cria (ou confere) o tópico com 3 partições

O app também cria o tópico no boot (`TopicConfig`). Pelo CLI, o mesmo resultado:

```bash
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create --if-not-exists \
  --topic pedidos.criados \
  --partitions 3 \
  --replication-factor 1

docker compose exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --describe --topic pedidos.criados
```

Aumentar partições depois (quebra a cola histórica da key — veja a aula de partições):

```bash
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --alter --topic pedidos.criados --partitions 6
```

## Sobe o serviço

Java 21.

```bash
cd pedido-service
./mvnw spring-boot:run
# ou: mvn spring-boot:run
```

Sem wrapper Maven: `mvn -f pedido-service/pom.xml spring-boot:run` a partir de `labs/kafka`.

## Produz e consome

Com key (pedido cola na mesma partição):

```bash
curl -s -X POST "http://localhost:8080/pedidos?pedidoId=99&totalCentavos=8000&comKey=true"
```

Sem key (linhas saltam de coluna):

```bash
curl -s -X POST "http://localhost:8080/pedidos/lote?comKey=false&n=9"
```

Nove recados, três keys (`pedido-1` … `pedido-3`):

```bash
curl -s -X POST "http://localhost:8080/pedidos/lote?comKey=true&n=9"
```

Dois grupos no mesmo processo: `faturamento` e `analytics`. Os logs imprimem `partition`, `offset`, `key`, `group`.

Offsets do grupo:

```bash
docker compose exec kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group faturamento --describe
```

## Schema Registry

O producer usa `KafkaJsonSchemaSerializer`; o consumer, `KafkaJsonSchemaDeserializer`. URL: `http://localhost:8081` em `application.yml`.

Compatibilidade do cluster: `BACKWARD` (definida no Compose).

Sujeito depois do primeiro produce:

```bash
curl -s http://localhost:8081/subjects
curl -s http://localhost:8081/subjects/pedidos.criados-value/versions/1
```

Evolução que o Registry **recusa** (remove campo obrigatório — não é BACKWARD):

```bash
curl -s -o /tmp/sr.json -w "%{http_code}" -X POST \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  --data '{"schemaType":"JSON","schema":"{\"type\":\"object\",\"additionalProperties\":false,\"properties\":{\"eventId\":{\"type\":\"string\"}},\"required\":[\"eventId\"]}"}' \
  http://localhost:8081/subjects/pedidos.criados-value/versions
```

Campo opcional novo (`cupom`) é o caminho seguro — já existe no record Java, não obrigatório.

## Outbox (lab 8)

```bash
# 1. pare o broker: docker compose stop kafka
curl -s -X POST "http://localhost:8080/pedidos/outbox?pedidoId=outbox-1"
# pedido está no H2 mesmo com Kafka morto
# 2. docker compose start kafka
# o poller (OutboxPublisher, 2s) publica a linha pendente
```

## Onde está cada peça

| Peça | Arquivo |
|------|---------|
| Compose | `docker-compose.yml` |
| Tópico 3 partições | `pedido-service/.../TopicConfig.java` |
| Producer | `PedidoProducer.java` |
| Consumers (dois grupos) | `PedidoConsumer.java` |
| YAML acks, idempotência, ack manual, concurrency | `application.yml` |
| Outbox | `OutboxService.java`, `OutboxPublisher.java` |
