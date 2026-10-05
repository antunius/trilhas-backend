---
slug: postgresql-evolucao-entrevista
categorySlug: system-design
title: "PostgreSQL: evolução do schema e entrevista"
navTitle: Evolução e entrevista
summary: "Migrar o schema sem parada e saber o que diferencia respostas média e sênior sobre PostgreSQL"
level: intermediario
order: 59
section: deep-dives-tecnologias
group: "PostgreSQL"
---

## Objetivos de aprendizagem

- [ ] Aplicar mudanças de schema sem quebrar leitores
- [ ] Responder com o nível de profundidade de um sênior

*Retomando o cenário da unidade: uma plataforma de reviews de restaurantes, com dados relacionais e busca de restaurantes dentro de um raio geográfico.*

## Evolução/schema/migração

Mudanças de schema em produção usam uma ferramenta de migração versionada como **Flyway**, em vez de alterar tabelas manualmente. Um arquivo `V1__adiciona_indice_restaurante.sql`:

```sql
CREATE INDEX CONCURRENTLY idx_reviews_restaurante ON reviews (restaurante_id);
```

(`CONCURRENTLY` evita travar a tabela inteira durante a criação do índice — importante em uma tabela de 10 milhões de linhas já em produção.)

Para mudar o formato de uma coluna existente sem quebrar consumidores que ainda leem o formato antigo, o padrão é **expand/contract**: se a coluna `nota` precisasse migrar de inteiro (1-5) para decimal (permitindo meias notas), o deploy seria feito em etapas —

1. **Expand**: adicionar a nova coluna `nota_decimal NUMERIC(2,1)`, mantendo `nota` intacta.
2. **Dual-write**: a aplicação passa a escrever em ambas as colunas a cada novo insert/update.
3. **Backfill**: um job popula `nota_decimal` para as linhas antigas a partir de `nota`.
4. **Contract**: só em um deploy posterior, depois que todo consumidor já lê `nota_decimal`, a coluna `nota` é removida.

Esse faseamento evita o cenário em que um deploy de schema e um deploy de código precisam ser perfeitamente simultâneos — cada etapa é, isoladamente, compatível com a versão anterior da aplicação.

## Principais usos

- Sistema de registro (*system of record*) transacional para pedidos, contas e inventário, onde consistência forte em escritas é indispensável.
- Relatórios e analytics internos usando *materialized views*, pré-computando agregações pesadas sem sobrecarregar as tabelas transacionais.
- Dados geoespaciais com PostGIS (busca por raio, rotas, cálculo de área) sem introduzir um banco especializado à parte.
- Campos semi-estruturados e variáveis (metadados, preferências, payloads de eventos) em `JSONB`, convivendo com o restante do dado relacional na mesma tabela.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "índices aceleram consultas" e que "réplicas ajudam a escalar leitura", em termos gerais |
| Sênior | Explica por que uma função aplicada a uma coluna impede o uso de um índice comum, e propõe extensões (PostGIS, GIN) antes de saltar para uma tecnologia especializada nova |
| Staff+ | Além do acima, quantifica o atraso de replicação e propõe uma estratégia concreta de roteamento de leitura pós-escrita para o próprio usuário |

## Erros comuns

- Adicionar índices sem considerar o padrão de escrita, ignorando o custo de manutenção de cada índice.
- Assumir automaticamente que um requisito de busca ou geolocalização exige uma tecnologia nova, sem considerar extensões do próprio PostgreSQL.
- Ignorar completamente o atraso de replicação ao propor réplicas de leitura como solução de escala.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que um índice em `nome_restaurante` não ajuda uma busca por `UPPER(nome_restaurante) = 'X'`?" (o índice armazena valores originais; um índice de expressão seria necessário para esse padrão específico).
- "O que aconteceria se um usuário lesse imediatamente após escrever, e a leitura fosse servida por uma réplica atrasada?" (risco de não ver a própria mudança — mitigado roteando essa leitura específica para o primário).

## Lembre

- Mude o schema em passos **compatíveis**: adicionar antes de remover.
- Cite **extensões** antes de propor uma tecnologia nova.
- Quantifique o **atraso de replicação** e proponha um roteamento pós-escrita.
