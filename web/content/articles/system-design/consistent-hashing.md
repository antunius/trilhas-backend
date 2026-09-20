---
slug: consistent-hashing
categorySlug: system-design
title: Consistent Hashing
summary: Entender o problema que consistent hashing resolve
level: intermediario
order: 15
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender o problema que consistent hashing resolve
- [ ] Explicar de forma simples como o mecanismo funciona

## Conteúdo

### O problema

![Anel de consistent hashing](/diagrams/sd-consistent-hashing.svg)

Com hashing simples (`hash(chave) % número_de_servidores`), adicionar ou remover um único servidor muda o resultado do módulo para praticamente todas as chaves, forçando a redistribuição de quase todos os dados — uma operação extremamente cara em sistemas de cache ou bancos distribuídos.

### Como consistent hashing resolve isso

A ideia central é mapear tanto os servidores quanto as chaves em um mesmo espaço circular (um "anel") de hash. Cada chave é atribuída ao primeiro servidor encontrado ao percorrer o anel em uma direção a partir de sua posição. Quando um servidor é adicionado ou removido, apenas as chaves que estavam atribuídas a esse trecho específico do anel precisam ser redistribuídas — o restante permanece intacto.

Na prática, cada servidor físico costuma ser representado por múltiplos pontos virtuais no anel, o que ajuda a distribuir a carga de forma mais equilibrada entre os servidores existentes.

## Exemplo aplicado

Em um cluster de cache com consistent hashing, adicionar um novo servidor faz com que apenas uma fração pequena e previsível das chaves (aquelas entre o novo servidor e seu vizinho anterior no anel) precise ser movida — em vez de quase todo o cache precisar ser reconstruído, como aconteceria com hashing simples por módulo.

## Erros comuns

- Confundir consistent hashing com sharding por hash simples — são conceitos relacionados, mas consistent hashing resolve especificamente o problema de redistribuição ao escalar.
- Não conseguir explicar por que apenas uma fração dos dados precisa se mover ao adicionar/remover um nó.
