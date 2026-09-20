---
slug: iterator
categorySlug: low-level-design
title: "Padrão Iterator"
navTitle: Iterator
summary: Percorrer os elementos de uma coleção sem expor sua representação interna
level: intermediario
order: 26
section: padroes-comportamentais
---

## Objetivos de aprendizagem

- [ ] Implementar um Iterator customizado em Java
- [ ] Entender por que `Iterable`/`Iterator` já é esse padrão embutido na linguagem

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Fornecer uma forma de acessar sequencialmente os elementos de uma coleção sem expor sua representação interna (array, lista encadeada, árvore) — o código cliente percorre a coleção sempre da mesma forma, não importa como ela é implementada por dentro.

![Iterator — percorre sem expor a estrutura interna](/diagrams/lld-iterator.svg)

### Problema sem o padrão

```java
public class CatalogoDeLivros {
    private Livro[] livros = new Livro[100];
    private int total = 0;

    public Livro[] getLivros() {
        return livros; // expõe o array interno e seu tamanho fixo de 100
    }
}
```

```java
// código cliente precisa conhecer os detalhes: array de tamanho 100,
// posições vazias possivelmente com null
Livro[] livros = catalogo.getLivros();
for (int i = 0; i < livros.length; i++) {
    if (livros[i] != null) {
        System.out.println(livros[i]);
    }
}
```

Se `CatalogoDeLivros` trocar o array por uma `LinkedList` ou uma árvore, todo código cliente que percorre a coleção dessa forma quebra.

### Solução com o padrão

```java
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

public class CatalogoDeLivros implements Iterable<Livro> {
    private final Livro[] livros = new Livro[100];
    private int total = 0;

    public void adicionar(Livro livro) {
        livros[total++] = livro;
    }

    @Override
    public Iterator<Livro> iterator() {
        return new CatalogoIterator();
    }

    private class CatalogoIterator implements Iterator<Livro> {
        private int indiceAtual = 0;

        public boolean hasNext() {
            return indiceAtual < total;
        }

        public Livro next() {
            return livros[indiceAtual++];
        }
    }
}
```

```java
// código cliente: não sabe (nem precisa saber) que por trás existe um array
CatalogoDeLivros catalogo = new CatalogoDeLivros();
catalogo.adicionar(new Livro("Clean Code"));
catalogo.adicionar(new Livro("Design Patterns"));

for (Livro livro : catalogo) { // funciona porque implementa Iterable<Livro>
    System.out.println(livro);
}
```

Se `CatalogoDeLivros` trocar o array interno por uma `ArrayList`, só a implementação de `CatalogoIterator` muda — todo código cliente que usa `for (Livro livro : catalogo)` continua funcionando sem alteração.

### Por que isso já existe na linguagem

Em Java, `Iterable<T>` e `Iterator<T>` (usados no exemplo acima) *são* o padrão Iterator do GoF, já embutido na linguagem — é por isso que qualquer `List`, `Set` ou `Map.values()` funciona com `for-each`. Entender o padrão por trás ajuda a saber quando vale a pena implementar `Iterable` na sua própria estrutura de dados customizada, em vez de expor uma coleção interna diretamente.

### Quando usar / quando não usar

- **Use** quando sua própria classe encapsula uma coleção de itens e você quer que o código cliente a percorra sem conhecer a estrutura interna — especialmente se essa estrutura pode mudar no futuro.
- **Evite** implementar um Iterator customizado quando expor diretamente uma `List<T>` já resolveria (as coleções padrão do Java já implementam Iterator corretamente) — só vale a pena quando existe uma estrutura de dados verdadeiramente customizada por trás.

## Erros comuns

- Expor a coleção interna diretamente (getter que devolve o array/lista mutável), permitindo que o cliente modifique a estrutura interna por fora, sem passar pelos métodos da classe.
- Implementar um Iterator que quebra (`ConcurrentModificationException` ou pior, comportamento indefinido) se a coleção for modificada durante a iteração, sem documentar essa limitação.
- Reimplementar `Iterator` do zero quando a coleção interna já é um `List`/`Set` padrão do Java — nesse caso, delegar para o iterator da coleção interna é mais simples e menos propenso a bugs.
