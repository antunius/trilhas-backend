---
slug: kafka
categorySlug: system-design
title: "Deep Dive: Kafka"
navTitle: Kafka
summary: "Definir com precisão cada peça do vocabulário do Kafka: producer, broker, topic, partition, consumer, consumer group, offset"
level: intermediario
order: 44
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Definir com precisão cada peça do vocabulário do Kafka: producer, broker, topic, partition, consumer, consumer group, offset
- [ ] Entender o modelo de partições, réplicas e consumer groups em profundidade suficiente para sustentar um deep dive de 10+ minutos
- [ ] Raciocinar sobre ordenação, at-least-once vs. exactly-once, e hot partitions com exemplos numéricos concretos
- [ ] Saber o que um candidato pleno entrega nesse deep dive, e o que separa isso de uma resposta de nível sênior

## Cenário de referência para esta aula

Para tornar os conceitos concretos, vamos usar o mesmo cenário ao longo de toda a aula: um sistema de rastreamento de entregas (estilo "onde está meu pedido"), onde cada atualização de posição de um entregador gera um evento, e múltiplos serviços downstream (o app do cliente, o painel de suporte, e um serviço de analytics) precisam consumir esses eventos de forma independente.

## Fundamentos: o vocabulário básico, peça por peça

Antes de qualquer trade-off, vale fixar o que cada termo significa. Kafka tem seu próprio vocabulário, e confundir esses termos é o erro mais comum de quem estuda isso pela primeira vez.

### O que é o Kafka, em uma frase

Kafka é um sistema de mensageria distribuído que funciona como um **log de eventos**: produtores escrevem eventos nesse log, e consumidores leem esses eventos — mas, diferente de uma fila tradicional, o evento não desaparece depois de lido, e múltiplos leitores independentes podem ler o mesmo log do seu próprio ponto de partida.

### Broker

Um broker é uma única máquina (ou processo) do cluster Kafka. Um cluster Kafka em produção normalmente tem vários brokers trabalhando juntos — cada broker armazena uma parte dos dados do cluster e atende requisições de leitura e escrita para essa parte. Pense no broker como "um servidor do cluster Kafka", análogo a um nó em qualquer sistema distribuído.

### Topic (tópico)

Um tópico é o nome lógico de um "canal" de eventos — no nosso cenário, teríamos um tópico chamado `atualizacoes-entrega`. Produtores escrevem eventos nomeando o tópico de destino; consumidores se inscrevem em um tópico para receber seus eventos. É a unidade organizacional mais alta do Kafka — o equivalente a "o nome da fila", em uma analogia com sistemas de fila mais simples.

### Partition (partição)

Um tópico não é armazenado como um bloco único — ele é dividido em **partições**, e cada partição é fisicamente um arquivo de log sequencial (eventos são apenas anexados ao final, nunca reescritos no meio). Se o tópico `atualizacoes-entrega` tem 8 partições, isso significa que existem 8 logs sequenciais independentes, cada um podendo estar em um broker diferente do cluster.

**Por que dividir em partições?** Duas razões centrais: (1) permite paralelismo — diferentes partições podem ser processadas por consumidores diferentes ao mesmo tempo — e (2) permite que o tópico seja maior do que uma única máquina conseguiria armazenar ou servir sozinha, já que partições diferentes vivem em brokers diferentes.

### Producer (produtor)

O producer é qualquer serviço que escreve eventos no Kafka. No nosso cenário, o aplicativo do entregador (que envia sua localização a cada poucos segundos) atua como producer, publicando cada atualização de posição no tópico `atualizacoes-entrega`. O producer decide, para cada evento, em qual partição ele deve cair — normalmente através de uma **chave de particionamento** (partition key), que veremos em detalhe a seguir.

### Consumer (consumidor)

O consumer é qualquer serviço que lê eventos de um tópico. No nosso cenário, temos três consumers completamente independentes: o serviço que atualiza o mapa no app do cliente, o painel usado pela equipe de suporte, e o pipeline de analytics. Cada um lê o mesmo tópico, mas para propósitos diferentes.

### Consumer Group

Aqui está um dos pontos que mais confunde quem está aprendendo Kafka pela primeira vez. Um **consumer group** é um conjunto de consumers que, juntos, dividem entre si o trabalho de ler as partições de um tópico — como se fossem "um único leitor lógico", dividido internamente em várias instâncias para paralelismo.

Cada consumer group mantém seu **próprio progresso de leitura**, independente de qualquer outro grupo. Isso é o que permite que o app do cliente, o painel de suporte, e o analytics leiam o mesmo tópico de forma totalmente independente uns dos outros — cada um é o seu próprio consumer group, com seu próprio ponteiro de leitura.

