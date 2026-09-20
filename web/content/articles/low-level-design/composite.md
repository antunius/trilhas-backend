---
slug: composite
categorySlug: low-level-design
title: "Padrão Composite"
navTitle: Composite
summary: Compor objetos em estruturas de árvore e tratar objetos individuais e composições de forma uniforme
level: intermediario
order: 20
section: padroes-estruturais
---

## Objetivos de aprendizagem

- [ ] Implementar Composite em Java para uma estrutura de árvore (ex.: sistema de arquivos)
- [ ] Reconhecer quando um problema tem forma de "todo/parte" recursivo

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Compor objetos em estruturas de árvore para representar hierarquias parte-todo, de forma que o código cliente trate um objeto individual (folha) e uma composição de objetos (nó) através da mesma interface — sem precisar saber, em cada chamada, se está lidando com um ou com muitos.

![Composite — árvore de partes e todo, mesmo contrato](/diagrams/lld-composite.svg)

### Problema sem o padrão

```java
public class Arquivo {
    private String nome;
    private long tamanho;
    public long getTamanho() { return tamanho; }
}

public class Pasta {
    private List<Arquivo> arquivos;
    private List<Pasta> subpastas;

    public long calcularTamanhoTotal() {
        long total = 0;
        for (Arquivo arquivo : arquivos) total += arquivo.getTamanho();
        for (Pasta subpasta : subpastas) total += subpasta.calcularTamanhoTotal(); // recursão manual
        return total;
    }
}
```

Cada operação que precisa "somar recursivamente" (calcular tamanho, contar itens, buscar por nome) exige tratar arquivos e pastas separadamente, com dois loops distintos — e cresce em complexidade a cada novo tipo de operação.

### Solução com o padrão

```java
public interface ItemDoSistemaDeArquivos {
    long calcularTamanho();
}

public class Arquivo implements ItemDoSistemaDeArquivos {
    private final String nome;
    private final long tamanho;

    public Arquivo(String nome, long tamanho) {
        this.nome = nome;
        this.tamanho = tamanho;
    }

    @Override
    public long calcularTamanho() {
        return tamanho;
    }
}

public class Pasta implements ItemDoSistemaDeArquivos {
    private final String nome;
    private final List<ItemDoSistemaDeArquivos> itens = new ArrayList<>();

    public Pasta(String nome) { this.nome = nome; }

    public void adicionar(ItemDoSistemaDeArquivos item) {
        itens.add(item);
    }

    @Override
    public long calcularTamanho() {
        return itens.stream().mapToLong(ItemDoSistemaDeArquivos::calcularTamanho).sum();
    }
}
```

```java
Pasta fotos = new Pasta("Fotos");
fotos.adicionar(new Arquivo("foto.png", 2_000_000));

Pasta documentos = new Pasta("Documentos");
documentos.adicionar(new Arquivo("a.txt", 1_000));
documentos.adicionar(fotos); // uma Pasta dentro de outra Pasta — mesma interface

System.out.println(documentos.calcularTamanho()); // soma recursiva, sem loop manual no cliente
```

`Pasta` chama `calcularTamanho()` em cada item filho sem saber (nem precisar saber) se aquele filho é um `Arquivo` ou outra `Pasta` — a recursão acontece naturalmente através do polimorfismo, sem nenhum `if (item instanceof Pasta)` espalhado pelo código.

### Quando usar / quando não usar

- **Use** quando o domínio do problema já é naturalmente uma árvore parte-todo (sistema de arquivos, estrutura de menus, árvore de componentes de UI, estrutura organizacional de uma empresa).
- **Evite** quando a estrutura de dados não é recursiva de verdade — forçar Composite sobre uma lista simples, sem hierarquia real, adiciona complexidade sem necessidade.

## Erros comuns

- Verificar o tipo concreto (`instanceof Arquivo` vs. `instanceof Pasta`) no código cliente, em vez de deixar o polimorfismo da interface comum resolver — isso anula o benefício do padrão.
- Colocar métodos que só fazem sentido para nós compostos (como `adicionar(item)`) na interface comum, forçando folhas a implementá-los de forma vazia ou lançando exception — o mesmo problema visto na aula de ISP.
- Esquecer casos-limite da recursão (uma pasta vazia, uma árvore muito profunda causando estouro de pilha em recursão não controlada).
