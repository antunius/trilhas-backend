---
slug: elasticsearch
categorySlug: system-design
title: "Deep Dive: Elasticsearch"
navTitle: Elasticsearch
summary: Explicar como um índice invertido torna a busca textual rápida, com um exemplo construído à mão
level: intermediario
order: 45
section: deep-dives-tecnologias
---

## Objetivos de aprendizagem

- [ ] Explicar como um índice invertido torna a busca textual rápida, com um exemplo construído à mão
- [ ] Descrever o caminho de uma busca através de shards, coordenação e ranqueamento
- [ ] Discutir o atraso de sincronização entre a fonte de dados principal e o índice de busca
- [ ] Reconhecer o problema de shard "quente" e como mitigá-lo

## Cenário de referência para esta aula

Vamos usar uma plataforma de vagas de emprego, onde candidatos buscam vagas por palavra-chave ("engenheiro de dados remoto"), com filtros (localização, faixa salarial) e ordenação por relevância — um caso clássico de busca textual combinada com filtros estruturados.

## Fundamentos: o índice invertido, construído à mão

A peça central que faz o Elasticsearch (por baixo, construído sobre a biblioteca Lucene) ser rápido é o **índice invertido**. A melhor forma de entender isso é construir um pequeno exemplo manualmente.

Imagine três vagas, reduzidas a uma frase cada, para simplificar:

- **Vaga 1**: "engenheiro de dados remoto"
- **Vaga 2**: "engenheiro de software remoto"
- **Vaga 3**: "analista de dados presencial"

Um índice tradicional (por linha) armazenaria essas três frases como estão. Um índice **invertido** faz o oposto: para cada palavra (termo), mantém a lista de documentos onde ela aparece:

```
"engenheiro" -> [Vaga 1, Vaga 2]
"de"         -> [Vaga 1, Vaga 2, Vaga 3]
"dados"      -> [Vaga 1, Vaga 3]
"remoto"     -> [Vaga 1, Vaga 2]
"software"   -> [Vaga 2]
"analista"   -> [Vaga 3]
"presencial" -> [Vaga 3]
```

![Índice invertido: de termo para lista de documentos](/diagrams/elasticsearch-indice-invertido.svg)

Para buscar "engenheiro dados", o motor simplesmente consulta as duas listas (`engenheiro` → [1,2], `dados` → [1,3]) e calcula a interseção: Vaga 1 aparece em ambas, então é a melhor correspondência — sem nunca precisar examinar o texto completo de nenhuma vaga. Essa é a diferença estrutural fundamental: buscar vira uma operação de consultar listas pré-computadas, não escanear texto.

### O que acontece entre a palavra digitada e o índice: analyzers

Antes de uma palavra virar uma entrada no índice invertido, ela passa por um pipeline de **análise**: tokenização (quebrar o texto em palavras individuais), normalização (minúsculas, remover acentuação), e às vezes stemming (reduzir "engenheiros" e "engenheiro" à mesma raiz, para que a busca encontre ambos). Esse pipeline é o motivo de uma busca por "ENGENHEIRO" encontrar um documento escrito como "engenheiro" — sem ele, a comparação seria exatamente literal, caractere por caractere.

## Arquitetura distribuída: shards, réplicas e o coordinating node

### Shards: dividindo o índice

Assim como um banco de dados particionado (Módulo 2), um índice do Elasticsearch é dividido em **shards primários**, cada um hospedado potencialmente em um nó diferente do cluster — cada shard é, na prática, seu próprio índice invertido menor e independente. Isso permite que o índice inteiro (e a carga de busca sobre ele) seja distribuído entre múltiplas máquinas.

### Réplicas: disponibilidade e throughput extra

Cada shard primário pode ter uma ou mais **réplicas** — cópias completas daquele shard em outros nós. Réplicas servem dois propósitos: tolerância a falha (se o nó com o shard primário cair, uma réplica assume) e throughput adicional de leitura (buscas podem ser atendidas por qualquer réplica, distribuindo a carga).

### O caminho de uma busca: scatter-gather

