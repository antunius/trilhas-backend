---
slug: cache-fundamentos
categorySlug: system-design
title: "Cache: hit, miss, hit ratio, TTL e eviction"
navTitle: Fundamentos de cache
summary: "Entender o vocabulário do cache e o caminho de uma leitura"
level: intermediario
order: 25
section: tecnologias-chave
group: "Cache"
---

## Objetivos de aprendizagem

- [ ] Definir cache, hit, miss, hit ratio, TTL e eviction
- [ ] Descrever o caminho de uma leitura com e sem cache

## Cenário de referência da unidade

Vamos usar o mesmo cenário do início ao fim: a página de produto de uma loja online. Cada visita mostra nome, preço, fotos e estoque do produto, lidos de um banco de dados. A loja tem 200 mil visitas por minuto no horário de pico, e uma liquidação faz 1% dos produtos concentrar quase todo o tráfego.

## Fundamentos: o vocabulário básico, peça por peça

Antes de comparar estratégias, vale fixar cada termo. Muita confusão em entrevista vem de usar "cache" para tudo sem dizer o que se guarda, onde e por quanto tempo.

### O que é um cache, em uma frase

Cache é uma cópia temporária de um dado, guardada num lugar mais rápido ou mais perto de quem pede, para não repetir o trabalho caro de buscar o dado original. A analogia do dia a dia é a geladeira: ir ao mercado (o banco de dados) leva 30 minutos, abrir a geladeira leva 5 segundos. Você guarda em casa o que usa muito, sabendo que a geladeira tem espaço limitado e que o leite pode vencer.

### Hit e miss

Um **hit** acontece quando o dado pedido está no cache e a resposta sai de lá. Um **miss** acontece quando ele não está, e é preciso buscar no banco. Todo cache vive entre esses dois caminhos, e o miss é mais lento que não ter cache nenhum, porque faz a consulta ao cache e depois a consulta ao banco.

### Hit ratio

O **hit ratio** é a fração de pedidos que viram hit. Se de cada 100 pedidos 95 acham o dado no cache, o hit ratio é 95%. É o número que diz se o cache está valendo a pena, e ele importa mais do que a velocidade do cache em si, como o exemplo numérico mais abaixo mostra.

### TTL

**TTL** (*time to live*) é o tempo de vida de uma entrada: passado esse prazo, o cache a descarta sozinho. Um TTL de 60 segundos para o preço do produto significa que, no pior caso, o cliente vê um preço com até 60 segundos de atraso. É a forma mais simples de limitar o quanto o dado guardado pode ficar velho.

### Eviction (remoção por falta de espaço)

Um cache tem memória limitada. Quando enche, precisa **remover** algo para dar lugar a um dado novo. A política mais comum é a **LRU** (*least recently used*): sai o dado que está há mais tempo sem ser usado. Em termos práticos, produtos populares ficam e produtos que ninguém olha saem.

### Juntando as peças: o caminho de uma leitura

1. O cliente abre a página do produto 42, e a aplicação pergunta ao cache por `produto:42`.
2. **Hit**: o cache devolve o dado em cerca de 1 ms, e o banco nem fica sabendo.
3. **Miss**: a aplicação consulta o banco (cerca de 20 ms), devolve a resposta ao cliente e grava o resultado no cache com um TTL.
4. A próxima visita ao produto 42 já encontra o dado no cache.

![Cache-aside: app lê o cache e só vai ao DB no miss](/diagrams/sd-cache-aside.svg)

*A imagem mostra o caminho acima. Note que é a aplicação, e não o cache, que decide ir ao banco no miss. Essa é a característica que define o cache-aside.*

## Lembre

- **Hit**: o dado está no cache. **Miss**: foi preciso ir ao banco.
- O **hit ratio** diz se o cache vale a pena.
- **TTL** limita o quanto o dado pode ficar velho; **LRU** remove o menos usado.
