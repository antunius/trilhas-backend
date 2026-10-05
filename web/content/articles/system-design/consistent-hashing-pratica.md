---
slug: consistent-hashing-pratica
categorySlug: system-design
title: "Onde aparece e como implementar com TreeMap"
navTitle: Na prática
summary: "Ver onde o consistent hashing é usado e implementar um anel em Java com TreeMap"
level: intermediario
order: 36
section: tecnologias-chave
group: "Consistent hashing"
---

## Objetivos de aprendizagem

- [ ] Citar sistemas que usam consistent hashing
- [ ] Implementar um anel com nós virtuais em Java

*Retomando o cenário da unidade: um cluster de cache com 4 servidores guardando 1 milhão de chaves, e a pergunta de o que acontece quando um quinto servidor entra.*

## Onde isso aparece na prática

- **Cassandra e DynamoDB**: particionam os dados em um anel e usam vnodes.
- **Caches distribuídos** (clientes de Memcached e Redis em modo de cluster por cliente): escolhem o servidor pela chave.
- **CDNs e balanceadores de carga**: mantêm a mesma chave (usuário, URL) no mesmo servidor, para aproveitar cache local.
- **Bancos shardados**: a lição anterior (*Sharding*) usa `hash % N` na forma mais simples; consistent hashing é a forma que não sofre ao crescer.

Redis Cluster usa uma variação com 16.384 *hash slots* fixos, atribuídos aos servidores, e a ideia é a mesma: deslocar poucos slots ao mudar o cluster.

## Na prática

### Um anel em Java com `TreeMap`

O `TreeMap` mantém as chaves ordenadas e oferece `ceilingEntry`, que devolve o primeiro ponto maior ou igual a um valor. Isso é exatamente "andar no sentido horário até o próximo servidor":

```java
public class AnelConsistente {

    private static final int NOS_VIRTUAIS = 200;
    private final SortedMap<Integer, String> anel = new TreeMap<>();

    public void adicionarServidor(String servidor) {
        for (int i = 0; i < NOS_VIRTUAIS; i++) {
            anel.put(hash(servidor + "#" + i), servidor);
        }
    }

    public void removerServidor(String servidor) {
        for (int i = 0; i < NOS_VIRTUAIS; i++) {
            anel.remove(hash(servidor + "#" + i));
        }
    }

    public String servidorPara(String chave) {
        if (anel.isEmpty()) {
            throw new IllegalStateException("nenhum servidor no anel");
        }
        int h = hash(chave);
        SortedMap<Integer, String> aPartirDeH = anel.tailMap(h); // pontos >= h
        // se passou do último ponto, volta ao primeiro: é o "fechamento" do círculo
        Integer ponto = aPartirDeH.isEmpty() ? anel.firstKey() : aPartirDeH.firstKey();
        return anel.get(ponto);
    }

    private int hash(String texto) {
        // MurmurHash3 do Guava: rápido e bem distribuído
        return Hashing.murmur3_32_fixed().hashString(texto, StandardCharsets.UTF_8).asInt();
    }
}
```

A linha com `isEmpty()` implementa o ponto mais sutil do anel: se a chave está além do último servidor, ela "dá a volta" e fica com o primeiro. Para quem usa Spring, esse objeto pode ser um `@Bean` singleton, reconstruído quando a lista de servidores muda.

### Verificando que o rebalanceamento é pequeno

```java
AnelConsistente anel = new AnelConsistente();
List.of("A", "B", "C", "D").forEach(anel::adicionarServidor);

Map<String, String> antes = new HashMap<>();
for (int i = 0; i < 100_000; i++) antes.put("chave" + i, anel.servidorPara("chave" + i));

anel.adicionarServidor("E");

long mudaram = antes.entrySet().stream()
    .filter(e -> !e.getValue().equals(anel.servidorPara(e.getKey())))
    .count();
// esperado: perto de 20.000 (cerca de 20%), e não 80.000
```

## Lembre

- Cassandra, DynamoDB, CDNs e caches distribuídos usam a ideia.
- No `TreeMap`, `tailMap` acha "o próximo ponto no sentido horário".
- Se passar do último ponto, **volta ao primeiro**: o fechamento do círculo.
