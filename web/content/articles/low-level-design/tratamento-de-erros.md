---
slug: tratamento-de-erros
categorySlug: low-level-design
title: "Clean Code: Tratamento de Erros"
navTitle: Tratamento de Erros
summary: Usar exceptions em vez de códigos de erro, e não deixar o tratamento de erro esconder a lógica principal
level: iniciante
order: 6
section: clean-code
---

## Objetivos de aprendizagem

- [ ] Preferir exceptions a códigos de retorno de erro
- [ ] Criar exceptions específicas do domínio em vez de capturar `Exception` genérica

## Estrutura da aula

1. Exceptions em vez de códigos de erro
2. Exceptions específicas contam a história
3. Não devolver nem receber `null`
4. Separar a lógica principal do tratamento de erro

## Conteúdo

### Exceptions em vez de códigos de erro

Códigos de retorno (`return -1` para erro, `return 0` para sucesso) obrigam quem chama a lembrar de checar o código toda vez — e nada impede de esquecer. Exceptions separam o caminho de erro do caminho normal e não podem ser silenciosamente ignoradas.

```java
// ruim: fácil de esquecer de checar o retorno
public int sacar(double valor) {
    if (valor > saldo) return -1;
    saldo -= valor;
    return 0;
}

// bom: impossível ignorar sem perceber
public void sacar(double valor) {
    if (valor > saldo) {
        throw new SaldoInsuficienteException("Saldo atual: " + saldo);
    }
    saldo -= valor;
}
```

### Exceptions específicas contam a história

Capturar `Exception` genérica esconde qual erro realmente aconteceu e força quem lê o `catch` a investigar o corpo do método inteiro para entender o que pode dar errado. Exceptions específicas do domínio (`SaldoInsuficienteException`, `PedidoJaCanceladoException`) documentam, pelo próprio tipo, o que pode falhar.

```java
public class SaldoInsuficienteException extends RuntimeException {
    public SaldoInsuficienteException(String mensagem) {
        super(mensagem);
    }
}

try {
    conta.sacar(500);
} catch (SaldoInsuficienteException e) {
    // trata especificamente esse caso — ex.: sugere um valor menor
} catch (ContaBloqueadaException e) {
    // trata outro caso, de forma diferente
}
```

### Não devolver nem receber `null`

Devolver `null` empurra a responsabilidade de checagem para quem chama, e uma checagem esquecida vira `NullPointerException` em produção, longe de onde o problema começou. Prefira devolver uma coleção vazia em vez de `null`, ou usar `Optional<T>` quando a ausência de valor é um caso legítimo e esperado.

```java
// ruim: força quem chama a lembrar de checar null
public List<Pedido> buscarPedidos(String clienteId) {
    if (naoExisteCliente(clienteId)) return null;
    return repositorio.buscar(clienteId);
}

// bom: coleção vazia é um estado válido, não um caso especial
public List<Pedido> buscarPedidos(String clienteId) {
    if (naoExisteCliente(clienteId)) return Collections.emptyList();
    return repositorio.buscar(clienteId);
}

// bom: Optional deixa explícito que a ausência é esperada
public Optional<Cliente> buscarPorEmail(String email) {
    return repositorio.findByEmail(email);
}
```

### Separar a lógica principal do tratamento de erro

Um método que mistura a lógica de negócio com blocos `try/catch` extensos fica difícil de ler — o `try/catch` deveria isolar a lógica principal, não competir com ela por atenção.

```java
// bom: extrai o try/catch para uma função dedicada
public void processarArquivo(String caminho) {
    try {
        lerEProcessar(caminho);
    } catch (IOException e) {
        logger.error("Falha ao processar arquivo: " + caminho, e);
    }
}

private void lerEProcessar(String caminho) throws IOException {
    // lógica principal, sem try/catch no meio
}
```

## Erros comuns

- Capturar `Exception` genérica e ignorar o erro (`catch (Exception e) {}`), escondendo falhas reais.
- Usar exceptions para controle de fluxo normal (ex.: lançar uma exception para sair de um loop em vez de usar `break`).
- Devolver `null` em vez de uma coleção vazia ou `Optional`, empurrando a checagem para quem chama.
