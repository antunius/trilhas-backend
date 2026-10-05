---
slug: ocp-aberto-fechado
categorySlug: low-level-design
title: "SOLID: Princípio Aberto/Fechado (OCP)"
navTitle: "O — Aberto/Fechado"
summary: Aberto para extensão, fechado para modificação
level: intermediario
order: 9
section: solid
---

## Objetivos de aprendizagem

- [ ] Enunciar o Princípio Aberto/Fechado
- [ ] Refatorar um `switch`/`if-else` que cresce a cada novo requisito, usando polimorfismo

## Estrutura da aula

1. O enunciado
2. O sintoma clássico: o `switch` que não para de crescer
3. Refatorando com OCP
4. OCP e os padrões de projeto

## Conteúdo

### O enunciado

"Entidades de software (classes, módulos, funções) devem estar abertas para extensão, mas fechadas para modificação." Na prática: quando um novo requisito aparece, você deveria conseguir *adicionar* código novo (uma nova classe, uma nova implementação de interface), sem *editar* código que já funciona e já foi testado.

### O sintoma clássico

```java
public class CalculadoraDeDesconto {
    public double calcular(String tipoCliente, double valor) {
        if (tipoCliente.equals("REGULAR")) {
            return valor * 0.95;
        } else if (tipoCliente.equals("PREMIUM")) {
            return valor * 0.85;
        } else if (tipoCliente.equals("VIP")) {
            return valor * 0.70;
        }
        return valor;
    }
}
```

Toda vez que um novo tipo de cliente aparece, alguém precisa abrir essa classe, encontrar o lugar certo no meio do `if-else`, e editar um código que já estava em produção — arriscando quebrar os casos que já funcionavam.

### Refatorando com OCP

```java
public interface PoliticaDeDesconto {
    double aplicar(double valor);
}

public class DescontoRegular implements PoliticaDeDesconto {
    public double aplicar(double valor) { return valor * 0.95; }
}

public class DescontoPremium implements PoliticaDeDesconto {
    public double aplicar(double valor) { return valor * 0.85; }
}

public class DescontoVip implements PoliticaDeDesconto {
    public double aplicar(double valor) { return valor * 0.70; }
}

public class CalculadoraDeDesconto {
    public double calcular(PoliticaDeDesconto politica, double valor) {
        return politica.aplicar(valor);
    }
}
```

Um novo tipo de cliente (ex.: `DescontoAtacado`) vira uma nova classe implementando `PoliticaDeDesconto` — `CalculadoraDeDesconto` nunca precisa ser reaberta ou editada de novo.

### OCP e os padrões de projeto

OCP é o princípio que mais aparece por trás dos padrões de projeto que vêm nas próximas aulas: **Strategy** (que veremos adiante) é literalmente esse exemplo — trocar um `if-else` de comportamento por implementações intercambiáveis de uma interface. **Factory Method** e **Decorator** também existem, em grande parte, para permitir estender comportamento sem editar código existente.

## Erros comuns

- Tentar prever toda extensão futura possível e criar abstrações genéricas demais "por precaução" — OCP se aplica onde já existe evidência de mudança recorrente, não em qualquer lugar por padrão.
- Continuar crescendo um `if-else`/`switch` central toda vez que aparece um novo caso, em vez de extrair uma interface.
- Confundir "fechado para modificação" com "nunca mais mexer na classe" — a classe pode (e deve) ser corrigida se tiver um bug; o que ela não deveria precisar é ser reaberta a cada novo caso de uso.
