---
slug: strategy
categorySlug: low-level-design
title: "Padrão Strategy"
navTitle: Strategy
summary: Definir uma família de algoritmos intercambiáveis, encapsulados em classes separadas
level: intermediario
order: 22
section: padroes-comportamentais
---

## Objetivos de aprendizagem

- [ ] Implementar Strategy em Java para tornar um algoritmo trocável em tempo de execução
- [ ] Reconhecer Strategy como a aplicação direta de OCP vista na aula de SOLID

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Definir uma família de algoritmos, encapsular cada um numa classe separada implementando a mesma interface, e torná-los intercambiáveis — o código que usa o algoritmo (o *contexto*) não precisa saber qual implementação concreta está usando, nem mudar quando uma nova variação aparece.

![Strategy — troca o algoritmo sem tocar no contexto](/diagrams/lld-strategy.svg)

### Problema sem o padrão

```java
public class CalculadoraDeFrete {
    public double calcular(String tipoFrete, Pedido pedido) {
        if (tipoFrete.equals("FIXO")) {
            return 15.0;
        } else if (tipoFrete.equals("POR_PESO")) {
            return pedido.getPesoTotal() * 2.5;
        } else if (tipoFrete.equals("EXPRESSO")) {
            return pedido.getPesoTotal() * 2.5 + 20.0;
        }
        throw new IllegalArgumentException("Tipo de frete desconhecido");
    }
}
```

Esse é exatamente o mesmo sintoma visto na aula de OCP — um `if/else` que cresce a cada nova regra de frete, obrigando a reabrir e editar essa classe toda vez.

### Solução com o padrão

```java
public interface FreteStrategy {
    double calcular(Pedido pedido);
}

public class FreteFixo implements FreteStrategy {
    public double calcular(Pedido pedido) { return 15.0; }
}

public class FretePorPeso implements FreteStrategy {
    public double calcular(Pedido pedido) { return pedido.getPesoTotal() * 2.5; }
}

public class FreteExpresso implements FreteStrategy {
    public double calcular(Pedido pedido) { return pedido.getPesoTotal() * 2.5 + 20.0; }
}

public class CalculadoraDeFrete {
    private final FreteStrategy estrategia;

    public CalculadoraDeFrete(FreteStrategy estrategia) {
        this.estrategia = estrategia;
    }

    public double calcular(Pedido pedido) {
        return estrategia.calcular(pedido);
    }
}
```

```java
CalculadoraDeFrete calculadora = new CalculadoraDeFrete(new FreteExpresso());
double valor = calculadora.calcular(pedido);

// trocar a estratégia em tempo de execução, sem editar CalculadoraDeFrete
CalculadoraDeFrete outraCalculadora = new CalculadoraDeFrete(new FreteFixo());
```

Uma nova regra de frete (`FretePromocional`) é uma classe nova implementando `FreteStrategy` — `CalculadoraDeFrete` nunca é reaberta.

### Strategy vs. Factory Method: não confundir o objetivo

Os dois padrões envolvem uma interface com várias implementações, mas resolvem problemas diferentes: **Factory Method** decide *qual objeto criar*; **Strategy** decide *qual algoritmo executar*, geralmente recebendo a estratégia já pronta via construtor, em vez de criá-la internamente.

### Quando usar / quando não usar

- **Use** quando existem várias formas de realizar a mesma operação, e a escolha entre elas pode mudar em tempo de execução (por configuração, por tipo de cliente, por contexto do pedido).
- **Evite** quando existe só um algoritmo, sem nenhuma variação esperada — nesse caso, a interface e a injeção adicionam complexidade sem trazer flexibilidade real.

## Erros comuns

- Deixar o código cliente decidir qual `Strategy` concreta instanciar através de um `if/else` sobre uma string ou enum — isso apenas move o problema de OCP para outro lugar, sem resolvê-lo (Factory Method resolve exatamente essa parte).
- Colocar estado mutável específico de um caso de uso dentro da própria `Strategy`, tornando-a não reutilizável entre chamadas concorrentes.
- Criar uma `Strategy` para uma variação que na prática nunca muda — nesse caso, o código direto é mais simples de ler.
