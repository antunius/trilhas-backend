---
slug: plataforma-julgamento-codigo
categorySlug: system-design
title: "Exercício: Projetar uma Plataforma de Julgamento de Código (estilo LeetCode)"
navTitle: Plataforma de Julgamento de Código
summary: Projete uma plataforma onde usuários submetem código para resolver problemas de programação, e o sistema executa esse código contra casos de teste, retornando se a solução passou ou falhou.
level: avancado
order: 134
section: exercicios-praticos
group: "Infraestrutura e ferramentas"
---

## Objetivos de aprendizagem

- [ ] Praticar o desenho de processamento assíncrono sob isolamento de segurança
- [ ] Decidir como escalar workers durante picos de competição

## Enunciado

Projete uma plataforma onde usuários submetem código para resolver problemas de programação, e o sistema executa esse código contra casos de teste, retornando se a solução passou ou falhou.

![Judge: fila de execução isolada](/diagrams/sd-plataforma-julgamento-codigo.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Quantas submissões simultâneas o sistema precisa suportar em um dia comum, e durante uma competição ao vivo?
- Como garantir que o código de um usuário não afete o sistema ou outros usuários (segurança de execução)?
- O resultado da execução deve ser retornado de forma síncrona ou o usuário pode esperar um pouco?

## Requisitos funcionais (exemplos)

- Submeter código para um problema específico.
- Executar o código contra um conjunto de casos de teste.
- Retornar o resultado (passou/falhou, com detalhe do caso que falhou).
- Permitir consultar o status de uma submissão em processamento.

## Requisitos não-funcionais (exemplos)

- **Escala:** poucas submissões por segundo em dia comum; picos de milhares por segundo durante uma competição ao vivo.
- **Latência:** resultado em segundos é aceitável — não precisa ser síncrono na mesma requisição HTTP.
- **Disponibilidade:** alta na fila de recebimento; degradar de forma controlada (fila cresce, mas nada se perde) é preferível a rejeitar submissões.
- **Consistência:** cada submissão deve ser executada exatamente uma vez — reexecutar por engano pode duplicar o resultado.
- **Segurança:** requisito não-funcional central — o código de um usuário nunca pode afetar o host, outros usuários ou a rede.

## Tecnologias que podem ser usadas

- **Fila de mensagens:** para desacoplar recebimento de submissões e execução, absorvendo picos de competição.
- **Sandbox de execução:** containers isolados (ex.: gVisor, Firecracker) com limites de CPU, memória e tempo por execução.
- **Armazenamento:** banco relacional para submissões e resultados; blob storage para artefatos grandes (ex.: saída de testes).
- **Escalonamento:** workers stateless que escalam horizontalmente conforme o tamanho da fila.

## Pontos centrais a explorar (deep dive sugerido)

- **Tarefas de Longa Duração** (Módulo 6): a execução do código é assíncrona, com o resultado sendo consultado ou notificado depois.
- Isolamento de execução: cada submissão deve rodar em um ambiente isolado (sandbox), com limites de tempo e memória, para proteger o restante do sistema.

![Fila de submissões → sandbox isolado → resultado assíncrono](/diagrams/sd-plataforma-julgamento-codigo-sandbox.svg)

- Fila de processamento para distribuir submissões entre workers disponíveis, especialmente relevante durante picos como competições.

## O que revisar depois de resolver

- O isolamento de execução foi explicado com uma tecnologia concreta, não apenas "roda em sandbox"?
- A fila absorve picos de competição sem exigir que o servidor de API espere a execução terminar?
- O modelo garante que uma submissão não seja executada (ou contabilizada) mais de uma vez?
