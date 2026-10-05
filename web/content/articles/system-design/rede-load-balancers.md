---
slug: rede-load-balancers
categorySlug: system-design
title: "Load balancers de camada 4 e camada 7"
navTitle: Load balancers L4 e L7
summary: "Diferenciar balanceadores de camada 4 e 7, escolher o algoritmo e tornar o balanceador redundante"
level: intermediario
order: 10
section: tecnologias-chave
group: "Rede"
---

## Objetivos de aprendizagem

- [ ] Diferenciar load balancers de camada 4 e de camada 7
- [ ] Escolher um algoritmo e evitar que o balanceador seja um ponto único de falha

*Retomando o cenário da unidade: uma loja online com 20 mil requisições por segundo, usuários no Brasil e na Europa e dezenas de servidores de aplicação.*

## Load balancers: camada 4 e camada 7

As "camadas" vêm do modelo de rede em camadas. Para esta lição, só importam duas.

### Camada 4 (transporte)

Opera sobre **conexões TCP/UDP**. Ele vê IP e porta, mas **não lê o conteúdo** da requisição. Decide por onde mandar a conexão e a repassa.

- **Vantagem**: muito rápido e eficiente, sustenta milhões de conexões, funciona para qualquer protocolo (banco de dados, jogos, WebSocket).
- **Custo**: não pode rotear por URL, cabeçalho ou cookie.

### Camada 7 (aplicação)

Entende o protocolo da aplicação, como **HTTP**. Pode ler o caminho da URL, cabeçalhos e cookies.

- **Vantagem**: rotas inteligentes (`/api/*` para os servidores de API, `/imagens/*` para o de arquivos), terminação de TLS, reescrita de cabeçalhos, limite de taxa.
- **Custo**: mais lento e mais caro, porque precisa abrir e interpretar cada requisição.

| | Camada 4 | Camada 7 |
|---|---|---|
| Enxerga | IP e porta | URL, cabeçalhos, cookies |
| Velocidade | Muito alta | Menor |
| Roteamento | Por conexão | Por conteúdo |
| Exemplo | AWS NLB | AWS ALB, Nginx, Envoy |

Um desenho comum usa os dois: um L4 na frente (para absorver volume) e L7 atrás (para a lógica de roteamento).

## Algoritmos de balanceamento

- **Round robin**: manda uma requisição para cada servidor em sequência. Simples, e bom quando as requisições são parecidas.
- **Menos conexões**: manda para o servidor com menos conexões abertas. Melhor quando as requisições têm durações muito diferentes.
- **Hash do IP ou de um id**: o mesmo cliente sempre cai no mesmo servidor, útil para manter dados locais, mas desiguala a carga (a ideia por trás do *consistent hashing*).
- **Sticky sessions**: o balanceador "gruda" o usuário num servidor com um cookie. Resolve o problema de sessões guardadas na memória do servidor, mas atrapalha o balanceamento e a retirada de servidores. O ideal é servidores **sem estado** (a sessão fica num Redis).

## E se o balanceador cair?

O balanceador é o ponto de entrada de tudo, então ele mesmo é um **ponto único de falha**. A solução é replicá-lo: dois ou mais balanceadores, em zonas diferentes, atrás do mesmo nome DNS (que devolve vários IPs) ou de um IP flutuante que migra para o balanceador reserva. Serviços de nuvem já fazem isso por baixo, e vale dizer em entrevista que "o balanceador também precisa ser redundante".

## Lembre

- **L4** vê IP e porta e é muito rápido; **L7** lê a URL e os cabeçalhos e é mais flexível.
- **Least connections** serve quando as requisições têm durações muito diferentes.
- O balanceador também precisa ser **redundante**.
