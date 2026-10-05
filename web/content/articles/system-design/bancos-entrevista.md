---
slug: bancos-entrevista
categorySlug: system-design
title: "Bancos de dados na entrevista"
navTitle: Na entrevista
summary: "Saber o que diferencia respostas média e sênior sobre bancos, e as armadilhas comuns"
level: intermediario
order: 21
section: tecnologias-chave
group: "Bancos de dados"
---

## Objetivos de aprendizagem

- [ ] Reconhecer os erros comuns ao escolher bancos
- [ ] Responder com o nível de profundidade esperado

*Retomando o cenário da unidade: um marketplace online com pedidos e pagamentos, catálogo de produtos de atributos variáveis e carrinho temporário.*

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe descrever os três modelos e dá um exemplo de cada |
| Sênior | Escolhe pelo padrão de acesso, justifica por tabela de dados (pedido vs. catálogo vs. carrinho), cita ACID e a falta dele quando cabe, e reconhece o custo de operar vários bancos |
| Staff+ | Pergunta sobre volume, proporção leitura/escrita e requisitos de consistência antes de escolher, discute como manter dados em bancos diferentes consistentes (por exemplo com eventos) e prevê migrações futuras |

## Erros comuns

- Escolher um único banco para tudo, ou escolher vários sem necessidade.
- Justificar a escolha pela familiaridade ("já uso Mongo"), sem ligar ao padrão de acesso.
- Usar documento ou chave-valor para dados que exigem transação entre vários registros, como dinheiro.
- Usar banco relacional para um dado que é só "busque por id em altíssima taxa" e depois estranhar a carga.
- Duplicar dados num banco de documento e esquecer como atualizar todas as cópias.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que não guardar tudo no MongoDB?" (pedidos e pagamentos precisam de transação entre vários registros e consultas variadas, o que o relacional entrega melhor.)
- "Como o catálogo no MongoDB e os pedidos no Postgres ficam consistentes?" (o pedido guarda o id e um instantâneo do preço; mudanças viajam por eventos, aceitando consistência eventual para o catálogo.)
- "O que acontece se o Redis do carrinho cair?" (se o carrinho vive só ali, os carrinhos se perdem; aceitável para carrinhos temporários, com persistência ou réplica se a perda for cara.)
- "Quando você migraria o catálogo para relacional?" (se surgirem muitas consultas que cruzam produtos e outras entidades, a flexibilidade do join passa a valer mais que a do esquema.)

## Lembre

- Justifique pelo **padrão de acesso**, nunca pela familiaridade.
- Dinheiro pede **transação**; evite documento/chave-valor para isso.
- Fale de como manter bancos diferentes **consistentes**, por exemplo com eventos.
