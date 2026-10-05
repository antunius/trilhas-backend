---
slug: srp-responsabilidade-unica
categorySlug: low-level-design
title: "SOLID: Princípio da Responsabilidade Única (SRP)"
navTitle: "S — Responsabilidade Única"
summary: Uma classe deve ter apenas um motivo para mudar
level: intermediario
order: 8
section: solid
---

## Objetivos de aprendizagem

- [ ] Enunciar o Princípio da Responsabilidade Única e o que "responsabilidade" significa aqui
- [ ] Refatorar uma classe que viola SRP separando as responsabilidades

## Estrutura da aula

1. O enunciado
2. Exemplo que viola o princípio
3. Refatorando com SRP
4. Quando não exagerar

## Conteúdo

### O enunciado

"Uma classe deve ter apenas um motivo para mudar." Isso não significa "uma classe deve ter um método só" — significa que todo o comportamento de uma classe deve estar a serviço de um único ator ou uma única responsabilidade do negócio. Se duas partes do sistema, por razões completamente diferentes, forçam mudanças na mesma classe, essa classe está fazendo coisas demais.

### Exemplo que viola o princípio

```java
public class Funcionario {
    private String nome;
    private double salario;

    public double calcularPagamento() {
        // regra de negócio de folha de pagamento
        return salario * 1.1;
    }

    public void salvar() {
        // regra de persistência
        // conecta no banco e faz o INSERT/UPDATE
    }

    public String gerarRelatorioEmHtml() {
        // regra de apresentação
        return "<html><body>" + nome + "</body></html>";
    }
}
```

Essa classe tem três motivos para mudar: uma mudança na regra de cálculo de pagamento, uma mudança no banco de dados (trocar de Postgres para MongoDB), e uma mudança no formato do relatório (de HTML para PDF) — três times diferentes de um negócio real mexeriam nessa mesma classe por razões completamente distintas.

### Refatorando com SRP

```java
public class Funcionario {
    private String nome;
    private double salario;
    // getters
}

public class CalculadoraDePagamento {
    public double calcular(Funcionario funcionario) {
        return funcionario.getSalario() * 1.1;
    }
}

public class RepositorioDeFuncionario {
    public void salvar(Funcionario funcionario) {
        // conecta no banco e faz o INSERT/UPDATE
    }
}

public class RelatorioDeFuncionarioHtml {
    public String gerar(Funcionario funcionario) {
        return "<html><body>" + funcionario.getNome() + "</body></html>";
    }
}
```

Agora, uma mudança na regra de cálculo só toca `CalculadoraDePagamento`; trocar de banco só toca `RepositorioDeFuncionario`; mudar o formato do relatório só toca a classe de relatório. Cada classe tem exatamente um motivo para mudar.

### Quando não exagerar

SRP não significa criar uma classe para cada método. Se duas operações sempre mudam juntas, pela mesma razão de negócio, elas provavelmente pertencem à mesma classe — dividir demais cria uma explosão de classes triviais que também prejudica a leitura. O critério é sempre "motivo para mudar", não "número de métodos".

## Erros comuns

- Dividir uma classe em várias só para ter classes menores, sem que cada uma corresponda a um motivo de mudança distinto.
- Deixar uma classe de domínio (ex.: `Funcionario`) acumular lógica de persistência, apresentação e regra de negócio — o sintoma mais comum de violação de SRP.
- Confundir SRP com "uma classe, um método" — o princípio é sobre coesão de propósito, não sobre contagem de métodos.
