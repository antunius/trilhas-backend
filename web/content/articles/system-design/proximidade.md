---
slug: proximidade
categorySlug: system-design
title: "Padrão: Proximidade (Busca Geoespacial)"
navTitle: Proximidade
summary: Reconhecer problemas que envolvem busca por proximidade geográfica
level: intermediario
order: 111
section: padroes-recorrentes
group: "Escala e concorrência"
---

## Objetivos de aprendizagem

- [ ] Reconhecer problemas que envolvem busca por proximidade geográfica
- [ ] Conhecer as estratégias comuns para indexar dados espaciais de forma eficiente

## Conteúdo

### Reconhecendo o padrão

![Busca geoespacial por grade / geohash](/diagrams/sd-proximidade.svg)

Sistemas que precisam responder perguntas como "quais restaurantes existem num raio de 2km" ou "qual motorista está mais próximo do passageiro" enfrentam um problema estrutural: uma busca ingênua (calcular a distância de todos os pontos candidatos, um por um) não escala conforme o número de pontos cresce.

### Estruturas de indexação espacial

Abordagens comuns dividem o espaço geográfico em células ou regiões, permitindo restringir rapidamente a busca a uma pequena vizinhança em vez de todo o conjunto de dados: grades (grids) que dividem o mapa em quadrados de tamanho fixo, quadtrees que subdividem recursivamente regiões com muitos pontos em sub-regiões menores, e geohashing, que codifica coordenadas em uma string cujos prefixos compartilhados indicam proximidade geográfica.

### Um ponto importante sobre escopo

A maioria dos problemas reais de proximidade não exige busca global — o usuário normalmente está interessado em algo próximo à sua própria localização. Isso simplifica bastante o problema: em vez de indexar o planeta inteiro de forma uniforme, é comum particionar os dados espacialmente também para fins de escala (cada partição cobrindo uma região geográfica), combinando esse padrão com o de sharding visto no Módulo 2.

## Exemplo aplicado

Em um aplicativo de transporte, encontrar os motoristas mais próximos de um passageiro pode usar geohashing: calculando o geohash da localização do passageiro e buscando motoristas cujos próprios geohashes compartilham o mesmo prefixo (indicando proximidade), em vez de calcular a distância exata para todos os motoristas cadastrados na cidade.

## Implementando na prática (Java + Spring Boot)

### Como implementar

Para localizações que mudam com frequência — como a posição de motoristas em movimento — o Redis é uma escolha natural: sua estrutura geoespacial (`GEOADD`/`GEOSEARCH`) mantém as coordenadas indexadas em memória usando geohashing internamente, com escritas e buscas por raio em tempo constante ou próximo disso, sem exigir um banco relacional completo para dados que são efêmeros por natureza. Já para dados geoespaciais duráveis que precisam de consultas mais ricas (interseção com polígonos, junções com outras tabelas, histórico), o PostgreSQL com a extensão PostGIS é mais adequado, ao custo de mais complexidade operacional. Como motoristas mudam de posição constantemente e o caso de uso é "quem está por perto agora", o Redis se encaixa melhor no exemplo do aplicativo de transporte.

### Como usar em Java com Spring Boot

```java
@Service
public class MotoristaLocalizacaoService {

    private static final String GEO_KEY = "motoristas:localizacao";

    private final StringRedisTemplate redisTemplate;

    public MotoristaLocalizacaoService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Atualiza a posição do motorista a cada evento de GPS
    public void atualizarPosicao(String motoristaId, double longitude, double latitude) {
        redisTemplate.opsForGeo().add(
                GEO_KEY,
                new Point(longitude, latitude),
                motoristaId);
    }

    // Busca motoristas num raio a partir da localização do passageiro
    public List<String> buscarMotoristasProximos(double longitude, double latitude, double raioEmKm) {
        Circle area = new Circle(new Point(longitude, latitude), new Distance(raioEmKm, Metrics.KILOMETERS));

        GeoResults<RedisGeoCommands.GeoLocation<String>> resultados = redisTemplate.opsForGeo()
                .search(GEO_KEY, area);

        return resultados.getContent().stream()
                .map(r -> r.getContent().getName())
                .toList();
    }
}
```

### Como configurar

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms
```

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## Erros comuns

- Propor calcular a distância para todos os pontos do sistema a cada busca, ignorando o problema de escala.
- Tratar o problema como se exigisse busca global, quando a maioria dos casos de uso reais é inerentemente local.
