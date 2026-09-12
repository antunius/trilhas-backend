# Trilha 6 — Clean Code, SOLID e Padrões

**Formato:** 30 min por sessão, rodando em paralelo com as trilhas de plataforma, do começo ao fim do plano.
**Regra central:** cada tópico só conta quando ela **refatorou código real** com ele. Ler sobre clean code não muda como se escreve código.

> Clean code não é estética. É **custo de mudança**. Código limpo é o que um colega (você daqui a três meses) altera sem medo. Sem o vocabulário do zero (acoplamento, coesão, abstração, smell), SOLID vira poster na parede.

---

## Mapa mental

Código existe para dois leitores: a máquina (que aceita qualquer coisa que compile) e o **humano que vai mudar**. A trilha inteira reduz a distância entre “o que o sistema faz” e “o que o texto diz”.

```
nome certo  →  função pequena  →  módulo com um motivo para mudar
                                      ↓
                         testes como primeiro cliente
                                      ↓
                         padrão de projeto só quando a variação já existe
```

**Refatorar** é mudar a forma **sem** mudar o comportamento observável. **Feature** muda comportamento. Misturar os dois no mesmo commit é como mentir no git: quando quebrar, ninguém sabe o que quebrou.

---

## Glossário do zero

### Legibilidade vs “código esperto”

**Legível.** O próximo leitor entende a intenção sem debugger. Nomes, funções curtas, um nível de abstração por vez.

**Esperto.** Compressão, truque, one-liner que economiza 4 linhas e custa 20 minutos. Em entrevista sênior, esperto demais é cheiro.

### Abstração

**O que é.** Esconder detalhe atrás de um nome que captura a intenção (`cobrarPedido` em vez de 40 linhas de HTTP + SQL misturados).

**Para que serve.** Poder mudar o detalhe (trocar gateway de pagamento) sem reescrever o fluxo.

**Erro comum.** Abstrair *antes* de ter dois casos reais → interface com uma implementação, fábrica que cria uma coisa só. Isso é complexidade acidental.

### Coesão e acoplamento

**Coesão.** Coisas que mudam juntas **ficam juntas**. Classe/módulo com um assunto.

**Acoplamento.** Quanto A precisa saber de B. Acoplamento alto: mudar B quebra A. O objetivo não é acoplamento zero (impossível) — é acoplar na **direção certa** (domínio não conhece JPA).

### Encapsulamento

**O que é.** Invariantes protegidos: o objeto não deixa o mundo deixar o estado inválido. Não é “tudo `private` e um getter/setter por campo” — isso é struct com disfarce.

### Code smell (cheiro)

**O que é.** Sinal de que o design está apodrecendo — não é bug hoje, é **custo amanhã**. Nomear o cheiro (`Feature Envy`, `God Class`) é o que permite conversar no PR sem “está feio”.

### Refatoração

Catálogo (Fowler): Extract Method, Extract Class, Rename, Move Method… Cada uma é um passo pequeno com testes verdes.

**Caracterização.** Em legado sem testes: primeiro testes que cravam o comportamento *atual* (mesmo que errado), depois refatora.

### Dívida técnica

**O que é.** Atalho de agora que cobra juros depois (mais tempo por feature, mais bugs). Não é “código feio”. Comunica em **tempo e risco**, não em gosto estético.

### SOLID — as cinco letras em uma frase cada

Antes das semanas 5–8, estas frases têm que sair sem olhar:

| Letra | Nome | Em uma frase |
|---|---|---|
| **S** | Single Responsibility | Um motivo para mudar — um *stakeholder*, não “uma função só”. |
| **O** | Open/Closed | Estender com código novo; não reabrir o que já foi testado. |
| **L** | Liskov | Subtipo não quebra o contrato do tipo. |
| **I** | Interface Segregation | Não force ninguém a depender de método que não usa. |
| **D** | Dependency Inversion | Alto nível e baixo nível dependem de abstração; o domínio não depende do JPA. |

### Padrão de projeto

**O que é.** Solução *nomeada* para um problema que se repete (Strategy, Adapter, Observer…).

