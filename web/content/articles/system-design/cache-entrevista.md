---
slug: cache-entrevista
categorySlug: system-design
title: "Cache na entrevista"
navTitle: Na entrevista
summary: "Saber o que diferencia respostas média e sênior e os erros comuns sobre cache"
level: intermediario
order: 29
section: tecnologias-chave
group: "Cache"
---

## Objetivos de aprendizagem

- [ ] Reconhecer os erros comuns sobre cache
- [ ] Responder com o nível esperado de um sênior

*Retomando o cenário da unidade: a página de produto de uma loja online, com 200 mil visitas por minuto no pico e poucos produtos concentrando o tráfego.*

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Diz "vou colocar um Redis na frente do banco", conhece cache-aside e TTL |
| Sênior | Escolhe a estratégia por tipo de dado (produto vs. estoque), estima o hit ratio e a carga que sobra no banco, e fala de invalidação e de stampede sem ser perguntado |
| Staff+ | Discute consistência entre as camadas (CDN, aplicação, Redis), aceita defasagem de forma explícita por requisito de negócio, e planeja o que acontece quando o cache inteiro cai (banco aguenta o tráfego cheio?) |

## Erros comuns

- Propor cache sem dizer como e quando a entrada será invalidada.
- Cachear dados que mudam o tempo todo (como o estoque) sem avaliar o risco de mostrar um valor errado.
- Colocar cache sem estimar o hit ratio: se os pedidos são quase todos diferentes, o cache só acrescenta latência.
- Esquecer que o cache pode cair e que o banco precisa suportar o tráfego sem ele, ao menos por um tempo.
- Atualizar o cache antes do banco, deixando um valor antigo gravado por mais tempo que o TTL.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Seu hit ratio é de 90%. O que muda no banco se ele for a 99%?" (a carga cai de 10% para 1% dos pedidos, dez vezes menos, o que muitas vezes decide se o banco aguenta.)
- "O que acontece se o Redis reiniciar no pico?" (todos os pedidos viram miss ao mesmo tempo, o banco recebe o tráfego cheio. Mitigações: réplicas do cache, aquecimento prévio, limite de taxa na frente do banco.)
- "Como você evita servir um preço antigo depois de uma alteração?" (invalidar na escrita, na ordem banco-depois-cache, com TTL curto como rede de segurança.)
- "Cache local ou distribuído?" (local é mais rápido, mas cada servidor tem uma cópia diferente; distribuído é consistente entre servidores, ao custo de uma viagem de rede.)

## Lembre

- Estime o **hit ratio** e a carga que sobra no banco.
- Pense no que acontece quando o **cache inteiro cai**.
- Atualizar o cache **antes** do banco é um erro clássico.
