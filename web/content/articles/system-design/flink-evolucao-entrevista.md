---
slug: flink-evolucao-entrevista
categorySlug: system-design
title: "Flink: evolução do estado e entrevista"
navTitle: Evolução e entrevista
summary: "Evoluir o estado de um job sem perder o savepoint e saber como responder em entrevista"
level: intermediario
order: 92
section: deep-dives-tecnologias
group: "Flink"
---

## Objetivos de aprendizagem

- [ ] Evoluir o schema do estado de forma compatível
- [ ] Reconhecer usos típicos e o que separa respostas média e sênior

*Retomando o cenário da unidade: um painel de métricas em tempo real para uma plataforma de anúncios, com cliques por minuto por campanha.*

## Evolução/schema/migração

Com o tempo, o formato do estado guardado por operador tende a mudar — por exemplo, adicionar um campo `ultimaCampanhaVista` ao acumulador de um operador stateful, ou trocar o POJO `Clique` por uma versão com um novo campo `dispositivo`. Isso levanta a pergunta: dá para atualizar o código do job e retomar de um **savepoint** tirado com a versão antiga, sem perder o estado acumulado?

O Flink suporta isso via **evolução de schema de estado**, desde que o tipo usado no `ValueState`/POJO siga regras de compatibilidade do serializador (POJO serializer ou Avro): campos podem ser **adicionados** livremente (o valor default é usado ao ler estado antigo que não tinha aquele campo), mas **remover ou renomear** um campo quebra a compatibilidade binária do estado serializado — o Flink não tem como saber que `nomeAntigo` e `nomeNovo` são "o mesmo campo", então o savepoint antigo se torna ilegível para esse tipo.

Regra prática: trate o tipo do estado como um contrato aditivo — só adicione campos, nunca remova ou renomeie sem um plano de migração explícito (ex: manter o campo antigo como deprecated, ler dos dois formatos por um período de transição, e só remover depois que todos os savepoints relevantes já tiverem sido regravados com o novo schema).

## Principais usos

- **Detecção de fraude em tempo real**: identificar padrões suspeitos (ex: múltiplas transações da mesma conta em janelas curtas de tempo) enquanto o evento ainda está "quente", antes da transação ser aprovada.
- **Dashboards de analytics em tempo real**: exatamente o cenário deste artigo — métricas agregadas continuamente (cliques, pedidos, erros) por janela de tempo, sem espera por um batch job noturno.
- **Microsserviços orientados a eventos com processamento stateful**: serviços que mantêm estado por entidade (ex: saldo de carrinho de compras, sessão de usuário) diretamente no operador, evitando ida a um banco externo a cada evento.
- **Processamento de streams de ETL/CDC**: consumir change data capture (CDC) de um banco transacional e transformar/enriquecer os dados continuamente antes de escrever num data warehouse ou lake.
- **Computação de features em tempo real para ML**: calcular features agregadas (ex: "número de compras do usuário na última hora") no momento da inferência, mantendo paridade com como as mesmas features foram calculadas no treino.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "Flink processa streams em tempo real" e menciona "janelas de tempo" de forma genérica |
| Sênior | Escolhe o tipo de janela certo (tumbling/sliding/session) com justificativa, e menciona watermarks como solução para eventos fora de ordem |
| Staff+ | Além do acima, discute o trade-off da margem de tolerância do watermark (latência vs. completude), e explica checkpoints como mecanismo de recuperação sem reprocessamento total |

## Erros comuns

- Propor um motor de processamento de stream para um cenário simples sem agregação contínua ao longo do tempo, onde um consumidor comum já bastaria.
- Ignorar completamente o problema de eventos fora de ordem, assumindo que tudo chega na ordem exata em que aconteceu.
- Não considerar como o sistema recupera seu estado após uma falha no meio do processamento de uma janela.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece com um clique que chega depois que sua janela já foi fechada e o resultado já foi emitido?" (depende da configuração: pode ser descartado, ou disparar uma atualização tardia do resultado já emitido, dependendo de quão crítica é a exatidão para o caso de uso).
- "Por que não usar uma margem de tolerância enorme para o watermark, garantindo que quase nenhum evento chegue tarde demais?" (aumenta a latência de todas as métricas — o painel em tempo real ficaria sistematicamente atrasado por essa margem inteira).

## Lembre

- Trate o tipo do estado como um contrato **aditivo**: só adicione campos.
- Remover ou renomear um campo **quebra o savepoint**.
- Fale de **watermarks** e de **checkpoints** sem ser perguntado.
