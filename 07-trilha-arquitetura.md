# Trilha 7 — Arquitetura e Microsserviços

**Duração:** 8 semanas · 1 sessão longa por semana (sábado) + leitura.
Pré-requisito ideal: trilhas de Kafka e Kubernetes já em andamento.

> Entrevista de arquitetura não avalia a resposta "certa" — avalia se ela **pergunta antes de assumir**, **justifica escolhas** e **admite trade-offs**. A frase que fecha vaga sênior é *"escolhi X, e o custo disso é Y"*.
>
> Sem o vocabulário do zero (latência, consistência, serviço, contrato), CAP e Saga viram palavras de podcast.

---

## Mapa mental

Arquitetura é o conjunto de decisões **caras de reverter**: onde está o dado, quem fala com quem, o que acontece se um pedaço cair. Não é diagrama bonito nem “quantos microsserviços”.

```
usuário
  → latência / SLO (o que ele sente)
  → API / gateway
  → serviços (fronteiras de negócio)
  → dados (dono do dado) + cache + filas
  → falha: timeout, retry, breaker, degradação
```

Toda escolha puxa um custo. Lote no Kafka ↑ throughput ↓ latência. Microsserviço ↑ autonomia de time ↓ simplicidade de debug. Cache ↑ velocidade ↓ risco de dado velho. A resposta madura **nomeia os dois lados**.

---

## Glossário do zero

### Sistema, componente e fronteira

**Sistema.** O todo que entrega uma capacidade (ex.: “cobrar e confirmar pedido”).

**Componente / serviço.** Um processo deployável com **fronteira**: API ou tópico que outros usam. Dentro, você pode mudar à vontade; do lado de fora, o contrato é lei.

**Contrato.** O que o consumidor pode assumir: campos, semântica, erros, idempotência, versão. Quebrar contrato é incidente, mesmo com código “certo” no produtor.

### Latência, throughput e percentil

**Latência.** Tempo de *uma* operação (ida e volta).

**Throughput.** Quantas operações por unidade de tempo.

**Percentil (p50, p95, p99).** p99 = 99% das requests abaixo daquele valor; a cauda é o 1% restante. Média esconde a cauda. SLO se escreve em percentil + recorte de tempo.

**Erro comum.** Otimizar média e ignorar o usuário lento (em geral o que tem mais dados).

### Disponibilidade e consistência

**Disponibilidade.** Fração do tempo em que o sistema responde de forma útil. “Dois noves” (99%) ≠ “três noves” (99,9%) — a diferença é ordem de grandeza de downtime.

**Consistência.** Leituras veem um estado que as regras de negócio aceitam. **Forte:** depois do write, qualquer read vê o novo valor (num modelo simples). **Eventual:** réplicas convergem; por um tempo podem divergir.

**Inconsistente de verdade.** Não converge, ou viola invariante (cobrou duas vezes e os dois “commits” ficaram). Eventual **não** é desculpa para invariante quebrada — é atraso até convergir.

### CAP e PACELC

**Partição de rede.** Pedacinhos do sistema não se falam.

**CAP.** *Durante partição*, escolha: consistência (recusar request) ou disponibilidade (responder talvez com dado velho). Não é “sempre AP” no dia ensolarado.

**PACELC.** Sem partição, o trade-off cotidiano é latência vs consistência (replicar síncrono é mais lento e mais coerente).

### ACID (um banco) vs mundo distribuído

**ACID.** Atomicidade, consistência (invariantes do *banco*), isolamento, durabilidade — no **mesmo** resource manager.

**Dois bancos / banco + Kafka.** Não há transação mágica. Aí entram Outbox, Saga, idempotência.

### Monolito, módulo e microsserviço

**Monolito.** Um deploy. Pode ser um **monolito modular** (pacotes com fronteiras claras) — escolha padrão até o domínio e o time pedirem outra coisa.

**Microsserviço.** Deploy independente, banco próprio, time capaz de operar. Preço: rede, observabilidade, consistência distribuída.

**Monolito distribuído.** Vários deploys **e** banco compartilhado / features que sempre mudam três repos juntos. O pior dos dois mundos.

### Síncrono vs assíncrono

**Síncrono (REST/gRPC).** Chamou, esperou resposta. Simples; **acopla disponibilidade**.

**Assíncrono (fila/log).** Publicou um fato; o outro processa depois. Absorve pico; consistência eventual; rastreio mais difícil.

### Cache