Quando uma busca chega, um nó **coordenador** a recebe, a distribui ("scatter") para uma cópia (primária ou réplica) de cada shard relevante do índice, e cada shard executa a busca localmente sobre seu próprio índice invertido, retornando seus melhores resultados locais com uma pontuação de relevância. O coordenador então combina ("gather") esses resultados parciais de todos os shards, ordena globalmente por relevância, e devolve apenas o topo dessa lista combinada ao cliente.

![Busca distribuída: scatter para os shards, gather no coordenador](/diagrams/elasticsearch-scatter-gather.svg)

**Uma implicação prática que vale mencionar**: como cada shard calcula sua pontuação de relevância isoladamente (sem saber a distribuição de termos nos outros shards), a relevância de um documento pode, em teoria, variar ligeiramente dependendo de como os documentos foram distribuídos entre shards — um detalhe fino que raramente importa na prática, mas que demonstra entendimento de como o sistema realmente funciona por dentro.

## Relevância: como o Elasticsearch decide o que é "melhor"

Além de encontrar documentos que correspondem, o Elasticsearch calcula uma pontuação de relevância para ordenar os resultados — o algoritmo padrão (BM25) considera, essencialmente: quantas vezes o termo buscado aparece no documento (mais aparições, mais relevante, com retornos decrescentes), quão raro é esse termo no conjunto total de documentos (um termo raro que aparece é mais informativo que um termo comum), e o tamanho do documento (um termo aparecendo em um documento curto pesa mais que no mesmo termo perdido em um documento longo).

No nosso cenário, isso explica por que uma vaga com "engenheiro de dados" no título aparece à frente de uma vaga onde "dados" aparece uma única vez, de passagem, em uma descrição de 500 palavras — mesmo que ambas tecnicamente "correspondam" à busca.

## Near-real-time: o atraso entre escrever e conseguir buscar

Documentos novos não ficam imediatamente buscáveis — eles primeiro vão para um buffer em memória, e só se tornam parte de um segmento buscável do índice em um intervalo de atualização (refresh), tipicamente da ordem de 1 segundo por padrão. Isso é chamado de **near-real-time**, não *real-time* de verdade — uma vaga recém-publicada pode não aparecer em buscas por até esse intervalo.

Esse comportamento se conecta a um ponto mais amplo: o Elasticsearch quase sempre vive **ao lado** de um banco de dados principal (que continua sendo a fonte de verdade), recebendo uma cópia dos dados para fins de indexação — geralmente via um pipeline assíncrono (possivelmente usando Kafka, como visto na aula anterior, para propagar mudanças). Isso significa que existe sempre uma janela, por menor que seja, onde o banco principal e o índice de busca podem estar temporariamente dessincronizados — vale mencionar isso explicitamente ao propor essa arquitetura, e mencionar um processo de reconciliação periódica para casos em que essa sincronização falhe silenciosamente.

## Shards quentes (hot shards)

Se uma fração pequena dos documentos (ex: vagas de uma empresa muito popular, ou um termo de busca viral) concentra desproporcionalmente as consultas, o shard que contém esses documentos populares recebe carga muito maior que os demais — o mesmo fenômeno de hot partition já visto no deep dive de Kafka (Módulo 5), aqui aplicado a shards de busca. As mitigações são similares: cache na camada de aplicação para consultas populares repetidas, aumentar o número de réplicas especificamente para shards identificados como quentes, ou reconsiderar a estratégia de particionamento dos documentos entre shards.

## Na prática

### Subindo no Docker

Para desenvolvimento local, um único nó, sem segurança habilitada, é o suficiente para experimentar com o índice de vagas:

```yaml
# docker-compose.yml
version: "3.8"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.13.4
    container_name: es-vagas
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
    volumes:
      - es-data:/usr/share/elasticsearch/data

volumes:
  es-data:
```

**Importante**: `xpack.security.enabled=false` e `discovery.type=single-node` são adequados apenas para desenvolvimento local. Em produção, segurança (TLS, autenticação) precisa estar habilitada, e um cluster real usa múltiplos nós com configuração de descoberta apropriada (não `single-node`) — subir isso sem segurança em um ambiente acessível pela rede expõe o cluster inteiro sem autenticação.

### Cliente Java: operação central de escrita/leitura