Dentro de um único consumer group, porém, cada partição é lida por **exatamente um** consumer daquele grupo por vez — duas instâncias do mesmo grupo nunca leem a mesma partição simultaneamente. Isso é o mecanismo de paralelismo horizontal: se o consumer group do app do cliente tem 4 instâncias rodando e o tópico tem 8 partições, cada instância fica responsável, em média, por 2 partições.

### Offset

O offset é simplesmente um número sequencial — a posição de um evento específico dentro de uma partição (0, 1, 2, 3...). Cada consumer, dentro de cada partição, mantém registrado até qual offset ele já processou. Isso é o "marcador de página" do consumer: se ele cai e volta, retoma a partir do último offset confirmado (commitado), não do início.

### Réplicas

Cada partição pode ter múltiplas cópias (réplicas) espalhadas por brokers diferentes, para tolerância a falhas — se o broker que hospeda a réplica principal (líder) de uma partição cair, uma das réplicas assume automaticamente, sem perda de dados já confirmados (desde que a replicação tenha sido configurada corretamente).

### Anatomia de uma mensagem

Cada evento publicado no Kafka carrega, tipicamente, quatro componentes: uma **chave** (key — usada para decidir a partição, como o ID do entregador no nosso cenário), um **valor** (value — o conteúdo real do evento, ex: latitude/longitude e horário), um **timestamp** (quando o evento foi gerado ou recebido), e **headers** opcionais (metadados adicionais, como um ID de rastreamento para depuração, separados do conteúdo principal). Entender essa anatomia importa na prática: candidatos que só falam em "a mensagem" sem saber que a chave é um campo separado do valor tendem a ter dificuldade para explicar como o particionamento realmente funciona por baixo.

### Juntando as peças: o caminho de um evento

1. O app de um entregador (**producer**) gera um evento de atualização de posição.
2. O producer calcula, a partir de uma chave de particionamento (ex: ID do entregador), qual **partition** do **topic** `atualizacoes-entrega` deve receber esse evento.
3. O evento é anexado ao final do log daquela partição, em um **broker** específico, recebendo um **offset** sequencial.
4. Cada **consumer group** interessado (app do cliente, suporte, analytics) tem suas instâncias lendo as partições que lhe foram atribuídas, avançando seu próprio offset conforme processa.

![Arquitetura: um producer, um tópico com 4 partições, dois consumer groups independentes](/diagrams/kafka-arquitetura.svg)

*A imagem acima mostra a peça que mais confunde iniciantes: o consumer group "app-cliente" e o consumer group "analytics" leem o **mesmo** tópico, mas cada um mantém seu próprio progresso de leitura — um não sabe nem se importa com o offset do outro.*

Com esse vocabulário fixado, agora dá para discutir os trade-offs reais que aparecem em entrevista.

## Por que uma fila simples não bastaria aqui

Um candidato apressado poderia propor uma fila comum (tipo SQS) e seguir em frente. O problema: com uma fila tradicional, uma mensagem consumida geralmente desaparece da fila — se três serviços diferentes precisam ler o mesmo evento, ou você duplica a mensagem em três filas (frágil, e um evento novo exige lembrar de atualizar três lugares), ou você aceita que só um serviço a lê. Kafka resolve isso nativamente, como acabamos de ver: múltiplos consumer groups independentes leem o mesmo tópico do começo ao fim, cada um com seu próprio offset. Esse é, sozinho, o motivo mais comum para Kafka aparecer em vez de uma fila mais simples — vale dizer isso explicitamente na entrevista, em vez de simplesmente anunciar "vou usar Kafka".

## Números concretos para ancorar a intuição de escala

Uma única partição, em hardware comum, sustenta tipicamente algo entre dezenas e algumas centenas de milhares de mensagens por segundo para mensagens pequenas (a ordem de grandeza real depende do tamanho da mensagem e do disco usado — o ponto central é que existe um teto por partição, já que ela é processada sequencialmente).

Se o sistema de rastreamento tem 500 mil entregadores ativos enviando uma atualização a cada 5 segundos, isso equivale a 100 mil eventos/segundo no total — perto o suficiente do teto de uma única partição para justificar, por si só, a necessidade de múltiplas partições distribuindo essa carga.

## Ordenação: a garantia que existe, e a que não existe

Kafka garante ordem de escrita e leitura **dentro de uma partição**, nunca entre partições diferentes do mesmo tópico. Isso tem uma consequência de design real: se dois eventos do mesmo entregador (ex: "saiu para entrega" e "chegou ao destino") caíssem em partições diferentes, um consumer poderia processar "chegou" antes de "saiu" — corrompendo a lógica de negócio.

