---
slug: sharding-fundamentos
categorySlug: system-design
title: "Sharding: o que é e por que réplicas não bastam"
navTitle: Fundamentos de sharding
summary: "Entender shard, chave de particionamento, escala vertical e horizontal e por que réplicas de leitura não resolvem escrita"
level: intermediario
order: 30
section: tecnologias-chave
group: "Sharding"
---

## Objetivos de aprendizagem

- [ ] Definir shard e chave de particionamento
- [ ] Explicar por que réplicas não resolvem o limite de escrita e de armazenamento

## Cenário de referência da unidade

Vamos usar um aplicativo de mensagens. Ele tem 200 milhões de usuários, cada um envia em média 40 mensagens por dia, e cada mensagem ocupa cerca de 1 KB com seus metadados. Isso dá 8 bilhões de mensagens por dia, ou cerca de **8 TB novos por dia**. Esse volume não cabe num único banco por muito tempo, e é isso que torna o sharding uma pergunta real.

## Fundamentos: o vocabulário básico, peça por peça

### O que é sharding, em uma frase

Sharding é dividir os dados de **uma tabela lógica** entre **vários bancos independentes**, cada um dono de uma fatia dos dados. Cada fatia se chama **shard**. A analogia é um arquivo de escritório: em vez de uma estante gigante, há 8 estantes, e uma regra diz em qual delas cada pasta fica.

### Partição e shard

Os dois nomes se misturam, mas costuma-se dizer **partição** quando a divisão é lógica (dentro do mesmo banco ou serviço) e **shard** quando cada fatia vive em um **servidor diferente**. Em entrevista, o sentido importante é: dados divididos por uma regra, em máquinas diferentes.

### Chave de particionamento

É a coluna cujo valor decide em qual shard a linha vai. No app de mensagens, pode ser o `conversa_id`. Escolher essa chave é a decisão mais importante do sharding, porque ela define quais consultas ficam fáceis e quais ficam caras.

### Escalar verticalmente e horizontalmente

**Vertical**: comprar uma máquina maior (mais CPU, memória, disco). É simples, mas tem teto e fica caro. **Horizontal**: acrescentar mais máquinas e dividir o trabalho entre elas. Sharding é a forma de escalar um banco horizontalmente.

### Por que réplicas não bastam

Uma **réplica de leitura** é uma cópia do banco que atende consultas. Ela divide a carga de **leitura**, mas continua guardando uma **cópia completa** dos dados e todas as escritas ainda passam pelo servidor principal. Então réplicas não resolvem dois limites: o **armazenamento total** (8 TB por dia não cabem num servidor, mesmo com mil cópias) e a **taxa de escrita** (o servidor principal continua sendo o único a gravar).

### Juntando as peças: o caminho de uma escrita

1. O app envia uma mensagem da conversa `c-8841`.
2. Um componente de roteamento aplica a regra de particionamento ao `conversa_id`.
3. A regra aponta para o **shard 5**.
4. A escrita vai ao shard 5, que é um banco comum com suas próprias réplicas.
5. Para ler a conversa, o mesmo cálculo leva ao mesmo shard.

![Sharding por hash: a chave decide o shard](/diagrams/sd-sharding.svg)

*A imagem mostra a regra: dada a chave, o roteador calcula o shard. A mesma chave sempre cai no mesmo shard, e é isso que permite ler de volta o que foi escrito.*

## Lembre

- Sharding divide os dados entre **bancos independentes**, cada um dono de uma fatia.
- A **chave de particionamento** é a decisão mais importante.
- Réplicas dividem **leitura**; só o sharding divide **escrita e armazenamento**.