**Para que serve.** Vocabulário comum (“isso é um Adapter”) e reuso de um desenho já debatido.

**Quando não usar.** Um `if` com dois casos. Interface com uma implementação e zero perspectiva de segunda. Fábrica que só faz `new`.

### Teste como design

Se precisa de 8 mocks, a unidade está grande demais (SRP). Se precisa testar método `private`, ele provavelmente quer ser classe. O teste é o **primeiro cliente** da API pública.

---

## Parte 1 — Clean Code (semanas 1-4)

### 1.1 Nomes

O nome deve responder *o quê* e *por quê*. Se precisa de comentário para ser entendido, o nome está errado.

| Ruim | Bom | Por quê |
|---|---|---|
| `d` | `elapsedDays` | Nome de uma letra só sobrevive em índice de loop |
| `processData()` | `normalizeCustomerAddresses()` | Diz o que faz, não a categoria |
| `List<Map<String,Object>> list` | `List<OrderSummary> pendingOrders` | Tipo e intenção |
| `flag` | `isEligibleForDiscount` | Booleano deve ler como pergunta |
| `getUser()` que cria se não existir | `findOrCreateUser()` | Nome mentindo é o pior defeito |

**Exercício:** abrir um arquivo do trabalho dela, listar os 10 piores nomes e renomear todos. Só isso, 30 min.

### 1.2 Funções

- **Pequenas.** Se não cabe na tela, provavelmente faz demais.
- **Um nível de abstração por função.** Não misturar "orquestrar o fluxo do pedido" com "formatar CPF" na mesma função.
- **Faz uma coisa só.** Teste: dá para extrair outra função com um nome significativo (que não seja só reformular a implementação)? Então fazia mais de uma coisa.
- **Poucos argumentos.** Três ou mais sugere que falta um objeto. `criarPedido(cliente, itens, endereco, cupom, canal)` → `criarPedido(PedidoRequest)`.
- **Argumento booleano é cheiro.** `salvar(pedido, true)` — o que é `true`? Quase sempre significa que a função faz duas coisas. Separe em `salvar()` e `salvarERascunho()`.
- **Sem efeito colateral escondido.** `verificarSenha()` que também inicializa a sessão é uma armadilha para quem lê.
- **Comando ou consulta, nunca os dois.** Ou muda estado, ou devolve informação. (Separação comando-consulta — CQS.)

### 1.3 Comentários

Comentário bom explica **por quê**, não **o quê**.

```java
// ruim
i++; // incrementa i

// bom
// A API do fornecedor é 1-indexed; o +1 evita pular o primeiro item.
```

- Comentário desatualizado é pior que comentário nenhum — vira mentira documentada.
- Código comentado deve ser **deletado**. Existe git.
- TODO sem dono e sem data vira lixo permanente.
- Javadoc vale para API pública; para código interno, um bom nome vale mais.

### 1.4 Tratamento de erro

- Exceção em vez de código de retorno.
- **Nunca engolir:** `catch (Exception e) { }` é o pior padrão do Java. Se não pode tratar, relance.
- Não usar exceção para fluxo normal (é caro e obscurece o código).
- **Não retornar `null`** — retornar `Optional` ou coleção vazia. Não *passar* `null` como argumento.
- Mensagem de exceção deve conter contexto: `"Pedido 4821 não encontrado para o cliente 77"`, não `"não encontrado"`.
- Nunca vazar exceção interna para o cliente da API.

### 1.5 Cheiros de código (aprender a nomear é aprender a ver)

| Cheiro | Sinal | Refatoração |
|---|---|---|
| **Long Method** | Não cabe na tela | Extract Method |
| **God Class** | `PedidoManager` com 1500 linhas | Extract Class por responsabilidade |
| **Feature Envy** | Método que só usa dados de outra classe | Move Method |
| **Primitive Obsession** | `String cpf`, `BigDecimal valor` soltos | Value Objects (`Cpf`, `Dinheiro`) |
| **Data Clump** | Os mesmos 4 parâmetros juntos em toda parte | Extrair um objeto |
| **Shotgun Surgery** | Uma mudança pequena exige tocar 8 arquivos | Juntar o que muda junto |
| **Divergent Change** | Uma classe muda por 5 motivos diferentes | Violação de SRP → dividir |
| **Switch repetido** | O mesmo `switch(tipo)` em vários lugares | Polimorfismo / Strategy |
| **Comentário explicando bloco** | "// agora calcula o frete" | Extrair método com esse nome |
| **Flag argument** | `metodo(x, true)` | Separar em dois métodos |

