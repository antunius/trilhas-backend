---
slug: facade
categorySlug: low-level-design
title: "Padrão Facade"
navTitle: Facade
summary: Fornecer uma interface simples e única para um conjunto de subsistemas complexos
level: intermediario
order: 18
section: padroes-estruturais
---

## Objetivos de aprendizagem

- [ ] Implementar uma Facade que orquestra múltiplos subsistemas
- [ ] Entender que a Facade não substitui os subsistemas, apenas simplifica o acesso a eles

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Fornecer uma interface unificada e simples para um conjunto de interfaces de um subsistema, tornando esse subsistema mais fácil de usar sem esconder a possibilidade de acessar as partes individuais diretamente, quando necessário.

![Facade — uma porta simples para um subsistema complexo](/diagrams/lld-facade.svg)

### Problema sem o padrão

```java
// código cliente conhece e orquestra manualmente três subsistemas
EstoqueService estoque = new EstoqueService();
PagamentoService pagamento = new PagamentoService();
EnvioService envio = new EnvioService();

if (estoque.reservarItens(pedido.getItens())) {
    if (pagamento.cobrar(pedido.getCliente(), pedido.getTotal())) {
        envio.agendarEntrega(pedido);
    } else {
        estoque.liberarItens(pedido.getItens());
    }
}
```

Todo lugar do sistema que precisa "finalizar uma compra" repete essa mesma sequência de chamadas, na mesma ordem, com o mesmo tratamento de erro — e conhece detalhes de três subsistemas diferentes que, na prática, deveriam ser um detalhe de implementação escondido.

### Solução com o padrão

```java
public class CheckoutFacade {
    private final EstoqueService estoque;
    private final PagamentoService pagamento;
    private final EnvioService envio;

    public CheckoutFacade(EstoqueService estoque, PagamentoService pagamento, EnvioService envio) {
        this.estoque = estoque;
        this.pagamento = pagamento;
        this.envio = envio;
    }

    public boolean finalizarCompra(Pedido pedido) {
        if (!estoque.reservarItens(pedido.getItens())) return false;

        if (!pagamento.cobrar(pedido.getCliente(), pedido.getTotal())) {
            estoque.liberarItens(pedido.getItens());
            return false;
        }

        envio.agendarEntrega(pedido);
        return true;
    }
}
```

```java
// código cliente: uma chamada só, sem conhecer os três subsistemas
CheckoutFacade checkout = new CheckoutFacade(estoque, pagamento, envio);
checkout.finalizarCompra(pedido);
```

A ordem correta de chamadas e o tratamento de falha ficam centralizados num único lugar — qualquer parte do sistema que precisa finalizar uma compra usa a mesma Facade, sem duplicar a orquestração.

### Quando usar / quando não usar

- **Use** quando um fluxo de negócio exige orquestrar vários subsistemas numa ordem específica, e essa orquestração se repetiria em vários pontos do código sem a Facade.
- **Evite** criar uma Facade que apenas repassa uma única chamada para um único subsistema, sem agregar nenhuma orquestração real — isso só adiciona uma camada sem propósito.

## Erros comuns

- Transformar a Facade num "Deus objeto" que acumula lógica de negócio própria, em vez de apenas orquestrar os subsistemas existentes.
- Esconder completamente os subsistemas atrás da Facade, impedindo código avançado de acessá-los diretamente quando um caso legítimo exige mais controle do que a Facade oferece.
- Criar uma Facade para um único subsistema sem nenhuma orquestração — nesse caso, não há problema real sendo resolvido.
