---
slug: mensagens-tempo-real
categorySlug: system-design
title: "Exercício: Projetar um Sistema de Mensagens em Tempo Real"
navTitle: Sistema de Mensagens em Tempo Real
summary: Aplicar o framework a um problema que exige comunicação em tempo real
level: avancado
order: 117
section: exercicios-praticos
group: "Mensagens e feeds"
---

## Objetivos de aprendizagem

- [ ] Aplicar o framework a um problema que exige comunicação em tempo real
- [ ] Praticar decisões sobre entrega garantida de mensagens e ordenação

## Enunciado

Projete um sistema de troca de mensagens em tempo real entre dois usuários (estilo chat individual), incluindo indicação de mensagem entregue e lida.

![Chat: mensagens + presença](/diagrams/sd-mensagens-tempo-real.svg)

## Perguntas orientadoras (levantamento de requisitos)

- O sistema precisa suportar apenas conversas entre dois usuários, ou também grupos?
- Mensagens precisam ser entregues mesmo se o destinatário estiver offline no momento do envio?
- É necessário garantir a ordem exata de entrega das mensagens?

## Requisitos funcionais (exemplos)

- Enviar uma mensagem de texto para outro usuário.
- Entregar a mensagem em tempo real se o destinatário estiver online.
- Armazenar a mensagem para entrega posterior se o destinatário estiver offline.
- Marcar e exibir os estados "entregue" e "lida".

## Requisitos não-funcionais (exemplos)

- **Escala:** milhões de conexões simultâneas mantidas abertas, cada uma de baixo tráfego.
- **Latência:** entrega em tempo real deve ficar abaixo de ~200ms fim a fim enquanto os dois lados estão online.
- **Disponibilidade:** alta — uma queda não pode perder mensagens, só atrasá-las.
- **Consistência:** a ordem de mensagens dentro de uma mesma conversa precisa ser preservada; os estados "entregue"/"lida" podem ser eventualmente consistentes entre os dispositivos do mesmo usuário.
- **Leitura vs. escrita:** próximo de 1:1 no envio, mas a carga real é sustentar conexões abertas, não volume de escrita.

## Tecnologias que podem ser usadas

- **Load balancer:** com suporte a conexões persistentes (sticky sessions ou um gateway dedicado de WebSocket).
- **Camada de aplicação:** servidores WebSocket com registro de "quem está conectado em qual instância" (ex.: em Redis).
- **Armazenamento:** banco otimizado para série temporal por conversa (Cassandra, DynamoDB) para o histórico de mensagens.
- **Fila de mensagens:** para desacoplar recebimento e entrega, e para a mailbox de usuários offline.

## Pontos centrais a explorar (deep dive sugerido)

- Como manter uma conexão persistente com o cliente para entrega em tempo real (ex: WebSockets), em vez de o cliente ficar perguntando repetidamente por novas mensagens (polling)?
- Como lidar com um destinatário offline: onde a mensagem fica armazenada até a próxima conexão do usuário?

![Destinatário online (WebSocket) vs. offline (mailbox)](/diagrams/sd-mensagens-tempo-real-offline.svg)

- Como garantir e comunicar os estados de "entregue" e "lida" de forma consistente entre os dois lados da conversa?

## O que revisar depois de resolver

- A escolha de protocolo de comunicação em tempo real foi justificada, considerando o trade-off entre WebSockets e alternativas como polling?
- O modelo de dados contempla o histórico de mensagens de forma que suporte consultas eficientes por conversa?
- A consistência necessária para os estados de "entregue"/"lida" foi discutida (aula de Consistência, Módulo 3)?
