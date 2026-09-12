# Trilha 2 — Java

**Formato:** responder em voz alta → conferir o gabarito → anotar o que faltou.
**Duração:** 6 semanas · 3 sessões de 45 min por semana.

> Java em entrevista sênior não é sintaxe. É **o que a JVM faz com o seu código**: memória, GC, collections, visibilidade entre threads. Sem o vocabulário do zero, as perguntas viram recitação.

---

## Mapa mental

Você não “roda um arquivo `.java`”. O caminho real:

```
.java  →  javac  →  bytecode (.class)  →  ClassLoader  →  JVM interpreta/JIT
                                                      │
                         cada thread tem uma stack ───┤
                         todos compartilham o heap ───┘
                                          GC coleta o inalcançável
```

Objetos vivem no **heap**. Métodos em execução vivem na **stack** daquela thread. Referências na stack (e em estáticos, JNI, etc.) são as **GC roots**: o que dá para alcançar a partir delas vive; o resto o GC pode apagar.

Concorrência entra quando **duas stacks** (duas threads) apontam para o **mesmo** objeto no heap e o modificam sem coordenação.

---

## Glossário do zero

### JDK, JRE e JVM

**JVM.** Máquina virtual: executa bytecode, gerencia memória, threads, JIT, GC. É a especificação + uma implementação (HotSpot é a que você usa).

**JRE.** Runtime: JVM + bibliotecas para *rodar*. **JDK.** JRE + compilador (`javac`), `jcmd`, `jstack`, etc. — o que quem desenvolve instala.

**Bytecode.** Instruções da JVM, independentes do SO. Por isso “write once, run anywhere”: o `.class` é o mesmo; a JVM de cada plataforma traduz.

### ClassLoader

**O que é.** Quem carrega `.class` na JVM (bootstrap → platform → application). Classes com o mesmo nome em classloaders diferentes são tipos diferentes.

**Para que serve.** Isolar código (app servers antigos, plugins). Em Spring Boot “fat jar”, um classloader especial acha as classes dentro do jar empacotado.

**Erro comum.** `ClassNotFoundException` (classloader não achou na hora de carregar) vs `NoClassDefFoundError` (achou na compilação / carga inicial e falhou depois — muitas vezes dependência ausente em runtime).

### Thread, stack e heap

**Thread.** Linha de execução. Cada uma tem stack própria (~1MB na thread de plataforma).

**Stack.** Frames de método: variáveis locais, operandos, referências. Automática: entra no método, empilha; sai, desempilha. `StackOverflowError` = recursão (ou stack pequena) demais.

**Heap.** Onde os `new` vivem. Compartilhado. `OutOfMemoryError: Java heap space` = heap cheia. Há outros OOM (metaspace, native) — heap não é a memória toda do processo.

**Erro comum.** “Objeto grande vai para a stack.” Em Java, o objeto vai para o heap; a stack guarda a *referência* (escape analysis pode alocar na stack em casos otimizados — detalhe avançado, não é o modelo mental do dia a dia).

### GC (garbage collector)

**O que é.** Libera objetos **inalcançáveis** a partir das GC roots. Não é `free()` manual.

**Geracional.** Hipótese: a maioria morre jovem. *Young* (Eden + survivor): coletas frequentes e baratas. *Old*: quem sobreviveu várias vezes; coleta mais cara. **G1** (padrão moderno): heap em regiões, pausas mais previsíveis. **ZGC / Shenandoah:** heaps grandes, pausas curtas.

**Vazamento em Java.** Referência esquecida (`static` que cresce, listener, `ThreadLocal` em pool, cache sem teto). O GC *não pode* coletar o alcançável.

### JIT

**O que é.** Compila bytecode “quente” para código nativo. No início a JVM interpreta — daí o **warm-up** após deploy e a mentira de benchmark sem aquecimento.

### `equals` e `hashCode`

