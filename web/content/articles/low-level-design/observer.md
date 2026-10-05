---
slug: observer
categorySlug: low-level-design
title: "Padrão Observer"
navTitle: Observer
summary: Notificar automaticamente um conjunto de objetos interessados quando o estado de outro objeto muda
level: intermediario
order: 21
section: padroes-comportamentais
---

## Objetivos de aprendizagem

- [ ] Implementar Observer em Java para desacoplar quem gera um evento de quem reage a ele
- [ ] Reconhecer Observer como a base conceitual de sistemas de eventos e listeners

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Definir uma dependência um-para-muitos entre objetos, de forma que quando um objeto (o *sujeito*) muda de estado, todos os seus dependentes (os *observadores*) são notificados e atualizados automaticamente — sem que o sujeito precise conhecer os tipos concretos dos observadores.

![Observer — o sujeito notifica todos os inscritos](/diagrams/lld-observer.svg)

### Problema sem o padrão

```java
public class EstoqueProduto {
    private int quantidade;

    public void atualizarQuantidade(int nova) {
        this.quantidade = nova;

        // toda nova forma de reagir à mudança exige editar esta classe
        NotificadorEmail.enviar("Estoque atualizado: " + nova);
        PainelAdmin.atualizarTela(nova);
        if (nova < 10) SistemaDeAlerta.dispararAlerta("Estoque baixo");
    }
}
```

`EstoqueProduto` conhece diretamente todas as classes interessadas em suas mudanças — cada nova forma de reagir a uma atualização de estoque (um novo relatório, uma nova integração) exige editar essa classe, violando OCP.

### Solução com o padrão

```java
public interface ObservadorDeEstoque {
    void atualizar(int novaQuantidade);
}

public class EstoqueProduto {
    private int quantidade;
    private final List<ObservadorDeEstoque> observadores = new ArrayList<>();

    public void inscrever(ObservadorDeEstoque observador) {
        observadores.add(observador);
    }

    public void removerInscricao(ObservadorDeEstoque observador) {
        observadores.remove(observador);
    }

    public void atualizarQuantidade(int nova) {
        this.quantidade = nova;
        for (ObservadorDeEstoque observador : observadores) {
            observador.atualizar(nova);
        }
    }
}

public class NotificadorEmail implements ObservadorDeEstoque {
    public void atualizar(int novaQuantidade) {
        System.out.println("E-mail: estoque agora é " + novaQuantidade);
    }
}

public class SistemaDeAlerta implements ObservadorDeEstoque {
    public void atualizar(int novaQuantidade) {
        if (novaQuantidade < 10) System.out.println("Alerta: estoque baixo!");
    }
}
```

```java
EstoqueProduto estoque = new EstoqueProduto();
estoque.inscrever(new NotificadorEmail());
estoque.inscrever(new SistemaDeAlerta());
estoque.atualizarQuantidade(5); // notifica os dois observadores automaticamente
```

Um novo observador (um `PainelAdmin`, por exemplo) só precisa implementar `ObservadorDeEstoque` e se inscrever — `EstoqueProduto` nunca precisa ser editado de novo.

### Quando usar / quando não usar

- **Use** quando várias partes do sistema precisam reagir a uma mudança de estado de outro objeto, e você quer que essa lista de interessados possa crescer sem tocar na classe que gera o evento.
- **Evite** quando existe apenas um único interessado fixo e sem expectativa de crescer — nesse caso, uma chamada direta é mais simples de seguir do que uma lista de observadores.

## Erros comuns

- Notificar os observadores no meio de uma operação inconsistente (estado parcialmente atualizado), fazendo com que reajam a um estado que ainda vai mudar.
- Deixar um observador lançar uma exception que interrompe a notificação dos demais — geralmente vale isolar cada chamada de `atualizar()` num try/catch dentro do laço de notificação.
- Esquecer de remover a inscrição de um observador que não deveria mais existir, causando vazamento de memória (o sujeito segura uma referência para um objeto que já deveria ter sido descartado).