**A solução padrão**: usar uma chave de particionamento derivada da entidade cujo ordenamento importa — aqui, o ID do entregador. O Kafka aplica uma função de hash sobre essa chave para decidir a partição, e a mesma chave sempre mapeia para a mesma partição. Isso garante ordem *por entregador*, que é a granularidade que realmente importa — não precisamos de ordem global entre entregadores diferentes.

![Como a chave decide a partição: hash(chave) % número de partições](/diagrams/kafka-particionamento.svg)

*Note que "entregador_101" aparece duas vezes à esquerda (dois eventos diferentes) e as duas vezes cai na Partition 1 — é isso que preserva a ordem relativa entre eventos do mesmo entregador, mesmo com múltiplas partições no tópico.*

**Uma armadilha operacional que candidatos experientes mencionam**: se, no futuro, for necessário aumentar o número de partições do tópico, o hash de uma mesma chave pode passar a apontar para uma partição diferente da anterior — quebrando a garantia de ordem para eventos que estavam "em trânsito" no momento da mudança. Mencionar esse detalhe demonstra profundidade real, não apenas memorização do conceito de particionamento.

## Commit de offset: at-least-once vs. exactly-once

A pergunta que separa candidatos nesse ponto é: **quando** o offset é confirmado (commitado) pelo consumer?

- **Commit antes de processar**: rápido, mas se o consumer cair no meio do processamento, essa mensagem é perdida para sempre — nunca será reprocessada. Isso é *at-most-once*.
- **Commit depois de processar com sucesso**: se o consumer cair depois de processar mas antes de commitar, a mesma mensagem será entregue de novo na reinicialização. Isso é *at-least-once* — o padrão mais comum, desde que o processamento seja **idempotente** (processar a mesma atualização de posição duas vezes não deveria ter efeito colateral duplicado, como enviar duas notificações push).
- ***Exactly-once***: obtido via transações (producer e commit de offset na mesma transação atômica), mas com custo real de throughput e complexidade operacional — a maioria dos sistemas prefere at-least-once + idempotência no consumer, mais simples e "suficientemente correto".

**No nosso cenário**: se o app do cliente processar a mesma atualização de posição duas vezes, o pior caso é mostrar a mesma localização duas vezes — inofensivo. Isso é um argumento concreto para escolher at-least-once em vez de pagar o custo de exactly-once.

## Rebalanceamento: o que acontece quando um consumer cai

Se um consumer de um grupo falha, o Kafka detecta isso (via heartbeat) e redistribui as partições que ele possuía entre os consumers restantes daquele grupo — o rebalanceamento. Durante esse processo, o grupo inteiro geralmente pausa o consumo por um breve período (segundos, dependendo da configuração) — um detalhe real que vale mencionar ao discutir latência ponta a ponta do sistema.

## Hot partitions: quando a chave de particionamento vira um problema

Se a distribuição de eventos entre chaves não é uniforme, algumas partições recebem desproporcionalmente mais tráfego que outras — uma "hot partition". Imagine que, por algum motivo, um único entregador (um "super-entregador" de teste, por exemplo) gerasse volume anormalmente alto: a partição responsável por ele ficaria sobrecarregada enquanto as demais ficam ociosas — o paralelismo teórico de N partições não se traduz em N vezes mais capacidade real.

**Como reconhecer esse risco na entrevista**: ao propor uma chave de particionamento, vale perguntar em voz alta "essa chave tende a ter distribuição razoavelmente uniforme, ou existe uma entidade que domina desproporcionalmente o volume?".

## Tratamento de erros e retries

Quando o processamento de um evento falha dentro de um consumer (ex: o serviço de analytics não conseguiu gravar no banco por uma instabilidade momentânea), existem algumas estratégias comuns, cada uma com um trade-off diferente:

- **Retry imediato in-line**: o consumer tenta processar de novo, algumas vezes, antes de desistir — simples, mas se a falha for persistente (não momentânea), isso trava o processamento daquela partição inteira enquanto insiste no mesmo evento.
- **Fila de retry separada**: o evento problemático é publicado em um tópico separado de "retry", com um atraso antes de ser reprocessado, permitindo que o consumer principal siga adiante para os próximos eventos sem ficar bloqueado.
- **Dead-letter queue (DLQ)**: depois de um número máximo de tentativas falhas, o evento é movido para um tópico de "mensagens mortas", onde fica disponível para inspeção manual (ou automatizada) posterior, sem bloquear o pipeline principal indefinidamente nem descartar silenciosamente o evento problemático.

