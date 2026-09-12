# Trilha 4 — Apache Kafka

**Duração:** 6 semanas · 3 sessões de 45 min.
Pré-requisito: trilha de Spring (consumo HTTP e persistência) ajuda, mas não é obrigatório para as semanas 1–2.

> O erro mais comum é tratar Kafka como fila. Kafka é um **log distribuído, ordenado e persistente**. Toda a diferença de comportamento (reprocessamento, múltiplos consumidores, ordem parcial) sai daí.
>
> Esta trilha começa no zero: o que é um evento, o que é um tópico, o que é uma partição, o que é um offset. Sem isso, as perguntas de entrevista viram memorização.

---

## Mapa mental (leia isto antes de qualquer pergunta)

Imagine um caderno infinito. Cada página é um **tópico**. Dentro da página, as linhas são escritas **só no final** (nunca no meio, nunca apagando o que já foi escrito). Várias pessoas podem **escrever** nesse caderno (produtores) e várias podem **ler** (consumidores). Quem lê não rasga a página: só anota *até onde já leu*. Essa anotação é o **offset**.

Se o caderno cresce demais, você o divide em **colunas** (partições). Cada coluna tem ordem própria. O caderno inteiro **não** tem uma ordem única.

Isso não é analogia decorativa — é o modelo real. O resto desta trilha é detalhe operacional em cima disso.

```
Produtor ──escreve──►  Tópico "pedidos"
                         │
                         ├── Partição 0:  [offset 0] [1] [2] [3] ...
                         ├── Partição 1:  [offset 0] [1] [2] ...
                         └── Partição 2:  [offset 0] [1] ...
                                              ▲
                                              │
Consumidor do grupo "faturamento" ──lê e avança o próprio offset
Consumidor do grupo "analytics"    ──lê o mesmo log, offset independente
```

---

## Glossário do zero — o vocabulário que você precisa falar fluente

Cada item abaixo é uma **definição + para que serve + o erro comum**. Não pule. Se a palavra não estiver clara, o resto da trilha não cola.

### Evento (mensagem / record)

**O que é.** Um fato que já aconteceu, imutável. Exemplos: `PedidoCriado`, `PagamentoAprovado`, `ItemAdicionadoAoCarrinho`. No Kafka o nome técnico é *record* (ou *message*): um envelope com, no mínimo:

| Campo | Papel |
|---|---|
| **key** (opcional) | Decide a partição. Mesma key → mesma partição → ordem entre eventos daquela entidade. |
| **value** | O payload: JSON, Avro, Protobuf… o “o que aconteceu”. |
| **timestamp** | Quando o evento foi criado (pelo produtor ou pelo broker). |
| **headers** | Metadados (correlation id, tipo do evento, tracing). |
| **offset** | Posição **na partição**. Não vem do produtor — o broker atribui na escrita. |
| **partition** | Em qual “coluna” do tópico o record caiu. |

**Para que serve.** Desacoplar quem *produz* o fato de quem *reage* a ele. O serviço de pedidos não precisa saber que faturamento, estoque e analytics existem. Ele só publica `PedidoCriado`.

**Não é.** Um comando (“faça isso”) nem um request HTTP. Evento descreve o passado. Comando pede o futuro. Confundir os dois gera tópicos que “pedem para alguém fazer algo” e acoplam de novo.

**Erro comum.** Publicar “o objeto inteiro do pedido mudou” sem dizer *o que* aconteceu. Eventos nomeados (`PedidoCriado`, `PedidoCancelado`) comunicam intenção; blobs genéricos (`PedidoUpdated`) empurram a lógica para o consumidor adivinhar.

### Tópico

**O que é.** Um *stream nomeado* de eventos do mesmo tipo de domínio — o “canal”. Ex.: `pedidos.criados`, `pagamentos.aprovados`. Um tópico **não é uma fila**: é um log append-only com retenção.

**Para que serve.** Organizar o que circula no sistema. Consumidores se inscrevem em tópicos, não em produtores. O tópico é o contrato.

**Como pensar o nome.** Nomeie pelo *fato*, não pelo consumidor (`pedidos.criados`, não `para-o-faturamento`). Vários grupos vão ler o mesmo tópico.

### Partição

**O que é.** Um tópico é fatiado em N logs independentes, numerados 0..N-1. Cada partição:

