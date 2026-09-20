---
slug: classes-coesas-e-acopladas
categorySlug: low-level-design
title: "Clean Code: Coesão e Acoplamento em Classes"
navTitle: Coesão e Acoplamento
summary: Entender coesão alta e acoplamento baixo como a ponte entre Clean Code e SOLID
level: intermediario
order: 7
section: clean-code
---

## Objetivos de aprendizagem

- [ ] Reconhecer uma classe com baixa coesão (faz coisas não relacionadas)
- [ ] Reconhecer acoplamento alto entre classes e saber reduzi-lo

## Estrutura da aula

1. Coesão: os membros de uma classe pertencem juntos?
2. Uma classe pequena não é o objetivo — coesão é
3. Acoplamento: o quanto uma classe depende dos detalhes de outra
4. Ponte para SOLID

## Conteúdo

### Coesão: os membros pertencem juntos?

Uma classe tem alta coesão quando seus atributos e métodos trabalham juntos para um propósito único e bem definido. O teste prático: se você consegue dividir os métodos de uma classe em dois grupos que quase não usam os mesmos atributos, provavelmente são duas classes disfarçadas de uma.

```java
// baixa coesão: mistura relatório financeiro com envio de e-mail
public class RelatorioMensal {
    private List<Transacao> transacoes;
    private String servidorSmtp;

    public double calcularTotal() {
        return transacoes.stream().mapToDouble(Transacao::getValor).sum();
    }

    public void enviarPorEmail(String destinatario) {
        // conecta no servidorSmtp e manda o relatório
    }
}
```

```java
// alta coesão: cada classe tem um propósito único
public class RelatorioMensal {
    private List<Transacao> transacoes;

    public double calcularTotal() {
        return transacoes.stream().mapToDouble(Transacao::getValor).sum();
    }
}

public class EnvioDeRelatorio {
    private String servidorSmtp;

    public void enviar(RelatorioMensal relatorio, String destinatario) {
        // conecta no servidorSmtp e manda o relatório
    }
}
```

### Uma classe pequena não é o objetivo — coesão é

Dividir uma classe em várias só para reduzir o número de linhas, sem que cada parte tenha um propósito coerente, não melhora nada — só espalha a confusão por mais arquivos. O objetivo é sempre a coesão; o tamanho pequeno é uma consequência natural dela, não a meta em si.

### Acoplamento: o quanto uma classe depende dos detalhes de outra

Acoplamento é o grau em que uma classe conhece e depende dos detalhes internos de outra. Acoplamento alto significa que mudar uma classe força mudanças em cascata em outras. Um sinal comum de acoplamento excessivo: uma classe que instancia diretamente (`new`) as classes concretas de que depende, em vez de receber uma interface.

```java
// alto acoplamento: ServicoDePedido conhece a implementação concreta
public class ServicoDePedido {
    private EmailSender emailSender = new EmailSender(); // classe concreta

    public void finalizar(Pedido pedido) {
        emailSender.enviar(pedido.getCliente().getEmail(), "Pedido confirmado");
    }
}

// baixo acoplamento: depende de uma interface, não da implementação
public class ServicoDePedido {
    private final NotificadorPagamento notificador; // interface

    public ServicoDePedido(NotificadorPagamento notificador) {
        this.notificador = notificador;
    }

    public void finalizar(Pedido pedido) {
        notificador.notificar(pedido.getCliente().getEmail(), "Pedido confirmado");
    }
}
```

A segunda versão de `ServicoDePedido` pode trocar de e-mail para SMS sem precisar mudar uma linha — e pode ser testada com uma implementação falsa de `NotificadorPagamento`, sem depender de um servidor de e-mail de verdade.

### Ponte para SOLID

Coesão alta e acoplamento baixo são o objetivo prático por trás de quase todo princípio SOLID que vem a seguir: **S**RP é, essencialmente, "mantenha a coesão alta dividindo responsabilidades diferentes em classes diferentes"; **D**IP é, essencialmente, "reduza o acoplamento dependendo de abstrações, não de implementações concretas". Os próximos cinco artigos dão nome e estrutura formal a essas ideias.

## Erros comuns

- Medir qualidade de design pelo número de linhas por classe, em vez de pela coesão real dos seus membros.
- Instanciar classes concretas dentro de outra classe (`new ServicoConcreto()`) em vez de receber uma interface por parâmetro/construtor.
- Dividir uma classe grande em várias classes pequenas sem verificar se cada uma ficou coesa — só movendo a bagunça de lugar.
