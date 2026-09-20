---
slug: fundamentos-rede
categorySlug: system-design
title: Fundamentos de Rede (DNS, Load Balancers, Proxies)
navTitle: Fundamentos de Rede
summary: Entender o papel do DNS na resolução de um domínio até um servidor
level: intermediario
order: 9
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender o papel do DNS na resolução de um domínio até um servidor
- [ ] Diferenciar load balancer de camada 4 e camada 7
- [ ] Diferenciar proxy direto de proxy reverso

## Conteúdo

### DNS

![DNS → Load Balancer → servidores](/diagrams/sd-fundamentos-rede.svg)

O DNS traduz um nome de domínio legível (`exemplo.com`) para o endereço IP do servidor que deve responder à requisição. Em sistemas de larga escala, o DNS também é usado para distribuir tráfego entre regiões geográficas diferentes, direcionando o usuário para o servidor mais próximo — uma técnica conhecida como GeoDNS.

### Load balancers

Um load balancer distribui requisições recebidas entre várias instâncias de um serviço, evitando que uma única instância fique sobrecarregada e permitindo escalar horizontalmente. Load balancers de **camada 4** operam no nível de conexão TCP/UDP, sem olhar o conteúdo da requisição — são mais rápidos, porém menos flexíveis. Load balancers de **camada 7** entendem o protocolo da aplicação (como HTTP), permitindo rotear com base em caminho da URL, cabeçalhos ou cookies — mais lentos, porém mais flexíveis para casos como roteamento por tipo de conteúdo.

### Proxies

Um **proxy direto (forward proxy)** fica entre o cliente e a internet, geralmente usado para controlar ou mascarar o tráfego que sai de uma rede. Um **proxy reverso** fica entre a internet e os servidores internos, geralmente usado para terminar conexões TLS, fazer cache de respostas, ou rotear requisições — um load balancer de camada 7 é, na prática, um tipo de proxy reverso.

## Exemplo aplicado

Em um sistema web típico, o fluxo é: o cliente resolve o domínio via DNS, a requisição chega a um load balancer de camada 7 (que também atua como proxy reverso terminando TLS), que então distribui a requisição entre instâncias da aplicação com base no caminho da URL.

## Erros comuns

- Confundir load balancer com proxy reverso, como se fossem conceitos totalmente separados.
- Não saber explicar a diferença prática entre camada 4 e camada 7 quando perguntado.
