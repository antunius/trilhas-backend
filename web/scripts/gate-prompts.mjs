/** Pergunta clara + mito da mesma aula. Chave = tag do fato. */
export const prompts = {
  kafka: {
    evento: {
      fato: [
        "Evento descreve o que já aconteceu ou pede o que deve acontecer?",
        "Evento é um comando: “cubra o cartão agora”, não um fato do passado.",
      ],
      nome: [
        "Como você nomeia o evento: o fato concreto ou um PedidoUpdated genérico?",
        "Nomeie PedidoUpdated genérico; o consumidor adivinha o que mudou.",
      ],
      key: [
        "No envelope Kafka, a key serve para quê?",
        "A key do envelope é o eventId da inbox.",
      ],
      eventId: [
        "O que a inbox usa para não cobrar o mesmo pedido duas vezes?",
        "Offset substitui idempotência de negócio.",
      ],
      value: [
        "O value da mensagem é o quê — e o broker interpreta o JSON por você?",
        "O broker lê o JSON e aplica a regra de negócio sozinho.",
      ],
      "offset carimbo": [
        "Quem escolhe o offset: o produtor ou o líder da partição?",
        "Quem escreve escolhe o offset no ProduceRequest, tipo “me dá o 42”.",
      ],
      headers: [
        "Headers no record Kafka são o quê?",
        "Headers são a key de particionamento.",
      ],
      desacoplar: [
        "O payload do evento deve nomear o destinatário (o João, o faturamento)?",
        "Coloque o destinatário no payload: tópico “para o João”.",
      ],
      "lab record": [
        "No evento PedidoCriado, o que é obrigatório e o que pode ser opcional?",
        "Campo obrigatório novo é o caminho BACKWARD-safe.",
      ],
      HTTP: [
        "GET /pedidos/99 é um evento?",
        "GET /pedidos/99 é um evento, só que síncrono.",
      ],
      imutável: [
        "Dá para editar o evento depois de publicado?",
        "Edite o evento já publicado se o pedido mudar.",
      ],
      timestamp: [
        "O timestamp do record escolhe a partição?",
        "Timestamp escolhe a partição.",
      ],
      "notificação vs estado": [
        "É melhor mandar estado suficiente no evento ou só o ID para o consumidor “buscar lá”?",
        "Só o ID no evento é melhor: o consumidor busca o resto no checkout.",
      ],
      "lab classe": [
        "O payload do evento deve ser uma classe tipada ou um Map solto?",
        "O payload é um Map solto, sem schema.",
      ],
    },
    topico: {
      nome: [
        "O que é um tópico, na prática?",
        "Tópico é um processo na RAM do broker, tipo uma fila em memória.",
      ],
      "auto-create": [
        "Por que auto-create de tópico em produção é perigoso?",
        "Auto-create em produção é ótimo: o contrato nasce sozinho com as partições certas.",
      ],
      metadata: [
        "O nome do tópico guarda as mensagens?",
        "O nome do tópico já guarda os bytes; partição é só um apelido.",
      ],
      append: [
        "Dá para reescrever a linha 40 de um tópico?",
        "Tópico é tabela: faça UPDATE na linha 40 se o pedido mudar.",
      ],
      CLI: [
        "O que kafka-topics.sh --create --partitions 3 cria de verdade?",
        "O CLI cria um único log; as três partições são só um número no YAML.",
      ],
      inscrição: [
        "O consumidor se inscreve no tópico ou no produtor?",
        "O consumidor se inscreve no produtor; se o serviço sumir, o log some.",
      ],
      controller: [
        "Onde vive a metadata do tópico, e onde ficam os bytes?",
        "Você “fala com o tópico” como se fosse um processo; bytes e metadata são a mesma coisa.",
      ],
      N: [
        "Mais partições é só um número de graça no YAML?",
        "Mais partições não custam arquivos, réplicas nem rebalance.",
      ],
      "if-not-exists": [
        "--if-not-exists substitui decidir o contrato do tópico antes?",
        "--if-not-exists decide o contrato por você; não precisa pensar no tópico.",
      ],
      RF: [
        "RF: replication-factor 1 imita durabilidade de produção?",
        "RF=1 é o mesmo que produção: o disco do líder pode sumir sem perda.",
      ],
      "vários leitores": [
        "Vários grupos no mesmo tópico apagam a linha uns para os outros?",
        "O segundo grupo não vê a linha: o primeiro já apagou.",
      ],
      Spring: [
        "NewTopic no Spring Boot faz o quê, comparado ao CLI?",
        "NewTopic é outra coisa: o CLI cria tópico, o Spring só escuta.",
      ],
    },
    particao: {
      log: [
        "O que é uma partição no disco, e de quem são os offsets?",
        "Offset 0 da P0 e offset 0 da P1 são o mesmo recado.",
      ],
      teto: [
        "Num grupo, quantos membros ativos uma partição pode ter?",
        "O 4º consumidor em 3 partições também recebe uma fatia.",
      ],
      aumentar: [
        "Aumentar o número de partições faz o quê com a key do pedido 99?",
        "Aumentar N não muda a coluna do pedido 99; o hash continua igual.",
      ],
      diminuir: [
        "O Kafka diminui o número de partições se você pedir?",
        "O Kafka diminui partições com --alter para baixo, sem apagar o log.",
      ],
      líder: [
        "Quem recebe o ProduceRequest: o líder ou um follower qualquer?",
        "Você escreve no follower para aliviar o líder.",
      ],
      escala: [
        "Subir pod no grupo, sem mais partições, escala o consumo?",
        "Subir pod sem aumentar partições escala o grupo do mesmo jeito.",
      ],
      describe: [
        "Qual comando mostra PartitionCount e o líder de cada partição?",
        "Não há comando para ver as colunas; chute pelo log da aplicação.",
      ],
      "key cola": [
        "Sem key, os eventos do mesmo pedido ficam ordenados?",
        "Sem key o pedido 99 ainda cai sempre na mesma coluna.",
      ],
      segmentos: [
        "A partição é um arquivo eterno ou uma fila de segmentos?",
        "A partição é um único arquivo eterno; segment.bytes não fecha nada.",
      ],
      TopicBuilder: [
        "TopicBuilder.partitions(3) no Spring cria o quê?",
        "TopicBuilder.partitions(3) é só comentário; o tópico nasce com 1 partição.",
      ],
      alter: [
        "Subir de 3 para 6 partições é reversível para baixo?",
        "--alter --partitions 6 volta para 3 quando você quiser, sem mudar o módulo da key.",
      ],
      hot: [
        "Uma key gigante (vip) se resolve subindo concurrency?",
        "Subir concurrency drena a coluna quente da key vip.",
      ],
      "grupo B": [
        "Um consumidor sozinho pode ler as três partições?",
        "Analytics com 1 membro precisa de 3 pods, um por partição.",
      ],
      "ordem local": [
        "Há ordem entre um recado da P0 e um da P1?",
        "Pago na P1 nasce ordenado com Criado na P0 pelo offset.",
      ],
      arquivos: [
        "Mais partições custam o quê além de paralelismo?",
        "Mais partições não abrem mais arquivos nem réplicas; é número de graça.",
      ],
    },
    offset: {
      carimbo: [
        "O cliente manda “me dá offset 42” no Produce?",
        "O cliente escolhe o offset no ProduceRequest.",
      ],
      "não global": [
        "Offset 42 da P0 e 42 da P1 são o mesmo recado?",
        "Offset é ID global de negócio, igual nas duas partições.",
      ],
      marca: [
        "A linha da mensagem guarda “já li”?",
        "A mensagem guarda quem já leu; committed offset é redundante.",
      ],
      crash: [
        "Depois de um crash, o grupo relê a partir de onde?",
        "Crash apaga o que já estava no log; não há o que reler.",
      ],
      reset: [
        "A config auto.offset.reset vale depois que o grupo já tem commit?",
        "auto.offset.reset latest num job de histórico é o reset certo.",
      ],
      lag: [
        "Lag mede se o cartão cobrou duas vezes?",
        "Lag alto prova cobrança duplicada.",
      ],
      CLI: [
        "Qual comando mostra o committed offset do grupo?",
        "Não há CLI para a marca; só o log do Spring.",
      ],
      manual: [
        "Com ack-mode manual, o committed offset anda quando — no relógio ou no ack?",
        "Auto-commit por relógio espera o cartão terminar.",
      ],
      antes: [
        "Commitar o offset antes de processar dá qual risco?",
        "Commitar antes de processar é exatamente-uma-vez na prática.",
      ],
      depois: [
        "Por que commitar depois do efeito ainda precisa de inbox?",
        "Commitar depois nunca reprocessa; inbox é enfeite.",
      ],
      earliest: [
        "Reset earliest relê o que a retenção já apagou?",
        "earliest recupera o começo mesmo depois da retenção.",
      ],
      listener: [
        "O listener do consumidor deve logar o offset de cada record?",
        "O offset não aparece no log da aplicação; só no broker.",
      ],
      "duas marcas": [
        "Dois grupos no mesmo tópico compartilham o CURRENT-OFFSET?",
        "Dois grupos têm a mesma marca; describe de um vale para o outro.",
      ],
      lote: [
        "Morte no meio de um commit em lote faz o quê?",
        "Morte no meio do lote não reprocessa; o lote inteiro já estava seguro.",
      ],
      mensagem: [
        "A mensagem lembra quais grupos já leram?",
        "Kafka entrega-e-esquece sozinho, como fila clássica.",
      ],
    },
    key: {
      hash: [
        "Como o particionador padrão escolhe a coluna?",
        "A partição é aleatória mesmo com a mesma key e o mesmo N.",
      ],
      ordem: [
        "Por que a key = pedidoId cola Criado e Pago na mesma coluna?",
        "Sem key, Pago e Criado do 99 ainda nascem ordenados.",
      ],
      "sem key": [
        "Produce sem key ordena os eventos do pedido 99?",
        "Sem key o sticky partitioner ainda ordena por pedido.",
      ],
      UUID: [
        "Key = UUID novo a cada evento: o que acontece com a ordem do pedido?",
        "UUID novo a cada evento mantém a ordem por entidade.",
      ],
      hot: [
        "Sempre a mesma key (ou um cliente gigante) cria o quê?",
        "Sempre a mesma key espalha a carga; concurrency drena a coluna do vip.",
      ],
      send: [
        "No Spring, qual argumento do send é a key?",
        "No Spring a key vai no JSON; o send só tem tópico e value.",
      ],
      HTTP: [
        "POST /pedidos?comKey=true manda o quê como key?",
        "comKey=true manda UUID aleatório; comKey=false manda pedidoId.",
      ],
      "N muda": [
        "Se o número de partições muda, a mesma key continua na mesma coluna?",
        "Se N muda, a mesma key permanece na coluna antiga para sempre.",
      ],
      null: [
        "Mandar key nula no send produz com a key do pedido?",
        "Key nula faz o broker escolher a ordem do pedido 99.",
      ],
      timestamp: [
        "Usar timestamp como key cola a história do pedido 99?",
        "Key = timestamp cola a história do 99 na mesma coluna.",
      ],
      log: [
        "No consumer, vale olhar key e partition juntos?",
        "No consumer, key e partition não aparecem; só o JSON.",
      ],
      bytes: [
        "A key de particionamento é um campo mágico dentro do JSON?",
        "O particionador lê a key de dentro do JSON, não do envelope.",
      ],
      família: [
        "A key do evento cola a história do mesmo pedido na mesma partição?",
        "Key espalha o mesmo pedidoId em partições aleatórias de propósito.",
      ],
      lote: [
        "Num lote de pedidos, mandar cada pedidoId como key cola a história de cada pedido?",
        "O lote ignora a key; todos os pedidos vão sem key.",
      ],
    },
    broker: {
      processo: [
        "Um broker no cluster Kafka é o quê?",
        "Broker é um sidecar HTTP genérico, não um processo que guarda partições.",
      ],
      líder: [
        "O cliente “fala com o Kafka” ou resolve o líder de cada partição?",
        "bootstrap.servers é o líder de todas as partições para sempre.",
      ],
      cluster: [
        "Um broker sozinho ainda é um cluster?",
        "Cluster só existe com ZooKeeper e no mínimo três brokers.",
      ],
      controller: [
        "Em cluster novo, quem elege líder e trata falha?",
        "ZooKeeper é obrigatório em todo cluster novo.",
      ],
      listeners: [
        "Listener interno do broker e listener da sua máquina são o mesmo endereço?",
        "localhost:9092 e kafka:29092 são intercambiáveis em qualquer processo.",
      ],
      YAML: [
        "Onde o Spring aponta o bootstrap.servers?",
        "O YAML do Spring não tem bootstrap-servers; o cliente adivinha.",
      ],
      roles: [
        "No Compose didático, um processo pode ser broker e controller?",
        "Broker e controller são sempre dois processos separados, mesmo num cluster de um.",
      ],
      disco: [
        "Os bytes das partições ficam no nome do tópico ou no disco?",
        "O nome do tópico guarda o payload; disco é só backup.",
      ],
      "não executa": [
        "O broker cobra o cartão ou chama o seu serviço?",
        "O broker cobra o cartão quando a linha entra no log.",
      ],
      metadata: [
        "Se o líder da partição cair, o que o controller faz?",
        "Cair o líder encerra a partição até você recriar o tópico.",
      ],
      "lab um": [
        "Um broker sozinho, com RF=1, imita durabilidade de produção?",
        "Um broker tem RF e ISR de produção.",
      ],
      JVM: [
        "Produce clássico no Kafka é REST?",
        "Broker é sidecar HTTP; Produce clássico é REST.",
      ],
      equipe: [
        "O controller do cluster Kafka faz o quê?",
        "Controller é o consumer group; broker é o tópico.",
      ],
      id: [
        "O cluster.id do Kafka é o mesmo que group.id do consumidor?",
        "cluster.id e group.id são o mesmo identificador.",
      ],
      fetch: [
        "O consumidor clássico lê do follower por padrão?",
        "Fetch clássico lê do follower para aliviar o líder.",
      ],
    },
    isr: {
      definição: [
        "ISR no Kafka: o que a sigla significa e quem entra na lista?",
        "ISR é a lista de todos os brokers do cluster, atrasados ou não.",
      ],
      failover: [
        "Se o líder morre, o controller promove qualquer réplica?",
        "O controller promove qualquer réplica, mesmo atrasada.",
      ],
      "acks=all": [
        "Acks=all espera o ISR gravar ou o cartão ser cobrado?",
        "acks=all é o ACK do cartão e do faturamento.",
      ],
      "acks=1": [
        "Com acks=1, o follower já gravou quando o produtor recebe ACK?",
        "acks=1 é tão durável quanto acks=all.",
      ],
      "acks=0": [
        "Com acks=0 o producer pode perder a mensagem sem saber?",
        "acks=0 nunca perde mensagem; só é mais rápido.",
      ],
      "min.insync": [
        "Se o ISR cair abaixo de min.insync.replicas, o que o producer recebe?",
        "ISR insuficiente ainda devolve ACK; melhor silêncio do que erro.",
      ],
      "RF=1": [
        "Com replication.factor=1 em produção, o que acontece se o disco do líder some?",
        "RF=1 em produção ainda tem cópia em outro disco, por padrão.",
      ],
      "lab YAML": [
        "Por que usar acks=all mesmo num cluster de um broker?",
        "Com um broker o certo é acks=0, para parecer produção.",
      ],
      "não duplicata": [
        "Acks=all impede a segunda cobrança no consumidor?",
        "acks=all no producer é o mesmo que idempotência de cobrança no consumidor.",
      ],
      ata: [
        "Uma réplica atrasada, fora do ISR, entra na promoção a líder?",
        "Cópia atrasada entra na promoção; ISR não importa.",
      ],
      idempotence: [
        "A config enable.idempotence no producer impede a segunda cobrança no cartão?",
        "Idempotência do producer evita a segunda cobrança no cartão.",
      ],
      LEO: [
        "LEO é o quê, e para que o ISR compara?",
        "LEO é o group.id da réplica.",
      ],
      Produce: [
        "Produce clássico passa no líder; acks=all confirma o quê?",
        "acks=all confirma o efeito no cartão, não a escrita no ISR.",
      ],
      erro: [
        "É melhor ACK mentiroso ou erro de ISR insuficiente?",
        "ACK mentiroso é melhor do que erro visível de ISR insuficiente.",
      ],
      "lab limite": [
        "RF=1 e ISR de 1 já provam alta disponibilidade de produção?",
        "ISR de 1 já é redundância de produção.",
      ],
    },
    produtor: {
      biblioteca: [
        "O producer é um serviço à parte obrigatório?",
        "Producer é um microsserviço Kafka obrigatório, não biblioteca no seu processo.",
      ],
      ACK: [
        "“Mandei” no log da app já é ISR confirmado?",
        "Log “mandei” na app já prova que o ISR gravou.",
      ],
      retry: [
        "Sem idempotence, retry do mesmo producer cria o quê no log?",
        "Sem idempotence o retry nunca duplica linha no log.",
      ],
      "não cobra": [
        "Quem cobra o cartão: o Kafka ou o consumidor?",
        "O Kafka cobra o cartão na hora do Produce.",
      ],
      batch: [
        "O producer manda cada record isolado, sem batch?",
        "O producer não junta records; cada um é um ProduceRequest na hora.",
      ],
      "key send": [
        "No send do producer, a key do pedido vai em qual argumento?",
        "O producer manda o pedidoId só no JSON, nunca como key do envelope.",
      ],
      endpoint: [
        "Uma API HTTP que chama KafkaTemplate.send está no papel de producer?",
        "POST /pedidos só grava H2; o producer é outro processo.",
      ],
      serializer: [
        "KafkaJsonSchemaSerializer fala com o Registry?",
        "Sem serializer de schema o contrato ainda registra sozinho no Registry.",
      ],
      "acks YAML": [
        "Acks=all na config do producer espera o faturamento terminar?",
        "acks=all espera o faturamento, não o ISR.",
      ],
      caneta: [
        "O producer do Kafka é quem no fluxo: quem escreve ou quem lê?",
        "Producer é quem lê o log, não quem escreve no final da partição.",
      ],
      "erro send": [
        "Pode ignorar o callback de falha do send?",
        "Ignore o callback: outbox existe por outro motivo.",
      ],
      particiona: [
        "Quem escolhe a partição e quem carimba o offset?",
        "O broker escolhe a partição; o producer carimba o offset.",
      ],
      "lab curl": [
        "Uma API HTTP que chama KafkaTemplate.send publica o fato no tópico?",
        "O POST HTTP não produz nada no tópico; só aquece o Spring.",
      ],
      metadata: [
        "O result.getRecordMetadata() já vale antes do ACK do broker?",
        "partition e offset no metadata já existem antes do ACK.",
      ],
      "sem key": [
        "Produce sem key: a ordem do pedido 99 existe?",
        "Produce sem key ainda ordena o 99 na mesma coluna.",
      ],
    },
    consumidor: {
      crachá: [
        "Mesmo group.id vs outro group.id: qual a diferença?",
        "Outro group.id divide as partições com o primeiro; mesmo id relê o log.",
      ],
      fetch: [
        "O broker chama o seu método Java quando chega mensagem?",
        "O broker chama seu @KafkaListener; você não faz Fetch.",
      ],
      "um por fatia": [
        "Cada partição pode ir para quantos membros do mesmo grupo?",
        "Cada partição vai para todos os membros do grupo ao mesmo tempo.",
      ],
      "dois listeners": [
        "Faturamento e analytics no mesmo tópico são o quê?",
        "Só existe um groupId; analytics é o mesmo group.id.",
      ],
      concurrency: [
        "Concurrency: 3 em 3 partições cria uma 4ª partição no tópico?",
        "concurrency: 3 cria 3 partições extras no tópico.",
      ],
      ack: [
        "O ack.acknowledge() anda o committed offset em que momento?",
        "O ack é automático no começo do método, antes do efeito.",
      ],
      "fan-out": [
        "Dois grupos imprimem as mesmas linhas?",
        "O segundo grupo não vê as linhas: o primeiro já levou.",
      ],
      "não rasga": [
        "Consumir apaga a linha para o outro grupo?",
        "Consumir rasga a página para o outro grupo.",
      ],
      heartbeat: [
        "Heartbeat perdido faz o quê no grupo?",
        "Heartbeat é opcional; session.timeout não existe.",
      ],
      assign: [
        "No consumo clássico você escolhe a P1 no código?",
        "Você faz assign manual da P1 no @KafkaListener.",
      ],
      log: [
        "O @KafkaListener deve imprimir partition, offset, key e group?",
        "O listener não imprime offset nem group; isso fica só no broker.",
      ],
      escala: [
        "Escalar consumo é só subir pod?",
        "Só pod escala consumo, mesmo com 3 partições e 9 membros.",
      ],
      "YAML group": [
        "No YAML do Spring, faturamento e analytics são o mesmo group-id?",
        "spring.kafka.consumer.group-id único serve os dois listeners.",
      ],
      time: [
        "Dois times com group.id diferentes compartilham CURRENT-OFFSET?",
        "Times diferentes compartilham a mesma marca no tópico.",
      ],
      idle: [
        "Concurrency 6 em 3 partições: as threads extras leem o quê?",
        "concurrency 6 em 3 partições: as 6 threads leem, cada uma com fatia própria.",
      ],
    },
    rebalance: {
      "o que é": [
        "Rebalance no consumer group: o que é e o que dispara?",
        "Rebalance é o producer redistribuir keys entre partições.",
      ],
      eager: [
        "No assignor clássico, o Fetch continua durante o rebalance?",
        "Rebalance eager não pausa o Fetch; o grupo nem percebe.",
      ],
      cooperative: [
        "Cooperative sticky elimina a parada do grupo?",
        "Cooperative sticky elimina rebalance; não há revogação.",
      ],
      static: [
        "A config group.instance.id serve para quê num restart planejado do mesmo pod?",
        "group.instance.id força rebalance a cada restart do mesmo pod.",
      ],
      "max.poll": [
        "Processar demais sem poll novo: o cluster pensa o quê?",
        "Lote enorme + cartão lento nunca dispara rebalance.",
      ],
      loop: [
        "Rebalance no meio do lote lento tende a gerar o quê?",
        "Subir pods quebra sozinho o loop de lote lento + rebalance.",
      ],
      "lab kill": [
        "Reiniciar o consumidor Spring: o que os logs de rebalance mostram?",
        "Restart do Spring nunca loga revoked / assigned.",
      ],
      YAML: [
        "As configs max.poll.interval.ms e session.timeout.ms importam no diagnóstico de rebalance?",
        "Essas configs do YAML não disparam rebalance; ignore-as.",
      ],
      analogia: [
        "No rebalance eager, um membro troca as partições em silêncio?",
        "No eager o time troca colunas em silêncio, sem parar a leitura.",
      ],
      concurrency: [
        "Concurrency 3 no listener cria uma 4ª partição no rebalance?",
        "concurrency 3 cria a 4ª coluna para o quarto membro.",
      ],
      heartbeat: [
        "GC longo pode parecer morte e disparar rebalance?",
        "GC longo não parece morte; heartbeat ignora pausa da JVM.",
      ],
      "não escala": [
        "Rebalance aumenta throughput se N de partições já é o teto?",
        "Rebalance aumenta throughput mesmo com 3 partições e 3 membros.",
      ],
      pause: [
        "Durante rebalance clássico o Fetch daquelas partições continua?",
        "Durante rebalance clássico o Fetch não para; lag não sobe.",
      ],
      join: [
        "Novo membro no grupo dispara redistribuição?",
        "Novo membro entra sem rebalance; as partições ficam onde estavam.",
      ],
      "poll records": [
        "A config max-poll-records alto demais alonga o processamento e o quê mais?",
        "max-poll-records alto encurta o processamento e evita rebalance.",
      ],
    },
    retencao: {
      segmentos: [
        "O log é um arquivo eterno ou uma fila de segmentos?",
        "O log é um arquivo eterno; retenção não apaga segmentos.",
      ],
      "ms/bytes": [
        "Quem não commitou a tempo perde a linha por quê?",
        "Retenção espera todas as marcas; ninguém perde linha.",
      ],
      "não backup": [
        "Kafka com retenção padrão é arquivo morto tipo S3?",
        "Kafka é backup eterno; copie só se quiser.",
      ],
      compaction: [
        "A policy cleanup.policy=compact guarda o filme completo de cada key?",
        "Compaction devolve todos os estados intermediários da key.",
      ],
      intermediários: [
        "Depois da compaction, os estados do meio da key ainda estão lá?",
        "Compaction guarda cada versão; só compacta o disco, não o histórico.",
      ],
      tombstone: [
        "Tombstone é DELETE no Postgres?",
        "Tombstone apaga a linha no Postgres na hora.",
      ],
      CLI: [
        "Como ver a retenção efetiva do tópico?",
        "Não há comando para retenção; só o YAML da app.",
      ],
      leitura: [
        "Ler uma mensagem dispara retenção e apaga o record?",
        "Ler dispara retenção; a marca rasga a página.",
      ],
      earliest: [
        "Reset earliest vê o que a retenção já comeu?",
        "earliest recupera o começo mesmo depois da retenção.",
      ],
      infinita: [
        "Pode assumir retenção infinita em qualquer tópico?",
        "Retenção infinita é o default; não pergunte a política.",
      ],
      "segment.bytes": [
        "O cleaner atua em segmento aberto, ainda recebendo append?",
        "Cleaner apaga o segmento que ainda está recebendo escrita.",
      ],
      analogia: [
        "Segmentos velhos vão embora ou ficam para sempre?",
        "Segmentos velhos nunca vão embora; compaction é só apelido.",
      ],
      lab: [
        "O tópico de pedidos com retenção finita é backup do checkout?",
        "Trate pedidos.criados como backup do checkout.",
      ],
      "compact vs delete": [
        "Delete e compact são a mesma política de retenção?",
        "delete e compact são a mesma política com outro nome.",
      ],
      "offset buraco": [
        "Offsets baixos sumirem depois da retenção é corrupção?",
        "Offset baixo sumir é corrupção do log, não política.",
      ],
    },
    garantias: {
      "at-least": [
        "Processar e depois commitar: pode duplicar o efeito?",
        "Processar depois commitar nunca duplica; não precisa de idempotência.",
      ],
      "at-most": [
        "Commit antes de processar, em cobrança: o que pode acontecer?",
        "Commit antes de processar é o padrão certo para cobrança.",
      ],
      EOS: [
        "Exactly-once do Kafka cobre a API do cartão?",
        "Exactly-once do Kafka vale na API HTTP do cartão.",
      ],
      "acks≠efeito": [
        "Acks=all impede a segunda cobrança no cartão?",
        "acks=all no producer fecha o cartão; inbox do consumidor sobra.",
      ],
      "dois cadeados": [
        "Idempotência do producer substitui a inbox do consumidor?",
        "Idempotência do producer substitui a inbox.",
      ],
      "morte no meio": [
        "Cartão cobrou e offset não commitou: o restart faz o quê?",
        "Se o cartão já cobrou, o restart não relê o 99.",
      ],
      "auto-commit": [
        "Auto-commit anda a marca quando o trabalho termina?",
        "Auto-commit espera o cartão; por relógio não anda a marca.",
      ],
      lag: [
        "Lag de 1600 linhas prova duplicata?",
        "Lag mede duplicata, não atraso da marca.",
      ],
      inbox: [
        "O eventId na mesma transação do efeito impede a segunda cobrança?",
        "Inbox sem unique / if exists ainda impede a segunda cobrança.",
      ],
      "producer idemp": [
        "A config enable.idempotence evita duas mensagens do retry — e o cartão?",
        "enable.idempotence é a chave do cartão; inbox é opcional.",
      ],
      "frase da mesa": [
        "O que o sênior quer ouvir: exactly-once porque tem Kafka, ou outra frase?",
        "“Exactly-once porque tem Kafka” é a frase certa da mesa.",
      ],
      "lote commit": [
        "Morte no meio do lote: o lote reprocessa?",
        "Morte no meio do lote não reprocessa; inbox é inútil.",
      ],
      "YAML ack": [
        "AckMode manual: quem chama ack, e depois de quê?",
        "AckMode manual chama ack sozinho no começo do listener.",
      ],
      "log não duplicou": [
        "Se cobrou duas vezes, o primeiro culpado é o broker?",
        "O log duplicou a linha; culpe o broker primeiro.",
      ],
      "lab 7": [
        "Se o consumidor morre depois de processar e antes do ack, qual garantia aparece no restart?",
        "Morrer antes do ack mostra exactly-once: a mensagem não volta no restart.",
      ],
    },
    operacao: {
      lag: [
        "Lag só numa coluna se resolve com mais concurrency?",
        "Mais concurrency drena a coluna quente da key enviesada.",
      ],
      DLT: [
        "Poison pill sem handler faz o quê na coluna?",
        "Poison pill sem handler pula a coluna; DLT é opcional.",
      ],
      "hot key": [
        "90% vip na mesma key: o que o describe mostra?",
        "Hot key espalha o lag nas três partições por igual.",
      ],
      "rebalance loop": [
        "A config max.poll.interval estourada + lote lento gera o quê?",
        "max.poll estourado não gera loop; ignore records e intervalo.",
      ],
      configs: [
        "Operar Kafka é decorar 200 chaves de config?",
        "Decore as 200 chaves; poll interval e concurrency vs N não importam.",
      ],
      incidente: [
        "Num incidente, você começa pela config decorada ou pelo que o usuário sente?",
        "Comece pelo linger.ms; o sintoma do usuário vem depois.",
      ],
      idle: [
        "Mais consumidores que partições: as threads extras fazem o quê?",
        "Mais consumidores que partições: todos trabalham, o Kafka clona a coluna.",
      ],
      "lab YAML": [
        "Acks, AckMode e bootstrap-servers são configs do Spring Kafka?",
        "Essas configs não existem no Spring; invente outro projeto.",
      ],
      "error handler": [
        "JSON quebrado deve derrubar o listener inteiro?",
        "JSON quebrado deve derrubar o listener inteiro; ErrorHandlingDeserializer é mito.",
      ],
      métrica: [
        "Lag do consumidor mede se o cartão cobrou certo?",
        "Lag mede “cobrou certo”, não atraso.",
      ],
      rolling: [
        "Deploy rolling sem static membership evita rebalance extra?",
        "Deploy rolling sem group.instance.id não gera rebalance extra.",
      ],
      disk: [
        "Disco do líder cheio é incidente de listener?",
        "Disco do líder cheio é bug do @KafkaListener.",
      ],
      "lab 5": [
        "Concurrency 6 em 3 partições: quantos membros ficam sem assignment?",
        "concurrency 6 em 3 partições: os 6 têm assignment.",
      ],
      "console poison": [
        "JSON no console sem schema id quebra o quê?",
        "JSON no console sem schema id nunca quebra o deserializer.",
      ],
      plantão: [
        "Operar é recitar linger.ms ou diagnosticar a partir do sintoma?",
        "Operar é recitar linger.ms; o sintoma é detalhe.",
      ],
    },
    schema: {
      HTTP: [
        "Schema Registry é um tópico mágico ou um serviço HTTP?",
        "Schema Registry é só um tópico interno, sem HTTP.",
      ],
      wire: [
        "O payload no fio é JSON solto sem contrato?",
        "No fio vai JSON solto; magic byte e schema id são mito.",
      ],
      BACKWARD: [
        "BACKWARD quer dizer o quê para o consumidor novo?",
        "BACKWARD: o consumidor antigo é que precisa ler o dado novo. Consumidor novo que lê schema antigo não é o ponto.",
      ],
      FORWARD: [
        "FORWARD é o mesmo que BACKWARD com outro nome?",
        "FORWARD e BACKWARD são o mesmo nível; misture os nomes na mesa.",
      ],
      recusa: [
        "Remover campo obrigatório: o Registry aceita?",
        "Remover campo obrigatório passa no Registry; 409 é mito.",
      ],
      rename: [
        "Rename de campo obrigatório é evolução BACKWARD-safe?",
        "Rename de campo obrigatório é igual a campo opcional novo: passa BACKWARD.",
      ],
      YAML: [
        "A URL schema.registry.url precisa estar no producer e no consumer?",
        "Só o producer fala com o Registry; o consumer adivinha o JSON.",
      ],
      subject: [
        "Qual o subject padrão do value em pedidos.criados?",
        "O subject padrão é o group.id do faturamento.",
      ],
      "sem registry": [
        "Sem Schema Registry, um produtor mudar total para amount faz o quê em produção?",
        "Sem Registry o deserializer nunca explode; o contrato é verbal.",
      ],
      cupom: [
        "Um campo opcional novo no PedidoCriado quebra BACKWARD?",
        "Campo opcional novo quebra BACKWARD; remover eventId obrigatório é que passa.",
      ],
      pom: [
        "O serializer JSON Schema vem de onde no Spring?",
        "Não precisa do kafka-json-schema-serializer nem do repositório Confluent.",
      ],
      compat: [
        "Qual nível de compatibilidade o Schema Registry costuma usar no início?",
        "O Registry usa FULL_TRANSITIVE por default; BACKWARD é mito da aula.",
      ],
      "id no payload": [
        "O consumer adivinha o JSON ou pede o schema daquele id?",
        "O consumer adivinha o JSON; schema id no payload é enfeite.",
      ],
      aula: [
        "Schema Registry e outbox são a mesma peça?",
        "Schema Registry e transação de banco são a mesma aula.",
      ],
      "lab serviço": [
        "Schema Registry é um serviço HTTP separado do broker?",
        "Não há Schema Registry; o contrato vive só no broker.",
      ],
    },
    outbox: {
      buraco: [
        "Postgres e Kafka compartilham a mesma transação?",
        "save(); send(); é atômico: os dois commits nascem juntos.",
      ],
      "mesma tx": [
        "INSERT pedido + INSERT outbox: o Kafka já viu a mensagem?",
        "Na mesma transação do pedido o Kafka já recebeu o Produce.",
      ],
      poller: [
        "O poller do outbox publica na hora do INSERT ou depois?",
        "OutboxPublisher publica na mesma linha do INSERT, sem job.",
      ],
      CDC: [
        "Debezium é outra ideia ou o mesmo outbox com outro publisher?",
        "Debezium substitui a ideia de outbox; não há poller nem CDC.",
      ],
      "at-least": [
        "Outbox sozinho evita duplicata no outro lado?",
        "Outbox sozinho impede duplicata; inbox é desnecessária.",
      ],
      inbox: [
        "Se o eventId commitou e o efeito não, o replay aplica de novo?",
        "Se o ID commitou e o efeito não, o replay cobra de novo do mesmo jeito.",
      ],
      "lab stop": [
        "Kafka parado e POST de pedido via outbox: o pedido se perde?",
        "Kafka down: o POST via outbox falha e o pedido não grava.",
      ],
      tabela: [
        "O campo publicado_em na tabela outbox deve ser marcado antes do ACK do Kafka?",
        "Marque publicado_em antes do ACK, para não retriar.",
      ],
      walkthrough: [
        "A transação no banco vem antes ou depois do log Kafka?",
        "O log Kafka primeiro; o banco depois, se der tempo.",
      ],
      "não mágica": [
        "Existe 2PC barato entre seu Postgres e o cluster Kafka?",
        "2PC barato entre Postgres e Kafka é o desenho maduro; outbox é atraso.",
      ],
      classes: [
        "OutboxService e OutboxPublisher são peças do padrão outbox no Spring?",
        "Outbox não tem service nem poller; o KafkaTemplate já resolve.",
      ],
      "inbox unique": [
        "Sem unique em eventId, o replay cobra de novo?",
        "Sem unique o replay não cobra; o Kafka impede.",
      ],
      "quando não": [
        "Resposta na cara do usuário deve passar por outbox+tópico?",
        "Frete na cara do usuário: publique num tópico e espere o consumer.",
      ],
      notificação: [
        "Evento só com ID desacopla o consumidor do checkout?",
        "Evento só com ID é o máximo de desacoplamento.",
      ],
      Streams: [
        "A maior parte dos serviços precisa de Kafka Streams?",
        "O default é Kafka Streams; consumer Spring + banco é exceção.",
      ],
    },
    spring: {
      fiação: [
        "Spring Kafka muda o modelo do log?",
        "Spring Kafka muda o modelo: vira fila clássica com annotation.",
      ],
      template: [
        "KafkaTemplate sem key: a ordem do 99 permanece?",
        "KafkaTemplate sem key mantém a ordem do 99.",
      ],
      listener: [
        "Mudar o groupId do @KafkaListener faz o quê?",
        "Mudar o groupId não relê o log; o committed offset é do tópico.",
      ],
      "concurrency teto": [
        "Concurrency 6 em 3 partições: quantos ociosos?",
        "concurrency 6 em 3 partições: zero ociosos.",
      ],
      AckMode: [
        "AckMode MANUAL, BATCH ou RECORD: em qual você chama ack depois do efeito?",
        "AckMode é sempre BATCH; você não chama ack.",
      ],
      "lab 1": [
        "Lote de pedidos com e sem key: o que você vê no log da partição?",
        "Lote sem key não mostra partition= no log.",
      ],
      "lab 3": [
        "Dois consumer groups no mesmo tópico veem as mesmas mensagens?",
        "O segundo grupo não vê as mensagens que o primeiro já leu.",
      ],
      "lab 8": [
        "Com outbox e Kafka parado, o pedido vai para onde?",
        "Com Kafka parado o pedido não grava no banco.",
      ],
      "lab 9": [
        "Hot key concentrando volume: subir concurrency drena a partição?",
        "Subir concurrency drena a partição da hot key.",
      ],
      ErrorHandling: [
        "JSON quebrado deve derrubar o listener inteiro?",
        "JSON quebrado deve derrubar o listener; ErrorHandlingDeserializer atrapalha.",
      ],
      DLT: [
        "Erro permanente depois das tentativas vai para onde?",
        "Erro permanente fica na partição para sempre; DLT é mito.",
      ],
      "um repo": [
        "Spring Kafka muda o modelo do log (tópico, partição, offset)?",
        "Spring Kafka inventa outro modelo; o log do broker não vale.",
      ],
      serializer: [
        "JSON Schema + Registry basta, ou o Spring obriga Avro?",
        "O Spring obriga Avro; JSON Schema não entra.",
      ],
      "kill ack": [
        "Processo morto antes do ack: a mensagem volta no restart?",
        "Morrer antes do ack some com a mensagem para sempre.",
      ],
      README: [
        "Para operar um cluster você usa CLI (describe, consumer-groups) e config Spring?",
        "Não há CLI nem YAML: as páginas inventam os comandos.",
      ],
    },
    sintese: {
      "fluxo 99": [
        "Na síntese, o que você precisa narrar sobre o pedido 99?",
        "Na síntese basta recitar buzzword; o 99 não precisa de buraco nomeado.",
      ],
      "glossário cego": [
        "Dá para explicar partição sem abrir o HTML, se a aula colou?",
        "Se não abrir o HTML, você não pode explicar partição — e está ok.",
      ],
      eixos: [
        "ISR e inbox são a mesma coisa?",
        "ISR e inbox são a mesma coisa: escrita e efeito no mesmo cadeado.",
      ],
      simulador: [
        "O simulador de 50 questões e o cadeado de 5 da aula são o mesmo instrumento?",
        "O cadeado de 5 questões substitui o simulador de 50.",
      ],
      "lab antes": [
        "Antes de publicar/consumir, você diz o que espera ver no log?",
        "Publique e torça; dizer o esperado antes é teatro.",
      ],
      "key ordem": [
        "Sem key, o 99 tem história ordenada?",
        "Sem key o 99 tem história ordenada; N mudar não altera nada.",
      ],
      "dois grupos": [
        "Analytics atrasado impede o faturamento?",
        "Analytics atrasado trava o faturamento no mesmo tópico.",
      ],
      "outbox furo": [
        "Save+send sem outbox: os dois mundos ficam honestos?",
        "save+send sem outbox nunca mente: banco e log nascem juntos.",
      ],
      "acks frase": [
        "Acks=all + idempotence do producer fecha o cartão?",
        "acks=all e idempotence do producer já cobrem a cobrança; inbox sobra.",
      ],
      "N teto": [
        "4 consumidores e 3 partições: quantos ociosos?",
        "4 consumidores e 3 partições: zero ociosos.",
      ],
      retenção: [
        "O passado no Kafka fica para sempre, como backup?",
        "Kafka é backup; o passado não some.",
      ],
      schema: [
        "Rename de campo obrigatório costuma passar BACKWARD?",
        "Rename passa BACKWARD; campo opcional novo é que quebra o contrato.",
      ],
      Lead: [
        "Lead diz sim a tópico no lugar de GET na cara do usuário?",
        "Tópico no lugar de GET na cara do usuário é julgamento maduro.",
      ],
      offset: [
        "Inbox usa offset como eventId?",
        "Offset é eventId; inbox usa o número da linha.",
      ],
      rebalance: [
        "Lote lento sem poll: o cluster faz o quê?",
        "Lote lento sem poll não gera rebalance; o lote termina em paz.",
      ],
    },
    "tech-lead": {
      não: [
        "Lead usa Kafka para request/response na cara do usuário?",
        "Lead aprova Kafka para “qual o frete agora?” na cara do usuário.",
      ],
      operar: [
        "Quem propõe tópico assume lag, DLT, retenção e on-call?",
        "Propor tópico é só a annotation; operação é de outro time.",
      ],
      "N cedo": [
        "Aumentar partições depois é barato para a cola da key?",
        "Aumentar partições depois não quebra a cola da key.",
      ],
      "lab narrativa": [
        "O padrão de time é narrar o esperado antes de publicar ou consumir?",
        "O padrão maduro é “sobe e torce”.",
      ],
      "outbox default": [
        "Save+send sem outbox passa no review de checkout?",
        "save+send sem outbox passa no review: os dois commits nascem juntos.",
      ],
      inbox: [
        "At-least-once sem inbox em cobrança é detalhe de YAML?",
        "At-least-once sem inbox em cobrança é detalhe de YAML, não de desenho.",
      ],
      observar: [
        "“Consumer up” no dashboard substitui lag por partição?",
        "“Consumer up” basta; lag por partição é enfeite.",
      ],
      "schema dono": [
        "Cada PR pode inventar campo no schema do tópico?",
        "Cada PR inventa campo; dono do schema é opcional.",
      ],
      "menos tópicos": [
        "Tópico por destinatário (fila-do-joão) é o que o Lead quer?",
        "Lead aprova tópico por destinatário: fica mais claro.",
      ],
      "EOS hype": [
        "Lead recita exactly-once na API de pagamento?",
        "Lead vende exactly-once na API de pagamento porque tem Kafka.",
      ],
      capacidade: [
        "Time sem capacidade de operar cluster ganha Kafka “porque escala”?",
        "Sem capacidade de operar, Kafka “porque escala” ainda é a escolha certa.",
      ],
      Streams: [
        "Consumer burro + app é o default, ou Streams?",
        "Streams é o default; consumer + app é prestigiar ferramenta demais.",
      ],
      RF: [
        "RF=1 em produção é default ou decisão consciente de perda?",
        "RF=1 em produção é o default; um broker sozinho prova que basta.",
      ],
      ensinar: [
        "Lead explica o log com o pedido 99 ou com slide de buzzword?",
        "Lead começa pelo slide de buzzword; o 99 é detalhe.",
      ],
    },
  },
  arquitetura: {
    mapa: {
      cara: [
        "Arquitetura é diagrama bonito e contagem de serviços?",
        "Arquitetura é o diagrama bonito e a contagem de microsserviços.",
      ],
      régua: [
        "O que o arquiteto nomeia, além do que o sistema faz?",
        "Arquiteto só descreve o que faz; custo de reverter é do júnior.",
      ],
      caixas: [
        "Sair desenhando caixas e recitar AP sem requisitos é resposta forte?",
        "Desenhe caixas e recite AP antes de perguntar usuários e p99.",
      ],
      caminho: [
        "Você começa o desenho no Kafka ou no que o usuário sente?",
        "Comece no Kafka; o usuário vem depois das caixas.",
      ],
      lote: [
        "Lote sobe throughput e faz o quê com a latência da primeira mensagem?",
        "Lote sobe throughput e também a latência da primeira mensagem cai sempre.",
      ],
      "micro preço": [
        "Microsserviço só traz autonomia, sem preço de debug?",
        "Microsserviço aumenta autonomia e também a simplicidade de debug.",
      ],
      "cache preço": [
        "Cache só acelera, sem risco de dado velho?",
        "Cache acelera e nunca mostra dado velho.",
      ],
      default: [
        "Qual é o default até o domínio e o time pedirem outra coisa?",
        "O default é microsserviço; monolito modular é o contrário.",
      ],
      "peças vs juízo": [
        "Catálogo de peças (Kafka, Redis, dez caixas) substitui o juízo de arquitetura?",
        "Memorizar Kafka, Redis e dez caixas já é o julgamento de arquiteto.",
      ],
      números: [
        "Sem número, na mesa de arquiteto, o que você tem?",
        "Sem número ainda é arquitetura; ordem de grandeza é opcional.",
      ],
      seta: [
        "Toda seta no desenho tem preço?",
        "Seta no desenho é de graça; não nomeie o preço.",
      ],
      NFR: [
        "Quem sente a qualidade é a média ou a cauda?",
        "A média é o NFR; p99 é detalhe.",
      ],
      esqueleto: [
        "Na entrevista, stack vem antes dos requisitos?",
        "Memorize o stack primeiro; requisitos no fim dos 45 min.",
      ],
      fronteira: [
        "Gateway é a regra de checkout?",
        "Gateway é a regra de checkout; camada é carimbo de tecnologia.",
      ],
      gruda: [
        "Se a decisão reverte numa sprint, ainda era arquitetura?",
        "Se reverte numa sprint, ainda assim era arquitetura: tudo no quadro conta.",
      ],
    },
    sistema: {
      todo: [
        "Sistema é o repo ou o todo que entrega uma capacidade?",
        "Sistema é o repo; cobrar e confirmar é detalhe de pasta.",
      ],
      serviço: [
        "Pasta no Git sem fronteira de API ou tópico é serviço?",
        "Pasta no Git sem fronteira já é serviço de verdade.",
      ],
      dentro: [
        "Fora da fronteira, o contrato é lei ou sugestão?",
        "Fora da fronteira você muda à vontade; o contrato é interno.",
      ],
      analogia: [
        "Sistema, componente e contrato: o que cada um é?",
        "O consumidor precisa entrar no modelo interno; contrato é a implementação.",
      ],
      deploy: [
        "Sem fronteira de deploy e de dado, chame de serviço?",
        "Sem fronteira de deploy e de dado ainda chame de serviço.",
      ],
      versão: [
        "O contrato da API é só o JSON feliz?",
        "Contrato é só o JSON feliz; erros e idempotência não entram.",
      ],
      capacidade: [
        "Você nomeia a pasta YAML ou a capacidade de negócio?",
        "Checkout é o checkout-service.yaml, não a capacidade.",
      ],
      módulo: [
        "Módulo bem separado num deploy único ainda pode ser um sistema só?",
        "Módulo no mesmo deploy já é microsserviço; isso é obrigatório.",
      ],
      DNS: [
        "DNS + banco compartilhado é serviço independente?",
        "DNS + banco compartilhado é o melhor dos mundos.",
      ],
      "tópico contrato": [
        "Tópico Kafka também é fronteira de contrato?",
        "Só REST é fronteira; schema de tópico quebrado não é incidente.",
      ],
      dono: [
        "Fronteira sem dono ainda opera o contrato?",
        "Sem dono o contrato se opera sozinho.",
      ],
      vazamento: [
        "Expor tabela interna como API está ok?",
        "Expor tabela interna como API é fronteira fechada, desenho maduro.",
      ],
      teste: [
        "O consumidor precisa do seu fonte para o contrato ser testável?",
        "Contrato testável exige o fonte do produtor no CI do consumidor.",
      ],
      incidente: [
        "Teste verde interno salva mudança incompatível sem versão?",
        "Teste verde no produtor autoriza mudança incompatível sem versão.",
      ],
    },
    latencia: {
      latência: [
        "Latência é quantas operações por segundo?",
        "Latência é quantas operações por segundo, não o tempo de uma.",
      ],
      throughput: [
        "Throughput é o tempo de uma ida e volta?",
        "Throughput é o tempo de uma operação (ida e volta).",
      ],
      p99: [
        "O p99 é a média dos usuários?",
        "SLO se escreve na média; p99 é a cauda que não conta.",
      ],
      média: [
        "Otimizar a média mostra os usuários da cauda?",
        "Otimizar a média revela os usuários mais valiosos na cauda.",
      ],
      trade: [
        "Melhorar throughput com lote piora a latência da primeira mensagem?",
        "Lote sobe throughput e também baixa a latência da primeira mensagem.",
      ],
      caixa: [
        "Latência é o mercado inteiro ou o tempo de uma operação?",
        "Latência = o volume do sistema; throughput = o tempo de uma operação.",
      ],
      SLO: [
        "SLO é um feeling de “rápido”?",
        "SLO é um feeling; percentil e recorte de tempo são opcionais.",
      ],
      p50: [
        "O p50 serve como SLO de UX da fila do caixa lento?",
        "p50 é o SLO de UX: conta a cauda lenta.",
      ],
      cauda: [
        "Quem tem mais dados costuma estar na média ou na cauda?",
        "Quem tem mais dados está na média, não na cauda.",
      ],
      batch: [
        "A config linger.ms melhora o lote e faz o quê com a primeira mensagem?",
        "linger.ms acelera a primeira mensagem e piora o lote.",
      ],
      unidade: [
        "“Rápido” é métrica suficiente na mesa?",
        "“Rápido” é métrica; ms, p99 e writes/s são enfeite.",
      ],
      fila: [
        "Fila interna alta com throughput alto deixa a sua vez rápida?",
        "Throughput alto anula a fila: sua vez no caixa fica rápida.",
      ],
      rede: [
        "Hop extra de microsserviço some no p99?",
        "Hop extra de microsserviço não é latência; é só boa prática.",
      ],
      cache: [
        "Cache corta latência de leitura sem risco de dado velho?",
        "Cache corta latência e elimina o risco de dado velho.",
      ],
      mesa: [
        "Na entrevista, Redis vem antes do p99 alvo?",
        "Desenhe Redis antes de pedir o p99 alvo.",
      ],
    },
    disponibilidade: {
      disp: [
        "Disponibilidade é “o pod está up”?",
        "Disponibilidade é “o pod está up”, mesmo respondendo lixo.",
      ],
      noves: [
        "99% e 99,9% são quase o mesmo downtime?",
        "99% e 99,9% são o mesmo downtime na prática.",
      ],
      forte: [
        "Consistência forte: o read depois do write vê o novo valor?",
        "Consistência forte autoriza o read ver o valor velho depois do write.",
      ],
      eventual: [
        "Eventual consistency autoriza nunca convergir?",
        "Eventual autoriza nunca convergir e violar invariante para sempre.",
      ],
      mentira: [
        "Cobrar duas vezes sem compensação é “eventual”?",
        "Cobrar duas vezes sem compensação é eventual consistency madura.",
      ],
      loja: [
        "Disponibilidade e consistência são o mesmo eixo?",
        "Disponibilidade e consistência são o mesmo número.",
      ],
      etiqueta: [
        "Dado errado permanente é eventual?",
        "Dado errado permanente é eventual: não precisa corrigir.",
      ],
      "SLO disp": [
        "500 conta como resposta útil no SLO de disponibilidade?",
        "500 é útil no SLO de disponibilidade.",
      ],
      "lag réplica": [
        "Read-your-writes funciona com réplica atrasada?",
        "Réplica atrasada não quebra read-your-writes.",
      ],
      invariante: [
        "Saldo negativo permanente é “eventual”?",
        "Saldo negativo permanente é eventual; não bloqueie nem compense.",
      ],
      útil: [
        "200 com dado podre é melhor que 503?",
        "200 com dado podre é sempre melhor que 503.",
      ],
      "multi-AZ": [
        "Mais AZ só sobe disponibilidade, sem preço de consistência?",
        "Mais AZ sobe disponibilidade e simplifica consistência.",
      ],
      manutenção: [
        "Janela de manutenção não conta no downtime se o usuário não usa?",
        "Janela de manutenção não conta nos noves, mesmo com usuário de fora.",
      ],
      degradação: [
        "Fallback pode preservar disponibilidade útil?",
        "Fallback destrói disponibilidade; 500 é mais honesto sempre.",
      ],
      métrica: [
        "Uptime de VM substitui sucesso útil?",
        "Uptime de VM é o SLI certo de disponibilidade útil.",
      ],
    },
    cap: {
      gatilho: [
        "CAP vale o tempo todo, mesmo sem partição de rede?",
        "Dizer “escolhi AP” sem partição é o uso certo de CAP.",
      ],
      C: [
        "Durante partição, C é recusar ou responder talvez velho?",
        "Durante partição, C é responder talvez velho para não fechar o caixa.",
      ],
      A: [
        "Durante partição, A é fechar o caixa até a linha voltar?",
        "Durante partição, A é recusar em vez de vender com dado velho.",
      ],
      P: [
        "P é uma escolha de arquitetura solta, tipo “vamos ser P”?",
        "P é escolha de arquitetura solta, não o fato da rede ter caído.",
      ],
      PACELC: [
        "Sem partição, o dilema cotidiano ainda é CAP?",
        "Sem partição o dilema ainda é CAP; PACELC é enfeite.",
      ],
      "dia bom": [
        "No dia ensolarado, CAP é o dilema?",
        "No dia ensolarado CAP continua o dilema; PACELC não entra.",
      ],
      analogia: [
        "Partição de rede: recusar write é A ou C?",
        "Recusar write até o quorum voltar é viés A.",
      ],
      "não clima": [
        "CAP é clima (“hoje estou AP”)?",
        "CAP é clima: hoje estou AP, amanhã CP.",
      ],
      "CP exemplo": [
        "Recusar write se o quorum não responde é viés C ou A?",
        "Recusar write sem quorum é viés A.",
      ],
      "AP exemplo": [
        "Aceitar write local e reconciliar depois é viés A ou C?",
        "Aceitar write local e reconciliar depois é viés C.",
      ],
      ELC: [
        "Else Latency or Consistency é o dia a dia sem partição?",
        "ELC só vale durante a partição; no dia a dia você ignora latência vs consistência.",
      ],
      mesa: [
        "Na mesa, a letra CAP vem antes de mencionar a partição?",
        "Recite a letra antes do gatilho da partição.",
      ],
      "não 3": [
        "Durante partição você escolhe as três letras ao mesmo tempo?",
        "Durante partição você escolhe C, A e P juntos.",
      ],
      quorum: [
        "Quorum de escrita no dia bom paga o quê?",
        "Quorum de escrita no dia bom é CAP, não latência vs consistência.",
      ],
      produto: [
        "A escolha C/A é só de paper, não de produto?",
        "Estoque errado aceitável é pergunta de paper, não de produto.",
      ],
    },
    acid: {
      "um RM": [
        "ACID atravessa dois bancos sozinho?",
        "Dois bancos compartilham transação mágica ACID.",
      ],
      A: [
        "Atomicidade do Postgres atravessa o Kafka?",
        "Atomicidade atravessa Kafka: tudo ou nada nos dois.",
      ],
      I: [
        "Isolamento ACID vale entre dois serviços?",
        "Isolamento ACID é entre serviços; não confunda com o banco.",
      ],
      D: [
        "Durabilidade no seu WAL avisa o outro serviço?",
        "Commit no seu disco já avisou o outro serviço.",
      ],
      "C banco": [
        "C de ACID é consistência distribuída tipo CAP?",
        "C de ACID é consistência distribuída; a palavra não é sobrecarregada.",
      ],
      "dois caixas": [
        "Dois resource managers compartilham o mesmo rollback ACID?",
        "Dois bancos compartilham um rollback único: ACID atravessa sozinho.",
      ],
      outbox: [
        "Banco + Kafka: 2PC barato ou outbox/saga/idempotência?",
        "Banco + Kafka: 2PC barato. Outbox é atraso.",
      ],
      micro: [
        "Cada serviço com seu banco: ACID global ou local + saga?",
        "Cada serviço com seu banco restaura ACID global.",
      ],
      "shared db": [
        "Banco compartilhado entre “serviços” restaura um RM — e o quê mais?",
        "Banco compartilhado entre serviços é independência de verdade.",
      ],
      rollback: [
        "Há rollback distribuído mágico no cluster?",
        "Há rollback distribuído; saga é enfeite.",
      ],
      idempotência: [
        "Sem transação global, idempotência ainda importa?",
        "Sem transação global, eventId e upsert são opcionais.",
      ],
      mensagem: [
        "Publicar no Kafka entra no COMMIT do Postgres sozinho?",
        "O Produce no Kafka entra no COMMIT do Postgres; outbox é atraso.",
      ],
      "local first": [
        "Distribua invariantes fortes por esporte, em vários RM?",
        "Distribua invariantes fortes por esporte; um RM só é atraso.",
      ],
      entrevista: [
        "Na entrevista, “ACID” como slogan basta, sem dizer onde está o RM?",
        "Recite ACID sem o desenho; onde está o RM é detalhe.",
      ],
      compensação: [
        "Estorno desfaz a transação remota como undo mágico?",
        "Estorno é undo mágico da primeira transação remota.",
      ],
    },
    monolito: {
      "um deploy": [
        "Monolito pode ser modular, e é o default até pedir outra coisa?",
        "Monolito não pode ser modular; o default é micro no dia um.",
      ],
      micro: [
        "Microsserviço de verdade tem banco próprio e time capaz de operar?",
        "Microsserviço é pasta com DNS; banco próprio é opcional.",
      ],
      pior: [
        "Vários deploys e o mesmo banco: como se chama?",
        "Vários deploys e o mesmo banco é o melhor dos dois mundos.",
      ],
      preço: [
        "O preço do micro é só a pasta no Git?",
        "O preço do micro é só a pasta; rede e consistência não entram.",
      ],
      org: [
        "Micro é medalha técnica ou escolha organizacional?",
        "Micro é medalha técnica; time e domínio não pedem.",
      ],
      "features 3 repos": [
        "Toda feature muda três repos juntos: você decompôs de verdade?",
        "Toda feature em três repos prova que a decomposição funcionou.",
      ],
      modular: [
        "Módulos no monolito dão fronteira de código sem o preço da rede?",
        "Módulos no monolito já cobram o preço da rede.",
      ],
      quando: [
        "Time pequeno e domínio incerto: hora de micro?",
        "Time pequeno, domínio incerto e operação frágil: hora de micro.",
      ],
      strangler: [
        "Strangler Fig reescreve tudo numa sprint?",
        "Strangler Fig é reescrever tudo numa sprint.",
      ],
      bounded: [
        "O corte segue o organograma invertido ou o bounded context?",
        "O corte segue o organograma invertido; bounded context é religião.",
      ],
      DNS: [
        "DNS na frente do mesmo banco inventou um serviço?",
        "DNS na frente do mesmo banco inventou um serviço de verdade.",
      ],
      debug: [
        "Debug de micro é um processo, como o monolito?",
        "Debug de micro é um processo; trace é opcional.",
      ],
      default: [
        "O default honesto é monolito modular?",
        "O default honesto é micro; inverta sem motivo.",
      ],
      geladeira: [
        "Schema compartilhado entre deploys casa os times?",
        "Schema compartilhado não casa os times; é independência.",
      ],
      lead: [
        "Lead aprova micro cedo quando o custo de reverter explode?",
        "Lead aprova micro cedo justamente quando reverter explode.",
      ],
    },
    sincrono: {
      ligar: [
        "Síncrono acopla disponibilidade com o outro lado?",
        "Síncrono não acopla disponibilidade: se o outro caiu, você segue.",
      ],
      recado: [
        "Assíncrono entrega a resposta na mesma chamada?",
        "Assíncrono entrega a resposta na mesma chamada, sem espera.",
      ],
      regra: [
        "Consulta que o usuário espera agora vai para tópico?",
        "Consulta que o usuário espera agora: publique num tópico.",
      ],
      REST: [
        "Kafka substitui REST para “qual o frete agora?”",
        "Use o log Kafka para “qual o frete agora?”.",
      ],
      pico: [
        "Fila/log absorve pico e você pode mentir a latência na UI?",
        "Fila absorve pico; a UI pode mentir que a resposta já chegou.",
      ],
      rastreio: [
        "Assíncrono deixa o rastreio mais fácil, sem TraceId?",
        "Assíncrono deixa o rastreio mais fácil; TraceId no evento é enfeite.",
      ],
      eventual: [
        "Assíncrono implica consistência eventual no outro lado?",
        "Assíncrono implica consistência forte no outro lado, na hora.",
      ],
      timeout: [
        "Chamada síncrona pode viver sem timeout?",
        "Chamada síncrona sem timeout está ok; a thread se solta sozinha.",
      ],
      híbrido: [
        "Checkout e e-mail precisam do mesmo estilo, tudo síncrono ou tudo async?",
        "Tem que ser tudo ou nada: checkout e e-mail no mesmo estilo.",
      ],
      "RPC no log": [
        "Usar tópico como RPC é ferramenta certa?",
        "Tópico como RPC é ferramenta certa; Lead diz sim.",
      ],
      disponibilidade: [
        "Cadeia síncrona de 5 serviços: a disponibilidade sobe ou cai?",
        "Cadeia síncrona de 5 serviços sobe a disponibilidade.",
      ],
      UX: [
        "Se a tela precisa da resposta agora, tópico resolve?",
        "Se a tela precisa da resposta agora, prometa tópico.",
      ],
      idempotência: [
        "Retry síncrono em POST de pagamento sem chave: o que acontece?",
        "Retry síncrono em POST de pagamento sem chave nunca duplica.",
      ],
      espera: [
        "Fila absorveu o pico: a UI pode fingir que a resposta já chegou?",
        "Fila absorve pico; a UI pode mostrar a resposta como se já tivesse chegado.",
      ],
      discovery: [
        "Service discovery substitui timeout?",
        "Service discovery substitui timeout: a rede não falha se o DNS resolve.",
      ],
    },
    cache: {
      "post-it": [
        "Cache é fonte da verdade se ninguém invalidou?",
        "Cache é fonte da verdade; se ninguém invalidou, não mente.",
      ],
      aside: [
        "No cache-aside, quem preenche o cache no miss?",
        "No cache-aside o banco preenche o cache sozinho, sem a app.",
      ],
      through: [
        "Write-through é mais rápido que write-behind, com mais risco?",
        "Write-through é o caminho mais rápido e mais arriscado: grava só no cache e persiste depois.",
      ],
      behind: [
        "Write-behind pode perder escrita?",
        "Write-behind nunca perde escrita.",
      ],
      stampede: [
        "TTL estoura e mil vão ao banco: como se chama?",
        "TTL estoura e mil vão ao banco: isso é hit ratio alto, vitória.",
      ],
      "hot key": [
        "Uma chave quente derrete um shard de cache?",
        "Uma chave quente espalha sozinha; shard de cache não derrete.",
      ],
      invalidação: [
        "O problema difícil do cache é o get ou invalidar certo?",
        "O get é o problema difícil; invalidar é o fácil. TTL não é palpite.",
      ],
      "custo velho": [
        "A pergunta madura é o custo de mostrar 2s atrasado?",
        "A pergunta madura é o hit ratio; custo de 2s atrasado não importa.",
      ],
      camadas: [
        "CDN, Redis da app e cache local são a mesma camada?",
        "CDN = Redis da app = cache local.",
      ],
      hit: [
        "Hit ratio alto com dado errado é vitória?",
        "Hit ratio alto com dado errado ainda é vitória de cache.",
      ],
      cold: [
        "Cold start depois de flush: a latência explode?",
        "Cold start depois de flush não explode latência; planeje o contrário.",
      ],
      chave: [
        "Chave sem user e sem versão mistura mundos?",
        "Chave sem user e sem versão está ok; contrato da chave é enfeite.",
      ],
      "HA cache": [
        "Cache é fonte da verdade se o Redis cair?",
        "Cache é fonte da verdade; se cair, o banco não precisa aguentar.",
      ],
      "aside miss": [
        "Miss stampede se resolve só com TTL maior?",
        "Miss stampede se resolve só com TTL maior; lock/singleflight é mito.",
      ],
      "não saldo": [
        "CDN é fonte da verdade para saldo e assento?",
        "CDN é fonte da verdade para saldo e reserva de assento.",
      ],
    },
    replicacao: {
      foto: [
        "Replicação fatia o dataset ou copia as mesmas linhas?",
        "Replicação é fatiar o dataset (sharding).",
      ],
      fatia: [
        "Sharding resolve leitura com lag, ou escrita com risco de hot shard?",
        "Sharding é cópia das mesmas linhas: lê mais, um nó pode queimar.",
      ],
      leitura: [
        "Replicação escala escrita linearmente no primary?",
        "Replicação escala escrita linearmente; replication lag não existe.",
      ],
      escrita: [
        "A chave do shard é decisão difícil?",
        "A chave do shard é detalhe; cross-shard é barato.",
      ],
      lag: [
        "Read-your-writes quebra com réplica atrasada?",
        "Réplica atrasada não quebra read-your-writes.",
      ],
      Ana: [
        "Hot shard: o que acontece quando uma chave absorve o volume?",
        "A chave quente se espalha sozinha; aquele pedaço do shard não sente nada.",
      ],
      "não inverso": [
        "Replicação escala escrita linearmente?",
        "Replicação escala escrita linearmente; primary não é gargalo.",
      ],
      failover: [
        "Promover réplica é mágica sem RPO/RTO?",
        "Promover réplica é mágica: nunca perde writes não replicados.",
      ],
      cross: [
        "Query cross-shard é barata no desenho?",
        "Query cross-shard é barata; a chave não precisa atender o acesso.",
      ],
      CQRS: [
        "Réplica de leitura é CQRS completo?",
        "Réplica de leitura é CQRS completo, só com outro nome.",
      ],
      hash: [
        "Consistent hashing elimina hot key de celebridade?",
        "Consistent hashing elimina hot key de celebridade sozinha.",
      ],
      "multi-região": [
        "Réplica cross-região não tem conflito nem lag?",
        "Réplica cross-região não tem conflito, lag nem PACELC.",
      ],
      escolha: [
        "Antes de desenhar, pergunte se o gargalo é leitura ou escrita?",
        "Desenhe réplica e shard juntos, sem perguntar o gargalo.",
      ],
      "único primary": [
        "Com um primary + N réplicas, a escrita passa nas réplicas?",
        "A escrita também passa nas réplicas de leitura; o primary não é gargalo.",
      ],
      "rebalance shard": [
        "Reshard é barato; a chave pode ser chute?",
        "Reshard é barato; a chave não é decisão de arquitetura.",
      ],
    },
    indice: {
      busca: [
        "Índice acelera aquela busca e faz o quê com a escrita?",
        "Índice acelera busca e também a escrita.",
      ],
      espaço: [
        "Índice não usado é só custo de espaço e escrita?",
        "Índice não usado não custa espaço; não drope o ocioso.",
      ],
      composto: [
        "Índice composto segue a ordem das colunas da query?",
        "Índice composto adivinha a ordem; a query não importa.",
      ],
      write: [
        "Cada INSERT atualiza os índices da tabela?",
        "INSERT não atualiza índices; “só mais um índice” é de graça.",
      ],
      seletividade: [
        "Índice em boolean de 2 valores costuma ajudar?",
        "Índice em boolean de 2 valores costuma ser ótimo.",
      ],
      covering: [
        "Covering index evita lookup na heap se as colunas cabem?",
        "Covering index nunca evita lookup na heap.",
      ],
      "não milagre": [
        "Índice conserta N+1 e relatório pesado sozinho?",
        "Índice conserta N+1 e full scan de relatório pesado sozinho.",
      ],
      EXPLAIN: [
        "Chute de índice substitui olhar o plano?",
        "Chute de índice é melhor que EXPLAIN.",
      ],
      unique: [
        "Unique é só índice, sem invariante?",
        "Unique não é invariante; inbox de eventId não vive disso.",
      ],
      manutenção: [
        "Rebuild/reindex precisa de plano?",
        "Rebuild/reindex não é operação; só CREATE e esqueça.",
      ],
      leftmost: [
        "Índice a,b,c serve query só em c, em B-tree clássico?",
        "Índice a,b,c serve query só em c no B-tree clássico.",
      ],
      ORM: [
        "ORM sem índice na FK está ok em produção?",
        "ORM sem índice na FK nunca vira full scan.",
      ],
      SLO: [
        "Índice demais pode subir o p99 de write?",
        "Índice demais não sobe p99 de write; só baixa o de read.",
      ],
      parcial: [
        "Índice parcial (WHERE status=open) pode ser menor e mais honesto?",
        "Índice parcial é mentira; sempre indexe a tabela inteira.",
      ],
      "aula escala": [
        "Na aula de escala o índice entra isolado da carga?",
        "Índice na aula de escala fica isolado de replicação e cache.",
      ],
    },
    escala: {
      vocabulário: [
        "Esta aula é para dez caixas vazias ou para colar p99, índice e réplica no desenho?",
        "Esta aula é para dez caixas vazias; vocabulário cola sozinho.",
      ],
      p99: [
        "SLO de escala se escreve na média?",
        "SLO de escala se escreve na média; a cauda não conta.",
      ],
      cresce: [
        "Stateless + LB escala o banco do mesmo jeito que a app?",
        "Stateless + LB escala o banco; réplica e shard são da app.",
      ],
      cache: [
        "Na escala, cache tem acerto e mentira?",
        "Na escala o cache não mente; não nomeie o stale.",
      ],
      índice: [
        "Antes de shard, vale índice e query?",
        "Shard antes de índice e query: shard é barato.",
      ],
      QPS: [
        "Estime QPS e envelope, ou fuja de ordem de grandeza?",
        "Não estime QPS; ordem de grandeza é precisão falsa.",
      ],
      HA: [
        "HA é ter Redis no desenho?",
        "HA é “tem Redis”; falha nomeada é enfeite.",
      ],
      "SQL NoSQL": [
        "A escolha de storage segue moda ou o padrão de acesso?",
        "A peça de storage segue moda, não o acesso.",
      ],
      "read write": [
        "Split de leitura é o mesmo que CQRS?",
        "Split de leitura é CQRS; os nomes são sinônimos.",
      ],
      LB: [
        "Sessão grudenta no pod é o jeito certo de escalar HPA?",
        "Sticky session no pod é o jeito certo de escalar HPA.",
      ],
      capacidade: [
        "Capacidade é o número de pods?",
        "Capacidade é o número de pods; gargalo nomeado é enfeite.",
      ],
      "fim aula": [
        "No fim você explica por que réplica não escala write?",
        "No fim recite Redis; réplica escala write e cache não tem preço.",
      ],
      "multi-AZ": [
        "Multi-AZ no desenho de escala tem custo de consistência?",
        "Multi-AZ no desenho de escala não tem custo de consistência.",
      ],
      hot: [
        "Hot key/shard some quando “já foi para a nuvem”?",
        "Hot key some na nuvem; não diagnostique.",
      ],
      "não Kafka default": [
        "Ponha Kafka “porque escala”, mesmo sem requisito de log?",
        "Ponha Kafka “porque escala”, sem requisito de log.",
      ],
    },
    resiliencia: {
      ordem: [
        "A ordem timeout → retry+jitter → breaker → bulkhead → fallback importa?",
        "A ordem das peças de resiliência não importa.",
      ],
      timeout: [
        "Sem timeout, a thread se solta sozinha?",
        "Sem timeout a thread se solta; despertador é o último da lista.",
      ],
      retry: [
        "Retry em POST de pagamento não-idempotente está ok?",
        "Retry em qualquer erro, mesmo permanente, sem idempotência, é maduro.",
      ],
      jitter: [
        "Backoff sem jitter sincroniza a manada?",
        "Backoff sem jitter evita a manada; não aleatorize.",
      ],
      breaker: [
        "Breaker continua martelando o morto?",
        "Breaker continua martelando o morto; não fecha o circuito.",
      ],
      bulkhead: [
        "Um telefone pode ocupar todas as linhas do pool?",
        "Um telefone ocupa todas as linhas; pool isolado é mito.",
      ],
      fallback: [
        "Fallback vem primeiro, antes do timeout?",
        "Fallback vem primeiro; timeout é por último.",
      ],
      "retry sem limite": [
        "Retry sem limite e sem breaker é resiliência madura?",
        "Retry infinito sem breaker é resiliência madura.",
      ],
      gateway: [
        "API gateway é a regra de checkout?",
        "Gateway/BFF é a regra de checkout, não só auth e rate limit.",
      ],
      "API evolução": [
        "Evoluir API pode quebrar consumidor à vontade?",
        "Evoluir API pode quebrar consumidor; versão é enfeite.",
      ],
      "timeout cadeia": [
        "Timeout do caller pode ser maior que a soma dos callees?",
        "Timeout do caller maior que a soma dos callees está ok.",
      ],
      "429": [
        "Rate limit só no pod local basta atrás de NAT de operadora?",
        "Rate limit só no pod local basta atrás de NAT de operadora.",
      ],
      "idempotente GET": [
        "POST de pagamento retry igual ao GET?",
        "POST de pagamento retry igual ao GET; HTTP não muda nada.",
      ],
      "circuit half": [
        "Half-open abre todo o tráfego de uma vez?",
        "Half-open abre todo o tráfego de uma vez para testar o morto.",
      ],
      sincronia: [
        "Discovery substitui timeout na resiliência síncrona?",
        "Discovery substitui timeout na resiliência síncrona.",
      ],
    },
    decomposicao: {
      "quando não": [
        "Microsserviços no começo incerto com time pequeno?",
        "Use microsserviços no começo incerto com time pequeno.",
      ],
      bounded: [
        "Corte por entidade de banco (UserService para tudo)?",
        "Corte por entidade de banco; UserService para tudo é o bounded context.",
      ],
      "shared db": [
        "Banco compartilhado entre deploys mantém a independência?",
        "Banco compartilhado entre deploys mantém a independência.",
      ],
      strangler: [
        "Strangler Fig é big bang numa sprint?",
        "Strangler Fig é big bang; fachada é atraso.",
      ],
      release: [
        "Toda feature em três repos prova decomposição boa?",
        "Toda feature em três repos prova que a decomposição funcionou.",
      ],
      "dado dono": [
        "Vários times escrevem o mesmo dado direto no banco?",
        "Vários times escrevem o mesmo dado; um dono é burocracia.",
      ],
      "modular first": [
        "Extraia micro no dia um, antes do custo de coordenação pedir?",
        "Extraia no dia um; monolito modular primeiro é medo.",
      ],
      rede: [
        "Cada corte é uma falha parcial nova?",
        "Cada corte não é falha parcial nova; não nomeie o preço.",
      ],
      time: [
        "O corte ignora o time que consegue operar?",
        "Conway é mito; o corte ignora o time.",
      ],
      ACL: [
        "Anti-corruption layer na borda do legado ajuda o strangler?",
        "ACL na borda do legado atrapalha o strangler.",
      ],
      "evento vs API": [
        "Substitua consulta síncrona por tópico na decomposição?",
        "Substitua consulta síncrona por tópico na decomposição.",
      ],
      "teste contrato": [
        "Sem contrato testado entre serviços, o CI é honesto?",
        "Sem contrato testado o CI ainda é honesto.",
      ],
      transação: [
        "Depois do corte, a transação única permanece?",
        "Depois do corte a transação única permanece; saga/outbox não entram.",
      ],
      tamanho: [
        "Serviço do tamanho de um método é micro maduro?",
        "Serviço do tamanho de um método é micro maduro.",
      ],
      lead: [
        "Lead aprova extração cosmética que só adiciona YAML?",
        "Lead aprova extração cosmética: YAML novo já conta como serviço.",
      ],
    },
    dados: {
      saga: [
        "Saga é rollback distribuído mágico?",
        "Saga é rollback distribuído: desfaz o mundo remoto sem fato novo.",
      ],
      outbox: [
        "Outbox publica o evento antes do commit do dado?",
        "Outbox publica antes do commit; o buraco save+send não existe.",
      ],
      CQRS: [
        "CQRS é o default de todo CRUD para já nascer escalável?",
        "CQRS é o default de todo CRUD para “já nascer escalável”.",
      ],
      ES: [
        "Event sourcing é o default de um CRUD?",
        "Comece por event sourcing num CRUD; é barato de operar.",
      ],
      "idempotência pagto": [
        "API de pagamento vive sem Idempotency-Key e inbox?",
        "API de pagamento vive sem Idempotency-Key; at-least-once não chega.",
      ],
      ferramenta: [
        "O nome do padrão prova que o problema era prego?",
        "Se o nome é saga, o problema era prego: a ferramenta escolhe o problema.",
      ],
      orquestração: [
        "Maestro na saga não tem ponto único?",
        "Maestro na saga não tem ponto único nem fica mais visível.",
      ],
      coreografia: [
        "Eventos entre serviços deixam o filme mais fácil de ver?",
        "Coreografia deixa o filme mais fácil de ver que o maestro.",
      ],
      compensação: [
        "Estorno desfaz o mundo, sem fato novo?",
        "Estorno desfaz o mundo; não cria fato novo.",
      ],
      "leitura derivada": [
        "Projeção CQRS está sempre na hora, sem SLO de atraso?",
        "Projeção CQRS está sempre na hora; SLO de leitura é mito.",
      ],
      "não ES default": [
        "CRUD começa em event sourcing?",
        "Comece o CRUD em event sourcing: é o default barato.",
      ],
      CDC: [
        "CDC não precisa operar o conector?",
        "CDC não opera conector; Debezium é mágica.",
      ],
      invariante: [
        "Invariante de dinheiro espera “eventual” eterno?",
        "Invariante de dinheiro pode esperar “eventual” para sempre.",
      ],
      aula: [
        "Banco e broker se casam sozinhos nesta aula?",
        "Banco e broker se casam sozinhos; não ligue com Kafka.",
      ],
      "inbox tx": [
        "ID e efeito podem commitar em transações locais diferentes?",
        "ID e efeito em transações diferentes está ok; você não esquece de aplicar.",
      ],
    },
    observabilidade: {
      três: [
        "Métrica, trace e log respondem a quê, nesta ordem?",
        "Log diz que está ruim, métrica diz onde, trace diz por quê.",
      ],
      "SLI SLO": [
        "SLI, SLO e error budget são sinônimos?",
        "SLI, SLO e error budget são sinônimos.",
      ],
      RED: [
        "RED é Rate, Errors, Duration?",
        "RED é Redis, Elasticsearch, Datadog.",
      ],
      traceId: [
        "Log sem traceId cola no GPS do request?",
        "Log sem traceId ainda cola no GPS; contexto é enfeite.",
      ],
      alerta: [
        "Alerta que ninguém sabe o que fazer às 3h ainda é acionável?",
        "Alerta que ninguém sabe o que fazer às 3h é acionável.",
      ],
      "média grafana": [
        "A média no Grafana é o que o usuário sente?",
        "A média no Grafana é o que o usuário sente.",
      ],
      budget: [
        "Error budget gasta: freeze de feature é conversa de produto?",
        "Error budget gasta e ninguém congela feature; só Grafana.",
      ],
      cardinalidade: [
        "Label de user_id em métrica é barato?",
        "Label de user_id em métrica é barato; cardinalidade não explode.",
      ],
      sampling: [
        "Trace sampleado pega sozinho todo erro raro?",
        "Trace sampleado pega sozinho todo erro raro; log/métrica sobram.",
      ],
      "não log só": [
        "Só log opera sistema distribuído?",
        "Só log opera sistema distribuído; taxa e cauda sobram.",
      ],
      sintético: [
        "Probe sintético pega o p99 do cliente real sozinho?",
        "Probe sintético pega o p99 do cliente real sozinho.",
      ],
      RUM: [
        "UX real e SLI de backend são a mesma fatia?",
        "UX real e SLI de backend medem a mesma fatia; RUM é enfeite.",
      ],
      runbook: [
        "Alerta sem runbook é pager justo?",
        "Alerta sem runbook é pager justo; acionável é enfeite.",
      ],
      "lag kafka": [
        "“Consumer up” substitui lag por partição como SLI?",
        "“Consumer up” é o SLI de consumidor; lag por partição sobra.",
      ],
      glossário: [
        "Painel do carro vs GPS: métrica vs trace?",
        "O painel (métrica) diz o caminho; o GPS (trace) diz a velocidade. São a mesma coisa.",
      ],
    },
    "system-design": {
      "45min": [
        "Os 45 min começam nas caixas ou nos requisitos?",
        "Os 45 min começam nas caixas; requisitos no fim, se der tempo.",
      ],
      "voz alta": [
        "Silêncio pontua na entrevista de system design?",
        "Silêncio pontua; falar em voz alta é opcional.",
      ],
      requisito: [
        "Caixas vêm antes de usuários, p99 e consistência?",
        "Comece nas caixas; usuários, p99 e consistência vêm no fim, se der tempo.",
      ],
      estimativa: [
        "QPS de ordem de grandeza é pior que precisão falsa de 3 casas?",
        "Precisão falsa de 3 casas é melhor que ordem de grandeza.",
      ],
      feed: [
        "Fan-out on write vs on read: nomeie o preço ou chute um?",
        "Chute fan-out on write sempre; preço não se nomeia.",
      ],
      assento: [
        "Cache é fonte da verdade para não oversell o assento?",
        "Cache é fonte da verdade: se o Redis disse que há assento, pode vender.",
      ],
      pagamento: [
        "Pagamento se resolve com EOS de marketing, sem idempotência?",
        "Pagamento se resolve com EOS de marketing, sem outbox.",
      ],
      evoluir: [
        "No fim, mostre o que quebraria com 10x?",
        "No fim não mostre 10x; julgamento é as caixas do começo.",
      ],
      "não stack first": [
        "Comece em Kafka/Redis, depois no usuário?",
        "Comece em Kafka/Redis; o usuário vem nas caixas.",
      ],
      trade: [
        "Cada componente: o que ganha e o que perde?",
        "Não diga o que perde; só o que ganha.",
      ],
      API: [
        "Contrato da API fica para o fim do desenho?",
        "Contrato da API fica para o fim; paginação e auth sobram.",
      ],
      falha: [
        "Reserve minutos para timeout e degradação?",
        "Não reserve minutos para falha; os 45 min são só o caminho feliz.",
      ],
      "um sistema": [
        "System design na mesa é calendário de semanas?",
        "System design na mesa é calendário de semanas, não um sistema em 45 min.",
      ],
      números: [
        "Errar 100k vs 100 QPS é pior que errar 20%?",
        "Errar 20% é pior que errar 100k vs 100 QPS.",
      ],
      fechar: [
        "Feche com riscos e o que mediria amanhã?",
        "Feche nas caixas; SLO e alerta não entram.",
      ],
    },
    staff: {
      "além glossário": [
        "Staff para no card CAP, sem células nem blast radius?",
        "Staff para no card CAP; células e blast radius são júnior.",
      ],
      células: [
        "Uma célula isola blast radius?",
        "Célula não isola blast radius; falha de uma leva o planeta.",
      ],
      quorum: [
        "W+R > N é latência vs consistência no dia bom?",
        "W+R > N é CAP durante partição, não PACELC no dia bom.",
      ],
      budget: [
        "Error budget é só Grafana, não conversa de produto?",
        "Error budget é dashboard: produto decide feature sem olhar o budget.",
      ],
      capacidade: [
        "Capacidade é “sobe HPA”, sem envelope nem headroom?",
        "Capacidade é só HPA: envelope e headroom não entram no desenho.",
      ],
      "multi-região": [
        "Multi-região é checkbox, sem conflito nem RPO?",
        "Multi-região é checkbox, sem conflito, lag nem RPO.",
      ],
      blast: [
        "Blast radius: o que um deploy ruim pode quebrar?",
        "Blast radius não importa; feature flag e célula são enfeite.",
      ],
      "consistência real": [
        "Staff fala só CAP, sem lost update nem monotonic reads?",
        "Staff fala só CAP; lost update e monotonic reads são demais.",
      ],
      "feed staff": [
        "Feed em escala cabe num fan-out só, sem híbrido nem backfill?",
        "Feed em escala cabe num fan-out só; híbrido e backfill sobram.",
      ],
      noves: [
        "Três noves vs quatro: o custo é linear?",
        "Três noves vs quatro: o custo é linear, sempre vale a pena.",
      ],
      "rate limit": [
        "Rate limit no núcleo, não nas bordas?",
        "Rate limit protege melhor o núcleo do que as bordas.",
      ],
      LSM: [
        "LSM e B-tree têm o mesmo trade de write/read?",
        "LSM e B-tree têm o mesmo trade; não importa no storage.",
      ],
      "não recitar": [
        "Recitar PACELC sem o desenho do produto é Staff?",
        "Decorar o teorema já basta para o nível Staff.",
      ],
      oncall: [
        "Quem desenha não pergunta o pager?",
        "Quem desenha não pergunta o pager: Staff não opera.",
      ],
      clássica: [
        "Os temas anteriores já cobrem a entrevista clássica?",
        "Staff substitui a entrevista clássica; os temas anteriores sobram.",
      ],
    },
    catalogo: {
      "uma peça": [
        "Engula o catálogo inteiro de uma vez?",
        "Estude o catálogo inteiro de uma vez: API, cache, storage e pipeline juntos.",
      ],
      paginação: [
        "Offset pagination é o certo no fim de um feed?",
        "Offset pagination em feed evita duplicata quando chega item novo.",
      ],
      "authn authz": [
        "Authn e authz são a mesma coisa, e o gateway é a regra toda?",
        "Authn e authz são a mesma peça; o gateway já é a regra de negócio toda.",
      ],
      "LB vs gateway": [
        "Load balancer e API gateway são o mesmo hop de política?",
        "Load balancer e API gateway são o mesmo hop: política, auth e rate limit no mesmo lugar.",
      ],
      dataflow: [
        "Escolha a ferramenta antes do fluxo push vs pull?",
        "Escolha Spark/Flink/Kafka antes de decidir se o fluxo é push ou pull.",
      ],
      "two-stage": [
        "Redis como fila não tem limites?",
        "Redis como fila não tem limites; two-stage é mito.",
      ],
      storage: [
        "A peça de storage segue moda ou o acesso?",
        "A peça de storage segue moda, não o acesso.",
      ],
      "B-tree LSM": [
        "B-tree é amigo de write pesado; LSM de read pontual?",
        "B-tree é o storage de write pesado; LSM é o de read pontual. Inverta os trades.",
      ],
      particionar: [
        "Consistent hashing e IDs k-sortable não entram no catálogo de particionar?",
        "Consistent hashing elimina hot key; UUID v4 é k-sortable e não fragmenta B-tree.",
      ],
      pipeline: [
        "Batch vs stream, watermark e backfill são nível júnior?",
        "Lambda e Kappa são só nomes de nuvem, sem trade-off de pipeline.",
      ],
      "rate limit": [
        "Rate limit no núcleo, com qualquer algoritmo?",
        "Rate limit no núcleo; token bucket vs sliding window não importa, nem a borda.",
      ],
      comentários: [
        "Walkthrough de comentários ignora fan-out, cache e ordenação?",
        "O walkthrough de comentários pode ignorar fan-out, cache e ordenação.",
      ],
      "cache camadas": [
        "Invalidação é a mesma em CDN, edge, Redis e local?",
        "Invalidação é a mesma receita em CDN, edge, Redis e cache local.",
      ],
      "HA stacks": [
        "HA stack sem falha nomeada ainda é NFR?",
        "HA stack sem falha nomeada ainda conta como NFR de verdade.",
      ],
      "recusar peça": [
        "O catálogo serve para recusar a peça errada ou para colecionar logos?",
        "Colecionar Redis, Kafka e Spark no desenho já é o catálogo usado certo.",
      ],
    },
    referencia: {
      ADR: [
        "ADR registra o que foi recusado, ou só a decisão feliz?",
        "ADR registra só a decisão feliz; o recusado não entra.",
      ],
      "recusar micro": [
        "Recusar microsserviço cedo é medo, não arquitetura?",
        "Recusar microsserviço cedo é medo; arquitetura é sempre decompor.",
      ],
      RFC: [
        "Review de RFC olha só as boxes?",
        "Review de RFC olha só as boxes; falha, operação e custo sobram.",
      ],
      não: [
        "Arquiteto diz não sem alternativa nem preço?",
        "Arquiteto diz não sem alternativa nem preço: é muro.",
      ],
      produto: [
        "Consistência é só pergunta de paper?",
        "Consistência é só pergunta de paper; estoque errado não é produto.",
      ],
      operar: [
        "Quem desenha não pergunta quem acorda?",
        "Quem desenha não pergunta quem acorda; sem pager o desenho ainda vale.",
      ],
      menos: [
        "O melhor desenho tem mais logos?",
        "O melhor desenho tem mais logos, não menos peças.",
      ],
      evoluir: [
        "Diga em voz alta o que faria diferente com mais tempo?",
        "Não diga o que faria diferente; a régua da mesa é o desenho congelado.",
      ],
      medir: [
        "Aposta sem SLI ainda é arquitetura?",
        "Aposta sem SLI ainda é arquitetura; medida é opinião.",
      ],
      fronteira: [
        "Shared db é evolução da fronteira de dado?",
        "Shared db é evolução da fronteira de dado, não regressão.",
      ],
      "saga honesta": [
        "Saga sem compensação desenhada ainda é saga?",
        "Saga sem compensação desenhada ainda é saga: o nome basta.",
      ],
      "cache verdade": [
        "Arquiteto aceita cache como fonte da verdade de saldo?",
        "Arquiteto aceita cache como fonte da verdade de saldo e reserva.",
      ],
      "Kafka quando": [
        "Kafka para GET de frete está no julgamento certo?",
        "Kafka para GET de frete na cara do usuário é o julgamento certo.",
      ],
      documentar: [
        "Wiki eterno sem dono ganha de ADR curto?",
        "Wiki eterno sem dono ganha de ADR curto com contexto e recusa.",
      ],
      ensinar: [
        "Arquiteto ensina o stack da moda, não o mapa usuário → SLO → falha?",
        "Arquiteto ensina o stack da moda; o mapa usuário → SLO → falha é júnior.",
      ],
    },
  },
};
