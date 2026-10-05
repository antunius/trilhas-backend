---
slug: dip-inversao-de-dependencia
categorySlug: low-level-design
title: "SOLID: Princípio da Inversão de Dependência (DIP)"
navTitle: "D — Inversão de Dependência"
summary: Dependa de abstrações, não de implementações concretas
level: intermediario
order: 12
section: solid
---

## Objetivos de aprendizagem

- [ ] Enunciar o Princípio da Inversão de Dependência
- [ ] Aplicar injeção de dependência para depender de interfaces em vez de classes concretas

## Estrutura da aula

1. O enunciado
2. Exemplo que viola DIP
3. Refatorando com DIP e injeção de dependência
4. DIP fecha o ciclo do SOLID

## Conteúdo

### O enunciado

"Módulos de alto nível não devem depender de módulos de baixo nível — ambos devem depender de abstrações." Na prática: a lógica de negócio (alto nível) não deveria conhecer os detalhes concretos de infraestrutura (baixo nível, como qual banco de dados ou qual provedor de e-mail está sendo usado) — os dois devem depender de uma interface no meio.

### Exemplo que viola DIP

```java
public class MySqlRepositorioDePedido {
    public void salvar(Pedido pedido) {
        // conecta no MySQL e salva
    }
}

public class ServicoDePedido {
    private MySqlRepositorioDePedido repositorio = new MySqlRepositorioDePedido();

    public void finalizar(Pedido pedido) {
        repositorio.salvar(pedido);
    }
}
```

`ServicoDePedido` (lógica de negócio, alto nível) depende diretamente de `MySqlRepositorioDePedido` (detalhe de infraestrutura, baixo nível). Trocar de banco, ou testar `ServicoDePedido` sem um MySQL de verdade rodando, exige mudar a classe de negócio.

### Refatorando com DIP e injeção de dependência

```java
public interface RepositorioDePedido {
    void salvar(Pedido pedido);
}

public class MySqlRepositorioDePedido implements RepositorioDePedido {
    public void salvar(Pedido pedido) {
        // conecta no MySQL e salva
    }
}

public class RepositorioDePedidoEmMemoria implements RepositorioDePedido {
    private final List<Pedido> pedidos = new ArrayList<>();
    public void salvar(Pedido pedido) {
        pedidos.add(pedido);
    }
}

public class ServicoDePedido {
    private final RepositorioDePedido repositorio; // depende da interface

    public ServicoDePedido(RepositorioDePedido repositorio) {
        this.repositorio = repositorio; // injetado de fora (injeção de dependência)
    }

    public void finalizar(Pedido pedido) {
        repositorio.salvar(pedido);
    }
}
```

Agora `ServicoDePedido` (alto nível) e `MySqlRepositorioDePedido` (baixo nível) dependem, ambos, da abstração `RepositorioDePedido` — nenhum dos dois conhece o outro diretamente. Em testes, `ServicoDePedido` pode receber `RepositorioDePedidoEmMemoria`, sem precisar de um banco real.

### DIP fecha o ciclo do SOLID

DIP costuma ser o princípio que sustenta os outros na prática: OCP (estender sem modificar) depende de conseguir injetar uma nova implementação sem tocar no código de alto nível; ISP (interfaces pequenas) só é útil se o código depender dessas interfaces em vez das classes concretas. Frameworks de injeção de dependência (Spring, Guice) existem, em essência, para automatizar a construção de objetos respeitando DIP — mas o princípio em si não exige nenhum framework, como o exemplo acima mostra.

## Erros comuns

- Instanciar classes concretas com `new` dentro da lógica de negócio, em vez de recebê-las via construtor/parâmetro.
- Confundir "inversão de dependência" com "usar um framework de injeção de dependência" — o princípio é sobre depender de abstrações; o framework é só uma ferramenta opcional para automatizar isso.
- Criar uma interface para uma única implementação que nunca vai mudar, sem nenhum ganho real de flexibilidade ou testabilidade — abstração sem propósito é complexidade desnecessária.
