---
slug: pilares-poo-revisao
categorySlug: low-level-design
title: "Revisão: os Quatro Pilares da Orientação a Objetos"
navTitle: Revisão dos Pilares de POO
summary: Revisar encapsulamento, abstração, herança e polimorfismo em Java como base para o resto do curso
level: iniciante
order: 2
section: fundamentos
---

## Objetivos de aprendizagem

- [ ] Revisar os quatro pilares de POO com exemplos em Java
- [ ] Identificar qual pilar cada padrão de projeto vai explorar mais adiante no curso

## Estrutura da aula

1. Encapsulamento
2. Abstração
3. Herança
4. Polimorfismo

## Conteúdo

### Encapsulamento

Esconder o estado interno de um objeto e expor apenas o que é necessário através de métodos. Não é só "usar `private`" — é desenhar a classe para que ela nunca fique num estado inconsistente.

```java
public class ContaBancaria {
    private double saldo;

    public void depositar(double valor) {
        if (valor <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
        this.saldo += valor;
    }

    public void sacar(double valor) {
        if (valor > saldo) throw new IllegalStateException("Saldo insuficiente");
        this.saldo -= valor;
    }

    public double getSaldo() {
        return saldo;
    }
}
```

Sem encapsulamento (`saldo` público, mutável de fora), nada impede outro código de fazer `conta.saldo = -1000`, ignorando as regras de negócio.

### Abstração

Expor uma interface simples que esconde a complexidade da implementação. Em Java, isso é feito com `interface` ou classes abstratas: quem usa `List<String>` não precisa saber se por trás existe um `ArrayList` ou um `LinkedList`.

```java
public interface NotificadorPagamento {
    void notificar(String destinatario, String mensagem);
}
```

Quem chama `notificador.notificar(...)` não sabe (nem precisa saber) se a implementação manda e-mail, SMS ou push notification.

### Herança

Uma classe reaproveita e especializa o comportamento de outra. Herança é poderosa, mas é o pilar mais fácil de abusar — usar herança para reaproveitar código, sem que exista uma relação real de "é um", é uma causa comum de design frágil (veremos isso no princípio de Liskov, mais adiante).

```java
public class Veiculo {
    protected int velocidadeMaxima;

    public void acelerar() {
        System.out.println("Acelerando até " + velocidadeMaxima + " km/h");
    }
}

public class Carro extends Veiculo {
    public Carro() {
        this.velocidadeMaxima = 180;
    }
}
```

### Polimorfismo

O mesmo método se comporta de forma diferente dependendo do objeto concreto por trás de uma referência de tipo mais genérico. É o pilar que praticamente todos os padrões de projeto do GoF exploram: código escrito contra uma interface funciona com qualquer implementação futura, sem precisar de `if/else` verificando o tipo concreto.

```java
public interface FormaGeometrica {
    double calcularArea();
}

public class Circulo implements FormaGeometrica {
    private double raio;
    public Circulo(double raio) { this.raio = raio; }
    public double calcularArea() { return Math.PI * raio * raio; }
}

public class Retangulo implements FormaGeometrica {
    private double largura, altura;
    public Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura = altura;
    }
    public double calcularArea() { return largura * altura; }
}

// em qualquer lugar do código:
List<FormaGeometrica> formas = List.of(new Circulo(2), new Retangulo(3, 4));
for (FormaGeometrica forma : formas) {
    System.out.println(forma.calcularArea()); // cada uma calcula do seu jeito
}
```

## Erros comuns

- Confundir "classe com muitos getters/setters" com encapsulamento — expor todo o estado através de getters/setters públicos anula o propósito do encapsulamento.
- Usar herança para reaproveitar código entre classes que não têm uma relação "é um" genuína (o sintoma clássico é sobrescrever um método para "desligar" um comportamento herdado).
- Escrever `if (forma instanceof Circulo) ... else if (forma instanceof Retangulo) ...` em vez de deixar o polimorfismo resolver — um sinal recorrente de que falta uma interface ou um método virtual.
