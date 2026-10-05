---
slug: numeros-regras-pratica
categorySlug: system-design
title: "Regras de bolso e medição na prática"
navTitle: Regras de bolso e prática
summary: "Usar regras de bolso para estimar, medir latência por percentis e paralelizar chamadas independentes"
level: intermediario
order: 49
section: tecnologias-chave
group: "Números para saber"
---

## Objetivos de aprendizagem

- [ ] Aplicar as regras de bolso de tempo, potências de 2 e disponibilidade
- [ ] Medir latência por percentis e paralelizar chamadas

*Retomando o cenário da unidade: um encurtador de URLs que recebe 100 milhões de links novos por mês, cada um lido em média 100 vezes.*

## Regras de bolso úteis

- Um dia tem ~100.000 segundos (86.400 arredondado). Então **1 milhão de requisições por dia ≈ 12 por segundo**.
- Um ano tem ~30 milhões de segundos (31,5 milhões).
- Potências de 2: 2¹⁰ ≈ mil, 2²⁰ ≈ milhão, 2³⁰ ≈ bilhão. Um inteiro de 4 bytes vai até ~2 bilhões; um de 8 bytes vai a ~9 quintilhões (não estoura).
- Disponibilidade: 99,9% permite ~8,8 horas de indisponibilidade por ano; 99,99% permite ~53 minutos.
- Regra do pico: para dimensionar, use 2 a 5 vezes a média.

## Como os números guiam decisões

- **Memória é muito mais rápida que disco**: justifica cache e estruturas em memória.
- **Rede dentro do data center é barata, entre regiões é cara**: justifica manter serviços que conversam muito na mesma região, e fazer chamadas entre regiões em paralelo e fora do caminho crítico.
- **Chamadas em sequência somam latência**: três chamadas de 50 ms uma após a outra custam 150 ms; em paralelo custam 50 ms.
- **Armazenamento é barato, latência não**: duplicar dados para evitar um join caro costuma valer.

## Na prática

### Medindo, em vez de adivinhar, com Spring Boot

Os números acima são referências. No sistema real, **meça**. O Spring Boot com Micrometer (`spring-boot-starter-actuator`) mede latência por endpoint:

```java
@Service
public class LinkService {

    private final LinkRepository repository;
    private final Timer consultaTimer;

    public LinkService(LinkRepository repository, MeterRegistry registry) {
        this.repository = repository;
        this.consultaTimer = Timer.builder("link.consulta")
            .publishPercentiles(0.5, 0.95, 0.99)   // p50, p95, p99
            .register(registry);
    }

    public Optional<Link> buscar(String codigo) {
        return consultaTimer.record(() -> repository.findByCodigo(codigo));
    }
}
```

Olhe os **percentis**, não a média: se o p50 é 2 ms mas o p99 é 400 ms, 1 em cada 100 usuários espera 400 ms, e a média esconde isso.

### Paralelizar chamadas independentes

```java
@Service
public class PaginaService {

    public PaginaResposta montar(long usuarioId) {
        CompletableFuture<Perfil> perfil = CompletableFuture.supplyAsync(() -> perfis.buscar(usuarioId));
        CompletableFuture<List<Post>> posts = CompletableFuture.supplyAsync(() -> feed.recentes(usuarioId));
        CompletableFuture<Integer> notificacoes = CompletableFuture.supplyAsync(() -> avisos.contar(usuarioId));

        // latência total = a MAIOR das três, não a soma
        return new PaginaResposta(perfil.join(), posts.join(), notificacoes.join());
    }
}
```

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que memória é mais rápida que disco e disco mais rápido que rede entre regiões |
| Sênior | Faz a estimativa com contas à vista (por segundo, armazenamento, pico), compara com a capacidade de cada componente e decide com base no resultado |
| Staff+ | Questiona as premissas (razão leitura/escrita, crescimento, picos sazonais), olha percentis e não médias, e identifica qual recurso satura primeiro |

## Erros comuns

- Tentar decorar valores exatos em vez de internalizar a hierarquia relativa.
- Ignorar a latência de rede entre regiões ao desenhar sistemas distribuídos.
- Estimar pela média e esquecer o pico.
- Misturar unidades (bits com bytes, KB com MB) e errar por três ordens de grandeza.
- Fazer as contas de cabeça sem mostrá-las: o entrevistador avalia o raciocínio, não só o resultado.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Quantas requisições por segundo são 10 milhões por dia?" (10.000.000 ÷ 100.000 ≈ 100 por segundo em média.)
- "Seu endpoint faz 3 chamadas a serviços de 50 ms cada. Qual a latência?" (150 ms em sequência, 50 ms se forem independentes e em paralelo.)
- "Por que olhar o p99 e não a média?" (a média esconde a cauda: poucos usuários com respostas muito lentas.)
- "Esse sistema precisa de sharding?" (compare as escritas por segundo e os TB estimados com a capacidade de uma instância; se cabem com folga, não precisa agora.)

## Lembre

- **1 milhão de requisições por dia ≈ 12 por segundo**.
- 99,9% de disponibilidade permite ~**8,8 horas** de queda por ano; 99,99%, ~**53 minutos**.
- Olhe **percentis** (p99), não a média.
