---
slug: elasticsearch-operacao-schema
categorySlug: system-design
title: "Elasticsearch: rebalanceamento de shards e evolução do schema"
navTitle: Operação e schema
summary: "Entender a alocação de shards ao escalar o cluster e evoluir um mapping com reindexação e alias"
level: intermediario
order: 78
section: deep-dives-tecnologias
group: "Elasticsearch"
---

## Objetivos de aprendizagem

- [ ] Explicar a alocação e o rebalanceamento de shards
- [ ] Evoluir um mapping com reindexação sem parada

*Retomando o cenário da unidade: uma plataforma de vagas de emprego, em que candidatos buscam por palavra-chave, com filtros de localização e salário e ordenação por relevância.*

## Operação avançada específica da tecnologia: alocação e rebalanceamento de shards

Quando um nó é adicionado ou removido do cluster, o Elasticsearch precisa decidir em qual nó cada shard (primário ou réplica) deve viver — esse processo é a **alocação de shards**, e o rebalanceamento automático move shards entre nós para manter a carga equilibrada.

Alguns parâmetros centrais que controlam esse comportamento:

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "all",
    "cluster.routing.allocation.node_concurrent_recoveries": 2,
    "cluster.routing.allocation.awareness.attributes": "zone"
  }
}
```

- `cluster.routing.allocation.enable`: pode ser restringido (ex: `primaries` durante uma manutenção) para evitar que o cluster comece a mover réplicas desnecessariamente enquanto um nó está temporariamente fora.
- `awareness.attributes`: instrui o Elasticsearch a nunca colocar um shard primário e sua réplica na mesma zona de disponibilidade — essencial para que a perda de uma zona inteira não derrube primário e réplica ao mesmo tempo.

**Risco de split-brain**: em versões antigas do Elasticsearch (pré-7.x), uma partição de rede podia fazer duas metades do cluster elegerem, cada uma, seu próprio nó mestre — um cenário clássico de split-brain, mitigado historicamente por uma configuração de quorum (`minimum_master_nodes`, exigindo maioria dos nós elegíveis a mestre para eleger um). Versões modernas (7.x+) substituíram isso por um protocolo de consenso interno mais robusto que dispensa essa configuração manual, mas o princípio por trás dela — nunca permitir que uma eleição de mestre aconteça sem quorum de maioria — continua sendo o motivo pelo qual um cluster de produção deve ter um número ímpar de nós elegíveis a mestre.

## Evolução/schema/migração

Diferente de um banco sem schema, o Elasticsearch define um **mapping** (o schema de cada índice) na criação, e alguns tipos de mudança de mapping — como mudar o tipo de um campo existente — não são permitidos in-place. A solução padrão é reindexar para um novo índice com o mapping corrigido, usando a API `_reindex`, coordenada com um **alias**.

Suponha que o campo `salario` foi mapeado como `text` por engano, e precisa virar `integer` para permitir filtros de faixa salarial:

```json
// 1. cria o novo índice com o mapping correto
PUT /vagas_v2
{
  "mappings": {
    "properties": {
      "salario": { "type": "integer" },
      "descricao": { "type": "text" }
    }
  }
}

// 2. copia os documentos do índice antigo para o novo
POST /_reindex
{
  "source": { "index": "vagas_v1" },
  "dest": { "index": "vagas_v2" }
}

// 3. flip do alias: a aplicação sempre aponta para "vagas", nunca para vagas_v1/v2 diretamente
POST /_aliases
{
  "actions": [
    { "remove": { "index": "vagas_v1", "alias": "vagas" } },
    { "add": { "index": "vagas_v2", "alias": "vagas" } }
  ]
}
```

Como a aplicação sempre lê e escreve através do alias `vagas` (nunca do nome físico do índice), o flip do passo 3 é atômico do ponto de vista do cliente — não existe uma janela onde o alias aponta para "nenhum índice" ou para os dois ao mesmo tempo, e os consumidores nunca precisam saber que uma migração aconteceu. Para volumes grandes, o `_reindex` pode ser combinado com `slices` para paralelizar a cópia, e o índice antigo só é removido depois de confirmar que o novo está completo e correto.

## Lembre

- Mapping não muda no lugar: **crie outro índice e reindexe**.
- Use um **alias** para trocar o índice sem o cliente perceber.
- O número de shards primários é **definido na criação** do índice.
