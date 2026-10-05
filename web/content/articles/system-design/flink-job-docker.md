---
slug: flink-job-docker
categorySlug: system-design
title: "Flink na prática: Docker e o job Java"
navTitle: Docker e o job
summary: "Subir um cluster Flink local e montar o job de cliques por minuto por campanha"
level: intermediario
order: 91
section: deep-dives-tecnologias
group: "Flink"
---

## Objetivos de aprendizagem

- [ ] Subir JobManager e TaskManagers no Docker
- [ ] Ler o fluxo de um job: fonte, keyBy, janela e sink

*Retomando o cenário da unidade: um painel de métricas em tempo real para uma plataforma de anúncios, com cliques por minuto por campanha.*

## Subindo no Docker

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

## Job Java: operação central de processamento de stream

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

## Lembre

- Um cluster mínimo tem **um JobManager** e **um ou mais TaskManagers**.
- Os **slots** definem o paralelismo disponível.
- O job é: **fonte, keyBy, janela, agregação, sink**.