- é um arquivo (na prática, uma sequência de *segmentos*) num broker;
- tem **ordem total** internamente;
- tem seus próprios offsets, começando em 0 e só crescendo;
- é a **unidade de paralelismo**: um consumidor de um grupo lê no máximo uma partição por vez (na verdade: cada partição vai para *exatamente um* membro do grupo).

**Para que serve.**

1. **Escala.** Um tópico com 1 partição = 1 writer “quente” e 1 consumer ativo no grupo. 12 partições permitem até 12 consumidores no mesmo grupo trabalhando em paralelo.
2. **Distribuição.** Partições de um tópico moram em brokers diferentes. O cluster espalha carga e dados.
3. **Ordem local.** Ordem só existe *dentro* da partição. Por isso a key importa.

**Analogia concreta.** Um tópico `pedidos` com 3 partições é três cadernos lado a lado. Pedido A com key `pedido-A` sempre cai no caderno 1; os eventos daquele pedido ficam na ordem em que foram escritos. Pedido B pode estar no caderno 2. Não dá para dizer se o evento 50 do caderno 1 “aconteceu antes” do evento 3 do caderno 2.

**Erro comum.** Achar que “mais partições = sempre melhor”. Cada partição custa: arquivos abertos, réplicas, memória no broker, rebalances mais caros. Escolha cedo: **aumentar partições depois redistribui keys e quebra a ordenação histórica** daquela entidade (a key `pedido-A` pode mudar de partição). Diminuir partições é pior ainda — Kafka não reduz partições nativamente de forma trivial.

### Offset

**O que é.** Um número sequencial **por partição**, atribuído pelo broker quando o record é gravado. O primeiro record da partição 0 tem offset 0, o próximo 1, 2, 3… Não há “buraco” no log saudável. Offset **não é** um ID de negócio e **não é** global no tópico: o offset 42 da partição 0 e o offset 42 da partição 1 são records diferentes.

**Para que serve.** É o cursor de leitura. Cada *consumer group* guarda, para cada partição, “já li até o offset X”. Isso se chama **committed offset**. Na próxima vez (ou depois de um crash), o grupo continua dali — ou do começo / do fim, conforme `auto.offset.reset`, se nunca commitou nada.

**Consequências que importam:**

- Ler **não apaga** a mensagem. O offset só anda para frente (ou você o move de propósito).
- Dois grupos no mesmo tópico têm offsets independentes. Faturamento no offset 1_000 e analytics no 50 é normal.
- Dá para **voltar** o offset e reprocessar (com idempotência, senão você duplica efeitos).
- Commitar offset **antes** de processar = pode perder mensagem (at-most-once). Commitar **depois** = pode reprocessar (at-least-once).

**Erro comum.** “O Kafka me entrega a mensagem e esquece.” Não. Quem esquece ou lembra é o **seu grupo**, via offset.

### Key

**O que é.** Bytes opcionais no record, usados pelo *partitioner* padrão: `hash(key) % número_de_partições`. Sem key, o produtor espalha em round-robin / sticky (versões recentes usam sticky partitioning para throughput).

**Para que serve.** Garantir que **todos os eventos de uma entidade** (mesmo `pedidoId`, mesmo `clienteId`) caiam na **mesma partição** e portanto fiquem ordenados entre si.

**Erro comum.** Key aleatória ou key demais (ex.: timestamp) — destrói a ordem por entidade e ainda pode criar *hot partition* se a distribuição for desigual (um cliente gigante = uma partição quente).

### Broker

**O que é.** Um processo Kafka (um servidor) que guarda partições, recebe writes dos produtores e atende reads dos consumidores. Um **cluster** é um conjunto de brokers (`broker-1`, `broker-2`, `broker-3`…).

**Para que serve.** Persistência + rede. Você não fala com “o Kafka” abstrato: fala com um broker (bootstrap) que te aponta para os líderes das partições.

### Cluster, controller e KRaft / ZooKeeper

**Cluster.** Vários brokers que se conhecem e replicam dados entre si.

**Controller.** Um broker eleito que coordena: quem é líder de cada partição, o que acontece se um broker cai, criação de tópicos. Nas versões modernas isso roda em **KRaft** (consenso dentro do próprio Kafka). Antes, essa coordenação era o **ZooKeeper**. Em entrevista: saiba que ZooKeeper é legado; clusters novos são KRaft.

### Líder, réplica e ISR

Cada partição tem **uma réplica líder** (toda escrita e leitura “oficial” passa por ela, no modelo clássico) e **réplicas followers** que copiam o log.