**Contrato.** Se `a.equals(b)`, então `a.hashCode() == b.hashCode()`. Hash igual **não** implica iguais.

**Para que serve.** `HashMap` / `HashSet` acham o bucket pelo hash e confirmam com `equals`. Quebrar o contrato = objeto “some” no mapa.

### Collection vs Map

**Collection:** conjunto de elementos (`List`, `Set`, `Queue`). **Map:** pares chave→valor — **não** é `Collection`.

**List.** Ordem, índice, duplicatas. `ArrayList` = array redimensionável. `LinkedList` = nós; rara como lista, ok como `Deque`.

**Set.** Sem duplicatas (`equals`). `HashSet` desordenado; `TreeSet` ordenado O(log n); `LinkedHashSet` preserva inserção.

**Map.** `HashMap` O(1) médio; `TreeMap` ordenado; `ConcurrentHashMap` concorrente.

### Imutabilidade

**O que é.** Depois de criado, o estado não muda. Classe/campos finais, sem setter, cópia defensiva de coleções mutáveis.

**Para que serve.** Thread-safety sem lock, chave de mapa segura, raciocínio simples. `record` é o atalho moderno para *value objects*.

### `Optional` e genéricos

**Optional.** Caixa para “pode não ter valor” **no retorno**. Não é campo, não é parâmetro, não é lista de optionals.

**Type erasure.** `List<String>` em runtime é `List`. Genéricos são do compilador.

**PECS.** Producer Extends (ler), Consumer Super (escrever).

### Concorrência — palavras que não pode trocar

**Race condition.** Resultado depende de quem chega primeiro; o programa está errado sob intercalação.

**Visibilidade.** Thread A escreveu, thread B ainda vê valor velho — cache de CPU / reordenação. `volatile` e `synchronized` criam **happens-before**.

**Atomicidade.** Operação indivisível. `i++` **não** é atômico. `volatile` **não** torna `i++` atômico.

**Lock / `synchronized`.** Só uma thread no bloco; ao sair, as escritas ficam visíveis a quem entrar depois.

**CAS.** Compare-and-swap: atômicos (`AtomicInteger`) tentam atualizar sem lock, em loop.

**Deadlock.** Espera circular de locks. Antídoto clássico: mesma ordem global de aquisição.

**Pool de threads.** Reusa threads; limita paralelismo. `new Thread()` em produção na rajada derruba a máquina.

**Virtual threads (21).** Leves, ótimas para I/O-bound bloqueante. Não aceleram CPU-bound.

---

## Semana 1 — JVM, memória e GC

**1. Qual a diferença entre stack e heap?**
> Cada thread tem sua própria stack: guarda frames de método, variáveis locais e referências. O heap é compartilhado por todas as threads e guarda os objetos. Stack é gerenciada automaticamente (empilha/desempilha); heap é limpa pelo GC. `StackOverflowError` = recursão profunda demais. `OutOfMemoryError` = heap esgotada (ou outra área nativa — pergunte *qual* OOM).

**2. Como funciona o garbage collector?**
> Modelo geracional, baseado na hipótese de que a maioria dos objetos morre jovem. Objetos nascem na *young generation* (coleta frequente e barata); sobreviventes são promovidos para a *old generation* (coleta rara e cara). O GC identifica o que é alcançável a partir das *GC roots* e coleta o resto. **G1** é o padrão desde o Java 9 e mira em pausas previsíveis dividindo o heap em regiões. **ZGC** e **Shenandoah** existem para heaps grandes com pausas sub-milissegundo.

**3. Se existe GC, é possível ter vazamento de memória em Java?**
> Sim, e essa é a pegadinha. O GC só coleta o que está inalcançável. Se ela mantém uma referência viva — um `static Map` que só cresce, um listener nunca removido, um `ThreadLocal` não limpo em pool de threads, um cache sem limite — o objeto nunca é coletado. Vazamento em Java é *referência esquecida*, não falta de `free()`.

