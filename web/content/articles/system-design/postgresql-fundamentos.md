---
slug: postgresql-fundamentos
categorySlug: system-design
title: "PostgreSQL: conexões, WAL e MVCC"
navTitle: Fundamentos do PostgreSQL
summary: "Entender o custo de uma conexão, o papel do WAL e como o MVCC deixa leitores e escritores trabalharem juntos"
level: intermediario
order: 54
section: deep-dives-tecnologias
group: "PostgreSQL"
---

## Objetivos de aprendizagem

- [ ] Explicar por que é preciso um pool de conexões
- [ ] Descrever o WAL e o MVCC e o que cada um garante

## Cenário de referência da unidade

Vamos usar uma plataforma de reviews de restaurantes, com dados razoavelmente relacionais (usuários, restaurantes, reviews) e um requisito específico: buscar restaurantes dentro de um raio geográfico de uma localização.

## Fundamentos: o vocabulário básico, peça por peça

### Conexão e processo

Cada cliente conectado ao PostgreSQL ocupa um **processo** dedicado no servidor, que consome da ordem de **5 a 10 MB de memória**. Por isso o número máximo de conexões é limitado (o padrão é 100), e um serviço com 50 instâncias, cada uma com 20 conexões, já pediria 1.000, muito além do que o banco aguenta bem. A solução é um **pool de conexões**: um conjunto pequeno de conexões reaproveitadas por muitas requisições.

### WAL (write-ahead log)

Antes de alterar os dados, o PostgreSQL anota a mudança num arquivo sequencial chamado **WAL**. Se o servidor cair, ele relê o WAL e refaz o que faltava, o que garante a **durabilidade** do ACID. O WAL também é o que as **réplicas** recebem para se manterem atualizadas, e é por isso que a replicação existe sem custo extra grande.

### MVCC

**MVCC** (controle de concorrência multiversão) é como o PostgreSQL deixa leitores e escritores trabalharem ao mesmo tempo sem se bloquear. Ao atualizar uma linha, ele não sobrescreve: cria uma **nova versão** e mantém a antiga até nenhuma transação precisar dela. Quem lê enxerga a versão correta para o seu momento. O custo é que as versões velhas se acumulam e precisam ser limpas pelo **VACUUM**.

### Juntando as peças: o caminho de uma escrita

1. A aplicação pega uma conexão do pool e envia um `INSERT` de review.
2. O banco registra a mudança no **WAL** e a confirma em disco.
3. Aplica a mudança à tabela e a todos os **índices** dela.
4. Responde "ok" à aplicação.
5. As **réplicas** recebem o trecho do WAL e o aplicam, com um pequeno atraso.

## Lembre

- Cada conexão é um **processo** de 5 a 10 MB: use um **pool**.
- O **WAL** vem antes da mudança, garante durabilidade e alimenta as réplicas.
- **MVCC** cria versões novas; o **VACUUM** limpa as velhas.
