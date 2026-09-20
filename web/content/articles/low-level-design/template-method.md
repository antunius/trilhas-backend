---
slug: template-method
categorySlug: low-level-design
title: "Padrão Template Method"
navTitle: Template Method
summary: Definir o esqueleto de um algoritmo na superclasse, deixando passos específicos para as subclasses
level: intermediario
order: 25
section: padroes-comportamentais
---

## Objetivos de aprendizagem

- [ ] Implementar Template Method em Java para reaproveitar um fluxo fixo com passos variáveis
- [ ] Diferenciar "hooks" obrigatórios de opcionais dentro do template

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Definir o esqueleto de um algoritmo numa superclasse, com a sequência de passos fixa, mas deixar que subclasses sobrescrevam passos específicos sem mudar a estrutura geral do algoritmo. É o único padrão comportamental deste curso baseado em herança (os demais usam composição via interfaces).

![Template Method — o esqueleto do algoritmo é fixo, os passos variam](/diagrams/lld-template-method.svg)

### Problema sem o padrão

```java
public class RelatorioVendas {
    public void gerar() {
        abrirDocumento();
        // corpo específico de vendas, duplicado em cada tipo de relatório
        System.out.println("Tabela de vendas...");
        escreverRodape();
    }

    private void abrirDocumento() { System.out.println("Abrindo documento"); }
    private void escreverRodape() { System.out.println("Rodapé padrão"); }
}

public class RelatorioEstoque {
    public void gerar() {
        abrirDocumento(); // mesma lógica de abertura, copiada
        System.out.println("Tabela de estoque...");
        escreverRodape(); // mesma lógica de rodapé, copiada
    }

    private void abrirDocumento() { System.out.println("Abrindo documento"); }
    private void escreverRodape() { System.out.println("Rodapé padrão"); }
}
```

A estrutura do algoritmo (abrir → corpo → rodapé) e os passos comuns (`abrirDocumento`, `escreverRodape`) estão duplicados em cada tipo de relatório — só o corpo realmente muda.

### Solução com o padrão

```java
public abstract class RelatorioBase {
    // template method: define a sequência fixa, não pode ser sobrescrito
    public final void gerar() {
        abrirDocumento();
        escreverCorpo();
        escreverRodape();
    }

    private void abrirDocumento() {
        System.out.println("Abrindo documento");
    }

    protected abstract void escreverCorpo(); // passo obrigatório, cada subclasse decide

    protected void escreverRodape() { // passo com comportamento padrão, pode ser sobrescrito
        System.out.println("Rodapé padrão");
    }
}

public class RelatorioVendas extends RelatorioBase {
    protected void escreverCorpo() {
        System.out.println("Tabela de vendas...");
    }
}

public class RelatorioEstoque extends RelatorioBase {
    protected void escreverCorpo() {
        System.out.println("Tabela de estoque...");
    }

    @Override
    protected void escreverRodape() { // sobrescreve o passo opcional
        System.out.println("Rodapé com data de corte do inventário");
    }
}
```

```java
new RelatorioVendas().gerar();
new RelatorioEstoque().gerar();
```

`gerar()` é `final` — nenhuma subclasse pode mudar a *ordem* dos passos, só o *conteúdo* de passos específicos. `escreverCorpo()` é abstrato (obrigatório); `escreverRodape()` tem um comportamento padrão que pode opcionalmente ser sobrescrito (um "hook").

### Quando usar / quando não usar

- **Use** quando várias classes compartilham a mesma sequência de passos, mas alguns passos específicos variam entre elas — e você quer garantir que ninguém mude a ordem geral do algoritmo.
- **Evite** quando os passos variáveis não têm uma sequência fixa em comum entre os casos — nesse caso, Strategy (composição, sem herança) costuma ser mais flexível.

## Erros comuns

- Deixar o método template sem `final`, permitindo que uma subclasse sobrescreva a ordem dos passos e quebre a garantia estrutural que o padrão deveria oferecer.
- Criar hierarquias profundas de Template Method (subclasse de subclasse de subclasse) — a herança em múltiplos níveis tende a ficar difícil de acompanhar; geralmente um nível já resolve o problema.
- Usar Template Method (herança) quando Strategy (composição) resolveria o mesmo problema com menos acoplamento — herança é a ferramenta certa aqui só porque a *sequência* de passos, e não apenas um algoritmo isolado, é o que se quer reaproveitar.