**ISR (*In-Sync Replicas*).** O conjunto de réplicas que *estão em dia* com o líder. Se o líder morre, o controller promove alguém do ISR.

**Para que serve.** Durabilidade. `acks=all` + `min.insync.replicas=2` significa: “só confirma a escrita quando pelo menos 2 réplicas (incluindo o líder) têm o dado”. Preferível falhar a escrita a confirmar e depois perder o disco do líder.

**Erro comum.** `replication.factor=1` em produção. Um broker cai, a partição some.

### Produtor (*producer*)

**O que é.** Qualquer cliente que **appenda** records num tópico. Pode ser sua aplicação Spring, o Debezium, o Kafka Connect, um script.

**O que ele faz, em ordem aproximada:**

1. Serializa key/value.
2. Escolhe a partição (key, ou explícita, ou sticky).
3. Agrupa records em **batches** (`linger.ms`, `batch.size`).
4. Manda para o **líder** daquela partição.
5. Espera `acks` (0 = fogo e esquece; 1 = líder gravou; all = ISR).
6. Se falhar, retenta (`retries`) — e é aqui que nascem duplicatas sem idempotência.

**Para que serve.** A única forma de dados entrarem no log.

### Consumidor (*consumer*) e consumer group

**Consumidor.** Cliente que lê records de uma ou mais partições, processa, e (em geral) commita offset.

**Consumer group.** Um conjunto de consumidores com o **mesmo `group.id`**. O Kafka trata o grupo como *uma* unidade lógica de processamento:

- As partições do tópico são **divididas** entre os membros.
- Cada partição → **exatamente um** membro do grupo. Sem disputa, sem “dois processam a mesma mensagem no mesmo grupo”.
- Um **outro** `group.id` lê o tópico **do zero (do próprio cursor)** — cópia lógica independente.

**Para que serve.** Escalar o processamento (mais membros, até o número de partições) e isolar aplicações (faturamento ≠ analytics).

**Corolário.** Mais consumidores no grupo do que partições = membros **ociosos**. Escalar consumo de verdade = mais partições **e** mais consumidores.

### Rebalance

**O que é.** Redistribuição de partições entre os membros do grupo. Acontece quando alguém entra, sai, morre (heartbeat), ou estoura `max.poll.interval.ms`.

**Por que dói.** No modelo clássico (*eager*), o consumo **para** enquanto as partições são reatribuídas. Rebalance frequente é incidente clássico: processing lento → broker acha que o consumer morreu → rebalance → processing recomeça → loop.

### Segmento, retenção e compaction

O log de uma partição não é um arquivo único eterno. É cortado em **segmentos** (arquivos). Políticas:

- **Retenção por tempo** (`retention.ms`) ou **por tamanho** (`retention.bytes`): segmentos velhos são **apagados**. A mensagem some do broker. Quem não leu a tempo, perdeu (a menos que tenha copiado para outro lugar).
- **Log compaction:** para cada **key**, o Kafka mantém **só o último value** e joga fora os anteriores. O tópico vira “estado atual por entidade”, não histórico completo. Base de changelog, KTables, CDC.

**Erro comum.** Achar que Kafka é backup eterno. Sem retenção infinita (cara e rara), o log **esquece**.

### Schema Registry (visão rápida)

Serviço ao lado do cluster que guarda **versões de schema** (Avro / Protobuf / JSON Schema) e barre evoluções incompatíveis. Sem ele, um produtor muda um campo e quebra todos os consumidores em produção. Detalhe na semana 5.

---

## Semana 1 — Do zero ao modelo mental

Objetivo da semana: desenhar de memória o diagrama tópico → partições → offsets → dois grupos, e explicar cada caixa em voz alta.

**1. Kafka é uma fila de mensagens?**
> Não. É um log append-only, particionado e replicado. A mensagem **não some** quando é lida — ela expira por política de retenção (tempo ou tamanho) ou some na compaction. Cada consumidor (na prática: cada *group* em cada partição) mantém o próprio *offset*. Consequências: dá para reprocessar o passado, dá para vários consumidores independentes lerem o mesmo dado, e o consumo não é destrutivo.
>
> Fila clássica (Rabbit, SQS): em geral a mensagem é *entregue e retirada* para um consumidor. Kafka: a mensagem fica; o que anda é o cursor.

