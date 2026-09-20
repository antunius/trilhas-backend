---
slug: decorator
categorySlug: low-level-design
title: "Padrão Decorator"
navTitle: Decorator
summary: Adicionar comportamento a um objeto dinamicamente, envolvendo-o em camadas, sem herança
level: intermediario
order: 17
section: padroes-estruturais
---

## Objetivos de aprendizagem

- [ ] Implementar Decorator em Java para compor comportamento em tempo de execução
- [ ] Reconhecer a explosão de subclasses que o Decorator evita

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Adicionar responsabilidades a um objeto dinamicamente, envolvendo-o numa ou mais camadas que implementam a mesma interface — uma alternativa mais flexível à herança para estender comportamento, porque as camadas podem ser combinadas em tempo de execução, na ordem que fizer sentido.

![Decorator — camadas envolvendo o mesmo contrato](/diagrams/lld-decorator.svg)

### Problema sem o padrão

```java
// tentando cobrir combinações de ingredientes com herança
public class Cafe { public double custo() { return 5.0; } }
public class CafeComLeite extends Cafe { public double custo() { return 7.0; } }
public class CafeComChocolate extends Cafe { public double custo() { return 8.0; } }
public class CafeComLeiteEChocolate extends Cafe { public double custo() { return 10.0; } }
// e assim por diante — uma subclasse para cada combinação possível
```

Cada novo ingrediente combinável dobra (ou mais) o número de subclasses necessárias — um clássico caso de "explosão de subclasses" que a herança sozinha não resolve bem.

### Solução com o padrão

```java
public interface Bebida {
    double custo();
}

public class CafeSimples implements Bebida {
    public double custo() { return 5.0; }
}

public abstract class BebidaDecorator implements Bebida {
    protected final Bebida bebida;
    public BebidaDecorator(Bebida bebida) { this.bebida = bebida; }
}

public class ComLeite extends BebidaDecorator {
    public ComLeite(Bebida bebida) { super(bebida); }
    public double custo() { return bebida.custo() + 2.0; }
}

public class ComChocolate extends BebidaDecorator {
    public ComChocolate(Bebida bebida) { super(bebida); }
    public double custo() { return bebida.custo() + 3.0; }
}
```

```java
Bebida pedido = new ComChocolate(new ComLeite(new CafeSimples()));
System.out.println(pedido.custo()); // 5.0 + 2.0 + 3.0 = 10.0
```

Cada decorator implementa a mesma interface `Bebida` e delega para o objeto que envolve, adicionando seu próprio incremento. Qualquer combinação de ingredientes vira uma composição de objetos em tempo de execução, sem precisar de uma classe nova para cada combinação.

### Quando usar / quando não usar

- **Use** quando o número de combinações de comportamento cresceria demais como subclasses, e você precisa poder adicionar (ou remover) responsabilidades dinamicamente, em qualquer ordem.
- **Evite** quando as variações são poucas e fixas (duas ou três) — nesse caso, subclasses simples ou até um `if/else` direto podem ser mais fáceis de entender do que uma cadeia de decorators.

## Erros comuns

- Empilhar decorators numa ordem que muda o resultado sem que isso seja intencional ou documentado (ex.: aplicar um decorator de "imposto" antes ou depois de um decorator de "desconto" gera valores diferentes).
- Confundir Decorator com Adapter: Adapter muda a *interface* de um objeto para compatibilizar com outra; Decorator mantém a mesma interface e adiciona *comportamento*.
- Criar decorators com dependências entre si (um decorator que só funciona se outro específico já tiver sido aplicado antes) — isso quebra a promessa de que as camadas podem ser combinadas livremente.