**O que é.** Cópia mais rápida (e talvez velha) de um dado caro.

**Cache-aside.** App pergunta no cache; miss → banco → preenche.

**Riscos.** Stampede (TTL estoura, mil vão ao banco), hot key, invalidação (o problema difícil).

### Replicação vs sharding

**Replicação.** Cópias do mesmo dado → lê mais, aguenta falha de um nó; *replication lag* (“gravei e não vejo”).

**Sharding.** Fatia o dado por chave → escreve mais; chave ruim = hot shard e query cross-shard.

### Índice

Acelera *aquele* padrão de leitura; atrasa escrita; ocupa espaço. Índice composto segue a ordem das colunas da query.

### Resiliência (a ordem que importa)

1. **Timeout** — sem ele, thread presa para sempre.  
2. **Retry + backoff + jitter** — só erro transitório + operação idempotente.  
3. **Circuit breaker** — para de martelar o morto.  
4. **Bulkhead** — pool isolado por dependência.  
5. **Fallback** — degradar em vez de 500.

### Observabilidade

**Log.** Um evento, com contexto (`traceId`).  
**Métrica.** Número no tempo (barata, agregada). RED: Rate, Errors, Duration.  
**Trace.** O caminho da request entre serviços.  
Métrica diz *que* está ruim; trace *onde*; log *por quê*.

**SLI / SLO / error budget.** Medida → meta → quanto de falha o produto aceita no período.

### Saga, Outbox, CQRS, Event Sourcing (nomes, não dogma)

**Saga.** Passos locais + **compensação** (não há rollback distribuído). Coreografia (eventos) vs orquestração (maestro).

**Outbox.** Evento na mesma transação do dado; publicador depois. (Trilha Kafka.)

**CQRS.** Modelo de escrita ≠ modelo de leitura. Caro; só quando os requisitos divergem de verdade.

**Event Sourcing.** Estado = replay de eventos. Auditoria incrível; custo operacional alto. Raro.

---

## Semana 1 — Fundamentos

**0. O que é arquitetura, numa frase?**
> As decisões de estrutura cujo retrabalho é caro: fronteiras, dados, comunicação e falha. O resto é detalhe de implementação.

**1. Latência ou throughput — como você distingue?**
> Latência é o tempo de uma operação; throughput é quantas operações por segundo. Melhorar um pode piorar o outro: agrupar mensagens em lote (Kafka `linger.ms`) aumenta o throughput e piora a latência. Precisa saber qual dos dois o requisito está pedindo.

**2. Por que percentil e não média?**
> A média esconde a cauda. Com 1% das requisições em 5 segundos e o resto em 20ms, a média fica bonita e 1 em cada 100 usuários tem uma experiência horrível — e usuários com mais dados (os mais valiosos) costumam estar justamente na cauda. Medir p50, p95, p99. SLO se escreve em percentil.

**3. Explique CAP — e o que ele realmente diz.**
> Durante uma **partição de rede**, é preciso escolher entre consistência e disponibilidade. Fora de partição, não há escolha imposta — o trade-off real do dia a dia é entre **latência e consistência** (isso é o PACELC). Dizer "escolhi AP" sem mencionar que a partição é o gatilho é sinal de decoreba.

**4. O que é consistência eventual e quando ela é aceitável?**
> As réplicas convergem para o mesmo estado depois de um tempo, mas podem divergir temporariamente. Aceitável em contador de curtidas, feed, catálogo. Inaceitável em saldo de conta no momento do débito, reserva de assento, controle de estoque com unidade única. A pergunta certa a fazer é: *"qual o custo de mostrar um dado 2 segundos desatualizado?"*

**5. Estratégias de cache e seus riscos.**
> - **Cache-aside** (o mais comum): a aplicação consulta o cache, e em caso de miss busca no banco e popula.
> - **Write-through:** escreve nos dois ao mesmo tempo — consistente, mais lento.
> - **Write-behind:** escreve no cache e persiste depois — rápido, arriscado.
>
> Riscos: dado obsoleto; **cache stampede** (o item expira e mil requisições vão ao banco de uma vez — mitigar com jitter no TTL, lock ou refresh proativo); **hot key** (uma chave concentra o tráfego); e invalidação, que é o problema difícil de verdade.

