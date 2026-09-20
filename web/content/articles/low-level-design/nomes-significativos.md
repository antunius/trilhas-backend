---
slug: nomes-significativos
categorySlug: low-level-design
title: "Clean Code: Nomes Significativos"
navTitle: Nomes Significativos
summary: Escolher nomes de variáveis, métodos e classes que comunicam intenção sem precisar de comentário
level: iniciante
order: 3
section: clean-code
---

## Objetivos de aprendizagem

- [ ] Escrever nomes que revelam intenção sem precisar de comentário
- [ ] Reconhecer nomes que escondem ou mentem sobre o que o código faz

## Estrutura da aula

1. Por que nomes importam mais do que parecem
2. Nomes que revelam intenção
3. Evitar desinformação e distâncias artificiais
4. Nomes de classes, métodos e variáveis booleanas

## Conteúdo

### Por que nomes importam

Código é lido muito mais vezes do que é escrito. Um nome ruim custa alguns segundos a mais toda vez que alguém (inclusive você, seis meses depois) precisa entender o que uma variável ou método faz. Multiplicado por centenas de leituras ao longo da vida de um sistema, esse custo pequeno vira um custo real de manutenção.

### Nomes que revelam intenção

Compare:

```java
// ruim: o que é "d"? dias? data? desconto?
int d;

// bom: o nome já responde a pergunta
int diasDesdeCriacao;
```

```java
// ruim: o nome não diz o que a lista contém nem o que o método faz
List<int[]> getThem() {
    List<int[]> list1 = new ArrayList<>();
    for (int[] x : theList) {
        if (x[0] == 4) list1.add(x);
    }
    return list1;
}

// bom: intenção clara sem precisar de comentário
List<Celula> getCelulasMarcadas() {
    List<Celula> celulasMarcadas = new ArrayList<>();
    for (Celula celula : tabuleiro) {
        if (celula.getStatus() == Status.MARCADA) celulasMarcadas.add(celula);
    }
    return celulasMarcadas;
}
```

A segunda versão não precisa de comentário explicando "isso pega as células marcadas" — o nome do método já diz isso.

### Evitar desinformação e distâncias artificiais

- Não chame uma coleção de `contaLista` se ela não for uma `List` (usar o tipo real, ou nenhum sufixo, evita confundir quem lê).
- Evite nomes que diferem por um caractere ou número (`processaDados1`, `processaDados2`) — force o leitor a comparar caractere por caractere para entender a diferença.
- Evite abreviações que só fazem sentido para quem escreveu o código naquele momento (`gerCli` em vez de `gerenciadorDeClientes`).

### Nomes de classes, métodos e booleanos

- **Classes**: substantivos ou frases nominais (`GerenciadorDeEstoque`, `ValidadorDeCpf`) — nunca verbos.
- **Métodos**: verbos ou frases verbais (`calcularTotal()`, `enviarNotificacao()`).
- **Booleanos**: devem soar como uma pergunta de sim/não (`isAtivo`, `temPermissao`, `podeExecutar`) — um booleano chamado `status` obriga quem lê a adivinhar o que `true` significa.

```java
// ruim
boolean flag;
if (flag) { ... }

// bom
boolean pedidoFoiPago;
if (pedidoFoiPago) { ... }
```

## Erros comuns

- Nomear uma variável pelo tipo (`String stringNome`) em vez do que ela representa.
- Usar o mesmo nome para conceitos diferentes em partes distintas do código (ex.: `id` significando "identificador do usuário" num lugar e "índice do array" em outro).
- Adicionar comentário para compensar um nome ruim, em vez de simplesmente melhorar o nome.
