---
slug: zookeeper-pratica
categorySlug: system-design
title: "ZooKeeper na prática: Docker, cliente e eleição"
navTitle: Na prática
summary: "Subir o ZooKeeper localmente e implementar a eleição de líder com o cliente Java"
level: intermediario
order: 96
section: deep-dives-tecnologias
group: "ZooKeeper"
---

## Objetivos de aprendizagem

- [ ] Subir o ZooKeeper com Docker
- [ ] Implementar a eleição de líder e a reconfiguração com o cliente Java

*Retomando o cenário da unidade: um cluster de 5 workers idênticos, em que exatamente um precisa atuar como coordenador a qualquer momento, com recuperação automática.*

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

## Lembre

- A eleição usa **znodes efêmeros e sequenciais** e **watches em cadeia**.
- O cliente precisa tratar a **expiração da sessão**.
- Em produção, use um **ensemble** com número ímpar de servidores.