**6. Quando SQL e quando NoSQL?**
> SQL para dados relacionais, transações ACID, consultas variadas e não previstas — a escolha padrão. NoSQL quando o padrão de acesso é conhecido e a escala horizontal ou o modelo de dados justificam: documento (agregado auto-contido), chave-valor (cache, sessão), coluna larga (série temporal, escrita massiva), grafo (relacionamentos profundos). Justificar pela **carga de trabalho**, nunca por moda.

**7. Replicação e sharding — qual problema cada um resolve?**
> Replicação resolve **leitura** e disponibilidade (réplicas de leitura, com *replication lag* — o clássico "gravei e não vejo"). Sharding resolve **escrita** e volume, dividindo os dados por uma chave. A escolha da chave de shard é a decisão mais difícil: chave ruim gera hot shard e consultas cross-shard.

**8. Índice acelera tudo?**
> Não. Acelera leitura e **atrasa escrita** (todo insert/update mantém o índice), consome espaço, e um índice não usado é só custo. Índice composto só serve se a query respeitar a ordem das colunas.

---

## Semana 2 — Comunicação e resiliência

**1. Síncrono ou assíncrono entre serviços?**
> Síncrono (REST/gRPC) é simples e dá resposta imediata, mas **acopla disponibilidade**: se A chama B e B cai, A cai junto. Assíncrono (Kafka) desacopla no tempo, absorve picos e permite múltiplos consumidores, mas custa consistência eventual e dificuldade de rastrear o fluxo. Regra prática: consulta que o usuário está esperando → síncrono; efeito colateral e propagação de fato consumado → assíncrono.

**2. Quais mecanismos de resiliência você aplica, e em que ordem de importância?**
> 1. **Timeout** — o mais importante. Chamada sem timeout é vazamento de thread garantido e é assim que uma dependência lenta derruba o serviço inteiro.
> 2. **Retry com backoff exponencial + jitter** — sem jitter, todos os clientes tentam no mesmo instante (*thundering herd*) e mantêm o serviço caído. Só faz sentido em erro transitório e em operação idempotente.
> 3. **Circuit breaker** — fechado → aberto (falha rápido, deixa o dependente respirar) → meio-aberto (testa com poucas chamadas). Evita cascata.
> 4. **Bulkhead** — isolar pools de thread/conexão por dependência, para que uma lenta não consuma todos os recursos.
> 5. **Fallback / degradação graciosa** — resposta em cache, valor padrão, funcionalidade reduzida em vez de erro.

**3. Por que retry pode piorar um incidente?**
> Porque multiplica a carga exatamente quando o sistema está sobrecarregado. Retry sem circuit breaker e sem limite transforma degradação em queda total. E retry em operação não-idempotente duplica efeitos (cobrança dobrada).

**4. O que é API Gateway e o que é BFF?**
> Gateway: ponto único de entrada, com autenticação, rate limit, roteamento e TLS. BFF (Backend for Frontend): um backend por tipo de cliente (web, mobile), agregando chamadas e devolvendo exatamente o payload daquele cliente — evita que a API genérica seja puxada em direções conflitantes.

**5. Como você evolui uma API sem quebrar consumidores?**
> Só mudanças aditivas (campo novo opcional); nunca remover ou renomear campo em uso; versionar quando a quebra for inevitável (`/v2` ou header), mantendo as duas por um período com prazo de depreciação comunicado; e **contratos verificados automaticamente** (consumer-driven contracts / Pact) para o CI detectar a quebra antes do deploy.

---

## Semana 3 — Decomposição em serviços

**1. Quando você **não** usaria microsserviços?** ⭐
> Comece por aqui — é a resposta madura. Time pequeno, domínio ainda instável, produto sem escala que justifique. Microsserviço é uma solução **organizacional** (permitir que times deployem independentemente) que cobra um preço **técnico** alto: latência de rede, consistência distribuída, observabilidade, complexidade de deploy, debug muito mais difícil. **Monolito modular** é a escolha padrão correta na maioria dos casos, e permite extrair serviços depois, quando as fronteiras estiverem claras.

**2. Como você define as fronteiras de um serviço?**
> Por **capacidade de negócio** / *bounded context* do DDD — o que muda junto fica junto. Nunca por camada técnica (serviço-de-banco, serviço-de-API) nem por entidade isolada. Indicador prático: se toda feature exige alterar três serviços ao mesmo tempo, as fronteiras estão erradas.

