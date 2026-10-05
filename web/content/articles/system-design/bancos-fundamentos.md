---
slug: bancos-fundamentos
categorySlug: system-design
title: "Bancos de dados: tabela, chave, join e ACID"
navTitle: Fundamentos de bancos
summary: "Entender tabela, esquema, chaves, join, transação e ACID, e o que é o modelo de um banco"
level: intermediario
order: 17
section: tecnologias-chave
group: "Bancos de dados"
---

## Objetivos de aprendizagem

- [ ] Definir tabela, chave primária e estrangeira, join e transação
- [ ] Nomear as quatro garantias do ACID

## Cenário de referência da unidade

Vamos usar um marketplace online do início ao fim. Ele guarda **pedidos e pagamentos** (dinheiro, não pode ficar errado), um **catálogo de produtos** em que cada item tem atributos diferentes (um celular tem "memória", uma camiseta tem "tamanho"), e um **carrinho de compras** temporário que o cliente monta enquanto navega. São três tipos de dado com necessidades bem diferentes, e é justamente por isso que esse cenário serve para comparar os modelos.

## Fundamentos: o vocabulário básico, peça por peça

Antes de comparar, vale fixar o que cada termo quer dizer. Muita gente diz "SQL" para falar de "relacional" sem saber o que, exatamente, o modelo garante.

### O que é um banco de dados, em uma frase

Um banco de dados é um programa que guarda dados em disco de forma organizada e responde a perguntas sobre eles de forma rápida e segura, inclusive quando vários clientes usam ao mesmo tempo e quando a máquina reinicia no meio de uma operação.

### Tabela, linha e esquema

Uma **tabela** é uma planilha com colunas fixas: a tabela `pedido` tem as colunas `id`, `cliente_id`, `total` e `criado_em`. Cada **linha** é um pedido. O **esquema** é a definição dessas colunas e dos seus tipos. Num banco com esquema fixo, tentar gravar um pedido sem `total`, ou com `total = "abc"`, é recusado pelo próprio banco.

### Chave primária e chave estrangeira

A **chave primária** é a coluna que identifica uma linha de forma única (o `id` do pedido). A **chave estrangeira** é uma coluna que aponta para a chave primária de outra tabela: `pedido.cliente_id` aponta para `cliente.id`. O banco garante que não exista um pedido apontando para um cliente que não existe, como uma trava de segurança.

### Join

Um **join** é uma consulta que junta linhas de tabelas diferentes. "Mostre cada pedido com o nome do cliente" é um join entre `pedido` e `cliente`. Ele é a razão de dividir os dados em várias tabelas: o nome do cliente fica em um só lugar, e se ele mudar, muda em um só lugar.

### Transação e ACID

Uma **transação** é um grupo de operações tratado como uma só: ou todas acontecem, ou nenhuma. O exemplo clássico é a transferência: debitar R$ 100 da conta A e creditar R$ 100 na conta B. Se o sistema cair entre os dois passos, o dinheiro não pode sumir.

**ACID** é o nome das quatro garantias de uma transação:

- **Atomicidade**: tudo ou nada.
- **Consistência**: as regras do banco (chaves estrangeiras, tipos) nunca ficam quebradas depois de uma transação.
- **Isolamento**: duas transações simultâneas não enxergam o trabalho pela metade uma da outra.
- **Durabilidade**: depois de confirmada, a transação sobrevive a uma queda de energia.

### Juntando as peças: o que significa "modelo"

O **modelo** de um banco é a forma como ele enxerga um dado. No relacional, um dado é uma **linha** numa tabela ligada a outras. No de documento, um dado é um **documento** (em geral JSON) que carrega tudo junto. No de chave-valor, um dado é um **valor opaco** que se busca por uma chave. A pergunta que decide tudo é: "como eu vou **ler e escrever** esse dado?".

![Relacional vs documento vs chave-valor](/diagrams/sd-bancos-dados.svg)

*A imagem mostra o mesmo pedido nos três modelos. Observe a diferença: no relacional ele se espalha por várias tabelas ligadas por chaves, no de documento ele fica inteiro num bloco só, e no de chave-valor o banco nem sabe o que tem dentro do valor.*

## Lembre

- **ACID**: atomicidade, consistência, isolamento e durabilidade.
- A **chave estrangeira** impede apontar para uma linha que não existe.
- O **modelo** responde: como esse dado será lido e escrito?
