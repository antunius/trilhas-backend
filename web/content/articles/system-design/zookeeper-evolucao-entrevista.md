---
slug: zookeeper-evolucao-entrevista
categorySlug: system-design
title: "ZooKeeper: versionamento de dados e entrevista"
navTitle: Evolução e entrevista
summary: "Versionar os dados dos znodes com segurança e saber como responder em entrevista"
level: intermediario
order: 97
section: deep-dives-tecnologias
group: "ZooKeeper"
---

## Objetivos de aprendizagem

- [ ] Versionar dados de znode com compare-and-set
- [ ] Responder com o nível de profundidade de um sênior

*Retomando o cenário da unidade: um cluster de 5 workers idênticos, em que exatamente um precisa atuar como coordenador a qualquer momento, com recuperação automática.*

## Evolução/schema/migração: versionamento de dados de znode

Cada znode carrega um `Stat` com um campo `version`, incrementado a cada `setData` bem-sucedido. Isso permite compare-and-swap otimista: um cliente lê o dado junto com sua versão, e só grava de volta se a versão não mudou entre a leitura e a escrita — evitando perder a atualização de outro cliente concorrente.

```java
Stat stat = new Stat();
byte[] dadoAtual = client.getData().storingStatIn(stat).forPath("/config/limite-workers");
int versaoLida = stat.getVersion();

byte[] novoDado = "10".getBytes();
try {
    client.setData()
          .withVersion(versaoLida)
          .forPath("/config/limite-workers", novoDado);
} catch (KeeperException.BadVersionException e) {
    // outro cliente escreveu entre a leitura e a tentativa de escrita — recarregar e tentar de novo
}
```

Esse mesmo padrão (ler versão, escrever condicionalmente, tratar conflito com retry) é a base de como locks distribuídos e atualizações de configuração compartilhada evitam corrupção sob concorrência, sem precisar de um lock explícito adicional.

## Principais usos

- Gerenciamento de configuração distribuída, com notificação automática via watch quando um valor muda.
- Eleição de líder para serviços de alta disponibilidade (bancos de dados distribuídos, schedulers, coordenadores de processamento).
- Locks distribuídos e barreiras de sincronização entre processos em máquinas diferentes.
- Descoberta de serviço e registro (historicamente popular, hoje em parte substituído por etcd/Consul em novos projetos).
- Coordenação de brokers em versões mais antigas do Kafka, e componentes do ecossistema Hadoop/HBase.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "ZooKeeper serve para eleição de líder e coordenação" em termos gerais |
| Sênior | Explica znodes efêmeros/sequenciais e watches concretamente, descreve o algoritmo de eleição passo a passo |
| Staff+ | Além do acima, evita o problema de thundering herd com watches em cadeia, e justifica a contagem ímpar de servidores do ensemble com o raciocínio de quorum |

## Erros comuns

- Propor ZooKeeper como um banco de dados de propósito geral para armazenar dados de aplicação.
- Fazer todo worker observar diretamente o znode da líder, introduzindo o problema de thundering herd na eleição.
- Não explicar por que uma maioria (quorum), e não qualquer resposta, é necessária para confirmar uma escrita com segurança.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se a rede particionar o ensemble ZooKeeper em dois grupos de tamanho igual?" (nenhum dos dois lados forma maioria sozinho — o cluster para de aceitar escritas até a partição ser resolvida, priorizando consistência sobre disponibilidade nesse cenário).
- "Por que znodes efêmeros são a peça certa para detectar falha de um worker, em vez de um heartbeat manual?" (a remoção é automática e vinculada à sessão do próprio ZooKeeper, sem exigir que a aplicação implemente sua própria lógica de detecção de timeout).

## Lembre

- Cada znode tem uma **versão**; atualizar com a versão esperada evita sobrescrever.
- Fale de **quorum** e **thundering herd** sem ser perguntado.
- Nem tudo precisa de ZooKeeper: pergunte se uma **solução mais simples** basta.
