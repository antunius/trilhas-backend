---
slug: builder
categorySlug: low-level-design
title: "Padrão Builder"
navTitle: Builder
summary: Construir objetos complexos passo a passo, evitando construtores com muitos parâmetros
level: intermediario
order: 15
section: padroes-criacionais
---

## Objetivos de aprendizagem

- [ ] Implementar Builder com encadeamento fluente em Java
- [ ] Reconhecer o "telescoping constructor" como o problema que o Builder resolve

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Separar a construção de um objeto complexo (com muitos campos opcionais) da sua representação final, permitindo montar o objeto passo a passo e só materializá-lo quando todos os dados necessários estiverem definidos.

![Builder — encadeamento fluente](/diagrams/lld-builder.svg)

### Problema sem o padrão

```java
public class Pedido {
    private String cliente;
    private List<Item> itens;
    private String cupom;
    private String enderecoEntrega;
    private boolean presente;

    // "telescoping constructor": uma sobrecarga para cada combinação de opcionais
    public Pedido(String cliente, List<Item> itens) { ... }
    public Pedido(String cliente, List<Item> itens, String cupom) { ... }
    public Pedido(String cliente, List<Item> itens, String cupom, String enderecoEntrega) { ... }
    public Pedido(String cliente, List<Item> itens, String cupom, String enderecoEntrega, boolean presente) { ... }
}
```

Cada novo campo opcional multiplica o número de construtores necessários, e uma chamada como `new Pedido("Ana", itens, null, null, true)` é difícil de ler — não fica claro, na chamada, o que cada `null` ou `true` representa.

### Solução com o padrão

```java
public class Pedido {
    private final String cliente;
    private final List<Item> itens;
    private final String cupom;
    private final String enderecoEntrega;
    private final boolean presente;

    private Pedido(PedidoBuilder builder) {
        this.cliente = builder.cliente;
        this.itens = builder.itens;
        this.cupom = builder.cupom;
        this.enderecoEntrega = builder.enderecoEntrega;
        this.presente = builder.presente;
    }

    public static class PedidoBuilder {
        private String cliente;
        private List<Item> itens = new ArrayList<>();
        private String cupom;
        private String enderecoEntrega;
        private boolean presente = false;

        public PedidoBuilder comCliente(String cliente) {
            this.cliente = cliente;
            return this;
        }

        public PedidoBuilder adicionarItem(Item item) {
            this.itens.add(item);
            return this;
        }

        public PedidoBuilder comCupom(String cupom) {
            this.cupom = cupom;
            return this;
        }

        public PedidoBuilder comEnderecoEntrega(String endereco) {
            this.enderecoEntrega = endereco;
            return this;
        }

        public PedidoBuilder comoPresente() {
            this.presente = true;
            return this;
        }

        public Pedido build() {
            if (cliente == null) throw new IllegalStateException("Cliente é obrigatório");
            return new Pedido(this);
        }
    }
}
```

```java
Pedido pedido = new Pedido.PedidoBuilder()
    .comCliente("Ana")
    .adicionarItem(item1)
    .comCupom("PROMO10")
    .comoPresente()
    .build();
```

Cada método do builder devolve `this`, permitindo encadear as chamadas (*fluent interface*). A chamada final é autoexplicativa — só os campos relevantes aparecem, com nome, sem `null`s posicionais. `build()` também é o lugar natural para validar invariantes antes de criar o objeto final imutável.

### Quando usar / quando não usar

- **Use** quando um objeto tem muitos campos, vários deles opcionais, e a ordem dos parâmetros num construtor tradicional se tornaria confusa ou propensa a erro.
- **Evite** para objetos simples com dois ou três campos obrigatórios — um construtor comum já resolve, e um Builder ali só adiciona código sem necessidade.

## Erros comuns

- Usar Builder para uma classe com poucos campos obrigatórios, sem nenhum opcional — complexidade desnecessária.
- Esquecer de validar invariantes em `build()`, permitindo criar um objeto num estado inválido (ex.: `Pedido` sem cliente).
- Deixar os campos do objeto final mutáveis depois de construído — um dos maiores ganhos do Builder é permitir que o objeto final seja imutável (todos os campos `final`), mesmo tendo sido montado em várias etapas.
