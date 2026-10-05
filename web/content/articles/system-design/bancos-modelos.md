---
slug: bancos-modelos
categorySlug: system-design
title: "Os modelos relacional, de documento e chave-valor"
navTitle: Relacional, documento e chave-valor
summary: "Comparar o que cada modelo garante, onde brilha e o que sacrifica"
level: intermediario
order: 18
section: tecnologias-chave
group: "Bancos de dados"
---

## Objetivos de aprendizagem

- [ ] Explicar o que cada modelo guarda e garante
- [ ] Dizer o que cada modelo sacrifica

*Retomando o cenário da unidade: um marketplace online com pedidos e pagamentos, catálogo de produtos de atributos variáveis e carrinho temporário.*

## O modelo relacional

Organiza os dados em tabelas com esquema fixo e relacionamentos garantidos por chaves estrangeiras. Exemplos: PostgreSQL, MySQL.

**Onde brilha**: quando os dados se relacionam entre si e a correção importa mais que tudo. Um pedido tem itens, os itens apontam para produtos, o pagamento aponta para o pedido. Com transação ACID, "criar o pedido, baixar o estoque e registrar o pagamento" é uma operação atômica.

**Ponto forte menos óbvio**: a consulta é flexível. Mesmo que daqui a seis meses surja a pergunta "quanto cada cliente gastou por mês em eletrônicos?", um join com agrupamento a responde sem mudar a estrutura dos dados.

**O que sacrifica**: o esquema fixo torna mudanças mais cuidadosas (uma coluna nova num tabelão exige migração), e escalar **escrita** além de uma máquina é difícil, porque as garantias do ACID dependem de coordenação (veremos isso em *Sharding*).

## O modelo de documento

Guarda cada registro como um documento semiestruturado, normalmente JSON. Exemplos: MongoDB, Couchbase.

```json
{
  "_id": "p-1042",
  "nome": "Smartphone X",
  "categoria": "eletronicos",
  "atributos": { "memoria_gb": 128, "cor": "preto" },
  "avaliacoes": [ { "nota": 5, "texto": "ótimo" } ]
}
```

**Onde brilha**: quando o dado é naturalmente **aninhado** e lido **como uma unidade**. A página de um produto precisa do nome, dos atributos e das avaliações de uma vez. Num banco relacional isso seriam três tabelas e dois joins. No de documento é **uma leitura** em um único lugar.

**Ponto forte menos óbvio**: registros diferentes podem ter formatos diferentes. A camiseta tem `tamanho`, o celular tem `memoria_gb`, e ninguém precisa de uma coluna `tamanho` vazia em todos os celulares.

**O que sacrifica**: relacionamentos entre documentos não são garantidos pelo banco (nada impede um documento apontar para um id que não existe), joins são limitados ou caros, e a duplicação é comum (o nome do vendedor copiado em vários produtos). Se o vendedor mudar de nome, é preciso atualizar todas as cópias.

## O modelo chave-valor

O mais simples: um valor é guardado e recuperado por uma chave, sem estrutura interna exigida. Exemplos: Redis, DynamoDB (no uso mais básico).

**Onde brilha**: acesso por identificador, em altíssima escala e com latência mínima. O carrinho de compras é o caso ideal: a chave é `carrinho:{sessao}`, o valor é a lista de itens, e a operação é sempre "pegar tudo" ou "gravar tudo".

**O que sacrifica**: não há consulta por conteúdo. Se você precisar de "todos os carrinhos que têm o produto 1042", terá de varrer tudo, ou manter outra estrutura por fora. O banco só sabe responder a "me dê o valor desta chave".

## Lembre

- **Relacional**: relacionamentos, ACID e consulta flexível; escalar escrita é difícil.
- **Documento**: dado aninhado lido de uma vez; sem joins fortes.
- **Chave-valor**: busca por id em alta escala; sem consulta por conteúdo.
