---
slug: proxy
categorySlug: low-level-design
title: "Padrão Proxy"
navTitle: Proxy
summary: Controlar o acesso a um objeto através de um substituto que implementa a mesma interface
level: intermediario
order: 19
section: padroes-estruturais
---

## Objetivos de aprendizagem

- [ ] Implementar um Proxy de cache (virtual proxy) em Java
- [ ] Diferenciar Proxy de Decorator, apesar da estrutura de código parecida

## Estrutura da aula

1. Intenção
2. Problema sem o padrão
3. Solução com o padrão
4. Quando usar / quando não usar
5. Erros comuns

## Conteúdo

### Intenção

Fornecer um substituto (ou marcador de posição) para outro objeto, implementando a mesma interface, para controlar o acesso a ele — adiando a criação de um objeto caro, checando permissões antes de delegar, ou adicionando cache, sem que o código cliente perceba a diferença.

![Proxy — mesmo contrato, controla o acesso ao real](/diagrams/lld-proxy.svg)

### Problema sem o padrão

```java
public class RepositorioReal implements RepositorioDeDocumento {
    public Documento carregar(String id) {
        // operação cara: lê do disco ou de um serviço remoto
        return lerDoDiscoOuRede(id);
    }
}
```

```java
// código cliente chama carregar() repetidamente para o mesmo id,
// pagando o custo da leitura toda vez, sem nenhuma checagem de permissão
Documento doc = repositorio.carregar("doc-42");
```

Toda checagem de permissão e toda estratégia de cache ficariam espalhadas pelo código cliente, ou dentro da própria classe de domínio `RepositorioReal`, misturando responsabilidades que não são dela.

### Solução com o padrão

```java
public interface RepositorioDeDocumento {
    Documento carregar(String id);
}

public class RepositorioProxy implements RepositorioDeDocumento {
    private final RepositorioDeDocumento repositorioReal;
    private final Map<String, Documento> cache = new HashMap<>();
    private final ControleDeAcesso controleDeAcesso;

    public RepositorioProxy(RepositorioDeDocumento repositorioReal, ControleDeAcesso controleDeAcesso) {
        this.repositorioReal = repositorioReal;
        this.controleDeAcesso = controleDeAcesso;
    }

    @Override
    public Documento carregar(String id) {
        if (!controleDeAcesso.usuarioPodeVer(id)) {
            throw new AcessoNegadoException(id);
        }
        return cache.computeIfAbsent(id, repositorioReal::carregar);
    }
}
```

```java
// código cliente: usa a mesma interface, sem saber que existe um proxy
RepositorioDeDocumento repositorio = new RepositorioProxy(new RepositorioReal(), controleDeAcesso);
Documento doc = repositorio.carregar("doc-42"); // 1ª vez: checa acesso, lê do disco, guarda em cache
Documento doc2 = repositorio.carregar("doc-42"); // 2ª vez: checa acesso, devolve do cache
```

### Quando usar / quando não usar

- **Use** quando você precisa adicionar controle de acesso, cache, ou inicialização preguiçosa (*lazy loading*) de um objeto caro, mantendo o código cliente exatamente igual, como se estivesse falando com o objeto real.
- **Evite** quando não há nenhum controle de acesso adicional a fazer — nesse caso, chamar o objeto real diretamente é mais simples e direto.

### Proxy vs. Decorator: mesma estrutura, intenção diferente

O código de um Proxy e de um Decorator parecem quase idênticos (uma classe implementando a mesma interface do objeto que envolve, delegando chamadas). A diferença está na intenção: **Decorator** existe para *adicionar comportamento* de forma combinável (várias camadas empilhadas); **Proxy** existe para *controlar o acesso* ao objeto real (geralmente uma única camada, com um propósito específico como cache, permissão ou lazy loading).

## Erros comuns

- Misturar num só Proxy múltiplas responsabilidades de controle (cache + permissão + logging + retry) sem necessidade — cada preocupação pode virar seu próprio proxy, compostos, se fizer sentido.
- Deixar o Proxy vazar detalhes do objeto real através de exceptions ou tipos de retorno diferentes dos declarados na interface comum.
- Esquecer de invalidar o cache de um Proxy quando o dado subjacente muda, servindo dados desatualizados indefinidamente.
