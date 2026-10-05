---
slug: zookeeper-quorum-quando-usar
categorySlug: system-design
title: "Quorum e quando usar o ZooKeeper"
navTitle: Quorum e quando usar
summary: "Entender por que o ZooKeeper roda em ensemble com quorum e quando ele é, ou não, a escolha certa"
level: intermediario
order: 95
section: deep-dives-tecnologias
group: "ZooKeeper"
---

## Objetivos de aprendizagem

- [ ] Explicar o quorum e o número ímpar de servidores
- [ ] Decidir quando usar ZooKeeper

*Retomando o cenário da unidade: um cluster de 5 workers idênticos, em que exatamente um precisa atuar como coordenador a qualquer momento, com recuperação automática.*

## Por que um único nó ZooKeeper não seria confiável: quorum

O próprio ZooKeeper, para ser confiável, roda como um cluster de múltiplos servidores (um "ensemble", tipicamente com um número ímpar de nós — 3 ou 5 é comum). Escritas só são confirmadas depois de aceitas por uma **maioria** (quorum) desses servidores, não apenas um. Isso garante que, mesmo se uma minoria de servidores falhar ou ficar isolada por uma partição de rede, o restante (a maioria) continua operando com uma visão consistente dos dados — e a minoria isolada não pode, sozinha, aceitar escritas conflitantes, evitando o cenário de split-brain em que duas máquinas isoladas uma da outra decidem, cada uma, que são a líder.

**Por que um número ímpar de servidores**: com 5 servidores, o cluster tolera a falha de até 2 (a maioria restante, 3, ainda forma quorum). Com 4 servidores, ainda só tolera a falha de 1 (precisa de 3 de 4 para maioria) — pagando o custo de mais um servidor sem ganhar tolerância a falha adicional. Por isso, ensembles ZooKeeper quase sempre usam contagens ímpares.

## Quando ZooKeeper é a escolha certa (e quando não é)

ZooKeeper faz sentido quando o problema central é genuinamente **coordenação**: eleição de líder, configuração compartilhada com necessidade de notificação de mudança, ou locks distribuídos onde a garantia de correção precisa ser mais forte do que a de um lock baseado em Redis (visto na aula anterior). Não é a ferramenta certa para armazenar o volume de dados de uma aplicação (não foi desenhado para isso, e znodes são intencionalmente pequenos) — um erro comum de candidatos é propor ZooKeeper como se fosse um banco de dados de propósito geral.

Vale mencionar também: em sistemas mais modernos, alternativas como etcd ou Raft embutido diretamente na aplicação (usado, por exemplo, em versões mais recentes do próprio Kafka, que historicamente dependia de ZooKeeper) vêm substituindo o ZooKeeper em novos projetos — mas o modelo mental de znodes, watches e quorum continua sendo a forma mais didática de entender o problema de coordenação distribuída em uma entrevista.

## Lembre

- Escritas só são confirmadas por uma **maioria** do ensemble.
- **5 servidores** toleram 2 falhas; **4** toleram só 1.
- Use ZooKeeper para **coordenação**, não como banco de dados.
