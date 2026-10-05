---
slug: cache-numeros-estrategias
categorySlug: system-design
title: "O ganho do cache em números e as estratégias de leitura e escrita"
navTitle: Números e estratégias
summary: "Calcular a latência média pelo hit ratio e comparar cache-aside, read-through, write-through e write-back"
level: intermediario
order: 26
section: tecnologias-chave
group: "Cache"
---

## Objetivos de aprendizagem

- [ ] Calcular a latência média a partir do hit ratio
- [ ] Comparar as quatro estratégias e o que cada uma sacrifica

*Retomando o cenário da unidade: a página de produto de uma loja online, com 200 mil visitas por minuto no pico e poucos produtos concentrando o tráfego.*

## Por que o cache vale a pena: um exemplo com números

Suponha que o banco leve 20 ms por consulta e o cache leve 1 ms. A latência média depende do hit ratio:

| Hit ratio | Cálculo | Latência média |
|---|---|---|
| 0% (sem cache útil) | 20 ms | 20 ms |
| 50% | 0,5 × 1 + 0,5 × (1 + 20) | 11 ms |
| 90% | 0,9 × 1 + 0,1 × 21 | 3 ms |
| 99% | 0,99 × 1 + 0,01 × 21 | 1,2 ms |

Note o 21 ms no miss: o cache foi consultado (1 ms) e depois o banco (20 ms). O ganho maior ainda é na carga do banco. Com 200 mil visitas por minuto (cerca de 3.300 por segundo), um hit ratio de 95% manda ao banco só 5% disso, cerca de 170 consultas por segundo, em vez de 3.300. Esse é, muitas vezes, o motivo real para o cache existir: proteger o banco, não só deixar a página mais rápida.

Um cache só rende em sistemas **dominados por leitura**, onde poucos dados concentram a maior parte dos pedidos, como a liquidação do nosso cenário. Se cada pedido buscasse um dado diferente, o hit ratio seria baixo e o cache só acrescentaria latência.

## Estratégias de leitura e escrita

A pergunta central é: **quem** fala com o banco, a aplicação ou o cache? E, nas escritas, **quando** o banco é atualizado?

### Cache-aside (lazy loading)

A aplicação consulta o cache primeiro. No miss, ela mesma busca no banco e preenche o cache. É a estratégia mais comum e a mais simples de explicar.

- **Vantagem**: só entra no cache o que alguém realmente pediu, e se o cache cair a aplicação ainda funciona, indo direto ao banco.
- **Custo**: o primeiro pedido de cada dado é sempre lento (miss), e o dado pode ficar velho se o banco mudar sem avisar o cache.

### Read-through

Parecido, mas é o **cache** que busca no banco no miss, e não a aplicação. A aplicação só fala com o cache. Isso simplifica o código da aplicação, mas exige um cache que saiba carregar dados do banco.

### Write-through

Toda escrita vai ao cache e ao banco **na mesma operação**, e só é confirmada depois que os dois aceitam. Cache e banco ficam sempre iguais.

- **Vantagem**: leituras nunca veem dado velho.
- **Custo**: cada escrita fica mais lenta, e dados que nunca serão lidos ocupam espaço no cache.

### Write-back (write-behind)

A escrita vai **só ao cache**, que é confirmada na hora, e o banco é atualizado depois, de forma assíncrona e em lotes.

- **Vantagem**: escritas muito rápidas, e vários updates do mesmo dado viram uma única gravação no banco.
- **Custo**: se o cache cair antes de gravar no banco, os dados ainda não propagados **se perdem**. Só serve quando perder alguns segundos de dados é aceitável, como contadores de visualizações.

### Qual escolher no nosso cenário

Para a página de produto, que é quase só leitura, o padrão é **cache-aside**. Para o estoque, que muda a cada compra e não pode ficar errado, vale write-through ou nem cachear. Dizer essa diferença em voz alta, produto de um jeito e estoque de outro, é o que mostra que você entende o trade-off.

## Lembre

- O miss paga **as duas consultas**: cache e banco.
- **Cache-aside**: a aplicação decide. **Write-back**: rápido, mas pode perder dados.
- Produto: cache-aside. Estoque: write-through ou nem cachear.
