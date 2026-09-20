---
slug: flink
categorySlug: system-design
title: "Deep Dive: Flink (Processamento de Streams)"
navTitle: Flink
summary: Explicar janelas de tempo (tumbling, sliding, session) com exemplos numéricos concretos
level: intermediario
order: 50
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Explicar janelas de tempo (tumbling, sliding, session) com exemplos numéricos concretos
- [ ] Discutir o problema de eventos fora de ordem e watermarks
- [ ] Entender checkpoints como mecanismo de recuperação de estado após falha

## Cenário de referência para esta aula

Vamos usar um painel de métricas em tempo real para uma plataforma de anúncios, mostrando "cliques por minuto por campanha" para os times de marketing acompanharem o desempenho de uma campanha enquanto ela está no ar.

## Janelas de tempo: os três tipos principais

- **Tumbling window (janela fixa, sem sobreposição)**: intervalos consecutivos e não sobrepostos — ex: 10:00:00-10:01:00, depois 10:01:00-10:02:00. Cada evento pertence a exatamente uma janela. É o tipo natural para "cliques por minuto" no nosso cenário.
- **Sliding window (janela deslizante, com sobreposição)**: uma janela de duração fixa (ex: 5 minutos) que se recalcula a cada intervalo menor (ex: a cada 1 minuto) — útil para uma métrica tipo "média móvel dos últimos 5 minutos", atualizada a cada minuto, em vez de esperar 5 minutos entre cada atualização.
- **Session window**: agrupa eventos por períodos de atividade separados por um intervalo de inatividade (ex: agrupar os cliques de uma mesma sessão de navegação, fechando a janela após 30 minutos sem nenhum clique novo) — o tamanho da janela não é fixo, depende do comportamento real dos eventos.

![Tumbling vs. sliding window ao longo do tempo](/diagrams/flink-janelas.svg)

## Eventos fora de ordem: watermarks

Em um sistema distribuído real, eventos não chegam necessariamente na ordem em que aconteceram — uma instabilidade de rede pode atrasar um clique que "aconteceu" antes de outro que já chegou. Isso levanta uma pergunta prática: quanto tempo o sistema espera antes de considerar uma janela definitivamente "fechada" e emitir seu resultado final?

Um **watermark** é a resposta do Flink a essa pergunta: um marcador que avança ao longo do stream, indicando "não esperamos mais ver eventos com timestamp anterior a X" (com alguma margem de tolerância configurável, ex: 10 segundos). Quando o watermark ultrapassa o fim de uma janela, essa janela é considerada fechada e seu resultado é emitido — eventos que chegarem depois disso, atrasados além da margem tolerada, são tratados como "atrasados demais" (descartados, ou tratados por uma lógica de atualização tardia separada, dependendo da configuração).

**No nosso cenário**: se configurarmos uma margem de tolerância de 10 segundos, um clique com timestamp de 10:00:58 que chega às 10:01:05 (7 segundos de atraso) ainda é incluído corretamente na janela das 10:00; um clique que chega às 10:01:15 (17 segundos de atraso) já ultrapassou a margem e não seria mais incluído — essa margem é, na prática, um trade-off entre latência de resposta (esperar mais = métricas mais tardias, porém mais completas) e completude do resultado.

## Checkpoints: sobrevivendo a uma falha no meio do processamento

Diferente de um consumidor simples e stateless, o Flink mantém estado interno real (a contagem parcial de cada janela em andamento) que precisa sobreviver a falhas — se um worker cair no meio de uma janela, perder essa contagem parcial significaria começar a métrica daquele período do zero, incorretamente.

Flink resolve isso com **checkpoints**: snapshots periódicos (ex: a cada 30 segundos) de todo o estado interno, salvos de forma durável. Se um worker falha, o processamento é retomado a partir do último checkpoint salvo, reprocessando apenas os eventos que chegaram depois dele — não desde o início do stream inteiro, e sem perder o progresso já computado antes do checkpoint.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "Flink processa streams em tempo real" e menciona "janelas de tempo" de forma genérica |
| Sênior | Escolhe o tipo de janela certo (tumbling/sliding/session) com justificativa, e menciona watermarks como solução para eventos fora de ordem |
| Staff+ | Além do acima, discute o trade-off da margem de tolerância do watermark (latência vs. completude), e explica checkpoints como mecanismo de recuperação sem reprocessamento total |

## Na prática

### Subindo no Docker

Um cluster mínimo de Flink tem dois papéis: o **JobManager** (coordena a execução, distribui tarefas, dispara checkpoints) e um ou mais **TaskManagers** (executam de fato as tarefas paralelas). Para rodar localmente e submeter o job de "cliques por minuto por campanha" do nosso cenário:

```yaml
# docker-compose.yml
version: "3.8"
services:
  jobmanager:
    image: flink:1.19
    ports:
      - "8081:8081"   # UI do JobManager
    command: jobmanager
    environment:
      - |
        FLINK_PROPERTIES=
        jobmanager.rpc.address: jobmanager
        state.backend: rocksdb
        state.checkpoints.dir: file:///tmp/flink-checkpoints
        execution.checkpointing.interval: 30s

  taskmanager:
    image: flink:1.19
    depends_on:
      - jobmanager
    command: taskmanager
    deploy:
      replicas: 2
    environment:
      - |
        FLINK_PROPERTIES=
        jobmanager.rpc.address: jobmanager
        taskmanager.numberOfTaskSlots: 2
        state.backend: rocksdb
        state.checkpoints.dir: file:///tmp/flink-checkpoints
```

```bash
docker compose up -d
# UI em http://localhost:8081 mostra o cluster, os slots disponíveis e os jobs em execução
```

Com dois TaskManagers de 2 slots cada, o cluster tem 4 slots de paralelismo disponíveis — é nesses slots que as subtarefas do job (uma por chave/campanha, distribuídas por hash) vão rodar.

### Job Java: operação central de processamento de stream

O núcleo do job é: ler o stream de cliques, agrupar por `campaignId` (`keyBy`), aplicar uma janela tumbling de 1 minuto (a mesma vista nos fundamentos) com watermarks para tolerar atraso de 10 segundos, e emitir a contagem agregada.

```java
public class CliquesPorMinutoJob {

    public static class Clique {
        public String campaignId;
        public long timestampEpochMs;
    }

    public static class ContagemCampanha {
        public String campaignId;
        public long inicioJanela;
        public long total;

        public ContagemCampanha(String campaignId, long inicioJanela, long total) {
            this.campaignId = campaignId;
            this.inicioJanela = inicioJanela;
            this.total = total;
        }
    }

    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // Checkpoints a cada 30s, alinhado com a seção de checkpoints deste artigo
        env.enableCheckpointing(30_000);

        KafkaSource<Clique> source = KafkaSource.<Clique>builder()
                .setBootstrapServers("kafka:9092")
                .setTopics("cliques-anuncios")
                .setGroupId("flink-cliques-por-minuto")
                .setValueOnlyDeserializer(new CliqueJsonDeserializer())
                .setStartingOffsets(OffsetsInitializer.earliest())
                .build();

        WatermarkStrategy<Clique> watermarkStrategy = WatermarkStrategy
                .<Clique>forBoundedOutOfOrderness(Duration.ofSeconds(10))
                .withTimestampAssigner((clique, ts) -> clique.timestampEpochMs);

        DataStream<Clique> cliques = env.fromSource(
                source, watermarkStrategy, "cliques-kafka-source");

        DataStream<ContagemCampanha> contagens = cliques
                .keyBy(clique -> clique.campaignId)
                .window(TumblingEventTimeWindows.of(Time.minutes(1)))
                .aggregate(new AggregateFunction<Clique, Long, Long>() {
                    @Override public Long createAccumulator() { return 0L; }
                    @Override public Long add(Clique c, Long acc) { return acc + 1; }
                    @Override public Long getResult(Long acc) { return acc; }
                    @Override public Long merge(Long a, Long b) { return a + b; }
                }, new ProcessWindowFunction<Long, ContagemCampanha, String, TimeWindow>() {
                    @Override
                    public void process(String campaignId, Context ctx, Iterable<Long> counts,
                                         Collector<ContagemCampanha> out) {
                        out.collect(new ContagemCampanha(
                                campaignId, ctx.window().getStart(), counts.iterator().next()));
                    }
                });

        contagens.sinkTo(
                KafkaSink.<ContagemCampanha>builder()
                        .setBootstrapServers("kafka:9092")
                        .setRecordSerializer(new ContagemCampanhaSerializer("cliques-por-minuto-agregado"))
                        .setDeliveryGuarantee(DeliveryGuarantee.EXACTLY_ONCE)
                        .build());

        env.execute("Cliques por Minuto por Campanha");
    }
}
```

Repare que `keyBy(campaignId)` é o que garante que todos os cliques da mesma campanha vão para a mesma subtarefa — condição necessária para a contagem por janela estar correta, já que cada subtarefa mantém seu próprio estado parcial isolado por chave.

### Operação avançada específica da tecnologia

