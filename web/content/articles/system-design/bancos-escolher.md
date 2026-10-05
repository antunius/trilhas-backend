---
slug: bancos-escolher
categorySlug: system-design
title: "Como escolher o banco pelo padrão de acesso"
navTitle: Como escolher
summary: "Escolher o modelo pelo padrão de acesso e combinar vários bancos no mesmo sistema"
level: intermediario
order: 19
section: tecnologias-chave
group: "Bancos de dados"
---

## Objetivos de aprendizagem

- [ ] Escolher o modelo a partir do padrão de acesso
- [ ] Combinar bancos no marketplace e pesar o custo de operá-los

*Retomando o cenário da unidade: um marketplace online com pedidos e pagamentos, catálogo de produtos de atributos variáveis e carrinho temporário.*

## Números para ancorar a escolha

Uma ordem de grandeza útil (varia com hardware e tamanho do dado): um banco relacional bem indexado numa máquina resolve de milhares a poucas dezenas de milhares de leituras por segundo. Um armazenamento chave-valor em memória chega a centenas de milhares por segundo numa só instância. A diferença não é "melhor ou pior": o relacional paga latência e capacidade em troca de consulta flexível e garantias, e o chave-valor devolve latência e capacidade em troca de só saber buscar por chave.

Na prática, um marketplace com 5 mil pedidos por minuto (cerca de 85 por segundo) cabe folgadamente num único banco relacional. A escolha de modelo, nesse tamanho, é mais sobre **correção** que sobre **escala**.

## Como escolher: o padrão de acesso

A pergunta central **não** é "qual banco é melhor", e sim "qual o padrão de acesso predominante aos dados?".

| Se o padrão for... | Aponta para | Porque |
|---|---|---|
| Relacionamentos entre entidades, consultas variadas, dinheiro | Relacional | Joins, ACID e consulta flexível |
| Registro autocontido lido de uma vez, atributos variáveis | Documento | Uma leitura, esquema flexível |
| Busca por id, altíssima taxa, dado temporário | Chave-valor | Latência mínima, escala simples |

### Combinando os três no nosso cenário

- **Pedidos e pagamentos**: relacional. Dinheiro exige transação, e relatórios exigem consultas variadas.
- **Catálogo**: documento. Cada produto é autocontido e tem atributos diferentes.
- **Carrinho**: chave-valor. É temporário, acessado por sessão, e perder um carrinho antigo não é um desastre.

Sistemas reais quase sempre combinam bancos assim. O cuidado é não exagerar: cada banco extra é mais um componente para operar, monitorar e manter consistente com os outros.

## Lembre

- A pergunta é **qual o padrão de acesso**, não "qual banco é melhor".
- Pedidos: relacional. Catálogo: documento. Carrinho: chave-valor.
- Cada banco extra é **mais um componente** para operar.