---

## Parte 2 — SOLID (semanas 5-8)

Uma semana por conceito, com refatoração real em cada uma. Releia a tabela do glossário no sábado antes de abrir o código.

### S — Single Responsibility
> Uma classe deve ter **um único motivo para mudar**.

Não é "faz uma coisa só" — é sobre *quem pede a mudança*. Se uma classe muda quando o time de relatórios pede algo **e** quando o time de cobrança pede algo, ela tem duas responsabilidades.

**Cheiro:** classes chamadas `Manager`, `Helper`, `Util`, `Service` com 1000+ linhas; classe que importa `javax.mail` **e** `javax.persistence`.

**Exercício:** pegar a maior classe do projeto dela e listar os motivos pelos quais ela mudou nos últimos 6 meses (o git conta). Se forem mais de um stakeholder, dividir.

### O — Open/Closed
> Aberto para extensão, fechado para modificação.

Adicionar comportamento novo sem editar código já testado.

```java
// antes — cada novo meio de pagamento edita este switch
switch (tipo) {
    case CARTAO: ...
    case PIX: ...
    case BOLETO: ...
}

// depois
public interface ProcessadorPagamento {
    boolean suporta(TipoPagamento tipo);
    Recibo processar(Pagamento p);
}
// o Spring injeta todas as implementações automaticamente
public PagamentoService(List<ProcessadorPagamento> processadores) { ... }
```

Adicionar Apple Pay passa a ser criar uma classe nova. Zero edição no que já funciona.

**Cuidado:** não aplicar preventivamente. Com dois casos, um `if` está ótimo. A abstração se justifica quando a variação já se manifestou.

### L — Liskov Substitution
> Uma subclasse deve poder substituir a superclasse sem quebrar quem a usa.

**Violação clássica:** `Quadrado extends Retangulo`. `setLargura(5)` num quadrado precisa mudar a altura também, e todo código que assumia independência entre os lados quebra.

**Sinal inequívoco de violação:** subclasse que sobrescreve um método para lançar `UnsupportedOperationException`, ou que enfraquece garantias da superclasse (aceita menos entradas, devolve menos, lança exceções novas).

### I — Interface Segregation
> Ninguém deve ser forçado a depender de métodos que não usa.

Interface gorda (`Repositorio` com 20 métodos) obriga implementações a preencher métodos irrelevantes e força recompilação em quem não se importa. Preferir interfaces pequenas e coesas, definidas **pelo consumidor** e nomeadas pelo papel que exercem (`BuscadorDePedidos`, não `PedidoRepositoryInterface`).

### D — Dependency Inversion
> Módulos de alto nível não devem depender de módulos de baixo nível; ambos dependem de abstrações.

O domínio define a interface (`RepositorioDePedidos`); a infraestrutura implementa (`PedidoRepositoryJpa`). A seta de dependência aponta **para dentro**, para o domínio.

É a base da Arquitetura Hexagonal e o motivo real pelo qual injeção por construtor importa. Também é o que permite testar o domínio sem banco, sem Spring, sem Kafka.

**Exercício de fechamento:** montar um pacote de domínio no projeto dela que **não importe nada de Spring nem de JPA**. Se não for possível hoje, listar o que impede — essa lista é o mapa da refatoração.

---

## Parte 3 — Padrões de projeto (semanas 9-12)

Estudar pelo **problema que resolvem**, nunca pelo diagrama UML.

