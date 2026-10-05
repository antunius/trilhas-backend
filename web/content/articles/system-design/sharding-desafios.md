---
slug: sharding-desafios
categorySlug: system-design
title: "Os desafios do sharding e quando não usá-lo"
navTitle: Desafios e quando evitar
summary: "Reconhecer consultas entre shards, transações distribuídas, hot shards e rebalanceamento, e saber quando não fazer sharding"
level: intermediario
order: 32
section: tecnologias-chave
group: "Sharding"
---

## Objetivos de aprendizagem

- [ ] Nomear os desafios que o sharding introduz
- [ ] Listar as alternativas a tentar antes de fazer sharding

*Retomando o cenário da unidade: um aplicativo de mensagens com 200 milhões de usuários, cerca de 8 bilhões de mensagens e 8 TB novos por dia.*

## Os desafios que o sharding introduz

### Consultas entre shards

"Todas as conversas do usuário 77" não é consulta por `conversa_id`. Como as conversas dele estão em shards diferentes, o sistema precisa perguntar a **todos** os shards e juntar as respostas (*scatter-gather*). Isso é mais lento e mais caro. Soluções: manter um índice secundário por usuário, ou duplicar os dados com outra chave.

### Transações entre shards

Uma operação que altera dois shards (mover dinheiro da conta A no shard 1 para a conta B no shard 2) perde a transação ACID simples. É preciso protocolos como *two-phase commit* ou o padrão *saga*, ambos mais complexos e lentos. O desenho prefere manter dados que mudam juntos **no mesmo shard**.

### Hot shard e hot key

Se uma conversa de grupo recebe tráfego enorme, o shard dela fica sobrecarregado mesmo com a distribuição média uniforme. Isso é o mesmo problema da *hot partition* do Kafka: o paralelismo teórico não vale se uma chave domina.

### Rebalanceamento

Quando os dados crescem, é preciso criar shards novos e **mover dados** entre os existentes, com o sistema funcionando. É uma operação delicada, e é por isso que se planeja o número de shards com folga desde o início.

## Quando NÃO fazer sharding

Sharding é um dos passos mais caros de reverter e de operar. Antes de propô-lo, esgote os caminhos mais simples:

1. Otimizar consultas e **índices**.
2. Colocar um **cache** na frente das leituras.
3. Adicionar **réplicas de leitura**.
4. **Escalar verticalmente** (máquina maior).
5. Só então, particionar.

Em entrevista, mostrar que você sabe **quando não** fazer sharding vale tanto quanto saber como.

## Lembre

- Consultas **entre shards** viram scatter-gather.
- Transações entre shards perdem o ACID simples: **saga** ou two-phase commit.
- Antes de particionar: **índices, cache, réplicas e escala vertical**.