Usando o **Elasticsearch Java API Client** (o cliente oficial, sucessor do antigo `RestHighLevelClient`), a operação central do nosso cenário é indexar uma vaga e depois buscá-la por palavra-chave.

Indexando uma vaga:

```java
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;

public class VagaIndexService {

    private final ElasticsearchClient client;

    public VagaIndexService() {
        RestClient restClient = RestClient.builder(new HttpHost("localhost", 9200)).build();
        ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
        this.client = new ElasticsearchClient(transport);
    }

    public record Vaga(String id, String titulo, String descricao, String localizacao, int salario) {}

    public void indexarVaga(Vaga vaga) throws Exception {
        IndexResponse response = client.index(i -> i
            .index("vagas")
            .id(vaga.id())
            .document(vaga)
        );
        System.out.println("Indexado com resultado: " + response.result());
    }
}
```

Buscando "engenheiro de dados remoto" com filtro de localização, combinando full-text e filtro estruturado:

```java
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;

import java.util.List;

public List<Vaga> buscarVagas(String termoBusca, String localizacao) throws Exception {
    SearchResponse<Vaga> response = client.search(s -> s
        .index("vagas")
        .query(q -> q
            .bool(b -> b
                .must(m -> m.match(t -> t.field("descricao").query(termoBusca)))
                .filter(f -> f.term(t -> t.field("localizacao").value(localizacao)))
            )
        )
        .size(20),
        Vaga.class
    );

    return response.hits().hits().stream()
        .map(hit -> hit.source())
        .toList();
}
```

O `must` com `match` aplica análise textual e ranqueamento por relevância (BM25, visto antes) sobre a descrição; o `filter` com `term` é uma correspondência exata, sem afetar a pontuação de relevância — só reduz o conjunto de candidatos, exatamente como um `WHERE` estrutural ao lado de uma busca textual.

### Operação avançada específica da tecnologia: alocação e rebalanceamento de shards

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

### Evolução/schema/migração

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

### Principais usos

- **Busca textual em e-commerce e catálogos de produtos**, combinando relevância com filtros de preço, categoria e disponibilidade.
- **Agregação de logs e observabilidade** — a pilha ELK (Elasticsearch, Logstash/Beats, Kibana) é um padrão de mercado para centralizar e consultar logs de aplicações distribuídas.
- **Autocomplete e sugestões de busca**, usando analyzers especializados (ex: edge n-grams) para responder a buscas parciais em tempo real.
- **Dashboards analíticos sobre dados semiestruturados**, agregando métricas (contagens, médias, percentis) sobre grandes volumes de documentos sem um schema relacional rígido.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que "Elasticsearch serve para busca rápida" e menciona "índice invertido" de forma genérica |
| Sênior | Explica o índice invertido com um exemplo concreto, descreve o fluxo scatter-gather, e reconhece explicitamente o atraso de sincronização entre o banco principal e o índice |
| Staff+ | Além do acima, discute hot shards e como mitigá-los, menciona o trade-off entre número de shards (mais paralelismo) e overhead de coordenação (mais shards para consultar e combinar por busca), e propõe reconciliação periódica para lidar com drift entre fonte de verdade e índice |

## Erros comuns

- Tratar Elasticsearch como um substituto do banco de dados principal, e não como um índice derivado, alimentado a partir dele.
- Não mencionar o atraso de sincronização (near-real-time) entre uma escrita e ela se tornar buscável.
- Ignorar completamente como a relevância é calculada, tratando a busca como puramente binária (corresponde ou não corresponde).

## Perguntas de aprofundamento que um entrevistador pode fazer

- "O que acontece se o pipeline que sincroniza o banco principal com o Elasticsearch cair por uma hora?" (o índice fica desatualizado por esse período; um mecanismo de reconciliação ou reprocessamento é necessário para recuperar).
- "Por que aumentar o número de shards não melhora a performance indefinidamente?" (mais shards significa mais overhead de coordenação — o coordenador precisa consultar e combinar resultados de cada um).
- "Como você lidaria com uma busca que corresponde a milhões de documentos?" (paginação, e cuidado especial com paginação profunda, que é computacionalmente cara nesse tipo de sistema).
