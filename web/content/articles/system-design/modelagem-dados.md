---
slug: modelagem-dados
categorySlug: system-design
title: Modelagem de Dados
summary: Identificar as principais entidades do sistema e seus relacionamentos
level: intermediario
order: 5
section: framework-entrega
group: "Planejar"
---

## Objetivos de aprendizagem

- [ ] Identificar as principais entidades do sistema e seus relacionamentos
- [ ] Escolher um modelo de dados (relacional, documento, chave-valor) com base nos requisitos
- [ ] Evitar modelar dados demais em detalhe na entrevista

## Estrutura da aula

1. Identificando entidades a partir dos requisitos
2. Relacionamentos entre entidades
3. Escolhendo o tipo de armazenamento
4. Nível de detalhe adequado para uma entrevista

## Conteúdo

### Identificando entidades

![Entidades e relacionamentos](/diagrams/sd-modelagem-dados.svg)

A modelagem de dados começa a partir dos requisitos funcionais já definidos: cada "coisa" central que o sistema manipula normalmente vira uma entidade. Em um sistema de encurtamento de URLs, as entidades centrais são simples: o link (código curto, URL original, data de criação, expiração) e, se houver contas, o usuário dono do link.

### Relacionamentos

Depois de listar as entidades, é preciso pensar em como elas se relacionam — um usuário tem muitos links, um link pertence a um usuário. Esses relacionamentos影响 diretamente a escolha de banco de dados: relações muitos-para-muitos complexas tendem a favorecer bancos relacionais, enquanto dados que são sempre acessados como um documento único favorecem bancos de documentos.

### Escolhendo o tipo de armazenamento

- **Relacional**: bom quando há relacionamentos complexos entre entidades e a integridade referencial importa (ex: sistemas financeiros, reservas).
- **Documento**: bom quando os dados são naturalmente aninhados e acessados como uma unidade (ex: um post com seus comentários).
- **Chave-valor**: bom para acesso simples por identificador único, com altíssima performance de leitura/escrita (ex: sessões, cache, o próprio mapeamento de código curto → URL).

A escolha deve ser justificada pelos requisitos, não pela familiaridade — mas na prática, também é aceitável dizer "eu conheço melhor X, então vou usar X aqui, mesmo que Y também funcionasse".

### Nível de detalhe adequado

Não é necessário desenhar um schema completo com todos os campos e tipos. O suficiente é: nomear as entidades principais, seus campos mais relevantes, e os relacionamentos entre elas — em poucos minutos, sem se aprofundar em normalização de banco de dados a menos que isso seja pedido.

## Exemplo aplicado

Para o encurtador de URLs, a entidade `Link` pode ter: `codigo_curto (chave primária)`, `url_original`, `criado_em`, `expira_em`, `usuario_id (opcional)`. Dado o padrão de acesso (busca simples por `codigo_curto`), um banco chave-valor já resolve bem esse caso — sem necessidade de um banco relacional completo.

## Erros comuns

- Desenhar um schema de banco de dados excessivamente detalhado, gastando tempo que faria falta em outras etapas.
- Escolher um banco relacional "por padrão" sem considerar o padrão de acesso real aos dados.
- Esquecer de conectar a modelagem de dados às decisões já tomadas na etapa de requisitos.
