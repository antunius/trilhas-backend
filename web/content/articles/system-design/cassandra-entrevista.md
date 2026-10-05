---
slug: cassandra-entrevista
categorySlug: system-design
title: "Cassandra e DynamoDB na entrevista"
navTitle: Na entrevista
summary: "Saber os usos principais, os erros comuns e as perguntas de aprofundamento"
level: intermediario
order: 65
section: deep-dives-tecnologias
group: "Cassandra e DynamoDB"
---

## Objetivos de aprendizagem

- [ ] Reconhecer os usos típicos desses bancos
- [ ] Responder com o nível de um sênior

*Retomando o cenário da unidade: o histórico de mensagens de um chat (estilo WhatsApp), com bilhões de escritas por dia e a leitura mais comum sendo "as últimas N mensagens de uma conversa".*

## Principais usos

- Sistemas de altíssimo throughput de escrita, como telemetria de IoT e dados de série temporal.
- Carrinho de compras e estado de sessão em plataformas de e-commerce de grande escala.
- Sistemas que precisam de consistência ajustável por operação e escrita ativa-ativa multi-região.
- Armazenamento de feature flags e perfis de usuário lidos com latência de milissegundos em escala massiva.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "Cassandra/DynamoDB escalam bem para NoSQL", menciona "sem esquema fixo" de forma genérica |
| Sênior | Projeta uma partition key e clustering key concretas e justificadas pelo padrão de acesso real do problema |
| Staff+ | Além do acima, usa a matemática de `escrita + leitura > fator de replicação` para justificar o nível de consistência escolhido, e antecipa hot partitions com uma chave composta |

## Erros comuns

- Escolher uma partition key que não corresponde ao padrão de consulta mais frequente do sistema (ex: particionar por remetente quando a consulta principal é por conversa).
- Tratar consistência como uma escolha binária ("forte" ou "eventual"), sem reconhecer que é ajustável por operação nesses bancos.
- Propor uma consulta que filtra por uma coluna que não é a partition key, sem reconhecer o custo (ou a impossibilidade, sem configuração adicional) dessa operação.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que a consulta `WHERE remetente = 'ana'` é problemática?" (não informa a partition key, então precisa varrer o cluster inteiro; a solução é modelar uma tabela adicional particionada por remetente, duplicando dados de forma deliberada.)
- "Com fator de replicação 3, o que garante leitura forte?" (nível de escrita + nível de leitura > 3, por exemplo QUORUM + QUORUM = 2 + 2 = 4.)
- "Como lidar com um grupo viral que cria uma partição gigante?" (chave composta com um bucket de tempo, por exemplo `(id_conversa, mes)`, dividindo a conversa em partições menores.)
- "Por que a escrita é tão rápida?" (o caminho só anexa ao commit log e à memtable; nenhuma leitura nem reescrita no meio do arquivo é necessária.)

## Lembre

- Escolha a **partition key** pelo padrão de acesso, não pelo dado.
- Use **W + R > N** para justificar o nível de consistência.
- Antecipe **hot partitions** com uma chave composta.
