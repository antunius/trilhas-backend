---
slug: elasticsearch-pratica-java
categorySlug: system-design
title: "Elasticsearch na prática: Docker e cliente Java"
navTitle: Docker e cliente Java
summary: "Subir o Elasticsearch localmente e indexar e buscar documentos pelo cliente Java"
level: intermediario
order: 77
section: deep-dives-tecnologias
group: "Elasticsearch"
---

## Objetivos de aprendizagem

- [ ] Subir um nó de desenvolvimento no Docker
- [ ] Indexar e buscar documentos com o cliente Java

*Retomando o cenário da unidade: uma plataforma de vagas de emprego, em que candidatos buscam por palavra-chave, com filtros de localização e salário e ordenação por relevância.*

## Subindo no Docker

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

## Cliente Java: operação central de escrita/leitura

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

## Lembre

- Para desenvolver, **um nó** basta; em produção são vários, com réplicas.
- O cliente envia um documento para **indexar** e uma consulta para **buscar**.
- Defina o **mapping** (tipos e analyzers) antes de indexar em volume.
