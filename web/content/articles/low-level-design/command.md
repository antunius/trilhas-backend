---
slug: command
categorySlug: low-level-design
title: "Padrão Command"
navTitle: Command
summary: Encapsular uma solicitação como um objeto, permitindo enfileirar, desfazer e registrar histórico de ações
level: intermediario
order: 24
section: padroes-comportamentais
---

## Objetivos de aprendizagem

- [ ] Implementar Command em Java para desacoplar quem dispara uma ação de quem a executa
- [ ] Implementar suporte a "desfazer" (undo) usando o padrão

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Encapsular uma solicitação (uma ação a ser executada, com todos os dados necessários) como um objeto, permitindo parametrizar quem dispara a ação com diferentes solicitações, enfileirá-las, registrar um histórico, e suportar desfazer (`undo`) — sem que quem dispara a ação precise conhecer os detalhes de como ela é executada.

![Command — encapsula uma ação como objeto, com histórico](/diagrams/lld-command.svg)

### Problema sem o padrão

```java
public class ControleRemoto {
    private Luz luz;

    public void botaoLigarPressionado() {
        luz.ligar(); // ControleRemoto conhece diretamente Luz e o método certo
    }

    // não há como desfazer, nem como reatribuir o botão para outra ação em runtime
}
```

`ControleRemoto` está fortemente acoplado a `Luz` e ao método `ligar()` especificamente — reatribuir o botão para controlar um outro aparelho, ou desfazer a última ação, exigiria reescrever a classe.

### Solução com o padrão

```java
public interface Comando {
    void executar();
    void desfazer();
}

public class Luz {
    public void ligar() { System.out.println("Luz ligada"); }
    public void desligar() { System.out.println("Luz desligada"); }
}

public class LigarLuzCommand implements Comando {
    private final Luz luz;

    public LigarLuzCommand(Luz luz) { this.luz = luz; }

    public void executar() { luz.ligar(); }
    public void desfazer() { luz.desligar(); }
}

public class ControleRemoto {
    private final Deque<Comando> historico = new ArrayDeque<>();

    public void pressionar(Comando comando) {
        comando.executar();
        historico.push(comando);
    }

    public void desfazerUltimo() {
        if (!historico.isEmpty()) {
            historico.pop().desfazer();
        }
    }
}
```

```java
Luz luzDaSala = new Luz();
ControleRemoto controle = new ControleRemoto();

controle.pressionar(new LigarLuzCommand(luzDaSala)); // "Luz ligada"
controle.desfazerUltimo(); // "Luz desligada"
```

`ControleRemoto` não conhece `Luz` nem sabe o que "executar" realmente significa — ele só chama `comando.executar()` e guarda o comando para poder desfazer depois. Um novo aparelho (ex.: `Ventilador`) só precisa de um novo `Comando`, sem tocar em `ControleRemoto`.

### Quando usar / quando não usar

- **Use** quando você precisa desacoplar quem dispara uma ação de quem a executa, especialmente se também precisa de fila de execução, histórico, log de auditoria ou suporte a desfazer/refazer.
- **Evite** para ações simples e diretas, sem nenhuma necessidade de histórico, fila ou desacoplamento — encapsular tudo como Command adiciona uma camada de indireção que pode não valer a pena.

## Erros comuns

- Colocar a lógica de negócio dentro do próprio `Comando`, em vez de delegar para o objeto "receiver" (`Luz`, no exemplo) — isso mistura a responsabilidade de "representar uma ação" com "executar a lógica de fato".
- Implementar `executar()` sem um `desfazer()` correspondente coerente, quando o sistema promete suporte a undo — um comando que não sabe reverter seu próprio efeito quebra a garantia do histórico.
- Guardar referências a objetos mutáveis dentro do comando sem clonar o estado necessário, fazendo com que o "desfazer" reverta para um estado que já não existe mais.
