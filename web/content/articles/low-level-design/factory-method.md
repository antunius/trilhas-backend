---
slug: factory-method
categorySlug: low-level-design
title: "Padrão Factory Method"
navTitle: Factory Method
summary: Delegar a criação de objetos a subclasses, sem acoplar o código cliente a classes concretas
level: intermediario
order: 14
section: padroes-criacionais
---

## Objetivos de aprendizagem

- [ ] Implementar Factory Method em Java para desacoplar criação de uso
- [ ] Diferenciar Factory Method de simplesmente chamar `new`

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Definir uma interface para criar um objeto, mas deixar as subclasses decidirem qual classe concreta instanciar. O código que usa o objeto trabalha só com a interface/classe abstrata — nunca precisa saber (nem importar) a classe concreta real.

![Factory Method](/diagrams/lld-factory-method.svg)

### Problema sem o padrão

```java
public class ServicoDeNotificacao {
    public void enviar(String tipo, String mensagem) {
        if (tipo.equals("EMAIL")) {
            EmailNotificacao notificacao = new EmailNotificacao();
            notificacao.enviar(mensagem);
        } else if (tipo.equals("SMS")) {
            SmsNotificacao notificacao = new SmsNotificacao();
            notificacao.enviar(mensagem);
        }
        // todo novo canal exige editar este método (viola OCP também)
    }
}
```

`ServicoDeNotificacao` conhece todas as classes concretas de notificação e decide qual instanciar via `if/else` — exatamente o sintoma de OCP visto na aula de SOLID. Adicionar um canal novo (push notification) significa editar essa classe de novo.

### Solução com o padrão

```java
public interface Notificacao {
    void enviar(String mensagem);
}

public class EmailNotificacao implements Notificacao {
    public void enviar(String mensagem) {
        System.out.println("E-mail: " + mensagem);
    }
}

public class SmsNotificacao implements Notificacao {
    public void enviar(String mensagem) {
        System.out.println("SMS: " + mensagem);
    }
}

public abstract class CriadorDeNotificacao {
    public abstract Notificacao criar(); // o "factory method"

    public void enviar(String mensagem) {
        Notificacao notificacao = criar();
        notificacao.enviar(mensagem);
    }
}

public class CriadorDeEmail extends CriadorDeNotificacao {
    public Notificacao criar() {
        return new EmailNotificacao();
    }
}

public class CriadorDeSms extends CriadorDeNotificacao {
    public Notificacao criar() {
        return new SmsNotificacao();
    }
}
```

```java
// código cliente: não conhece EmailNotificacao nem SmsNotificacao diretamente
CriadorDeNotificacao criador = new CriadorDeEmail();
criador.enviar("Seu pedido foi confirmado");
```

Um canal novo (`CriadorDePush`) é uma classe nova — nenhuma classe existente precisa ser editada.

### Quando usar / quando não usar

- **Use** quando a lógica de criação de um objeto tem variações que crescem com o tempo (novos tipos de notificação, novos formatos de documento, novos drivers de banco), e você quer isolar essa decisão numa hierarquia própria.
- **Evite** quando existe apenas uma implementação concreta e nenhuma expectativa real de crescer — nesse caso, um `new` direto é mais simples e não precisa de uma hierarquia extra de "criadores".

## Erros comuns

- Criar uma hierarquia de Factory Method para um único tipo concreto, sem nenhuma variação real esperada — complexidade sem benefício.
- Deixar o `if/else` de decisão de tipo dentro do próprio `criar()` de uma única classe genérica, em vez de usar subclasses (isso é uma Simple Factory, não um Factory Method — resolve o problema de acoplamento no cliente, mas ainda concentra o `if/else` num único lugar).
- Confundir Factory Method com Abstract Factory: Factory Method cria um produto por vez através de herança; Abstract Factory (uma variação mais ampla, fora do escopo deste curso) cria famílias inteiras de produtos relacionados.
