---
slug: bancos-dados
categorySlug: system-design
title: "Bancos de Dados: Relacional vs. Documento vs. Chave-Valor"
navTitle: Bancos de Dados
summary: Entender as características centrais de cada modelo de banco
level: intermediario
order: 11
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender as características centrais de cada modelo de banco
- [ ] Escolher um modelo com base no padrão de acesso aos dados

## Conteúdo

### Relacional

![Relacional vs documento vs chave-valor](/diagrams/sd-bancos-dados.svg)

Organiza dados em tabelas com esquema fixo e relacionamentos explícitos entre elas, garantidos por chaves estrangeiras. Favorece integridade e consistência forte, e é uma escolha sólida quando relacionamentos entre entidades são centrais ao problema (ex: sistemas financeiros, onde uma transação precisa ser atômica e consistente).

### Documento

Armazena dados como documentos semi-estruturados (tipicamente JSON), sem exigir um esquema rígido compartilhado entre todos os registros. Funciona bem quando os dados são naturalmente aninhados e normalmente acessados como uma unidade completa (ex: um perfil de usuário com suas preferências), evitando *joins* custosos entre tabelas.

### Chave-valor

O modelo mais simples: um valor é recuperado diretamente por uma chave única, sem estrutura interna exigida. É o modelo com melhor desempenho para leitura/escrita simples em escala, e é comumente usado para cache, sessões, ou qualquer dado acessado predominantemente por um identificador único.

### Como escolher

A pergunta central não é "qual banco é melhor", mas "qual é o padrão de acesso predominante aos dados do meu sistema". Relacionamentos complexos e necessidade de consistência forte apontam para relacional; documentos autocontidos apontam para banco de documentos; acesso simples por chave, em altíssima escala, aponta para chave-valor.

## Exemplo aplicado

Um sistema de e-commerce provavelmente usa um banco relacional para pedidos e pagamentos (onde consistência é crítica), um banco de documentos para o catálogo de produtos (cada produto é praticamente autocontido), e um banco chave-valor para o carrinho de compras temporário (acesso simples por ID de sessão).

## Erros comuns

- Escolher um único tipo de banco para todo o sistema, ignorando que sistemas reais costumam combinar mais de um.
- Justificar a escolha apenas por familiaridade, sem conectar ao padrão de acesso real aos dados.