**No nosso cenário**: se uma atualização de posição específica falha ao ser processada pelo serviço de analytics (não crítico em tempo real), ela pode ir para uma fila de retry com atraso — mas se a mesma falha afetasse o app do cliente (onde a posição em tempo real é o produto principal), um DLQ com alerta imediato para a equipe de operação seria mais apropriado, já que um atraso longo ali prejudica diretamente a experiência do usuário.

## Retenção e replay: a diferença estrutural de uma fila tradicional

Diferente de uma fila tradicional (onde uma mensagem consumida some), o Kafka retém eventos por um período configurável (dias, ou indefinidamente), independente de terem sido consumidos ou não. Um novo serviço — digamos, um serviço de detecção de atraso criado meses depois do lançamento — pode consumir o tópico `atualizacoes-entrega` desde o início, reprocessando dias de histórico, sem afetar os consumers já existentes.

## Na prática

### Subindo o Kafka no Docker

A forma mais simples hoje em dia é usar o modo KRaft, que elimina a dependência do ZooKeeper (tratado à parte no seu próprio deep dive):

```yaml
# docker-compose.yml
services:
  kafka:
    image: apache/kafka:3.7.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    volumes:
      - kafka-data:/var/lib/kafka/data
volumes:
  kafka-data:
```

```bash
docker compose up -d
# criar o tópico do cenário, com 8 partições e replicação 1 (single-node local)
docker exec -it <container> /opt/kafka/bin/kafka-topics.sh \
  --create --topic atualizacoes-entrega --partitions 8 --replication-factor 1 \
  --bootstrap-server localhost:9092

# listar tópicos e inspecionar detalhes de partições/réplicas
docker exec -it <container> /opt/kafka/bin/kafka-topics.sh \
  --describe --topic atualizacoes-entrega --bootstrap-server localhost:9092
```

### Producer e Consumer em Java

Um producer publicando atualizações de posição, usando o ID do entregador como chave de particionamento (para preservar ordem por entregador, como discutido na seção de ordenação):

```java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
props.put(ProducerConfig.ACKS_CONFIG, "all"); // espera confirmação de todas as réplicas in-sync

try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
    String entregadorId = "entregador_101";
    String payload = "{\"lat\":-23.55,\"lon\":-46.63,\"ts\":%d}".formatted(System.currentTimeMillis());

    ProducerRecord<String, String> record =
        new ProducerRecord<>("atualizacoes-entrega", entregadorId, payload);

    producer.send(record, (metadata, exception) -> {
        if (exception != null) {
            log.error("Falha ao publicar posição do entregador {}", entregadorId, exception);
        } else {
            log.debug("Publicado na partition {} offset {}", metadata.partition(), metadata.offset());
        }
    });
}
```

Um consumer lendo esse tópico, com commit manual do offset **depois** de processar com sucesso (at-least-once, como discutido na seção de commit de offset):

```java
Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "app-cliente");
props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false); // commit manual, não automático
props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG,
    CooperativeStickyAssignor.class.getName());

try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
    consumer.subscribe(List.of("atualizacoes-entrega"));

    while (true) {
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));
        for (ConsumerRecord<String, String> record : records) {
            atualizarMapaCliente(record.key(), record.value()); // processamento idempotente
        }
        if (!records.isEmpty()) {
            consumer.commitSync(); // só commita depois que todo o processamento acima teve sucesso
        }
    }
}
```

### Rebalance de partição na prática

Quando uma instância do consumer group cai (ou uma nova entra), o Kafka dispara um rebalance: as partições são redistribuídas entre as instâncias restantes. Isso pode ser observado e controlado com um `ConsumerRebalanceListener`:

```java
consumer.subscribe(List.of("atualizacoes-entrega"), new ConsumerRebalanceListener() {
    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        // chamado ANTES de tirar as partições desta instância — último ponto seguro
        // para commitar o progresso e evitar reprocessar/perder eventos
        consumer.commitSync(currentOffsets);
    }

    @Override
    public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
        log.info("Partições atribuídas após rebalance: {}", partitions);
    }
});
```

Duas configurações que mudam o comportamento do rebalance na prática:

- **Assignor** — o `RangeAssignor` (padrão histórico) e o `RoundRobinAssignor` fazem um "stop-the-world": todas as partições são revogadas de todos os consumers e redistribuídas do zero a cada rebalance. O `CooperativeStickyAssignor` (recomendado hoje) faz rebalance incremental: só as partições que realmente precisam mudar de dono são revogadas, o resto do grupo continua consumindo sem pausa.
- **Detecção de falha** — `session.timeout.ms` (tempo sem heartbeat até considerar o consumer morto) e `max.poll.interval.ms` (tempo máximo entre chamadas de `poll()` antes de expulsar o consumer do grupo, útil quando o processamento de um batch demora mais que o esperado) controlam quão rápido um rebalance é disparado e quão sensível ele é a picos de latência de processamento.

