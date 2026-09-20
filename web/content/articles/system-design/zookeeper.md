---
slug: zookeeper
categorySlug: system-design
title: "Deep Dive: ZooKeeper"
navTitle: ZooKeeper
summary: Explicar znodes, znodes efêmeros e sequenciais, e watches com um exemplo construído passo a passo
level: intermediario
order: 46
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Explicar znodes, znodes efêmeros e sequenciais, e watches com um exemplo construído passo a passo
- [ ] Descrever um algoritmo de eleição de líder usando essas primitivas
- [ ] Entender por que um quorum (maioria) é necessário para consenso confiável
- [ ] Saber quando ZooKeeper é a peça certa, e quando é over-engineering

## Cenário de referência para esta aula

Vamos usar um cluster de processamento de dados com 5 máquinas trabalhadoras idênticas, onde exatamente uma delas precisa atuar como coordenadora (decidindo qual worker processa qual lote de trabalho) a qualquer momento — e o sistema precisa se recuperar automaticamente se essa coordenadora cair.

## Fundamentos: znodes, o namespace hierárquico

ZooKeeper organiza seus dados como um sistema de arquivos: um namespace hierárquico de nós chamados **znodes**, cada um identificado por um caminho (ex: `/coordenador`, `/workers/worker-1`), e cada um podendo guardar um pequeno pedaço de dado (tipicamente poucos KB, não um armazenamento de propósito geral).

Znodes vêm em variações que mudam completamente seu comportamento:

- **Persistente**: existe até ser explicitamente removido.
- **Efêmero**: existe apenas enquanto a sessão do cliente que o criou estiver ativa — se esse cliente desconectar (incluindo por uma falha, não só um encerramento normal), o znode é automaticamente removido pelo ZooKeeper.
- **Sequencial**: ao criar o znode, o ZooKeeper anexa automaticamente um número sequencial e crescente ao nome (ex: `worker-0000000001`, `worker-0000000002`), garantindo uma ordem total mesmo entre criações concorrentes.

Essas duas últimas variações, combinadas, são a base de praticamente todo padrão de coordenação construído sobre ZooKeeper.

### Watches: notificação sem polling

Um cliente pode registrar um **watch** sobre um znode específico, sendo notificado de forma assíncrona quando esse znode muda (é modificado ou removido) — sem precisar ficar perguntando repetidamente "isso já mudou?" (polling). Isso é o mecanismo de notificação em tempo real usado pelos padrões de coordenação a seguir.

## Construindo eleição de líder com essas peças

Vamos construir o algoritmo passo a passo, aplicado ao nosso cluster de 5 workers.

**Passo 1**: cada worker, ao iniciar, cria um znode efêmero e sequencial sob `/eleicao/` — por exemplo, o worker A cria `/eleicao/n_0000000001`, o worker B cria `/eleicao/n_0000000002`, e assim por diante conforme cada um sobe.

**Passo 2**: cada worker lista os znodes existentes sob `/eleicao/` e verifica: "meu número sequencial é o menor de todos?" Se sim, esse worker é a líder. Se não, ele não é.

**Passo 3 — o detalhe que evita um problema sério de escala**: um worker que não é líder não deveria colocar um watch diretamente no znode da líder (`n_0000000001`). Se fizesse isso, quando a líder caísse, **todos** os 4 workers restantes seriam notificados ao mesmo tempo, e todos tentariam simultaneamente verificar e reagir — um efeito conhecido como "thundering herd" (manada trovejante), desperdiçando trabalho e coordenação. Em vez disso, cada worker coloca um watch apenas no znode **imediatamente anterior ao seu** na sequência: o worker com `n_0000000003` observa apenas `n_0000000002`, não `n_0000000001`.

![Eleição de líder com znodes efêmeros sequenciais e watches em cadeia](/diagrams/zookeeper-eleicao-lider.svg)

