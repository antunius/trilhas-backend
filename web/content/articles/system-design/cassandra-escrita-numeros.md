---
slug: cassandra-escrita-numeros
categorySlug: system-design
title: "O caminho da escrita e os números de escala"
navTitle: Escrita e números
summary: "Seguir uma escrita do coordenador ao SSTable e estimar volumes e tamanho de partição"
level: intermediario
order: 61
section: deep-dives-tecnologias
group: "Cassandra e DynamoDB"
---

## Objetivos de aprendizagem

- [ ] Descrever commit log, memtable e SSTable
- [ ] Estimar escritas por segundo e o tamanho de uma partição

*Retomando o cenário da unidade: o histórico de mensagens de um chat (estilo WhatsApp), com bilhões de escritas por dia e a leitura mais comum sendo "as últimas N mensagens de uma conversa".*

## Juntando as peças: o caminho de uma escrita

1. O app envia uma mensagem da conversa 42. O driver calcula o hash da partition key e escolhe como **coordenador** um dos nós réplicas.
2. O coordenador repassa a escrita às 3 réplicas daquela partição.
3. Cada réplica anexa a escrita ao **commit log** (um arquivo sequencial, para sobreviver a quedas) e a grava numa estrutura em memória chamada **memtable**.
4. Quando o número exigido de réplicas confirma (o nível de escrita), o coordenador responde "ok".
5. Mais tarde, a memtable é descarregada em disco como um arquivo imutável (**SSTable**), e arquivos antigos são fundidos em segundo plano (*compaction*).

Esse caminho é **só de anexar, nunca de reescrever no meio**, e é o motivo de a escrita ser tão rápida e de a latência ser previsível.

## Números concretos para ancorar a escala

Com 1 bilhão de mensagens por dia, são cerca de **11.600 escritas por segundo** em média (1.000.000.000 ÷ 86.400). Um único nó Cassandra sustenta algo da ordem de dezenas de milhares de escritas por segundo, então um cluster de 6 a 12 nós cobre a média e o pico com folga e com réplicas.

O limite que realmente assusta é o **tamanho de uma partição**. A recomendação prática é mantê-la abaixo de algumas centenas de MB. Uma conversa de grupo com 1 milhão de mensagens de 200 bytes ocupa **200 MB**, no limite do aceitável. Com 10 milhões, seriam 2 GB, uma partição pesada para ler, reparar e mover. Por isso, para conversas gigantes, a chave de partição é composta: `(id_conversa, mes)`, o que quebra a conversa em uma partição por mês.

## Lembre

- A escrita só **anexa**: commit log e memtable, sem reescrever no meio.
- Mantenha cada partição abaixo de **algumas centenas de MB**.
- 1 bilhão de mensagens por dia são cerca de **11.600 escritas por segundo**.
