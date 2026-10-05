---
slug: singleton
categorySlug: low-level-design
title: "Padrão Singleton"
navTitle: Singleton
summary: Garantir que uma classe tenha uma única instância e fornecer um ponto de acesso global a ela
level: intermediario
order: 13
section: padroes-criacionais
---

## Objetivos de aprendizagem

- [ ] Implementar Singleton em Java de forma thread-safe
- [ ] Reconhecer quando Singleton é a escolha certa e quando é apenas um "global disfarçado"

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Garantir que uma classe tenha exatamente uma instância durante toda a execução do programa, e fornecer um ponto de acesso global a ela. É útil para recursos que, por natureza, só devem existir uma vez: uma configuração global carregada de um arquivo, um pool de conexões, um logger.

![Singleton](/diagrams/lld-singleton.svg)

### Problema sem o padrão

```java
public class ConfiguracaoApp {
    private Map<String, String> valores;

    public ConfiguracaoApp() {
        // carrega um arquivo de configuração do disco — operação cara
        this.valores = carregarDeArquivo();
    }

    public String getValor(String chave) {
        return valores.get(chave);
    }
}
```

Sem controle sobre a criação, cada parte do código pode instanciar sua própria `ConfiguracaoApp`, recarregando o arquivo repetidamente e, pior, permitindo que módulos diferentes enxerguem configurações potencialmente diferentes se o arquivo mudar entre as chamadas.

### Solução com o padrão

```java
public class ConfiguracaoApp {
    private static volatile ConfiguracaoApp instancia;
    private final Map<String, String> valores;

    private ConfiguracaoApp() {
        this.valores = carregarDeArquivo();
    }

    public static ConfiguracaoApp getInstance() {
        if (instancia == null) {
            synchronized (ConfiguracaoApp.class) {
                if (instancia == null) {
                    instancia = new ConfiguracaoApp();
                }
            }
        }
        return instancia;
    }

    public String getValor(String chave) {
        return valores.get(chave);
    }

    private Map<String, String> carregarDeArquivo() {
        // leitura do arquivo, uma única vez
        return new HashMap<>();
    }
}
```

O construtor é `private` — a única forma de obter uma instância é por `getInstance()`, que cria o objeto na primeira chamada e devolve sempre a mesma referência depois. O `synchronized` com verificação dupla (`double-checked locking`) evita que duas threads criem duas instâncias simultaneamente, sem pagar o custo de sincronizar toda chamada a `getInstance()` depois que a instância já existe.

Uma alternativa mais simples e igualmente thread-safe em Java é usar um `enum` de um único valor, que a própria JVM garante instanciar uma única vez:

```java
public enum ConfiguracaoAppEnum {
    INSTANCE;

    private final Map<String, String> valores = carregarDeArquivo();

    public String getValor(String chave) {
        return valores.get(chave);
    }

    private static Map<String, String> carregarDeArquivo() {
        return new HashMap<>();
    }
}
```

### Quando usar / quando não usar

- **Use** quando existe uma necessidade genuína de que só exista uma instância (um recurso físico único, como uma conexão de hardware, ou um cache verdadeiramente compartilhado).
- **Evite** quando Singleton está sendo usado só para evitar passar uma dependência explicitamente pelo construtor — isso costuma ser uma variável global disfarçada, e torna o código difícil de testar (não dá para trocar por uma implementação falsa em teste sem mudar a classe).

## Erros comuns

- Usar Singleton como substituto de injeção de dependência, espalhando `getInstance()` por toda a base de código — isso acopla fortemente qualquer classe que o use, dificultando testes unitários isolados.
- Esquecer a sincronização em ambientes multi-thread, permitindo que duas instâncias sejam criadas por uma condição de corrida.
- Usar Singleton para guardar estado mutável compartilhado sem pensar em concorrência — o padrão resolve "uma instância só", não resolve sozinho os problemas de acesso concorrente ao estado dela.