**3. Por que cada serviço deve ter seu próprio banco?**
> Porque banco compartilhado torna o schema um contrato implícito entre times — ninguém consegue evoluir sem quebrar o outro, e a independência de deploy (única justificativa de microsserviço) desaparece. Banco compartilhado + serviços separados = **monolito distribuído**, o pior dos dois mundos.

**4. Como migrar um monolito para serviços?**
> **Strangler Fig:** colocar um roteamento na frente do monolito e extrair funcionalidade por funcionalidade, redirecionando as rotas conforme cada pedaço fica pronto. Começar pelo que tem fronteira mais clara e menos acoplamento de dados. Nunca big bang rewrite.

**5. Como você lida com dado que dois serviços precisam?**
> Duplicação controlada via eventos: o serviço dono publica mudanças e os outros mantêm uma cópia local somente-leitura, aceitando consistência eventual. Alternativa é consulta síncrona (mais simples, mais acoplada). O que não vale é acessar a tabela do outro.

**6. O que é bounded context, numa frase?**
> Um recorte do domínio onde as palavras têm um significado estável (Pedido no checkout ≠ Pedido no fiscal) e o modelo pode evoluir sem vazar para o outro recorte.

---

## Semana 4 — Dados distribuídos ⭐

**1. Como manter consistência entre dois serviços sem transação distribuída?**
> **Saga:** a transação de negócio é dividida em passos locais, cada um com uma **compensação** (não existe rollback distribuído — existe operação inversa).
> - *Coreografia:* cada serviço reage a eventos. Desacoplado, mas o fluxo global fica invisível — difícil de depurar quando cresce.
> - *Orquestração:* um orquestrador conduz os passos e as compensações. Fluxo explícito e observável, ao custo de um componente central.
>
> Escolher coreografia para fluxos de 2-3 passos, orquestração a partir daí.

**2. Como garantir que o dado e o evento sejam publicados juntos?**
> **Outbox:** gravar o evento numa tabela na mesma transação do dado; um publicador (poller ou CDC com Debezium) envia ao Kafka depois. Resulta em at-least-once, tratado com idempotência no consumidor. (Detalhado na trilha de Kafka.)

**3. O que é CQRS e quando vale a pena?**
> Separar o modelo de escrita do modelo de leitura, possivelmente em armazenamentos diferentes. Vale quando leitura e escrita têm requisitos muito distintos: consultas complexas e pesadas sobre um modelo de escrita normalizado, ou proporção de leitura ordens de magnitude maior. Custa: sincronização, consistência eventual, mais infraestrutura. Não vale em CRUD.

**4. E Event Sourcing?**
> Armazenar a sequência de eventos em vez do estado atual; o estado é derivado por replay. Ganhos: auditoria completa, viagem no tempo, possibilidade de recalcular projeções. Custos altos: versionamento de eventos, snapshots, consultas difíceis, curva de aprendizado do time. Saber explicar **e** saber dizer que raramente é necessário.

**5. Como você faz idempotência numa API pública?**
> Chave de idempotência enviada pelo cliente (header `Idempotency-Key`), armazenada com o resultado da primeira execução. Requisição repetida com a mesma chave devolve o resultado guardado sem executar de novo. É como as APIs de pagamento sérias funcionam.

---

## Semana 5 — Observabilidade

**1. Quais são os três pilares e para que serve cada um?**
> **Logs** (o que aconteceu num evento específico), **métricas** (agregados numéricos ao longo do tempo, baratos de armazenar), **traces** (o caminho de uma requisição através dos serviços). Métrica diz *que* está ruim; trace diz *onde*; log diz *por quê*.

**2. Como você instrumenta corretamente?**
> Logs estruturados em JSON, com `traceId` propagado em todo o fluxo (incluindo através do Kafka, via headers). Métricas com Micrometer → Prometheus: **RED** para serviços (Rate, Errors, Duration) e **USE** para recursos (Utilization, Saturation, Errors). Tracing com OpenTelemetry. Nunca logar dado sensível — PII, token, número de cartão.

**3. O que é SLI, SLO e error budget?**
> SLI é a métrica medida (ex.: % de requisições abaixo de 300ms). SLO é a meta acordada (ex.: 99,9%). O *error budget* é o complemento (0,1%) — quanto de falha é aceitável no período. É o que traduz confiabilidade em decisão de produto: budget estourado significa parar features e trabalhar em estabilidade.