**Checkpointing e recuperação de falha.** `env.enableCheckpointing(30_000)` faz o JobManager injetar periodicamente marcadores especiais — **checkpoint barriers** — no início do stream, que fluem junto com os dados normais através de cada operador. Quando um operador recebe um barrier em todas as suas entradas, ele tira um snapshot do próprio estado (aqui, as contagens parciais de janelas ainda abertas) e repassa o barrier adiante. Com o **RocksDB state backend** (configurado no `docker-compose.yml` acima), esse estado é mantido em disco local via RocksDB e os snapshots incrementais são enviados de forma assíncrona para armazenamento durável (`state.checkpoints.dir`), o que permite estado muito maior que a memória disponível e checkpoints que não bloqueiam o processamento.

Se um TaskManager cai, o JobManager reinicia as subtarefas afetadas a partir do último checkpoint bem-sucedido e reposiciona os offsets de leitura do Kafka source para o ponto salvo naquele checkpoint. Combinado com `DeliveryGuarantee.EXACTLY_ONCE` no `KafkaSink` (que usa transações do Kafka — os dados só ficam visíveis para consumidores quando o checkpoint correspondente é confirmado), isso dá **exactly-once** ponta a ponta: nenhum clique é contado duas vezes nem perdido, mesmo com falhas no meio do processamento.

**Distribuição de tarefas ao escalar o paralelismo.** O estado por chave (`campaignId`) é internamente particionado em um número fixo de **key groups** (definido por `maxParallelism`), e cada key group é atribuído a exatamente uma subtarefa. Ao aumentar o paralelismo do job (por exemplo, de 4 para 8), o Flink não redistribui chaves individualmente — ele reatribui key groups inteiros entre as subtarefas, restaurando o estado correspondente a partir do último checkpoint/savepoint. Isso é o que torna possível escalar (ou reduzir) o job sem perder estado nem exigir reprocessamento desde o início.

### Evolução/schema/migração

Com o tempo, o formato do estado guardado por operador tende a mudar — por exemplo, adicionar um campo `ultimaCampanhaVista` ao acumulador de um operador stateful, ou trocar o POJO `Clique` por uma versão com um novo campo `dispositivo`. Isso levanta a pergunta: dá para atualizar o código do job e retomar de um **savepoint** tirado com a versão antiga, sem perder o estado acumulado?

O Flink suporta isso via **evolução de schema de estado**, desde que o tipo usado no `ValueState`/POJO siga regras de compatibilidade do serializador (POJO serializer ou Avro): campos podem ser **adicionados** livremente (o valor default é usado ao ler estado antigo que não tinha aquele campo), mas **remover ou renomear** um campo quebra a compatibilidade binária do estado serializado — o Flink não tem como saber que `nomeAntigo` e `nomeNovo` são "o mesmo campo", então o savepoint antigo se torna ilegível para esse tipo.

Regra prática: trate o tipo do estado como um contrato aditivo — só adicione campos, nunca remova ou renomeie sem um plano de migração explícito (ex: manter o campo antigo como deprecated, ler dos dois formatos por um período de transição, e só remover depois que todos os savepoints relevantes já tiverem sido regravados com o novo schema).

### Principais usos

- **Detecção de fraude em tempo real**: identificar padrões suspeitos (ex: múltiplas transações da mesma conta em janelas curtas de tempo) enquanto o evento ainda está "quente", antes da transação ser aprovada.
- **Dashboards de analytics em tempo real**: exatamente o cenário deste artigo — métricas agregadas continuamente (cliques, pedidos, erros) por janela de tempo, sem espera por um batch job noturno.
- **Microsserviços orientados a eventos com processamento stateful**: serviços que mantêm estado por entidade (ex: saldo de carrinho de compras, sessão de usuário) diretamente no operador, evitando ida a um banco externo a cada evento.
- **Processamento de streams de ETL/CDC**: consumir change data capture (CDC) de um banco transacional e transformar/enriquecer os dados continuamente antes de escrever num data warehouse ou lake.
- **Computação de features em tempo real para ML**: calcular features agregadas (ex: "número de compras do usuário na última hora") no momento da inferência, mantendo paridade com como as mesmas features foram calculadas no treino.

## Erros comuns

- Propor um motor de processamento de stream para um cenário simples sem agregação contínua ao longo do tempo, onde um consumidor comum já bastaria.
- Ignorar completamente o problema de eventos fora de ordem, assumindo que tudo chega na ordem exata em que aconteceu.
- Não considerar como o sistema recupera seu estado após uma falha no meio do processamento de uma janela.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece com um clique que chega depois que sua janela já foi fechada e o resultado já foi emitido?" (depende da configuração: pode ser descartado, ou disparar uma atualização tardia do resultado já emitido, dependendo de quão crítica é a exatidão para o caso de uso).
- "Por que não usar uma margem de tolerância enorme para o watermark, garantindo que quase nenhum evento chegue tarde demais?" (aumenta a latência de todas as métricas — o painel em tempo real ficaria sistematicamente atrasado por essa margem inteira).
