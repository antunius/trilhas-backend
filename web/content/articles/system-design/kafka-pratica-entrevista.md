---
slug: kafka-pratica-entrevista
categorySlug: system-design
title: "Kafka na prática e na entrevista"
navTitle: Na prática e na entrevista
summary: "Subir o Kafka localmente, evoluir schemas com segurança e saber o que separa uma resposta média de uma sênior"
level: intermediario
order: 86
section: deep-dives-tecnologias
group: "Kafka"
---

## Objetivos de aprendizagem

- [ ] Subir um Kafka local em modo KRaft e criar o tópico do cenário
- [ ] Evoluir um schema sem quebrar produtores e consumidores
- [ ] Reconhecer o que diferencia uma resposta de nível médio de uma de nível sênior

## Subindo o Kafka no Docker

O modo **KRaft** elimina a dependência do ZooKeeper: os próprios brokers fazem o papel de controladores, coordenados por um protocolo de consenso interno.

```yaml
# docker-compose.yml
services:
  kafka:
    image: apache/kafka:3.7.0
    ports: ["9092:9092"]
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

```bash
docker compose up -d
docker exec -it <container> /opt/kafka/bin/kafka-topics.sh \
  --create --topic atualizacoes-entrega --partitions 8 --replication-factor 1 \
  --bootstrap-server localhost:9092
```

## Schema Registry e evolução de schema

Em produção, o payload não é uma string JSON solta, e sim um schema Avro ou Protobuf registrado no **Schema Registry**, que valida a compatibilidade antes de aceitar uma versão nova. Meses depois, o time quer acrescentar a precisão do GPS. O campo novo precisa ser **opcional, com valor default**:

```json
{ "name": "precisaoMetros", "type": ["null", "double"], "default": null }
```

O modo de compatibilidade define a **ordem segura de atualização**:

- **BACKWARD** (o mais comum): um consumer com o schema **novo** lê eventos escritos com o schema **antigo**. Por isso os **consumers são atualizados primeiro**, e só depois os producers.
- **FORWARD**: um consumer com o schema **antigo** lê eventos escritos com o novo. Aqui os **producers** podem ser atualizados primeiro.

Adicionar um campo obrigatório sem default, ou remover um campo existente, quebra a compatibilidade, e o Registry rejeita o registro antes de chegar a produção.

## Principais usos no mercado

- **Pipeline de eventos entre microsserviços**, o cenário desta unidade.
- **Ingestão para analytics e data lake**, alimentando Flink, Spark e warehouses.
- **Change Data Capture**: publicar as mudanças de um banco como eventos (com Debezium).
- **Log de auditoria imutável**, aproveitando que o Kafka não apaga o que foi consumido.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Define producer, partition, consumer e consumer group; sabe que Kafka serve para "filas em escala" |
| Sênior | Articula at-least-once vs. exactly-once com custo real, escolhe a chave com justificativa de uniformidade e antecipa o rebalanceamento como fator de latência |
| Staff+ | Discute falhas em cascata (o consumer de analytics ficou 6 horas fora) e propõe o consumer lag por partição como métrica central |

## Erros comuns

- Tratar "tópico" e "partição" como sinônimos.
- Achar que dois consumer groups compartilham o offset do mesmo tópico.
- Assumir ordenação global entre partições.
- Propor exactly-once por padrão, sem avaliar o custo.

## Perguntas de aprofundamento

- "E se houver mais consumers que partições?" (os excedentes ficam ociosos; o paralelismo é limitado pelas partições.)
- "Como decide o número de partições?" (throughput-alvo ÷ throughput por partição, com folga, porque aumentar depois pode quebrar a ordem por chave.)
- "Como detecta uma partição sobrecarregada em produção?" (consumer lag por partição.)

## Lembre

- Com **BACKWARD**, atualize os **consumers primeiro**; com **FORWARD**, os **producers**.
- Campo novo de schema: **opcional e com default**.
- A métrica de saúde central é o **consumer lag por partição**.
