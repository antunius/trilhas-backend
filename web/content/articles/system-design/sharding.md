---
slug: sharding
categorySlug: system-design
title: Sharding e Particionamento
summary: Entender por que um único banco de dados eventualmente não escala
level: intermediario
order: 14
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender por que um único banco de dados eventualmente não escala
- [ ] Conhecer estratégias comuns de particionamento
- [ ] Reconhecer os desafios introduzidos pelo sharding

## Conteúdo

### Por que particionar

Em algum ponto de escala, um único servidor de banco de dados não consegue mais atender ao volume de dados ou de requisições, mesmo com réplicas de leitura — porque réplicas ajudam com leitura, mas não resolvem o limite de escrita ou de armazenamento total em uma única máquina. Sharding resolve isso dividindo os dados entre múltiplos bancos, cada um responsável por uma fatia (shard) do total.

![Sharding por hash: a chave decide o shard](/diagrams/sd-sharding.svg)

### Estratégias comuns de particionamento

- **Por intervalo (range-based)**: divide os dados por faixas de valores de uma chave (ex: usuários de A a M em um shard, N a Z em outro). Simples, mas pode gerar shards desbalanceados se a distribuição dos dados não for uniforme.
- **Por hash**: aplica uma função de hash sobre a chave para decidir o shard, distribuindo os dados de forma mais uniforme, ao custo de tornar consultas por intervalo mais difíceis.
- **Por diretório (lookup)**: mantém um serviço separado que sabe exatamente em qual shard cada chave está, oferecendo flexibilidade, mas introduzindo um novo ponto único a ser mantido disponível.

### Desafios introduzidos

Sharding resolve o problema de escala, mas introduz complexidade nova: consultas que precisam combinar dados de múltiplos shards ficam mais caras, transações que cruzam shards perdem garantias simples de atomicidade, e rebalancear shards conforme o sistema cresce é uma operação delicada.

## Exemplo aplicado

Um sistema de mensagens em escala global pode particionar conversas por hash do identificador da conversa, garantindo distribuição uniforme entre shards — mas precisa lidar separadamente com o caso de buscar todas as conversas de um usuário específico, que podem estar espalhadas por múltiplos shards diferentes.

## Erros comuns

- Propor sharding sem antes esgotar alternativas mais simples (réplicas de leitura, cache, verticalização).
- Ignorar o impacto do sharding em consultas que cruzam múltiplos shards.
