---
slug: rede-entrevista
categorySlug: system-design
title: "Rede: erros comuns e entrevista"
navTitle: Na entrevista
summary: "Saber o que diferencia respostas média e sênior sobre DNS, balanceadores e proxies"
level: intermediario
order: 12
section: tecnologias-chave
group: "Rede"
---

## Objetivos de aprendizagem

- [ ] Reconhecer os erros comuns ao falar de rede
- [ ] Responder com o nível de profundidade esperado

*Retomando o cenário da unidade: uma loja online com 20 mil requisições por segundo, usuários no Brasil e na Europa e dezenas de servidores de aplicação.*

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Coloca "um load balancer" na frente dos servidores e cita DNS |
| Sênior | Diferencia L4 e L7 com um motivo concreto, escolhe o algoritmo, explica health checks e terminação de TLS, e torna o balanceador redundante |
| Staff+ | Trata o balanceamento entre regiões (GeoDNS, failover), o custo de latência, o efeito do TTL em uma troca emergencial, e como evitar sticky sessions mantendo os servidores sem estado |

## Erros comuns

- Confundir load balancer com proxy reverso, como se fossem conceitos totalmente separados.
- Não saber explicar a diferença prática entre camada 4 e camada 7.
- Esquecer que o balanceador é um ponto único de falha e precisa ser redundante.
- Depender de sticky sessions em vez de manter os servidores sem estado.
- Esquecer o TTL do DNS ao planejar uma troca de servidor: alguns usuários demoram a enxergá-la.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Quando você escolheria L4 em vez de L7?" (volume muito alto, protocolo que não é HTTP, ou quando o roteamento por conteúdo não é necessário.)
- "O que acontece se um servidor trava no meio do tráfego?" (o health check falha, o balanceador o retira da rotação, e as requisições em curso naquele servidor falham e devem ser repetidas pelo cliente.)
- "Como lidar com usuários na Europa e no Brasil?" (GeoDNS ou Anycast para a região mais próxima, com balanceador por região.)
- "Por que não ter sessões na memória do servidor?" (impede escalar e retirar servidores livremente; a sessão vai para um armazenamento compartilhado, como o Redis.)

## Lembre

- Justifique **L4 ou L7** com um motivo concreto.
- Torne o balanceador **redundante** e fale do TTL ao planejar trocas.
- Prefira servidores **sem estado** a sticky sessions.
