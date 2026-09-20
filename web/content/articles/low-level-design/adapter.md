---
slug: adapter
categorySlug: low-level-design
title: "Padrão Adapter"
navTitle: Adapter
summary: Encaixar uma interface existente e incompatível na interface que o código cliente espera
level: intermediario
order: 16
section: padroes-estruturais
---

## Objetivos de aprendizagem

- [ ] Implementar Adapter para integrar código legado sem alterá-lo
- [ ] Diferenciar Adapter de simplesmente reescrever a classe legada

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Converter a interface de uma classe existente (que você não pode ou não quer modificar) para outra interface que o código cliente espera. É o padrão que resolve "eu tenho uma peça e uma tomada de formatos diferentes" sem trocar nenhuma das duas.

![Adapter — encaixa uma interface antiga na nova](/diagrams/lld-adapter.svg)

### Problema sem o padrão

```java
// Classe legada, de uma biblioteca externa — não pode ser alterada
public class GatewayPagamentoLegado {
    public void cobrar(int valorCentavos, String moeda) {
        System.out.println("Cobrando " + valorCentavos + " centavos em " + moeda);
    }
}

// Seu sistema já padronizou essa interface para todos os processadores de pagamento
public interface ProcessadorPagamento {
    void processar(double valor);
}
```

O código cliente do seu sistema espera `ProcessadorPagamento.processar(double)`, mas a biblioteca legada expõe `cobrar(int, String)` — assinaturas incompatíveis, sem contar que uma trabalha em reais (double) e a outra em centavos (int).

### Solução com o padrão

```java
public class GatewayLegadoAdapter implements ProcessadorPagamento {
    private final GatewayPagamentoLegado gatewayLegado;

    public GatewayLegadoAdapter(GatewayPagamentoLegado gatewayLegado) {
        this.gatewayLegado = gatewayLegado;
    }

    @Override
    public void processar(double valor) {
        int valorEmCentavos = (int) Math.round(valor * 100);
        gatewayLegado.cobrar(valorEmCentavos, "BRL");
    }
}
```

```java
// código cliente: trabalha só com a interface do seu sistema
ProcessadorPagamento processador = new GatewayLegadoAdapter(new GatewayPagamentoLegado());
processador.processar(49.90);
```

O `Adapter` fica no meio, traduzindo a chamada — o código cliente nunca precisa saber que, por trás, existe uma API legada trabalhando em centavos.

### Quando usar / quando não usar

- **Use** ao integrar uma biblioteca de terceiros, uma API legada, ou qualquer código que você não controla e cuja interface não bate com o que seu sistema já padronizou.
- **Evite** quando você tem controle total sobre as duas pontas — nesse caso, ajustar diretamente uma das interfaces é mais simples do que introduzir uma camada de tradução permanente.

## Erros comuns

- Usar Adapter para "consertar" uma interface mal desenhada dentro do próprio sistema, quando seria mais simples corrigir a interface original.
- Colocar lógica de negócio dentro do Adapter — sua única responsabilidade deveria ser traduzir chamadas e formatos, não decidir regras.
- Criar um Adapter que expõe parte da interface legada junto com a nova, misturando os dois mundos em vez de esconder completamente o legado atrás da interface padronizada.