**Passo 4**: se a líder (`n_0000000001`) cair, sua sessão expira, e o ZooKeeper remove automaticamente seu znode efêmero. Isso dispara o watch do worker que o observava (`n_0000000002`), que então verifica novamente "sou eu o menor agora?" — e, sendo o caso, se torna a nova líder. A falha se propaga em cadeia, um passo de cada vez, não como uma notificação em massa.

## Por que um único nó ZooKeeper não seria confiável: quorum

O próprio ZooKeeper, para ser confiável, roda como um cluster de múltiplos servidores (um "ensemble", tipicamente com um número ímpar de nós — 3 ou 5 é comum). Escritas só são confirmadas depois de aceitas por uma **maioria** (quorum) desses servidores, não apenas um. Isso garante que, mesmo se uma minoria de servidores falhar ou ficar isolada por uma partição de rede, o restante (a maioria) continua operando com uma visão consistente dos dados — e a minoria isolada não pode, sozinha, aceitar escritas conflitantes, evitando o cenário de split-brain em que duas máquinas isoladas uma da outra decidem, cada uma, que são a líder.

**Por que um número ímpar de servidores**: com 5 servidores, o cluster tolera a falha de até 2 (a maioria restante, 3, ainda forma quorum). Com 4 servidores, ainda só tolera a falha de 1 (precisa de 3 de 4 para maioria) — pagando o custo de mais um servidor sem ganhar tolerância a falha adicional. Por isso, ensembles ZooKeeper quase sempre usam contagens ímpares.

## Quando ZooKeeper é a escolha certa (e quando não é)

ZooKeeper faz sentido quando o problema central é genuinamente **coordenação**: eleição de líder, configuração compartilhada com necessidade de notificação de mudança, ou locks distribuídos onde a garantia de correção precisa ser mais forte do que a de um lock baseado em Redis (visto na aula anterior). Não é a ferramenta certa para armazenar o volume de dados de uma aplicação (não foi desenhado para isso, e znodes são intencionalmente pequenos) — um erro comum de candidatos é propor ZooKeeper como se fosse um banco de dados de propósito geral.

Vale mencionar também: em sistemas mais modernos, alternativas como etcd ou Raft embutido diretamente na aplicação (usado, por exemplo, em versões mais recentes do próprio Kafka, que historicamente dependia de ZooKeeper) vêm substituindo o ZooKeeper em novos projetos — mas o modelo mental de znodes, watches e quorum continua sendo a forma mais didática de entender o problema de coordenação distribuída em uma entrevista.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "ZooKeeper serve para eleição de líder e coordenação" em termos gerais |
| Sênior | Explica znodes efêmeros/sequenciais e watches concretamente, descreve o algoritmo de eleição passo a passo |
| Staff+ | Além do acima, evita o problema de thundering herd com watches em cadeia, e justifica a contagem ímpar de servidores do ensemble com o raciocínio de quorum |

## Na prática

### Subindo no Docker

Para experimentar znodes e watches localmente, um único container já é suficiente (um ensemble de verdade, com quorum, é discutido mais abaixo):

```yaml
# docker-compose.yml
services:
  zookeeper:
    image: zookeeper:3.9
    ports:
      - "2181:2181"
    environment:
      ZOO_MY_ID: 1
      ZOO_STANDALONE_ENABLED: "true"
    volumes:
      - zk-data:/data
      - zk-datalog:/datalog

volumes:
  zk-data:
  zk-datalog:
```

```bash
docker compose up -d
docker exec -it <container> zkCli.sh -server localhost:2181
```

### Cliente Java: operação central de escrita/leitura

Usando o Apache Curator (o wrapper idiomático sobre o cliente cru do ZooKeeper, que trata reconexão e retry por você), aplicado ao nosso cluster de 5 workers: um worker cria seu znode efêmero e sequencial sob `/eleicao/`, lê o dado de um znode e registra um watch no znode imediatamente anterior.

