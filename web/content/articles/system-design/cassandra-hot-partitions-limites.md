---
slug: cassandra-hot-partitions-limites
categorySlug: system-design
title: "Hot partitions e quando esse modelo não serve"
navTitle: Hot partitions e limites
summary: "Reconhecer partições quentes, dividir uma conversa gigante com chave composta e saber quando preferir um banco relacional"
level: intermediario
order: 63
section: deep-dives-tecnologias
group: "Cassandra e DynamoDB"
---

## Objetivos de aprendizagem

- [ ] Dividir uma partição gigante com uma chave composta
- [ ] Reconhecer quando um banco relacional é a escolha melhor

*Retomando o cenário da unidade: o histórico de mensagens de um chat (estilo WhatsApp), com bilhões de escritas por dia e a leitura mais comum sendo "as últimas N mensagens de uma conversa".*

## Hot partitions: o mesmo problema, nova roupagem

Se uma conversa específica (um grupo viral com milhões de participantes, por exemplo) gera volume de mensagens desproporcional, a partição responsável por essa conversa fica sobrecarregada enquanto as demais permanecem ociosas — o mesmo fenômeno de hot partition já visto em Kafka e Elasticsearch, aqui aplicado a esse tipo de banco. Mitigações similares se aplicam: uma chave de partição composta (ex: `id_conversa + intervalo_de_tempo`, quebrando uma conversa gigante em sub-partições por período) é uma técnica comum quando esse cenário é previsível.

## Quando esse modelo não é a escolha certa

Esse tipo de banco não é uma boa escolha quando o problema central envolve relacionamentos complexos entre entidades diferentes (joins), consultas ad-hoc variadas sobre colunas diferentes a cada vez, ou transações que precisam de consistência forte imediata entre múltiplas linhas não relacionadas por uma partition key comum. Nesses casos, um banco relacional continua sendo a escolha mais direta — o trade-off central é: você ganha escala de escrita massiva e previsibilidade de latência, em troca de flexibilidade de consulta.

### Dividindo a conversa por mês

```sql
CREATE TABLE mensagem (
    id_conversa uuid,
    mes         text,          -- ex.: '2025-10'
    ts          timeuuid,
    texto       text,
    PRIMARY KEY ((id_conversa, mes), ts)
) WITH CLUSTERING ORDER BY (ts DESC);
```

A partition key agora é o par `(id_conversa, mes)`. Cada mês de cada conversa é uma partição própria, e uma conversa viral deixa de ser uma partição única de gigabytes. O custo: ler "as últimas 50" pode exigir consultar o mês corrente e, se faltar, o anterior.

## Lembre

- Uma **hot partition** vem de uma chave que concentra o tráfego.
- Chave **composta** com um bucket de tempo divide a partição gigante.
- Joins, consultas ad-hoc e transações entre muitas linhas pedem um **banco relacional**.
