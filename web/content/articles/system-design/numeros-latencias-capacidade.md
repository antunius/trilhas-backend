---
slug: numeros-latencias-capacidade
categorySlug: system-design
title: "A hierarquia de latências e a capacidade dos componentes"
navTitle: Latências e capacidade
summary: "Memorizar a hierarquia de latências e as ordens de grandeza de capacidade dos componentes comuns"
level: intermediario
order: 47
section: tecnologias-chave
group: "Números para saber"
---

## Objetivos de aprendizagem

- [ ] Ordenar RAM, SSD, rede local, HDD e rede entre regiões
- [ ] Citar a capacidade aproximada de servidor, banco, cache e fila

*Retomando o cenário da unidade: um encurtador de URLs que recebe 100 milhões de links novos por mês, cada um lido em média 100 vezes.*

## A hierarquia de latências

Os valores abaixo são **ordens de grandeza** típicas de hardware comum (variam por máquina, mas a relação entre eles se mantém):

| Operação | Latência típica | Em escala humana* |
|---|---|---|
| Leitura da memória (RAM) | ~100 ns | 1 segundo |
| Leitura de SSD | ~100 µs (0,1 ms) | ~17 minutos |
| Ida e volta na rede, mesmo data center | ~0,5 ms | ~1,4 horas |
| Leitura de HDD (disco giratório) | ~10 ms | ~1 dia |
| Ida e volta na rede entre continentes | ~100–150 ms | ~2 semanas |

*A coluna da direita multiplica tudo por 10 milhões, para dar uma noção humana: se a RAM levasse 1 segundo, o SSD levaria uns 17 minutos, e uma viagem entre continentes levaria semanas.*

![Ordens de magnitude de latência](/diagrams/sd-numeros-para-saber.svg)

*A imagem mostra a mesma hierarquia em escala. Observe o salto: cada degrau é de uma a duas ordens de grandeza mais lento que o anterior.*

O que importa é a **ordem**: memória < SSD < rede local < HDD < rede entre regiões. E duas leituras práticas:

- Ler 1 MB sequencialmente da RAM leva uns 0,25 ms, do SSD uns 1 ms, de um HDD uns 20 ms.
- **Uma consulta ao banco** custa, na prática, dezenas de vezes mais que ler de um cache em memória na mesma máquina.

## Capacidade de componentes comuns

Valores aproximados por **instância** (sirva de referência, não de promessa):

| Componente | Ordem de grandeza |
|---|---|
| Servidor de aplicação (requisições simples) | ~1.000 por segundo |
| Banco relacional (leituras indexadas) | ~5.000–50.000 por segundo |
| Cache em memória (Redis) | ~100.000 por segundo |
| Fila/log (Kafka, por partição) | ~10.000–100.000 mensagens por segundo |
| SSD comum | ~100 mil operações de leitura por segundo |

Um bom uso: se a estimativa dá 200.000 leituras por segundo, nenhuma instância de banco sozinha dá conta, mas um cache sim, e é por isso que o cache aparece.

## Lembre

- Memória < SSD < rede local < HDD < rede entre regiões.
- Servidor de aplicação: ~**1.000/s**; banco: **5 mil a 50 mil/s**; Redis: ~**100 mil/s**.
- Se a estimativa pede 200 mil leituras/s, **um cache** aparece.