**4. Como você investigaria um `OutOfMemoryError` em produção?**
> Habilitar `-XX:+HeapDumpOnOutOfMemoryError`, capturar o heap dump e analisar com Eclipse MAT ou VisualVM procurando o *dominator tree* — quem está segurando mais memória. Antes disso, olhar métricas: o uso de heap cresce em degrau e nunca volta (vazamento) ou tem picos (carga)? Verificar se o limite de memória do container e o `-Xmx` batem. Lembrar: RSS do processo > heap.

**5. O que é o JIT e por que ele importa na prática?**
> A JVM começa interpretando o bytecode e compila para código nativo os trechos "quentes". Consequências reais: as primeiras requisições após um deploy são lentas (daí o warm-up), e benchmark sem aquecimento mede o interpretador, não a aplicação.

**6. O que é uma GC root? Cite três.**
> Origem da alcançabilidade: variáveis locais na stack, campos estáticos, referências JNI, threads em execução. Sem essa ideia, “o GC não coletou” vira mistério.

### Laboratório
Rodar uma app com `-verbose:gc -Xmx256m`, gerar carga, ler o log e identificar young vs full GC. Depois, escrever um vazamento de propósito (`static List` que só cresce), capturar o heap dump e achar o culpado no MAT.

---

## Semana 2 — Collections

**1. Como o `HashMap` funciona por dentro?**
> Array de buckets. O `hashCode()` da chave (após uma função de espalhamento interna) determina o índice do bucket. Colisões dentro do mesmo bucket viram lista encadeada e, a partir de 8 elementos, são convertidas em árvore rubro-negra — por isso o pior caso desde o Java 8 é O(log n), não O(n). Quando o número de entradas passa do *load factor* (0.75) da capacidade, o mapa dobra de tamanho e reposiciona tudo (resize é caro).

**2. Qual o contrato entre `equals` e `hashCode`?**
> Objetos iguais por `equals` **precisam** ter o mesmo `hashCode`. A recíproca não vale (hashes iguais não implicam objetos iguais). Quebrar isso faz o objeto sumir dentro de `HashMap`/`HashSet`: ele é procurado num bucket e está em outro.

**3. E se eu usar um objeto mutável como chave e alterar um campo depois?**
> O objeto fica inacessível. O hash mudou, mas ele continua fisicamente no bucket antigo. `map.get(chave)` devolve `null` mesmo com a chave "presente". Por isso chave de mapa deve ser imutável.

**4. `ArrayList` ou `LinkedList`?**
> `ArrayList` quase sempre. É array redimensionável: acesso por índice O(1), boa localidade de cache. `LinkedList` só é O(1) para inserir se você já está no nó — chegar até ele é O(n) — e a fragmentação de memória torna a iteração bem mais lenta na prática. `LinkedList` faz sentido como `Deque`, raramente como lista.

**5. `HashMap`, `Hashtable`, `Collections.synchronizedMap` e `ConcurrentHashMap` — diferença?**
> `HashMap` não é thread-safe. `Hashtable` é legado e sincroniza tudo num lock único. `synchronizedMap` envolve o mapa num lock único também — todas as operações serializam. `ConcurrentHashMap` usa locks granulares por bucket e CAS: leituras são livres de lock e escritas concorrentes em buckets diferentes não competem. É a escolha certa hoje.

**6. Quando usar `TreeMap`?**
> Quando precisa de ordem ou de consultas por faixa: `firstKey`, `floorKey`, `ceilingKey`, `subMap`. O custo é O(log n) em vez de O(1).

**7. O que é fail-fast?**
> Iteradores das coleções não-concorrentes lançam `ConcurrentModificationException` se a coleção for modificada durante a iteração (fora do próprio iterador). Não é garantia de thread-safety — é um mecanismo de detecção de bug.