| Padrão | Problema | Onde ela já usa |
|---|---|---|
| **Strategy** | Trocar algoritmo em runtime; matar `switch` | `List<Validador>` injetada pelo Spring |
| **Factory** | Criação complexa ou condicional | `EntityManagerFactory` |
| **Builder** | Muitos parâmetros opcionais | `WebClient.builder()`, `@Builder` do Lombok |
| **Template Method** | Fluxo fixo com passos variáveis | `JdbcTemplate`, `KafkaTemplate` |
| **Decorator** | Adicionar comportamento sem herança | Interceptors, `BufferedInputStream` |
| **Adapter** | Encaixar API externa no domínio | Camada anticorrupção |
| **Chain of Responsibility** | Pipeline de tratamento | `FilterChain` do Spring Security |
| **Observer** | Reagir a eventos | `ApplicationEventPublisher` |
| **Facade** | Simplificar subsistema complexo | Camada de serviço |
| **Singleton** | Instância única | Bean padrão do Spring |

### A parte que separa pleno de sênior: saber quando **não** usar

Padrão aplicado sem necessidade é complexidade acidental. A resposta que impressiona é sempre concreta:

> *"Usei Strategy no cálculo de imposto porque tínhamos seis regras variando por estado e uma nova entrando por trimestre. Não usaria se fossem duas — um `if` seria mais legível e mais fácil de mudar."*

**Exercício:** achar no código dela um padrão aplicado sem necessidade (fábrica que cria uma coisa só, interface com uma implementação única e sem perspectiva de segunda, camada que só repassa chamada) e simplificar. Remover abstração desnecessária é tão valioso quanto adicionar a certa.

---

## Parte 4 — Testes como design (contínuo)

Código difícil de testar é código mal desenhado. O teste é o primeiro cliente da API.

- Dependência estática (`LocalDateTime.now()`, `new RestTemplate()` dentro do método) → impossível de isolar. Injetar.
- Método privado que ela "queria testar" → sinal de que ele quer ser uma classe própria.
- Teste que precisa de 8 mocks → a classe tem dependências demais (volta ao SRP).
- Nome de teste deve descrever comportamento: `deveRecusarPedidoQuandoEstoqueInsuficiente()`, não `testPedido1()`.
- Padrão **AAA**: Arrange, Act, Assert, com linhas em branco separando.
- Um conceito por teste. Vários asserts sobre o mesmo conceito, tudo bem; testar três comportamentos num teste só, não.

---

## Perguntas de entrevista desta trilha

- Dê um exemplo real de violação de SRP que você viu e como resolveu.
- Como você explicaria Open/Closed para alguém júnior, sem jargão?
- Quando **não** vale aplicar um padrão de projeto?
- Você recebe um PR com um método de 200 linhas que funciona e está testado. O que você faz?
- Como você refatora com segurança um código legado sem testes?
  > *Resposta esperada:* primeiro criar testes de caracterização (que capturam o comportamento atual, mesmo que errado), depois refatorar em passos pequenos, mantendo o build verde a cada passo. Nunca refatorar e mudar comportamento no mesmo commit.
- O que é dívida técnica e como você a comunica para quem não é técnico?
  > *Resposta esperada:* traduzir em tempo e risco — "cada feature nessa área leva 3x mais tempo e tem 2x mais bugs" — não em "o código está feio".
- Explique acoplamento e coesão com um exemplo do seu sistema atual.

### Checklist de fluência (60 segundos)

- [ ] Refatorar ≠ feature
- [ ] Coesão vs acoplamento
- [ ] Smell: nomear pelo menos cinco da tabela
- [ ] SOLID: uma frase cada, sem sigla expandida de memória falha
- [ ] DIP: a seta aponta para o domínio
- [ ] Padrão: problema primeiro, diagrama nunca primeiro
- [ ] Teste difícil = design ruim

## Recursos
- **Clean Code** (Uncle Bob) — capítulos 2 a 7 são excelentes. A parte final envelheceu; ler com senso crítico e não tratar como dogma.
- **Refactoring** (Fowler, 2ª ed.) — o catálogo de refatorações e o de code smells. Mais útil no dia a dia que o Clean Code.
- **Tidy First?** (Kent Beck) — curto, sobre quando refatorar vale a pena.
- refactoring.guru — referência visual rápida para padrões e refatorações.
