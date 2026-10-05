---
slug: lsp-substituicao-de-liskov
categorySlug: low-level-design
title: "SOLID: Princípio da Substituição de Liskov (LSP)"
navTitle: "L — Substituição de Liskov"
summary: Uma subclasse deve poder substituir sua superclasse sem quebrar o comportamento esperado
level: intermediario
order: 10
section: solid
---

## Objetivos de aprendizagem

- [ ] Enunciar o Princípio da Substituição de Liskov
- [ ] Reconhecer o clássico exemplo "Quadrado é um Retângulo" e por que ele viola LSP

## Estrutura da aula

1. O enunciado
2. O exemplo clássico: Quadrado e Retângulo
3. Outros sintomas de violação
4. Como corrigir

## Conteúdo

### O enunciado

"Objetos de uma superclasse devem poder ser substituídos por objetos de suas subclasses sem quebrar a corretude do programa." Em outras palavras: se o código funciona com uma referência do tipo `Forma`, ele deve continuar funcionando corretamente não importa qual subclasse concreta de `Forma` esteja por trás — sem surpresas, sem exceções inesperadas, sem comportamento diferente do que o contrato da superclasse promete.

### O exemplo clássico

Matematicamente, um quadrado é um retângulo especial (com largura igual à altura). Modelar isso com herança direta, porém, quebra LSP:

```java
public class Retangulo {
    protected double largura;
    protected double altura;

    public void setLargura(double largura) { this.largura = largura; }
    public void setAltura(double altura) { this.altura = altura; }
    public double calcularArea() { return largura * altura; }
}

public class Quadrado extends Retangulo {
    @Override
    public void setLargura(double largura) {
        this.largura = largura;
        this.altura = largura; // precisa manter os dois lados iguais
    }

    @Override
    public void setAltura(double altura) {
        this.altura = altura;
        this.largura = altura;
    }
}
```

```java
// código que funciona para QUALQUER Retangulo, segundo o contrato da classe
public void testar(Retangulo r) {
    r.setLargura(5);
    r.setAltura(4);
    assert r.calcularArea() == 20; // funciona com Retangulo, quebra com Quadrado (retorna 16)
}
```

`Quadrado` é tecnicamente um `Retangulo` na herança do Java, mas viola o comportamento que o código cliente espera de qualquer `Retangulo` — substituir um pelo outro muda o resultado do programa.

### Outros sintomas de violação

- Uma subclasse que lança `UnsupportedOperationException` num método herdado, porque "esse método não faz sentido para ela" (ex.: `Pinguim extends Ave` com um método `voar()` que o pinguim não pode implementar).
- Uma subclasse que exige pré-condições mais restritivas que a superclasse (ex.: a superclasse aceita qualquer inteiro, a subclasse lança exception para números negativos).
- Uma subclasse que enfraquece a pós-condição prometida (a superclasse promete devolver uma lista ordenada; a subclasse devolve desordenada em alguns casos).

### Como corrigir

Quando a hierarquia natural ("é um", na linguagem do dia a dia) não sobrevive ao teste de substituição, o problema geralmente é modelar como herança algo que deveria ser duas abstrações separadas, ou usar composição em vez de herança:

```java
// Forma genérica sem assumir que largura/altura são independentes
public interface Forma {
    double calcularArea();
}

public class Retangulo implements Forma {
    private final double largura, altura;
    public Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura = altura;
    }
    public double calcularArea() { return largura * altura; }
}

public class Quadrado implements Forma {
    private final double lado;
    public Quadrado(double lado) { this.lado = lado; }
    public double calcularArea() { return lado * lado; }
}
```

Nenhuma classe finge ser uma variação da outra — cada uma implementa o contrato de `Forma` de forma independente e consistente.

## Erros comuns

- Criar uma hierarquia de herança baseada em relação conceitual do mundo real ("pinguim é uma ave") sem verificar se o comportamento realmente é substituível no código.
- Lançar exception num método sobrescrito "porque essa subclasse não suporta essa operação", em vez de repensar a hierarquia.
- Fortalecer pré-condições ou enfraquecer pós-condições numa subclasse, quebrando expectativas de quem programa contra a superclasse.