**2. O que é um evento, e o que deve ir nele?**
> Um fato imutável do domínio, com um nome (`PedidoCriado`), um identificador estável (`eventId` / `messageId` — essencial para idempotência), a key de particionamento (`pedidoId`), timestamp, e o estado necessário para o consumidor agir sem telefonar de volta (ou só o ID, se for *notification* — ver semana 5).
>
> Não coloque no evento um “destinatário”. Quem se importa se inscreve no tópico.

**3. O que é uma partição e por que ela existe?**
> A unidade de paralelismo, de ordenação e de replicação. Um tópico é dividido em N partições, distribuídas entre os brokers. Throughput de escrita e de leitura (por grupo) escala com o número de partições — e é limitado por ele. Ordem e “um consumer por fatia” também nascem daqui.

**4. O que é offset, committed offset e `auto.offset.reset`?**
> Offset = posição do record na partição. Committed offset = até onde o grupo jura que já processou. `auto.offset.reset` só vale quando **não há** offset commitado para aquele grupo/partição: `earliest` relê desde o início ainda retido; `latest` ignora o passado e cola no fim (padrão de “stream ao vivo”). Escolher `latest` num job que deveria reprocessar histórico é bug silencioso.

**5. Kafka garante ordem?**
> **Só dentro de uma partição.** Não existe ordem global no tópico. Se a ordem importa para uma entidade (eventos do mesmo pedido), use uma **key** — a mesma key sempre vai para a mesma partição *enquanto o número de partições não muda*, portanto os eventos daquela entidade ficam ordenados entre si.
>
> “Ordenados” significa: o consumidor daquela partição vê a sequência de append. Não significa que o relógio do produtor e o do broker coincidem, nem que dois produtores concorrentes no mesmo pedido coordenaram — se dois serviços publicam o mesmo `pedidoId` ao mesmo tempo, a ordem é a de chegada no líder.

**6. Como funciona um consumer group?**
> Cada partição é atribuída a exatamente **um** consumidor do grupo. Grupos diferentes recebem cópias independentes de tudo. Corolário: **mais consumidores que partições = consumidores ociosos**. Escalar consumo exige aumentar partições (e aumentar partições redistribui as keys, o que quebra a ordenação histórica — decisão que deve ser tomada cedo).

**7. O que é o ISR? E `acks`?**
> *In-Sync Replicas* — o conjunto de réplicas que está acompanhando o líder. Combinado com `acks=all` e `min.insync.replicas=2`, garante que a mensagem foi replicada antes de ser confirmada. Se as réplicas em sincronia caírem abaixo do mínimo, o produtor passa a receber erro — o que é preferível a perder dado silenciosamente.
>
> `acks=0`: máximo throughput, pode perder. `acks=1`: líder gravou, follower pode não ter. `acks=all`: durabilidade de verdade.

**8. O que é retenção e log compaction?**
> Retenção por tempo/tamanho apaga segmentos antigos. **Compaction** mantém a última mensagem por key e descarta as anteriores — o tópico passa a representar o "estado atual" de cada entidade, e não o histórico. É a base de tópicos de changelog e de CDC.
>
> Compaction **não** é backup e **não** garante que você vê todos os estados intermediários. Tombstone (value nulo) é o “apague esta key” da compaction.

**9. Producer, consumer, broker — quem faz o quê, numa frase cada?**
> Broker guarda o log e replica. Producer appenda no líder da partição. Consumer lê o log e move o próprio offset. O Kafka **não executa a sua regra de negócio** — só persiste e entrega bytes.

**10. Desenhe (papel) um tópico com 3 partições, 2 grupos, 4 consumidores no grupo A e 1 no grupo B.**
> Grupo A: no máximo 3 membros trabalham, 1 fica ocioso. Grupo B: o único consumidor lê as 3 partições (em threads/loops internos, mas sozinho). Offsets dos grupos são independentes. Se você não consegue desenhar isso, volte ao mapa mental.

---

## Semana 2 — Garantias de entrega ⭐

**1. Explique at-most-once, at-least-once e exactly-once.**
> - **At-most-once:** commita o offset **antes** de processar. Se cair no meio, a mensagem se perde. Raramente aceitável.
> - **At-least-once:** processa e **depois** commita. Se cair antes do commit, a mensagem é reprocessada. **É o padrão prático.** Pode duplicar.
> - **Exactly-once:** possível com produtor idempotente (`enable.idempotence=true`) + transações (`transactional.id`) — mas a garantia vale **dentro do Kafka** (read-process-write entre tópicos). Se o processamento escreve num banco externo ou chama uma API, a garantia acaba na fronteira.

