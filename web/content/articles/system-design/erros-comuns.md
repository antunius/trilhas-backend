---
slug: erros-comuns
categorySlug: system-design
title: Erros Comuns e Como Evitá-los
summary: Reconhecer os erros mais frequentes em cada etapa do framework
level: intermediario
order: 8
section: framework-entrega
group: "Desenhar e aprofundar"
---

## Objetivos de aprendizagem

- [ ] Reconhecer os erros mais frequentes em cada etapa do framework
- [ ] Ter estratégias práticas para evitá-los durante a entrevista

## Estrutura da aula

1. Erros de gestão de tempo
2. Erros de comunicação
3. Erros técnicos recorrentes
4. Checklist rápido antes de encerrar a entrevista

## Conteúdo

### Erros de gestão de tempo

![Erros comuns vs abordagem sólida](/diagrams/sd-erros-comuns.svg)

O erro mais comum é gastar tempo demais nas primeiras etapas (requisitos, contrato de API) e chegar ao fim sem espaço para deep dives — que é onde boa parte da avaliação acontece. Uma forma prática de evitar isso é ter, mentalmente, um orçamento de tempo por etapa (como visto na aula de Orientação) e monitorar o próprio ritmo, ajustando conforme necessário.

### Erros de comunicação

Ficar em silêncio pensando, sem verbalizar o raciocínio, é um dos erros mais penalizados — mesmo quando o raciocínio interno está correto, o entrevistador só pode avaliar o que é dito. Outro erro recorrente é não reagir aos sinais do entrevistador (perguntas, expressões de dúvida), continuando no mesmo ponto quando o sinal claro era para avançar ou aprofundar em outro lugar.

### Erros técnicos recorrentes

- Introduzir complexidade (sharding, filas, múltiplas regiões) sem que o requisito justifique isso.
- Ignorar completamente requisitos não-funcionais, desenhando apenas o caminho funcional feliz.
- Escolher tecnologias por familiaridade, sem conseguir justificar a escolha diante de uma pergunta simples de "por quê".

### Checklist rápido antes de encerrar

Nos minutos finais, vale revisar mentalmente: o desenho atende aos requisitos funcionais combinados? As decisões de escala fazem sentido com os números estimados? Existe algum ponto de falha óbvio que ainda não foi mencionado? Essa revisão rápida frequentemente identifica lacunas fáceis de corrigir com poucas frases antes do tempo acabar.

## Exemplo aplicado

Um candidato que gasta 30 dos 45 minutos disponíveis apenas definindo requisitos e contrato de API, chegando ao desenho de alto nível apressado e sem tempo para nenhum deep dive, ilustra o erro de gestão de tempo mais comum — mesmo que cada etapa individual tenha sido bem conduzida.

## Erros comuns

- Não monitorar o tempo e perceber o atraso só perto do fim da entrevista.
- Tratar comentários do entrevistador como interrupções a serem ignoradas, em vez de sinais a serem seguidos.
- Terminar a entrevista sem revisar se o design final ainda atende ao que foi combinado no início.
