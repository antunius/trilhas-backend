---
slug: consistent-hashing-problema
categorySlug: system-design
title: "O problema do hash por módulo"
navTitle: O problema do hash % N
summary: "Entender a função de hash, o hash por módulo e por que quase tudo muda quando o cluster cresce"
level: intermediario
order: 34
section: tecnologias-chave
group: "Consistent hashing"
---

## Objetivos de aprendizagem

- [ ] Definir função de hash, módulo e rebalanceamento
- [ ] Calcular quantas chaves mudam de servidor quando N muda

## Cenário de referência da unidade

Vamos usar um **cluster de cache** com 4 servidores guardando 1 milhão de chaves (por exemplo, `produto:42`). Cada requisição precisa saber **qual dos servidores** guarda a chave. A pergunta da aula é: o que acontece com essa regra quando um quinto servidor entra no cluster, ou um deles cai?

## Fundamentos: o vocabulário básico, peça por peça

### Função de hash

Uma **função de hash** transforma qualquer texto num número, de forma **determinística** (a mesma entrada dá sempre o mesmo número) e **bem espalhada** (entradas parecidas dão números muito diferentes). `hash("produto:42")` pode dar 1.847.302.915. Você não precisa saber o cálculo, só que ele é rápido e uniforme.

### Hash por módulo

A forma mais simples de escolher um servidor é: `servidor = hash(chave) % N`, onde `N` é o número de servidores. O operador `%` (módulo) devolve o resto da divisão. Com 4 servidores, o resto é 0, 1, 2 ou 3, e esse é o número do servidor. Essa regra é rápida, simples e distribui bem, o que a torna ótima enquanto `N` **nunca muda**.

### Rebalanceamento

**Rebalancear** é mover dados entre servidores depois que o cluster muda de tamanho. Em um cache, mover dados na prática significa que as chaves "mudam de endereço", o servidor novo não as tem, e cada uma vira um miss.

## O problema: `hash % N` quando N muda

Veja o que acontece com 4 servidores quando entra um quinto. Considere 12 chaves com hashes 0 a 11 (valores pequenos para a conta ficar à vista):

| hash | `% 4` (antes) | `% 5` (depois) | Mudou? |
|---|---|---|---|
| 0 | 0 | 0 | não |
| 1 | 1 | 1 | não |
| 2 | 2 | 2 | não |
| 3 | 3 | 3 | não |
| 4 | 0 | 4 | **sim** |
| 5 | 1 | 0 | **sim** |
| 6 | 2 | 1 | **sim** |
| 7 | 3 | 2 | **sim** |
| 8 | 0 | 3 | **sim** |
| 9 | 1 | 4 | **sim** |
| 10 | 2 | 0 | **sim** |
| 11 | 3 | 1 | **sim** |

Das 12 chaves, **8 mudaram de servidor** (cerca de 67%). Em geral, ao ir de N para N+1 servidores, a fração que muda chega perto de **N/(N+1)**: com 4 servidores indo para 5, cerca de 80% das chaves; com 100 indo para 101, cerca de 99%. Quase tudo muda.

Com 1 milhão de chaves no cache, isso significa cerca de 800 mil misses de uma vez. Todas essas leituras vão ao banco ao mesmo tempo. O cache que protegia o banco causa uma avalanche sobre ele (o *stampede* da lição de cache), justamente no momento em que você estava tentando **escalar**.

## Lembre

- `hash(chave) % N` é ótimo enquanto **N nunca muda**.
- Ao ir de N para N+1, cerca de **N/(N+1)** das chaves mudam.
- Em um cache, chave que muda de endereço vira **miss**.
