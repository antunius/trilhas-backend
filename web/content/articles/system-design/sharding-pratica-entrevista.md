---
slug: sharding-pratica-entrevista
categorySlug: system-design
title: "Sharding na prática e na entrevista"
navTitle: Na prática e na entrevista
summary: "Rotear por hash com Spring Boot e saber responder em entrevista"
level: intermediario
order: 33
section: tecnologias-chave
group: "Sharding"
---

## Objetivos de aprendizagem

- [ ] Rotear uma escrita ao shard certo com Spring
- [ ] Responder com o nível esperado de um sênior

*Retomando o cenário da unidade: um aplicativo de mensagens com 200 milhões de usuários, cerca de 8 bilhões de mensagens e 8 TB novos por dia.*

## Na prática

### Roteando por hash com Spring Boot

Uma forma simples de implementar sharding na aplicação é um `AbstractRoutingDataSource`, que escolhe a conexão por requisição:

```java
public class ShardRoutingDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return ShardContext.atual(); // ex.: "shard-5", definido antes da consulta
    }
}

public final class ShardContext {
    private static final ThreadLocal<String> ATUAL = new ThreadLocal<>();

    public static void usar(String shard) { ATUAL.set(shard); }
    public static String atual()          { return ATUAL.get(); }
    public static void limpar()           { ATUAL.remove(); }
}

@Service
public class MensagemService {

    private static final int TOTAL_SHARDS = 100;
    private final MensagemRepository repository;

    public MensagemService(MensagemRepository repository) {
        this.repository = repository;
    }

    public Mensagem salvar(String conversaId, Mensagem mensagem) {
        int shard = Math.floorMod(conversaId.hashCode(), TOTAL_SHARDS);
        ShardContext.usar("shard-" + shard);
        try {
            return repository.save(mensagem);
        } finally {
            ShardContext.limpar(); // evita vazar o contexto para a próxima requisição
        }
    }
}
```

`Math.floorMod` evita resultado negativo, que `%` pode gerar com `hashCode()` negativo. Na vida real, esse tipo de roteamento costuma ficar num componente dedicado (proxy como Vitess, ou o próprio banco, como o Cassandra e o DynamoDB, que já particionam por conta própria).

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Diz "vou fazer sharding" e cita hash e intervalo |
| Sênior | Justifica a necessidade com números de escrita e armazenamento, escolhe a chave pelo padrão de acesso, nomeia hot shard e consultas entre shards como riscos |
| Staff+ | Esgota alternativas antes, discute rebalanceamento sem parada, índices secundários e transações entre shards (saga), e propõe como limitar o hot key |

## Erros comuns

- Propor sharding sem antes esgotar índices, cache, réplicas e escala vertical.
- Escolher uma chave que cria hot shard, como a data ou um identificador de baixa cardinalidade.
- Ignorar as consultas que cruzam shards.
- Usar `hash % N` sem pensar no que acontece quando N muda.
- Esquecer que transações entre shards perdem o ACID simples.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que réplicas de leitura não resolvem seu problema?" (elas dividem só a leitura; escrita e armazenamento total continuam presos ao servidor principal.)
- "Qual chave você usa para particionar as mensagens e por quê?" (`conversa_id`: mantém uma conversa inteira num shard, e a leitura mais comum é por conversa; o custo é a lista de conversas por usuário.)
- "Como adicionar shards sem parar o serviço?" (consistent hashing ou diretório com migração gradual, copiando dados em segundo plano e virando o roteamento no fim.)
- "Como lidar com um grupo gigante que sobrecarrega um shard?" (dividir a chave em subchaves, por exemplo `conversa_id + faixa`, ou isolar a conversa num shard dedicado via diretório.)

## Lembre

- `Math.floorMod` evita resultado **negativo** com `hashCode()`.
- Sempre **limpe o contexto** do shard no `finally`.
- Mostre que sabe **quando não** fazer sharding.
