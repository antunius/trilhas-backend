---
slug: funcoes-pequenas-e-coesas
categorySlug: low-level-design
title: "Clean Code: Funções Pequenas e Coesas"
navTitle: Funções Pequenas e Coesas
summary: Escrever funções que fazem uma coisa só, num único nível de abstração
level: iniciante
order: 4
section: clean-code
---

## Objetivos de aprendizagem

- [ ] Reconhecer quando uma função está fazendo mais de uma coisa
- [ ] Extrair funções pequenas mantendo um único nível de abstração

## Estrutura da aula

1. "Faça uma coisa só"
2. Um nível de abstração por função
3. Poucos argumentos, sem flags booleanas
4. Efeitos colaterais escondidos

## Conteúdo

### "Faça uma coisa só"

Uma função deve fazer uma coisa, fazer bem feita, e fazer só ela. O teste prático: se você consegue extrair um pedaço da função para outra função com um nome que não seja apenas reafirmar o comentário, a função original estava fazendo mais de uma coisa.

```java
// ruim: valida, calcula E envia notificação, tudo numa função
public void processarPedido(Pedido pedido) {
    if (pedido.getItens().isEmpty()) throw new IllegalArgumentException("Pedido vazio");
    if (pedido.getCliente() == null) throw new IllegalArgumentException("Cliente obrigatório");

    double total = 0;
    for (Item item : pedido.getItens()) {
        total += item.getPreco() * item.getQuantidade();
    }
    pedido.setTotal(total);

    EmailService.enviar(pedido.getCliente().getEmail(), "Pedido recebido: " + pedido.getId());
}
```

```java
// bom: cada função faz uma coisa, e o nome da função conta a história
public void processarPedido(Pedido pedido) {
    validar(pedido);
    calcularTotal(pedido);
    notificarCliente(pedido);
}

private void validar(Pedido pedido) {
    if (pedido.getItens().isEmpty()) throw new IllegalArgumentException("Pedido vazio");
    if (pedido.getCliente() == null) throw new IllegalArgumentException("Cliente obrigatório");
}

private void calcularTotal(Pedido pedido) {
    double total = pedido.getItens().stream()
        .mapToDouble(item -> item.getPreco() * item.getQuantidade())
        .sum();
    pedido.setTotal(total);
}

private void notificarCliente(Pedido pedido) {
    EmailService.enviar(pedido.getCliente().getEmail(), "Pedido recebido: " + pedido.getId());
}
```

A segunda versão é lida quase como um índice: `processarPedido` conta a história em três passos, e cada passo pode ser lido em detalhe só quando necessário.

### Um nível de abstração por função

Misturar detalhes de baixo nível (concatenação de strings, aritmética) com chamadas de alto nível (`calcularTotal(pedido)`) na mesma função confunde o leitor sobre o quão "fundo" ele está no código. Cada função deve operar num único nível de abstração — a que está mais fácil de ler acima já separa validação, cálculo e notificação em três níveis distintos.

### Poucos argumentos, sem flags booleanas

Funções com muitos parâmetros são difíceis de chamar corretamente e de testar (o número de combinações cresce rápido). Um sinal específico de má função: um parâmetro booleano que muda o comportamento inteiro.

```java
// ruim: o "true" no fim não diz nada para quem lê a chamada
gerarRelatorio(pedido, true);

// bom: dois métodos com nomes que já dizem a intenção
gerarRelatorioDetalhado(pedido);
gerarRelatorioResumido(pedido);
```

### Efeitos colaterais escondidos

Uma função deve fazer o que o nome promete — nada mais. Uma função chamada `validarSenha(senha)` que, além de validar, também inicia a sessão do usuário, esconde um efeito colateral que ninguém vai adivinhar só lendo a chamada.

## Erros comuns

- Funções de 50+ linhas misturando validação, lógica de negócio e efeitos colaterais (I/O, log, notificação).
- Parâmetros booleanos ("flags") que fazem a função se comportar de dois jeitos completamente diferentes.
- Nomes de função que prometem uma coisa e fazem outra (ex.: `getTotal()` que, além de calcular, também salva no banco).