### Laboratório
Implementar um `HashMap` simplificado do zero (array de buckets + lista encadeada + resize). É o exercício que faz o conceito virar intuição.

---

## Semana 3 — Objetos, imutabilidade e API moderna

**1. Como criar uma classe imutável?**
> Classe `final` (ou construtor privado), todos os campos `final` e privados, sem setters, e **cópia defensiva** de qualquer campo mutável tanto no construtor quanto no getter. Sem isso, alguém guarda a referência da lista que passou e altera o objeto "imutável" por fora.

**2. Por que imutabilidade importa?**
> Thread-safety de graça, chave segura para mapas, sem estado surpresa, mais fácil de raciocinar. É o padrão recomendado para objetos de valor.

**3. O que é um `record`?**
> Java 16+. Portador de dados imutável com construtor canônico, `equals`, `hashCode`, `toString` e acessores gerados. Substitui o DTO cheio de boilerplate. Não serve para entidade JPA (que precisa de construtor sem argumentos e mutabilidade).

**4. Qual o uso correto de `Optional`?**
> Como **tipo de retorno** de método que legitimamente pode não ter valor. Não usar como campo de classe, parâmetro de método, ou em coleções. Não chamar `get()` sem checar — usar `map`, `filter`, `orElse`, `orElseGet` (lazy) ou `orElseThrow`. `orElse` avalia o argumento sempre, `orElseGet` só quando vazio; isso importa se o fallback for caro.

**5. Streams: quando não usar?**
> Quando o loop tem efeito colateral, quando precisa de `break` no meio (dá para fazer com `findFirst`, mas fica pior), em código extremamente sensível a performance (o `for` clássico costuma ser mais rápido), e sempre que o stream fica menos legível que o loop equivalente. Stream é sobre expressividade, não velocidade.

**6. O que é type erasure?**
> Genéricos existem só em tempo de compilação; em runtime `List<String>` é apenas `List`. Por isso não dá para fazer `new T[]`, nem `instanceof List<String>`, nem sobrecarregar métodos que diferem só pelo tipo genérico.

**7. Explique PECS.**
> *Producer Extends, Consumer Super.* Se a coleção **produz** valores que você vai ler, use `? extends T`. Se ela **consome** valores que você vai escrever, use `? super T`. `Collections.copy(List<? super T> dest, List<? extends T> src)` é o exemplo canônico.

**8. Checked vs unchecked exception — qual usar?**
> A prática moderna favorece unchecked (`RuntimeException`) para erros de programação e para falhas que o chamador não pode tratar de forma útil. Checked força tratamento e polui assinaturas. Regra: se o chamador pode fazer algo a respeito, considere checked; senão, unchecked. E nunca capturar `Exception` genérica sem relançar ou logar.

---

## Semanas 4-5 — Concorrência

**1. `volatile` garante o quê exatamente?**
> **Visibilidade** e ordenação (barreira de memória), não atomicidade. Uma escrita em campo `volatile` é vista imediatamente pelas outras threads. Mas `i++` continua sendo leitura-modificação-escrita — três passos — e continua sendo race condition mesmo com `volatile`.

**2. Então o que resolve o `i++` concorrente?**
> `synchronized`, um `Lock`, ou `AtomicInteger` (que usa CAS — compare-and-swap — em loop, sem bloqueio). `AtomicInteger` é preferível para contadores por ser lock-free.

**3. O que é happens-before?**
> A relação do modelo de memória do Java que garante que o efeito de uma operação seja visível para outra. Sair de um bloco `synchronized` acontece-antes de outra thread entrar no mesmo bloco; escrever em `volatile` acontece-antes de ler o mesmo campo; iniciar uma thread acontece-antes de qualquer coisa nela. Sem essa relação, não há garantia de visibilidade — nem que a ordem observada seja a do código.