**2. Então como você garante processamento único na prática?**
> **At-least-once + consumidor idempotente.** Formas de tornar idempotente:
> - Chave de deduplicação: guardar o `messageId` (ou `eventId`) processado numa tabela e ignorar repetidos (tabela *inbox*).
> - Upsert em vez de insert.
> - Versionamento: só aplicar o evento se a versão for maior que a atual.
> - Operação naturalmente idempotente (definir um estado, não incrementar).
>
> **Essa é a resposta que entrevistador sênior quer ouvir.**

**3. O que é o produtor idempotente?**
> Com `enable.idempotence=true`, o produtor recebe um PID e numera as mensagens (`sequence number`); o broker descarta duplicatas causadas por retry. Elimina duplicação **na produção** (o mesmo producer reenviando o mesmo batch), não no consumo e não entre dois producers diferentes. É o padrão nas versões recentes. Transações (`transactional.id`) vão além: write em vários tópicos + commit de offsets na mesma transação Kafka.

**4. O que acontece se o consumidor cai no meio do processamento?**
> O offset não foi commitado, então após o rebalance outro consumidor (ou o mesmo, ao voltar) reprocessa a partir do último offset commitado. Daí a necessidade de idempotência. Se o efeito colateral já foi para o mundo (cobrou o cartão) e o offset não commitou, a duplicata é de negócio — não de log.

**5. Commit automático ou manual?**
> Automático (`enable.auto.commit=true`) commita por tempo, podendo commitar mensagens ainda não processadas — perde dado em queda. Manual dá controle: processar, então commitar. Em Spring Kafka, `AckMode.MANUAL_IMMEDIATE` ou `RECORD`/`BATCH` com o container gerenciando.
>
> Commit por lote (`BATCH`) é mais rápido; se o processo morre no meio do lote, reprocessa o lote inteiro — de novo, idempotência.

**6. O que é *consumer lag*?**
> A diferença entre o último offset escrito na partição (log-end) e o offset commitado (ou o offset atual de leitura) daquele grupo. Lag alto sustentado = o grupo não está acompanhando a produção. Lag instantâneo pequeno é normal. Métrica número um de consumidor.

---

## Semana 3 — Operação, rebalance e tuning

**1. O que é rebalance, o que dispara e por que dói?**
> É a redistribuição de partições entre os membros do grupo. Disparado por: entrada/saída de consumidor, queda de heartbeat (`session.timeout.ms`), ou estouro de `max.poll.interval.ms`. Durante o rebalance clássico, **o consumo para**. Rebalance frequente é um dos incidentes mais comuns.

**2. Meu consumidor fica reiniciando em loop. O que investigar primeiro?**
> Provavelmente o processamento de um lote está demorando mais que `max.poll.interval.ms` — o broker conclui que o consumidor morreu e dispara rebalance, que interrompe o processamento, que recomeça, e assim em ciclo. Correções: reduzir `max.poll.records`, acelerar o processamento, ou aumentar o intervalo. Também vale checar OOMKilled do pod (ver trilha de K8s).

**3. Como reduzir o impacto de rebalances?**
> `CooperativeStickyAssignor` (rebalance incremental, sem parar tudo), *static membership* (`group.instance.id`, evita rebalance em restart planejado), processamento rápido, e heartbeat em thread separada (já é o comportamento padrão do cliente moderno).

**4. Consumer lag está crescendo. O que você faz?**
> Diagnóstico em ordem: (a) o consumo ficou mais lento ou a produção aumentou? (b) o gargalo está no consumidor ou numa dependência a jusante (banco, API)? (c) há partição quente por key mal distribuída? Ações: aumentar paralelismo (mais partições + mais consumidores), processar em lote, tornar o processamento assíncrono onde possível, ou escalar a dependência. Aumentar consumidores sem aumentar partições não resolve nada.

**5. Configurações de produtor que importam.**
> `acks` (0 / 1 / all — durabilidade), `enable.idempotence`, `retries` + `delivery.timeout.ms`, `linger.ms` e `batch.size` (esperar um pouco para agrupar aumenta muito o throughput ao custo de latência), `compression.type=lz4/zstd`, `max.in.flight.requests.per.connection` (com idempotência ligada, até 5 preserva a ordem).

