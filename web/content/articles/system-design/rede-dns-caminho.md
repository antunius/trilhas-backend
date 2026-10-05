---
slug: rede-dns-caminho
categorySlug: system-design
title: "DNS e o caminho de uma requisição"
navTitle: DNS e o caminho da requisição
summary: "Entender IP, DNS, TTL, load balancer, health check e proxy, e seguir uma requisição até o servidor"
level: intermediario
order: 9
section: tecnologias-chave
group: "Rede"
---

## Objetivos de aprendizagem

- [ ] Definir IP, DNS, TTL do DNS, load balancer, health check e proxy
- [ ] Descrever o caminho de uma requisição e o papel do GeoDNS

## Cenário de referência da unidade

Vamos usar uma loja online que começou com um servidor e agora precisa atender **20 mil requisições por segundo** com usuários no Brasil e na Europa. Cada servidor de aplicação aguenta cerca de 1.000 por segundo, então precisamos de pelo menos 20 servidores (e uma folga). A pergunta da aula é: **como uma requisição chega ao servidor certo**, e o que fica entre o usuário e a aplicação?

## Fundamentos: o vocabulário básico, peça por peça

### Endereço IP

Todo computador numa rede tem um **endereço IP**, um número como `203.0.113.10`, que o identifica. É o endereço de verdade; nomes como `loja.com` são só uma conveniência para humanos.

### DNS

O **DNS** (*Domain Name System*) é a "lista telefônica" da internet: traduz um nome (`loja.com`) para um ou mais endereços IP. Antes de qualquer conexão, o navegador pergunta ao DNS "qual o IP de `loja.com`?".

### TTL do DNS

Cada resposta do DNS vem com um **TTL**: por quantos segundos ela pode ser guardada em cache. Com TTL de 300 s, se você trocar o IP do servidor agora, alguns usuários continuarão indo ao IP antigo por até 5 minutos. TTL baixo permite trocas rápidas, ao custo de mais consultas ao DNS.

### Load balancer

Um **load balancer** (balanceador de carga) é um intermediário que recebe as requisições e as **reparte** entre vários servidores idênticos. Dois ganhos: nenhum servidor sozinho se sobrecarrega, e é possível acrescentar ou retirar servidores sem o usuário perceber.

### Health check

O balanceador pergunta periodicamente a cada servidor "você está bem?", por exemplo `GET /health` a cada 5 segundos. Se um servidor falha 3 vezes seguidas, é **retirado da rotação** até voltar. Sem isso, o balanceador continuaria mandando usuários para um servidor morto.

### Proxy

Um **proxy** é um intermediário que fala em nome de outro. Há dois tipos, que se diferenciam pelo lado que protegem:

- **Proxy direto (forward)**: fica do lado do **cliente** e fala com a internet em nome dele (rede de empresa que filtra ou mascara o tráfego de saída).
- **Proxy reverso**: fica do lado do **servidor** e recebe as requisições em nome dele (termina TLS, faz cache, roteia).

### Juntando as peças: o caminho de uma requisição

1. O usuário digita `loja.com`. O navegador pergunta ao **DNS**, que devolve o IP do balanceador (por exemplo `203.0.113.10`).
2. O navegador abre a conexão com esse IP. A requisição chega ao **load balancer**.
3. O balanceador escolhe um dos servidores saudáveis e repassa a requisição.
4. O servidor responde, a resposta volta pelo balanceador, e daí ao usuário.

![DNS → Load Balancer → servidores](/diagrams/sd-fundamentos-rede.svg)

*A imagem mostra essa cadeia. Note que o usuário só conhece o endereço do balanceador, nunca os dos servidores. É isso que permite trocá-los sem ninguém perceber.*

## DNS na escala: distribuir entre regiões

Em larga escala, o DNS também distribui tráfego. No **GeoDNS**, a resposta depende de **onde** o usuário está: quem pergunta do Brasil recebe o IP do balanceador de São Paulo, e quem pergunta da Alemanha recebe o de Frankfurt. Menos distância significa menos latência (veja *Números para saber*: atravessar o Atlântico custa cerca de 100 ms a mais que ficar na mesma região).

Dois cuidados: o DNS **não sabe se um servidor está de pé**, a menos que a configuração use health checks, e o cache (TTL) faz a troca de IP demorar a ter efeito. Por isso o DNS escolhe a **região** e o balanceador, dentro da região, escolhe o **servidor**.

## Lembre

- O DNS traduz **nome em IP**; o TTL diz por quanto tempo a resposta pode ser guardada.
- O usuário só conhece o endereço do **balanceador**, nunca dos servidores.
- O DNS escolhe a **região**; o balanceador escolhe o **servidor**.