**4. Por que não criar `new Thread()` em produção?**
> Cada thread do SO custa memória (~1MB de stack) e criação/destruição é cara. Sem limite, uma rajada de carga cria milhares de threads e derruba a aplicação. Usar `ExecutorService` com pool limitado e fila delimitada, e definir uma política de rejeição explícita.

**5. Como dimensionar um pool de threads?**
> Para trabalho **CPU-bound**: ~número de núcleos. Para **I/O-bound**: bem mais, porque as threads passam a maior parte do tempo bloqueadas. A fórmula clássica é `núcleos × (1 + tempo de espera / tempo de CPU)`. Na prática, medir.

**6. Deadlock: o que é e como evitar?**
> Duas ou mais threads esperando locks que a outra segura. Requer quatro condições simultâneas (exclusão mútua, posse-e-espera, não-preempção, espera circular). Evitar quebrando a espera circular: **sempre adquirir locks na mesma ordem global**, ou usar `tryLock` com timeout.

**7. O que são Virtual Threads (Java 21)?**
> Threads leves gerenciadas pela JVM, não pelo SO. Milhões delas cabem na memória. Quando uma bloqueia em I/O, a JVM desmonta o stack e libera a thread de plataforma. O ganho é para workload **I/O-bound**: permite escrever código bloqueante simples com escala de código assíncrono. Não acelera trabalho CPU-bound. Cuidado: `synchronized` em versões iniciais podia "fixar" a virtual thread na carrier — preferir `ReentrantLock`.

**8. `CompletableFuture` — para que serve?**
> Compor operações assíncronas sem callback hell: `thenApply`, `thenCompose` (encadear outra chamada assíncrona), `thenCombine` (juntar dois resultados), `allOf`. Sempre passar um `Executor` explícito em vez de usar o `ForkJoinPool.commonPool()` padrão para trabalho de I/O.

### Laboratório
1. Escrever um contador com race condition, provar o bug com 10 threads, e consertar de três formas: `synchronized`, `AtomicInteger`, `LongAdder`. Comparar throughput.
2. Provocar um deadlock de propósito, capturar um thread dump (`jstack`) e localizar o ciclo.

---

## Semana 6 — Revisão e simulação

Refazer todas as perguntas em voz alta, cronometrando 2 minutos por resposta. As que ficarem hesitantes voltam para o caderno de revisão. Se uma palavra do glossário travar, volte nela — não pule para a síntese.

### Perguntas-síntese (nível sênior)
- Descreva o que acontece, do começo ao fim, quando você chama `map.put(chave, valor)` num `HashMap`.
- Sua aplicação está com p99 alto e uso de CPU baixo. Como investiga?
- Uma classe é singleton no Spring e tem um campo `List` que é populado por requisição. Qual o problema?
- Você precisa processar 10.000 chamadas HTTP externas o mais rápido possível. Como faz em Java 21?
- Como você garantiria que um método só é executado uma vez, mesmo com várias threads chamando ao mesmo tempo?
- Heap dump mostra a heap “ok” mas o pod foi OOMKilled. O que você olha? *(off-heap, threads, limite do container — ponte para a trilha de K8s.)*

### Checklist de fluência (60 segundos)

- [ ] JVM vs JDK; bytecode; JIT
- [ ] Stack vs heap vs GC roots
- [ ] Por que existe vazamento com GC
- [ ] Contrato equals/hashCode
- [ ] ArrayList vs LinkedList vs ConcurrentHashMap
- [ ] Imutabilidade e record
- [ ] volatile ≠ atômico; happens-before
- [ ] Por que pool em vez de `new Thread()`
- [ ] Virtual threads: para que serve e para que não

## Recursos
- **Effective Java** (Bloch) — itens 10-14 (equals/hashCode), 17 (imutabilidade), 26-33 (genéricos), 78-84 (concorrência).
- **Java Concurrency in Practice** — capítulos 2, 3 e 5.
- JEP 444 (Virtual Threads) — leitura curta e oficial.