**6. Configurações de consumidor que importam.**
> `max.poll.records`, `max.poll.interval.ms`, `session.timeout.ms` / `heartbeat.interval.ms`, `auto.offset.reset` (`earliest` para pipeline de dados, `latest` para stream em tempo real), `fetch.min.bytes` / `fetch.max.wait.ms`, `enable.auto.commit`.

**7. O que é Dead Letter Topic e quando usar?**
> Mensagem que falha após N tentativas vai para um tópico separado, em vez de bloquear a partição indefinidamente (*poison pill*). Em Spring Kafka: `DefaultErrorHandler` + `DeadLetterPublishingRecoverer` com `ExponentialBackOff`. Importante: distinguir **erro permanente** (payload inválido → DLT direto) de **erro transitório** (banco fora → retry com backoff). Mandar erro transitório para o DLT perde dado; ficar tentando erro permanente trava a partição.

**8. Como você monitora um consumidor?**
> Consumer lag por partição (métrica número um), taxa de rebalance, tempo de processamento por mensagem, taxa de erro e volume no DLT. Alertar em lag crescente e sustentado, não em lag instantâneo. Offset “parado” numa partição só = poison pill ou hot key naquela partição.

**9. O que é uma partição quente (*hot partition*)?**
> Uma partição recebendo muito mais tráfego que as outras, em geral porque a key está enviesada (um `clienteId` enorme, ou key constante). Sintoma: lag só nela, enquanto as outras estão em zero. Kafka não rebalanceia carga *dentro* da partição — a correção é redesenhar a key (com cuidado com ordem) ou splittar o trabalho a jusante.

---

## Semana 4 — Padrões de integração ⭐

**1. Como garantir que salvar no banco e publicar no Kafka aconteçam juntos?**
> Não acontecem — não há transação distribuída entre banco e broker. A solução é o **padrão Outbox**: gravar o evento numa tabela `outbox` **dentro da mesma transação** do dado de negócio. Um processo separado (poller ou CDC com Debezium) lê a tabela e publica no Kafka, marcando como enviado. Se a publicação falhar, ele tenta de novo — resultando em at-least-once, tratado com idempotência no consumidor.
>
> **Essa pergunta separa quem usou Kafka de quem entendeu Kafka.**
>
> Anti-padrão: `salvar(); kafka.send();` — o processo pode morrer no meio e ficar só um dos dois. Ou o inverso, publicar antes de commitar o banco.

**2. E o inverso — o padrão Inbox?**
> No consumidor, guardar os IDs de mensagem já processados numa tabela e ignorar repetições, na mesma transação do efeito. É a implementação concreta da idempotência.

**3. O que é o Schema Registry e por que importa?**
> Um serviço que versiona os schemas (Avro/Protobuf/JSON Schema) usados nos tópicos e valida a compatibilidade da evolução. Sem ele, um produtor muda o payload e quebra consumidores em produção. Compatibilidade **backward** (consumidor novo lê dado antigo — o mais usado) e **forward** (consumidor antigo lê dado novo). Regra prática: adicionar campo opcional é seguro; remover campo obrigatório ou renomear não é.

**4. Como versionar eventos sem quebrar consumidores?**
> Só mudanças aditivas com valor padrão; nunca reutilizar nome de campo com outro significado; quando a mudança é incompatível, criar um novo tópico ou uma nova versão do tipo de evento e migrar os consumidores gradualmente.

**5. Event notification vs event-carried state transfer.**
> *Notification*: o evento carrega só o ID ("Pedido 123 mudou") e o consumidor busca o resto — payload pequeno, mas cria acoplamento síncrono na volta. *State transfer*: o evento carrega o estado necessário — desacopla, mas o payload cresce e pode ficar obsoleto. A escolha é um trade-off legítimo e boa pergunta de entrevista.

**6. Quando você **não** usaria Kafka?**
> Quando precisa de resposta síncrona (é request/response, não evento); quando o volume é baixo e uma fila simples (SQS, RabbitMQ) resolve com muito menos operação; quando precisa de roteamento complexo por mensagem ou prioridade — Kafka não tem prioridade nativa; quando o time não tem capacidade de operar o cluster.

**7. Kafka Streams / ksqlDB vs “só um consumer Spring” — quando cada um?**
> Consumer “burro” + sua aplicação: a maior parte dos microsserviços. Kafka Streams: quando o processamento é *sobre o log* (janelas, join entre tópicos, agregação, estado local com changelog). Não comece por Streams se o problema é “chamar o banco e a API de pagamento”.

