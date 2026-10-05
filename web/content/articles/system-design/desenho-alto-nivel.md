---
slug: desenho-alto-nivel
categorySlug: system-design
title: Desenho de Alto Nível
summary: Montar um diagrama de componentes que atenda aos requisitos já levantados
level: intermediario
order: 6
section: framework-entrega
group: "Desenhar e aprofundar"
---

## Objetivos de aprendizagem

- [ ] Montar um diagrama de componentes que atenda aos requisitos já levantados
- [ ] Narrar o fluxo de dados através do sistema de forma clara
- [ ] Manter o desenho simples o suficiente para permitir aprofundamento depois

## Estrutura da aula

1. O objetivo dessa etapa dentro do framework
2. Componentes que aparecem na maioria dos sistemas
3. Como narrar o desenho enquanto desenha
4. Simplicidade primeiro, complexidade depois

## Conteúdo

### O objetivo desta etapa

![Diagrama de alto nível: cliente → API → serviços → dados](/diagrams/sd-desenho-alto-nivel.svg)

O desenho de alto nível é a primeira versão completa (ainda que simples) do sistema, cobrindo o caminho do requisito principal do início ao fim: cliente → API → lógica de negócio → armazenamento, e volta. Ele deve, no mínimo, satisfazer o contrato de API e o modelo de dados já definidos — sem ainda entrar em detalhes de escala ou falhas, que ficam para a etapa de deep dive.

### Componentes recorrentes

Independente do problema, certos componentes aparecem com frequência: um load balancer distribuindo tráfego entre instâncias da aplicação, a própria camada de aplicação (contendo a lógica de negócio), uma camada de armazenamento (o banco escolhido na etapa anterior), e, dependendo do padrão de leitura, uma camada de cache. Sistemas com processamento assíncrono também costumam introduzir uma fila de mensagens nesse ponto.

### Narrando o desenho

Uma boa prática é desenhar e explicar ao mesmo tempo, seguindo o fluxo de uma requisição real: "o cliente chama esse endpoint, que passa pelo load balancer, chega no serviço de aplicação, que consulta o cache antes de ir ao banco...". Isso evita que o desenho vire um amontoado de caixas desconectadas, e mantém o entrevistador acompanhando seu raciocínio.

### Simplicidade primeiro

O desenho inicial não precisa (e não deve) já incluir todas as otimizações possíveis. O objetivo é ter uma versão que funciona e que serve de base concreta para os deep dives — é nessa próxima etapa que sharding, réplicas, filas e outras otimizações entram, uma de cada vez, com justificativa.

## Exemplo aplicado

Para o encurtador de URLs: cliente → load balancer → serviço de aplicação → (cache de leitura para redirecionamentos frequentes) → banco chave-valor armazenando o mapeamento código→URL. Esse desenho já cobre os dois endpoints definidos anteriormente, e serve de base para depois discutir, por exemplo, como gerar códigos curtos únicos em escala.

## Erros comuns

- Tentar desenhar a versão "final" e otimizada de cara, sem espaço para aprofundar depois.
- Desenhar componentes sem explicar o fluxo de dados entre eles.
- Introduzir tecnologias (filas, sharding) antes de haver justificativa de requisito para elas.
