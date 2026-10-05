---
slug: state
categorySlug: low-level-design
title: "Padrão State"
navTitle: State
summary: Permitir que um objeto altere seu comportamento quando seu estado interno muda
level: intermediario
order: 23
section: padroes-comportamentais
---

## Objetivos de aprendizagem

- [ ] Implementar State em Java para modelar uma máquina de estados sem `switch` gigante
- [ ] Diferenciar State de Strategy, apesar da estrutura de código quase idêntica

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. State vs. Strategy
5. Erros comuns

## Conteúdo

### Intenção

Permitir que um objeto mude seu comportamento quando seu estado interno muda, fazendo parecer que o objeto mudou de classe. Cada estado possível vira uma classe própria, responsável por decidir o que acontece em cada transição — em vez de um único método gigante checando "em que estado eu estou" a cada chamada.

![State — o objeto muda de comportamento trocando de estado interno](/diagrams/lld-state.svg)

### Problema sem o padrão

```java
public class Pedido {
    private String estado = "CRIADO";

    public void pagar() {
        if (estado.equals("CRIADO")) {
            estado = "PAGO";
        } else {
            throw new IllegalStateException("Não é possível pagar um pedido " + estado);
        }
    }

    public void enviar() {
        if (estado.equals("PAGO")) {
            estado = "ENVIADO";
        } else {
            throw new IllegalStateException("Não é possível enviar um pedido " + estado);
        }
    }

    public void cancelar() {
        if (estado.equals("CRIADO") || estado.equals("PAGO")) {
            estado = "CANCELADO";
        } else {
            throw new IllegalStateException("Não é possível cancelar um pedido " + estado);
        }
    }
}
```

Cada método precisa checar manualmente em que estado o pedido está, e cada novo estado (ex.: "DEVOLVIDO") exige revisar todos os métodos existentes, procurando onde essa nova transição se encaixa.

### Solução com o padrão

```java
public interface EstadoPedido {
    EstadoPedido pagar();
    EstadoPedido enviar();
    EstadoPedido cancelar();
}

public class Criado implements EstadoPedido {
    public EstadoPedido pagar() { return new Pago(); }
    public EstadoPedido enviar() { throw new IllegalStateException("Pague antes de enviar"); }
    public EstadoPedido cancelar() { return new Cancelado(); }
}

public class Pago implements EstadoPedido {
    public EstadoPedido pagar() { throw new IllegalStateException("Já está pago"); }
    public EstadoPedido enviar() { return new Enviado(); }
    public EstadoPedido cancelar() { return new Cancelado(); }
}

public class Enviado implements EstadoPedido {
    public EstadoPedido pagar() { throw new IllegalStateException("Já está pago"); }
    public EstadoPedido enviar() { throw new IllegalStateException("Já foi enviado"); }
    public EstadoPedido cancelar() { throw new IllegalStateException("Não é possível cancelar um pedido enviado"); }
}

public class Cancelado implements EstadoPedido {
    public EstadoPedido pagar() { throw new IllegalStateException("Pedido cancelado"); }
    public EstadoPedido enviar() { throw new IllegalStateException("Pedido cancelado"); }
    public EstadoPedido cancelar() { throw new IllegalStateException("Já está cancelado"); }
}

public class Pedido {
    private EstadoPedido estado = new Criado();

    public void pagar() { estado = estado.pagar(); }
    public void enviar() { estado = estado.enviar(); }
    public void cancelar() { estado = estado.cancelar(); }
}
```

Cada classe de estado sabe exatamente para quais outros estados pode transicionar. Adicionar um novo estado (`Devolvido`) significa criar uma classe nova e ajustar só quem transiciona para ela — sem tocar num `if/else` central que cresce sem parar.

### State vs. Strategy

A estrutura de código é praticamente idêntica (uma interface, várias implementações, um contexto que delega). A diferença é de intenção: em **Strategy**, o código cliente escolhe explicitamente qual algoritmo usar, e a estratégia normalmente não muda sozinha durante a execução; em **State**, é o próprio objeto que transiciona de um estado para outro como consequência de suas operações, e o cliente só interage com o contexto (`Pedido`), sem nunca escolher o estado diretamente.

## Erros comuns

- Deixar o contexto (`Pedido`) continuar checando o tipo do estado atual com `if (estado instanceof Pago)` — isso anula o propósito do padrão.
- Esquecer de tratar transições inválidas explicitamente em cada estado, deixando que uma transição não prevista falhe de forma confusa (`NullPointerException` em vez de uma exception clara).
- Compartilhar uma única instância mutável de estado entre múltiplos contextos, quando cada `Pedido` deveria ter sua própria transição independente.
