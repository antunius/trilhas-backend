---
slug: agendador-tarefas
categorySlug: system-design
title: "Exercício: Projetar um Agendador de Tarefas (Job Scheduler)"
navTitle: Agendador de Tarefas
summary: "Projete um sistema que permite agendar tarefas para execução em um momento futuro específico, ou de forma recorrente (ex: \"todo dia às 3h da manhã\"), garantindo que cada tarefa seja executada exatamente uma vez."
level: avancado
order: 135
section: exercicios-praticos
group: "Infraestrutura e ferramentas"
---

## Objetivos de aprendizagem

- [ ] Praticar como encontrar eficientemente o próximo trabalho a executar sem varrer tudo
- [ ] Decidir como garantir execução única sob múltiplos workers concorrentes

## Enunciado

Projete um sistema que permite agendar tarefas para execução em um momento futuro específico, ou de forma recorrente (ex: "todo dia às 3h da manhã"), garantindo que cada tarefa seja executada exatamente uma vez.

![Scheduler: fila de jobs no tempo](/diagrams/sd-agendador-tarefas.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual o volume esperado de tarefas agendadas simultaneamente?
- O que deve acontecer se uma tarefa falhar durante a execução — há retentativa automática?
- É aceitável que uma tarefa seja executada com um pequeno atraso, ou o horário precisa ser exato?

## Requisitos funcionais (exemplos)

- Agendar uma tarefa para um horário futuro específico.
- Agendar uma tarefa recorrente (cron-like).
- Executar a tarefa exatamente uma vez no horário definido (com tolerância de atraso definida).
- Registrar o resultado da execução e retentar em caso de falha.

## Requisitos não-funcionais (exemplos)

- **Escala:** potencialmente milhões de tarefas agendadas, mas só uma fração pequena "vence" em qualquer janela de tempo.
- **Latência:** tolerância de atraso definida (segundos a minutos, conforme o requisito) entre o horário agendado e a execução real.
- **Disponibilidade:** alta — o agendador precisa sobreviver à queda de um worker sem perder ou duplicar execuções.
- **Consistência:** forte na garantia de execução única por tarefa — é o requisito central do exercício.
- **Leitura vs. escrita:** escrita concentrada no agendamento; leitura concentrada em "o que está pronto para rodar agora", de forma contínua.

## Tecnologias que podem ser usadas

- **Armazenamento:** um banco com índice ordenado por horário de execução (Postgres com índice em `next_run_at`, ou uma estrutura de fila com prioridade).
- **Coordenação:** lock distribuído com TTL (Redis, ou lock otimista no banco) para o claim de uma tarefa por um único worker.
- **Fila de mensagens:** para desacoplar "identificar que está na hora" de "executar de fato".
- **Escalonamento:** múltiplos workers competindo pelo claim, escalando horizontalmente conforme o volume de tarefas prontas.

## Pontos centrais a explorar (deep dive sugerido)

- Como encontrar eficientemente quais tarefas estão prontas para execução em um dado momento, sem varrer todas as tarefas agendadas a cada verificação.
- Garantir execução única mesmo com múltiplos workers rodando em paralelo — um problema de **Lidando com Contenção** (Módulo 6): dois workers não podem pegar a mesma tarefa para executar simultaneamente.

![Fila ordenada por horário + lock de claim entre workers](/diagrams/sd-agendador-tarefas-contencao.svg)

- Estratégia de retentativa e tratamento de falhas para tarefas que não completam com sucesso.

## O que revisar depois de resolver

- A busca por tarefas prontas usa um índice ordenado por horário, em vez de varrer a tabela inteira?
- O mecanismo de claim explica o que acontece se o worker cair depois de reservar a tarefa e antes de concluir?
- A estratégia de retentativa evita duplicar o efeito de uma tarefa que já rodou parcialmente?
