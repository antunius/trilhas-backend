---
slug: isp-segregacao-de-interfaces
categorySlug: low-level-design
title: "SOLID: Princípio da Segregação de Interfaces (ISP)"
navTitle: "I — Segregação de Interfaces"
summary: Nenhum cliente deve ser forçado a depender de métodos que não usa
level: intermediario
order: 11
section: solid
---

## Objetivos de aprendizagem

- [ ] Enunciar o Princípio da Segregação de Interfaces
- [ ] Dividir uma interface "gorda" em interfaces menores e específicas

## Estrutura da aula

1. O enunciado
2. O sintoma: a interface gorda
3. Refatorando com ISP
4. ISP e SRP: princípios relacionados, focos diferentes

## Conteúdo

### O enunciado

"Nenhum cliente deveria ser forçado a depender de métodos que não usa." Uma interface muito grande, com métodos de propósitos diferentes, força quem a implementa a fornecer implementações (às vezes vazias, às vezes lançando exception) para métodos que simplesmente não fazem sentido para aquele caso.

### O sintoma: a interface gorda

```java
public interface Trabalhador {
    void trabalhar();
    void almocar();
    void receberSalario();
}

public class RoboTrabalhador implements Trabalhador {
    public void trabalhar() { /* ok */ }

    public void almocar() {
        throw new UnsupportedOperationException("Robôs não almoçam");
    }

    public void receberSalario() {
        throw new UnsupportedOperationException("Robôs não recebem salário");
    }
}
```

`RoboTrabalhador` é forçado a implementar dois métodos que não fazem sentido para ele, só porque a interface `Trabalhador` juntou responsabilidades que não pertencem a todo tipo de trabalhador.

### Refatorando com ISP

```java
public interface Trabalhavel {
    void trabalhar();
}

public interface Alimentavel {
    void almocar();
}

public interface Remuneravel {
    void receberSalario();
}

public class FuncionarioHumano implements Trabalhavel, Alimentavel, Remuneravel {
    public void trabalhar() { /* ... */ }
    public void almocar() { /* ... */ }
    public void receberSalario() { /* ... */ }
}

public class RoboTrabalhador implements Trabalhavel {
    public void trabalhar() { /* ... */ }
}
```

Cada classe implementa só as interfaces que fazem sentido para ela. Um método que recebe um `Trabalhavel` funciona tanto com `FuncionarioHumano` quanto com `RoboTrabalhador`, sem que nenhum dos dois precise fingir suportar operações que não fazem sentido.

### ISP e SRP: princípios relacionados, focos diferentes

SRP fala sobre classes: uma classe deve ter um único motivo para mudar. ISP fala sobre interfaces (contratos): uma interface deve representar um único conjunto coeso de comportamentos, para que quem a implementa não seja forçado a lidar com o que não usa. Na prática, os dois costumam andar juntos — uma interface "gorda" geralmente nasce de um design onde uma classe também estava fazendo coisas demais.

## Erros comuns

- Criar uma única interface grande "para cobrir todos os casos", em vez de várias interfaces pequenas e específicas.
- Implementar métodos de uma interface lançando `UnsupportedOperationException` — sinal claro de que a interface não deveria ter incluído aquele método para essa classe.
- Confundir ISP com "toda interface deve ter um método só" — o critério é coesão do contrato, não contagem de métodos.
