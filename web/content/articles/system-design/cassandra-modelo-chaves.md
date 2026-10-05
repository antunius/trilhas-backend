---
slug: cassandra-modelo-chaves
categorySlug: system-design
title: "Cassandra e DynamoDB: partition key e clustering key"
navTitle: Partition e clustering key
summary: "Projetar a chave de partição e a de clustering a partir do padrão de acesso"
level: intermediario
order: 60
section: deep-dives-tecnologias
group: "Cassandra e DynamoDB"
---

## Objetivos de aprendizagem

- [ ] Definir partition key e clustering key e o papel de cada uma
- [ ] Explicar por que consultas sem a partition key são desencorajadas

## Cenário de referência da unidade

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

## Lembre

- A **partition key** decide em qual nó a linha vive; a **clustering key** ordena dentro da partição.
- Projete as chaves a partir da **consulta mais frequente**.
- Sem a partition key, a consulta varre o cluster inteiro.
