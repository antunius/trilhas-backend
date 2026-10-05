---
slug: estimativas-capacidade
categorySlug: system-design
title: "Estimativas de Capacidade: quando vale a pena calcular"
navTitle: Estimativas de Capacidade
summary: Saber quando estimativas de capacidade agregam valor à entrevista
level: intermediario
order: 3
section: framework-entrega
group: "Planejar"
---

## Objetivos de aprendizagem

- [ ] Saber quando estimativas de capacidade agregam valor à entrevista
- [ ] Fazer cálculos aproximados de forma rápida (ordem de grandeza)
- [ ] Evitar perder tempo excessivo com contas que não mudam nenhuma decisão

## Estrutura da aula

1. O que são estimativas de capacidade
2. Quando essa etapa realmente importa
3. Como estimar rapidamente sem se perder em contas

## Conteúdo

Estimativas de capacidade envolvem calcular, de forma aproximada, volumes como: número de requisições por segundo, volume de armazenamento necessário por ano, largura de banda estimada. O objetivo não é precisão matemática — é ordem de grandeza, o suficiente para decidir, por exemplo, se um único banco relacional aguenta a carga ou se sharding é necessário desde o início.

![Estimativas: usuários → QPS → storage](/diagrams/sd-estimativas-capacidade.svg)

Essa etapa só vale a pena quando o resultado do cálculo muda uma decisão de design. Se o requisito não-funcional já deixou claro que a escala é pequena, gastar 10 minutos calculando armazenamento em petabytes não ajuda em nada — pelo contrário, tira tempo de etapas mais importantes. Já em sistemas de escala massiva (feeds sociais, sistemas de mensagens), a conta costuma justificar decisões como "precisamos de cache" ou "uma tabela só não aguenta esse volume de escrita".

Uma forma rápida de estimar é partir de números redondos: se o sistema tem 100 milhões de usuários ativos por dia e cada um faz, em média, 10 ações, isso dá 1 bilhão de ações/dia — dividido por ~86.400 segundos no dia, chega a pouco mais de 10 mil ações por segundo em média (lembrando que picos podem ser vários múltiplos da média).

## Exemplo aplicado

Em um sistema de encurtamento de URLs com 100 milhões de links criados por mês e uma proporção de leitura:escrita de 100:1, a estimativa rápida já indica que o sistema é dominado por leituras — o que aponta diretamente para a importância de cache na camada de redirecionamento, uma decisão que vale a pena declarar antes mesmo do desenho de alto nível.

## Erros comuns

- Fazer contas extremamente detalhadas que não influenciam nenhuma decisão de arquitetura.
- Pular completamente essa etapa em problemas onde a escala é o ponto central do desafio.
- Confundir estimativa de ordem de grandeza com exatidão matemática.