**4. Como você define um alerta bom?**
> Alerta sobre **sintoma percebido pelo usuário** (taxa de erro, latência, lag crescente), não sobre causa (CPU a 80% pode ser normal). Todo alerta precisa ser acionável e ter um runbook. Alerta que dispara e ninguém age deve ser deletado — ruído de alerta mata a atenção da equipe.

---

## Semanas 6-8 — System Design

### Framework de resposta (45 min)

1. **Requisitos (5 min).** Funcionais e não-funcionais. **Fazer perguntas** — o entrevistador espera isso e desconta de quem sai codando. Quantos usuários? Leitura ou escrita pesada? Latência aceitável? Consistência forte é obrigatória? Precisa funcionar em várias regiões?
2. **Estimativas (5 min).** QPS, volume de dados por dia/ano, banda. Ordem de grandeza basta — o objetivo é justificar decisões depois ("são 50k escritas/s, um único Postgres não aguenta, então...").
3. **API (5 min).** Poucos endpoints, contratos claros.
4. **Modelo de dados (5 min).** Escolha do armazenamento **com justificativa**.
5. **Desenho de alto nível (10 min).** Cliente → gateway → serviços → cache/banco/fila.
6. **Aprofundar 1-2 pontos (10 min).** Deixar o entrevistador escolher, ou apontar o gargalo mais interessante.
7. **Gargalos e trade-offs (5 min).** Ponto único de falha, hot partition, o que quebra se o tráfego dobrar, o que você faria diferente com mais tempo.

### Sistemas para praticar (um por semana, 45 min cronometrados, falando em voz alta)

| # | Sistema | O que ele exercita |
|---|---|---|
| 1 | Encurtador de URL | Geração de ID, cache, leitura pesada, sharding |
| 2 | Rate limiter | Token bucket, estado distribuído, Redis |
| 3 | Feed de rede social | Fan-out on write vs on read, hot user |
| 4 | Sistema de notificações | Filas, retry, DLT, idempotência |
| 5 | **Processador de pagamento** | Saga, Outbox, idempotência, consistência — **casa perfeitamente com o stack dela** |
| 6 | Chat em tempo real | WebSocket, presença, ordenação de mensagens |
| 7 | Upload e processamento de arquivo | Storage, processamento assíncrono, status |
| 8 | Sistema de reservas (assentos) | Concorrência, lock, consistência forte |

Para cada um: desenhar no papel, gravar a explicação em áudio, ouvir depois. Desconfortável e altamente eficaz.

Antes do primeiro desenho: recitar o glossário (latência, p99, CAP, quando *não* microsserviço). Se travar, não desenhe ainda.

---

## Perguntas-síntese (as que mais aparecem)

- Descreva a arquitetura do sistema em que você trabalha hoje, com os trade-offs, em 3 minutos.
  > **A pergunta de abertura mais comum em entrevista sênior.** Precisa estar ensaiada.
- Qual foi a decisão de arquitetura mais difícil que você tomou e por quê?
- Conte um incidente de produção que você resolveu — da detecção ao post-mortem.
- O que você faria diferente se recomeçasse o projeto atual?
- Como você convence o time a adotar (ou a não adotar) uma tecnologia nova?
- Um serviço está com p99 de 3 segundos. Descreva sua investigação passo a passo.
- Como você garante que um sistema distribuído não perca dado?
- Eventual vs inconsistente — dê um exemplo de cada no seu domínio.

### Checklist de fluência (60 segundos)

- [ ] Arquitetura = decisão cara de reverter
- [ ] Latência vs throughput vs p99
- [ ] CAP só durante partição; PACELC no dia a dia
- [ ] Eventual ≠ invariante quebrada
- [ ] Timeout primeiro na resiliência
- [ ] Quando **não** microsserviço
- [ ] Banco por serviço; Outbox; Saga
- [ ] Log / métrica / trace
- [ ] System design: perguntar requisitos antes de desenhar

## Recursos
- **Designing Data-Intensive Applications** (Kleppmann) — o melhor livro da área. Um capítulo por semana. Capítulos 5, 7, 8, 9 e 11 são os mais diretamente aplicáveis.
- **Building Microservices** (Sam Newman, 2ª ed.) — pragmático, sem hype.
- **microservices.io** (Chris Richardson) — catálogo de referência: Saga, Outbox, CQRS, Strangler Fig.
- **Fundamentals of Software Architecture** (Richards & Ford) — bom para vocabulário e características arquiteturais.
- Modelo **C4** (c4model.com) — como desenhar arquitetura de forma legível. Útil na entrevista e no trabalho.
