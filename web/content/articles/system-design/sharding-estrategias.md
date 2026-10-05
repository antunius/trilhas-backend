---
slug: sharding-estrategias
categorySlug: system-design
title: "Estratégias de particionamento: intervalo, hash e diretório"
navTitle: Estratégias de particionamento
summary: "Estimar o número de shards e comparar intervalo, hash e diretório"
level: intermediario
order: 31
section: tecnologias-chave
group: "Sharding"
---

## Objetivos de aprendizagem

- [ ] Estimar o número de shards a partir de volume e taxa de escrita
- [ ] Comparar as três estratégias e seus riscos

*Retomando o cenário da unidade: um aplicativo de mensagens com 200 milhões de usuários, cerca de 8 bilhões de mensagens e 8 TB novos por dia.*

## Números concretos: quantos shards

Com 8 TB novos por dia, em um ano seriam cerca de 2.900 TB. Se cada servidor suporta confortavelmente uns 2 TB de dados ativos, precisaríamos de algo em torno de **1.500 shards** para um ano de histórico completo, na pior hipótese. Na prática, dados antigos migram para armazenamento barato, e o número de shards cresce aos poucos.

Pelo lado da escrita: 8 bilhões de mensagens por dia são cerca de **93 mil escritas por segundo** em média, e várias vezes isso nos picos. Um servidor de banco comum sustenta alguns milhares a dezenas de milhares de escritas por segundo. Com 100 shards, cada um recebe uns 930 por segundo em média, uma carga tranquila. É o argumento clássico: o sharding multiplica a capacidade de **escrita** pelo número de shards.

## Estratégias de particionamento

### Por intervalo (range-based)

Cada shard cuida de uma **faixa** de valores da chave: ids de 0 a 999 mil no shard 1, de 1 a 2 milhões no shard 2.

- **Vantagem**: consultas por intervalo ("mensagens entre duas datas") são eficientes, porque a faixa vive em poucos shards.
- **Custo**: risco de **hot shard**. Se a chave é a data, todas as escritas novas caem no shard da faixa mais recente, e os outros ficam parados.

### Por hash

Aplica-se uma função de hash à chave e usa-se o resultado para escolher o shard, por exemplo `hash(conversa_id) % 100`.

- **Vantagem**: distribuição **uniforme**, porque o hash espalha as chaves.
- **Custo**: consultas por intervalo ficam caras, porque chaves vizinhas caem em shards diferentes. Além disso, `% 100` tem um problema de crescimento: se passar de 100 para 101 shards, quase toda chave muda de shard. A solução é o **consistent hashing**, tema da lição seguinte desta trilha.

### Por diretório (lookup)

Um serviço separado guarda uma **tabela** dizendo em qual shard cada chave está.

- **Vantagem**: flexibilidade total. Dá para mover uma conversa grande para um shard dedicado.
- **Custo**: o diretório vira um novo ponto crítico. Ele precisa ser rápido, replicado e consistente, ou todo o sistema para.

| Estratégia | Distribuição | Consulta por intervalo | Principal risco |
|---|---|---|---|
| Intervalo | Pode ficar desigual | Boa | Hot shard |
| Hash | Uniforme | Ruim | Rebalancear ao mudar o número de shards |
| Diretório | Configurável | Depende | Diretório como ponto único de falha |

## Lembre

- **Intervalo**: boa para faixas, mas pode gerar hot shard.
- **Hash**: distribui bem, mas consultas por intervalo ficam caras.
- **Diretório**: flexível, mas o diretório vira ponto crítico.