### Schema Registry e evolução de schema

Em produção, o payload do evento normalmente não é uma string JSON solta (como no exemplo acima) — é um schema Avro (ou Protobuf) registrado no **Schema Registry**, que valida compatibilidade antes de aceitar uma nova versão:

```json
// schema v1 registrado para o tópico atualizacoes-entrega
{
  "type": "record",
  "name": "AtualizacaoPosicao",
  "fields": [
    { "name": "entregadorId", "type": "string" },
    { "name": "lat", "type": "double" },
    { "name": "lon", "type": "double" },
    { "name": "timestamp", "type": "long" }
  ]
}
```

Meses depois, o time decide adicionar um campo de precisão do GPS. Para não quebrar os consumers antigos (app do cliente, suporte, analytics) que ainda esperam o schema v1:

```json
// schema v2 — campo novo é OPCIONAL, com valor default
{
  "type": "record",
  "name": "AtualizacaoPosicao",
  "fields": [
    { "name": "entregadorId", "type": "string" },
    { "name": "lat", "type": "double" },
    { "name": "lon", "type": "double" },
    { "name": "timestamp", "type": "long" },
    { "name": "precisaoMetros", "type": ["null", "double"], "default": null }
  ]
}
```

O Schema Registry é configurado com compatibilidade `BACKWARD` (o padrão mais comum): um consumer usando o schema **novo** consegue ler eventos escritos com o schema **antigo** (porque o campo novo tem default). Isso permite fazer deploy do producer com o schema v2 antes de todos os consumers terem sido atualizados — a ordem segura que não quebra nada é: registrar o novo schema, validar compatibilidade automaticamente, então fazer deploy do producer, e por último atualizar os consumers no seu próprio ritmo. Tentar adicionar um campo **obrigatório** sem default, ou remover um campo existente, quebraria `BACKWARD` compatibility e o Schema Registry rejeitaria o registro antes mesmo de chegar em produção.

### Principais usos do Kafka no mercado

- **Pipeline de eventos entre microsserviços** (o cenário deste artigo): desacoplar quem gera um evento de negócio de quem reage a ele, com múltiplos consumers independentes.
- **Ingestão de dados para analytics/data lake**: Kafka como a "espinha dorsal" que alimenta Spark/Flink e data warehouses (via Kafka Connect + sinks para S3/BigQuery/Snowflake).
- **Change Data Capture (CDC)**: capturar mudanças de um banco relacional (via Debezium) e publicá-las como eventos, para sincronizar caches, índices de busca ou outros bancos sem acoplar os sistemas.
- **Log de auditoria imutável**: retenção longa de eventos financeiros ou de compliance, aproveitando o fato de que o Kafka não apaga eventos já consumidos.
- **Comunicação entre serviços em arquitetura orientada a eventos (EDA)**: substituindo chamadas síncronas request/response por publicação de eventos de domínio (ex: `PedidoCriado`, `PagamentoAprovado`).

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Define corretamente producer, partition, consumer e consumer group; sabe que Kafka serve para "filas de mensagens em escala" |
| Sênior | Articula o trade-off entre at-least-once e exactly-once com custo real, escolhe uma chave de particionamento com justificativa explícita sobre uniformidade, antecipa rebalanceamento como fator de latência |
| Staff+ | Além do acima, discute cenários de falha em cascata (o que acontece se o consumer de analytics ficar 6 horas fora do ar) e propõe consumer lag por partição como métrica de observabilidade central |

## Erros comuns

- Confundir "tópico" com "partição" — tratando-os como sinônimos.
- Achar que um consumer group compartilha offset com outro consumer group do mesmo tópico (na verdade, cada grupo tem seu próprio progresso, independente).
- Assumir ordenação global entre partições.
- Propor exactly-once por padrão, sem avaliar se o custo realmente se justifica.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se o número de consumers em um grupo for maior que o número de partições?" (os consumers excedentes ficam ociosos — o paralelismo é limitado pelo número de partições).
- "Como você decidiria o número de partições ao criar o tópico?" (throughput-alvo dividido pelo throughput por partição, com margem para crescimento, já que aumentar partições depois quebra a garantia de ordem por chave já existente).
- "Como você detectaria, em produção, que uma partição específica está sobrecarregada?" (monitorar consumer lag por partição individualmente).
