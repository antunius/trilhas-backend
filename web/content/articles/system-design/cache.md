---
slug: cache
categorySlug: system-design
title: "Cache: Estratégias, Invalidação e Camadas"
navTitle: Cache
summary: Entender as principais estratégias de escrita/leitura de cache
level: intermediario
order: 13
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender as principais estratégias de escrita/leitura de cache
- [ ] Entender o problema central de invalidação de cache
- [ ] Identificar onde inserir camadas de cache em um sistema

## Conteúdo

### Por que usar cache

Cache guarda uma cópia de dados frequentemente acessados em um armazenamento muito mais rápido (geralmente em memória), evitando repetir o custo de buscar a mesma informação no banco de dados a cada requisição. É especialmente valioso em sistemas dominados por leitura, onde poucos dados concentram a maior parte do tráfego.

### Estratégias comuns

- **Cache-aside**: a aplicação verifica o cache primeiro; se não encontrar (*cache miss*), busca no banco e grava o resultado no cache para as próximas leituras. É a estratégia mais simples e comum.
- **Write-through**: toda escrita é feita simultaneamente no cache e no banco, mantendo os dois sempre sincronizados, ao custo de escritas um pouco mais lentas.
- **Write-back**: a escrita vai primeiro para o cache e é propagada ao banco de forma assíncrona depois, priorizando velocidade de escrita ao custo de risco de perda de dados em caso de falha antes da propagação.

![Cache-aside: app lê o cache e só vai ao DB no miss](/diagrams/sd-cache-aside.svg)

### O problema da invalidação

O maior desafio de qualquer cache não é guardar dados — é saber quando um dado guardado ficou desatualizado. Estratégias comuns incluem definir um tempo de expiração (TTL), invalidar explicitamente o cache sempre que o dado original é alterado, ou aceitar uma janela de inconsistência temporária quando isso é tolerável pelo requisito do sistema.

### Onde inserir cache

Cache pode existir em várias camadas: no navegador do cliente, em uma CDN próxima ao usuário, na camada de aplicação, ou na frente do banco de dados. A escolha de onde cachear depende de quão estável é o dado e de quão perto do usuário final ele pode ficar sem risco de inconsistência inaceitável.

## Exemplo aplicado

No encurtador de URLs, o mapeamento de código curto para URL original muda raramente depois de criado — um candidato para cache-aside com TTL longo na camada de aplicação, reduzindo drasticamente a carga sobre o banco no caminho de redirecionamento, que é a operação de leitura mais frequente do sistema.

## Erros comuns

- Propor cache sem discutir como e quando ele será invalidado.
- Cachear dados que mudam com muita frequência sem considerar o risco de servir informação desatualizada.
