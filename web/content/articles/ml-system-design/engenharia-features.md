---
slug: engenharia-features
categorySlug: ml-system-design
title: Engenharia de Features
summary: Categorizar features por origem e temporalidade
level: intermediario
order: 4
section: framework
---

## Objetivos de aprendizagem

- [ ] Categorizar features por origem e temporalidade
- [ ] Priorizar quais features discutir em uma entrevista com tempo limitado

## Conteúdo

### Categorias comuns de features

- **Features do usuário**: características relativamente estáveis (idade da conta, preferências históricas).
- **Features do item**: características do que está sendo avaliado (categoria, popularidade, idade do conteúdo).
- **Features de interação**: como o usuário específico já interagiu com itens semelhantes no passado.
- **Features contextuais**: momento da interação (hora do dia, dispositivo, localização).

### Temporalidade das features

Algumas features podem ser pré-computadas e cacheadas por muito tempo (características de um item que raramente mudam), enquanto outras precisam ser calculadas em tempo real no momento da predição (comportamento muito recente do usuário). Reconhecer essa diferença é importante para discutir viabilidade de produção, não apenas poder preditivo teórico.

### Priorizando o que discutir

Como o tempo de entrevista é limitado, uma boa prática é focar em um punhado de features realmente informativas para o problema específico, explicando por que cada uma foi escolhida, em vez de tentar listar exaustivamente todas as features possíveis — sinalizando ao entrevistador, se necessário, que mais poderiam ser discutidas caso o tempo permitisse.

## Exemplo aplicado

Para um sistema de detecção de bots, features "fáceis" e óbvias (frequência de postagem muito alta) podem ser combinadas com features mais sutis e resistentes a adaptação do bot (padrões de tempo entre ações, que são mais difíceis de imitar de forma convincente) — um exemplo de equilíbrio entre ganhos rápidos e robustez de longo prazo.

## Erros comuns

- Listar features exaustivamente sem discutir sua temporalidade ou viabilidade real de cálculo em produção.
- Focar apenas em features óbvias, sem considerar sinais mais sutis que aumentam a robustez do modelo.
