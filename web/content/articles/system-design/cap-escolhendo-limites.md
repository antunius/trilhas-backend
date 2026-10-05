---
slug: cap-escolhendo-limites
categorySlug: system-design
title: "Escolhendo CP ou AP, níveis de consistência e limites do CAP"
navTitle: Escolher e limites
summary: "Escolher pelo custo do erro, ajustar o nível de consistência com W + R > N e conhecer as limitações do teorema"
level: intermediario
order: 40
section: tecnologias-chave
group: "Teorema CAP"
---

## Objetivos de aprendizagem

- [ ] Escolher CP ou AP pelo custo do erro
- [ ] Aplicar W + R > N e citar as limitações do CAP

*Retomando o cenário da unidade: um serviço de saldo de conta replicado em dois data centers, São Paulo e Frankfurt, cuja rede entre os dois pode falhar.*

## Escolhendo com base no custo do erro

A escolha depende de uma pergunta de negócio: **o que custa mais, um erro ou um dado velho?**

| Cenário | Custo de um dado velho | Escolha típica |
|---|---|---|
| Transferência bancária | Alto: saldo errado, gasto duplo | CP |
| Estoque do último item de uma loja | Alto: vender o que não existe | CP (ou aceitar o risco e compensar depois) |
| Contador de curtidas | Baixo: 1.203 em vez de 1.205 | AP |
| Feed social | Baixo: um post demora alguns segundos | AP |
| Carrinho de compras | Médio: melhor aceitar o item e resolver no pagamento | AP |

No saldo da Ana, o saldo mostrado errado pode levar a um saque indevido. Aqui, **CP**: Frankfurt recusa a consulta (ou recusa saques) até se comunicar com São Paulo.

## Consistência além do CAP: um espectro

O CAP fala de consistência "ou tudo ou nada", mas na prática existem **níveis**:

- **Consistência forte**: toda leitura vê a escrita mais recente. Exige coordenação entre as réplicas antes de confirmar, o que aumenta a latência.
- **Consistência eventual**: se não houver novas escritas, todas as réplicas **acabam** convergindo ao mesmo valor, sem prazo garantido. Permite respostas rápidas e alta disponibilidade.
- **Níveis intermediários**: por exemplo, *ler o que você mesmo escreveu* (read-your-writes), em que o próprio autor sempre vê sua escrita, mesmo que outros demorem.

Muitos bancos permitem **escolher por operação**. No Cassandra e no DynamoDB, uma leitura pode exigir a confirmação de um **quórum** de réplicas (mais consistente, mais lenta) ou só de uma (mais rápida, possivelmente velha). A regra do quórum: com N réplicas, se as escritas esperam W confirmações e as leituras consultam R réplicas, e **W + R > N**, a leitura sempre cruza com pelo menos uma réplica que viu a escrita mais recente. Com 3 réplicas, W = 2 e R = 2 dá forte consistência (2 + 2 = 4 > 3).

## Limitações do teorema

- O CAP trata uma **falha específica** (a partição). Não descreve a **latência** normal: mesmo sem partição, consistência forte custa mais tempo (o modelo **PACELC** lembra isso: *se há partição escolha A ou C; senão, escolha entre latência e consistência*).
- As definições são **estritas**. "Disponível" no CAP significa que *toda* requisição tem resposta, o que é diferente do "99,9% de disponibilidade" de um contrato.
- A escolha **não é global**: partes diferentes do mesmo sistema escolhem diferente (o saldo é CP, o contador de curtidas é AP).

## Lembre

- Escolha CP ou AP por **operação**, pelo custo de um dado velho.
- **W + R > N** dá leitura forte sem exigir todas as réplicas.
- O CAP não fala de **latência**; o PACELC completa o quadro.
