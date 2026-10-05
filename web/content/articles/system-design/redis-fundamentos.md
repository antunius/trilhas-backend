---
slug: redis-fundamentos
categorySlug: system-design
title: "Redis: memória, single-thread e estruturas de dados"
navTitle: Fundamentos do Redis
summary: "Entender por que o Redis é rápido, o que o modelo de uma única thread custa e quais estruturas de dados ele oferece"
level: intermediario
order: 66
section: deep-dives-tecnologias
group: "Redis"
---

## Objetivos de aprendizagem

- [ ] Explicar por que o Redis é rápido e o que o modelo de uma única thread custa
- [ ] Escolher entre string, hash, list, set, sorted set e stream

## Cenário de referência da unidade

Vamos usar um cenário único ao longo da aula: uma plataforma de quiz ao vivo, onde milhares de jogadores respondem perguntas em tempo real, o sistema mantém um placar (leaderboard) ao vivo, limita quantas respostas por segundo cada jogador pode enviar (para evitar bots), e usa um lock temporário para garantir que apenas uma resposta por jogador seja contabilizada por pergunta.

## Fundamentos: o que é o Redis, por dentro

### Em memória, e o que isso significa na prática

Redis guarda todos os seus dados na RAM, não em disco (com persistência opcional discutida mais adiante). Isso é o motivo central de sua velocidade: uma leitura em Redis normalmente leva menos de 1 milissegundo, contra 5-20+ milissegundos de uma consulta típica a um banco relacional que precisa ir ao disco. Para o nosso quiz, isso significa que atualizar e consultar o placar pode acontecer em uma fração do tempo que levaria no banco principal.

### Single-threaded: rápido, mas com uma implicação séria

Redis processa comandos em uma única thread, um de cada vez, usando um event loop (o mesmo padrão usado por sistemas como Node.js). Isso elimina a complexidade de lidar com concorrência interna (dois comandos nunca disputam o mesmo dado ao mesmo tempo dentro do próprio Redis) e é surpreendentemente rápido — instâncias comuns sustentam a ordem de 100 mil+ operações por segundo.

**A implicação séria**: como é single-threaded, um único comando lento (ex: pedir para ordenar ou escanear uma estrutura com milhões de elementos) trava *todos* os outros comandos até terminar — não existe "outro núcleo" livre para atender o próximo cliente enquanto isso. No nosso quiz, isso significa: nunca rodar um comando que escaneie a lista inteira de 50 mil jogadores dentro do caminho crítico de uma resposta — é para isso que existem estruturas como o sorted set, que veremos a seguir, desenhadas para nunca exigir esse tipo de operação cara.

### As estruturas de dados, uma a uma

Redis não é um simples par chave-valor — é melhor pensado como um "servidor de estruturas de dados". As mais relevantes para entrevista:

- **String**: o tipo mais simples — uma chave aponta para um valor de texto ou número. Base de contadores simples (`INCR contador`) e cache básico.
- **Hash**: um objeto com múltiplos campos, como um dicionário aninhado sob uma única chave — útil para representar uma entidade inteira (ex: o perfil de um jogador) sem serializar/desserializar um JSON completo a cada leitura de um campo só.
- **List**: uma lista ordenada, com inserção/remoção eficiente nas duas pontas — base para filas simples.
- **Set**: uma coleção de valores únicos, sem ordem — útil para checar pertencimento rapidamente (ex: "esse jogador já respondeu essa pergunta?").
- **Sorted Set (ZSET)**: como um Set, mas cada membro tem uma pontuação numérica associada, e a estrutura se mantém sempre ordenada por essa pontuação — a peça central do nosso leaderboard, detalhada a seguir.
- **Stream**: um log de eventos append-only, com semântica parecida com uma versão simplificada do Kafka (aula anterior) — útil quando múltiplos consumidores precisam ler os mesmos eventos de forma independente, mas em uma escala menor que justificaria um Kafka completo.

## Lembre

- O Redis guarda tudo na **RAM**, por isso responde em menos de 1 ms.
- Uma única thread executa um comando por vez: **um comando lento trava todos**.
- Pense nele como um servidor de **estruturas de dados**, não só chave-valor.
