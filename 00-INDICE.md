# Trilhas de Estudo — Engenharia Backend

Sete trilhas independentes. Cada uma pode ser seguida no próprio ritmo, mas elas foram desenhadas para rodar **em paralelo**, não em sequência.

Cada trilha agora abre com **mapa mental + glossário do zero** (o que é cada peça, para que serve, erro comum) e só então as perguntas de entrevista. Sem esse vocabulário, o gabarito vira decoreba.

| # | Trilha | Formato | Duração sugerida |
|---|---|---|---|
| 1 | [Algoritmos e Estruturas de Dados](01-trilha-algoritmos.md) | Do zero (Big-O, estruturas) + 150 problemas por padrão | 24 semanas |
| 2 | [Java](02-trilha-java.md) | Do zero (JVM, heap, collections) + entrevista + labs | 6 semanas |
| 3 | [Spring](03-trilha-spring.md) | Do zero (IoC, bean, proxy) + entrevista + labs | 6 semanas |
| 4 | [Kafka](04-trilha-kafka.md) | Do zero (evento, partição, offset) + entrevista + labs | 6 semanas |
| 5 | [Kubernetes](05-trilha-kubernetes.md) | Do zero (pod, node, control plane) + entrevista + labs | 5 semanas |
| 6 | [Clean Code e SOLID](06-trilha-clean-code-solid.md) | Do zero (acoplamento, smell, SOLID) + refatoração | contínua |
| 7 | [Arquitetura e Microsserviços](07-trilha-arquitetura.md) | Do zero (latência, CAP, serviço) + system design | 8 semanas |

---

## Como combinar na semana

Modelo de ~1h por dia útil + 2h no sábado.

| Dia | Bloco 1 (45 min) | Bloco 2 (15-30 min) |
|---|---|---|
| Segunda | Trilha de plataforma (Java → Spring → Kafka → K8s) | Clean Code / SOLID |
| Terça | **Algoritmos** — 2 problemas novos | Revisão do caderno |
| Quarta | Trilha de plataforma | Clean Code / SOLID |
| Quinta | **Algoritmos** — 2 problemas novos | Revisar problemas de 3 dias atrás |
| Sexta | Projeto prático (aplicar o que viu na semana) | — |
| Sábado | **Algoritmos** (1 difícil) + Arquitetura | Laboratório de quebrar coisas |
| Domingo | Folga (de verdade) | — |

## Ordem recomendada das trilhas de plataforma

```
Semanas 1-6    → Java
Semanas 7-12   → Spring
Semanas 13-18  → Kafka
Semanas 19-23  → Kubernetes
Semanas 19-26  → Arquitetura (sobrepõe com K8s)
```

Algoritmos e Clean Code rodam **do começo ao fim**, sem interrupção.

## Três regras que valem para todas as trilhas

1. **Toda pergunta é respondida em voz alta antes de olhar o gabarito.** Ler a resposta e concordar com ela dá uma falsa sensação de domínio. Falar em voz alta expõe o buraco imediatamente.
2. **Todo conceito vira um laboratório.** Cada trilha tem uma seção de laboratórios — é onde o conhecimento gruda.
3. **Um caderno único de revisão** (`revisao.md`), com o formato: *conceito → explicação em 3 linhas → pegadinha*. 10 minutos toda segunda.