---

## Semana 5 — Spring Kafka e laboratório

**Conceitos:** `KafkaTemplate`, `@KafkaListener`, `ConcurrentKafkaListenerContainerFactory` (o `concurrency` cria N consumidores no mesmo grupo — limitado por partições), `AckMode`, serializers/deserializers, `ErrorHandlingDeserializer` (para não quebrar em payload malformado), `RetryableTopic`.

Lembrete: `concurrency = 6` num tópico de 3 partições ainda deixa 3 threads ociosas. O número mágico é `min(concurrency, partitions)`.

### Laboratórios (o coração desta trilha)

Faça cada um **narrando em voz alta** o que espera ver *antes* de rodar.

1. **Anatomia.** Crie um tópico de 3 partições. Publique 9 mensagens sem key e 9 com key `pedido-1` / `pedido-2` / `pedido-3`. No consumer, imprima `partition`, `offset`, `key`, `value`. Confirme: sem key a ordem global é um caos; com key, cada pedido é sequencial na sua partição. Offsets de partições diferentes são números independentes.
2. **Ordem.** Publicar eventos do mesmo pedido sem key e com key, em tópico de 3 partições. Observar a ordem chegando bagunçada no primeiro caso.
3. **Dois grupos.** Dois `group.id` no mesmo tópico. Confirme que ambos recebem tudo e que os offsets não se atrapalham.
4. **Rebalance.** Rodar 3 consumidores, matar um, observar o rebalance nos logs e medir a pausa no consumo.
5. **Consumidores ociosos.** Tópico com 2 partições e 4 consumidores. Confirmar que 2 ficam parados.
6. **Poison pill.** Publicar um payload inválido e ver a partição travar em loop de erro. Depois, configurar DLT com backoff e ver o comportamento correto.
7. **Duplicação.** Matar o consumidor entre o processamento e o commit. Ver a mensagem ser processada duas vezes. Implementar tabela de deduplicação e provar que o efeito passa a ser único.
8. **Outbox.** Implementar a tabela `outbox` + publicador, e simular falha do broker: o dado fica no banco e é publicado quando o Kafka volta.
9. **Lag.** Gerar carga alta, observar o lag crescer, escalar consumidores e ver o lag drenar. Depois: key enviesada (90% das mensagens com a mesma key) e ver lag só numa partição.

Tudo isso com Testcontainers ou Docker Compose local.

---

## Semana 6 — Síntese e entrevista

Releia o glossário em voz alta, sem olhar. Se travar numa palavra, volte nela — não avance para as perguntas-síntese.

### Perguntas-síntese (nível sênior)

- Explique Kafka para alguém que só conhece fila, usando partição e offset. Sem jargão de produto.
- Desenhe um fluxo de pagamento com Kafka onde nenhum pagamento pode ser cobrado duas vezes.
- Um consumidor precisa chamar uma API externa que fica lenta em horário de pico. Como você projeta isso sem travar a partição?
- Você precisa reprocessar 3 dias de eventos por causa de um bug. Como faz sem duplicar efeitos colaterais? (Dica: offset + retenção + inbox.)
- Como você migraria um tópico de 6 para 12 partições sem quebrar a ordenação por cliente?
- Qual a diferença entre o seu sistema estar "eventualmente consistente" e estar "inconsistente"?
- `acks=all` impede duplicata no consumidor? Por quê?
- Por que `enable.idempotence=true` não substitui a tabela inbox?

### Checklist de fluência (marque quando conseguir explicar em 60 segundos)

- [ ] Evento vs comando
- [ ] Tópico vs partição vs offset
- [ ] Key e ordem
- [ ] Consumer group e ociosos
- [ ] ISR / acks / retenção / compaction
- [ ] At-least-once + idempotência
- [ ] Outbox / Inbox
- [ ] Rebalance e lag
- [ ] Quando *não* usar Kafka

---

## Recursos

- **Kafka: The Definitive Guide** (2ª ed.) — capítulos 1–2 (modelo), 3 (produtor), 4 (consumidor), 7 (confiabilidade).
- Documentação oficial: [kafka.apache.org/documentation](https://kafka.apache.org/documentation/) — seções *Topics and Logs*, *Producers*, *Consumers*.
- Documentação do Confluent sobre exactly-once semantics.
- microservices.io — verbetes *Transactional Outbox* e *Saga*.