```java
CuratorFramework client = CuratorFrameworkFactory.newClient(
        "localhost:2181",
        new ExponentialBackoffRetry(1000, 3));
client.start();

// Passo 1: worker cria seu znode efêmero e sequencial
String path = client.create()
        .creatingParentsIfNeeded()
        .withMode(CreateMode.EPHEMERAL_SEQUENTIAL)
        .forPath("/eleicao/n_", "worker-A".getBytes());
// ex: path = "/eleicao/n_0000000003"

// Ler o dado de um znode específico
byte[] data = client.getData().forPath("/eleicao/n_0000000001");
System.out.println("Coordenador atual: " + new String(data));

// Passo 3: registrar um watch no znode imediatamente anterior, não no líder
String znodeAnterior = "/eleicao/n_0000000002";
Stat stat = client.checkExists()
        .usingWatcher((Watcher) event -> {
            if (event.getType() == Watcher.Event.EventType.NodeDeleted) {
                System.out.println("Znode anterior removido, reavaliar liderança");
            }
        })
        .forPath(znodeAnterior);
```

Com a API pura do ZooKeeper, o equivalente ao `checkExists` com watcher é `zk.exists(path, watcher)`, que retorna `null` se o znode não existir ou um `Stat` (contendo a versão, timestamps etc.) se existir.

### Operação avançada específica da tecnologia: eleição de líder e reconfiguração de quorum

O algoritmo de eleição de líder (detalhado antes) depende inteiramente de znodes efêmeros sequenciais: cada candidato cria um znode sob um caminho de eleição comum, o ZooKeeper garante a ordenação sequencial mesmo sob criação concorrente, e "menor número = líder" é uma verificação local barata, sem coordenação adicional. A cadeia de watches (cada worker observando apenas o znode imediatamente anterior) é o que evita thundering herd quando a liderança muda.

Operacionalmente, adicionar ou remover um membro do ensemble ZooKeeper (por exemplo, subir um 4º servidor num ensemble de 3, ou substituir um servidor com disco corrompido) exige reconfiguração de quorum: a partir da versão 3.5+, isso pode ser feito de forma dinâmica com `reconfig`, sem derrubar o cluster inteiro:

```bash
# no zkCli.sh conectado a um servidor do ensemble atual
reconfig -add server.4=10.0.0.4:2888:3888:participant;2181
```

Durante essa transição, o ZooKeeper mantém a antiga configuração de quorum válida até que a nova esteja replicada de forma segura para uma maioria — evitando uma janela em que dois quoruns diferentes e incompatíveis existam simultaneamente (o que reabriria a porta para split-brain).

### Evolução/schema/migração: versionamento de dados de znode

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

### Principais usos

- Gerenciamento de configuração distribuída, com notificação automática via watch quando um valor muda.
- Eleição de líder para serviços de alta disponibilidade (bancos de dados distribuídos, schedulers, coordenadores de processamento).
- Locks distribuídos e barreiras de sincronização entre processos em máquinas diferentes.
- Descoberta de serviço e registro (historicamente popular, hoje em parte substituído por etcd/Consul em novos projetos).
- Coordenação de brokers em versões mais antigas do Kafka, e componentes do ecossistema Hadoop/HBase.

## Erros comuns

- Propor ZooKeeper como um banco de dados de propósito geral para armazenar dados de aplicação.
- Fazer todo worker observar diretamente o znode da líder, introduzindo o problema de thundering herd na eleição.
- Não explicar por que uma maioria (quorum), e não qualquer resposta, é necessária para confirmar uma escrita com segurança.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se a rede particionar o ensemble ZooKeeper em dois grupos de tamanho igual?" (nenhum dos dois lados forma maioria sozinho — o cluster para de aceitar escritas até a partição ser resolvida, priorizando consistência sobre disponibilidade nesse cenário).
- "Por que znodes efêmeros são a peça certa para detectar falha de um worker, em vez de um heartbeat manual?" (a remoção é automática e vinculada à sessão do próprio ZooKeeper, sem exigir que a aplicação implemente sua própria lógica de detecção de timeout).
