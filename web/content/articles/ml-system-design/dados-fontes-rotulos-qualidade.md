---
slug: dados-fontes-rotulos-qualidade
categorySlug: ml-system-design
title: "Dados: Fontes, Rótulos e Qualidade"
navTitle: Dados
summary: Identificar possíveis fontes de dados e rótulos para um problema de ML
level: intermediario
order: 3
section: framework
---

## Objetivos de aprendizagem

- [ ] Identificar possíveis fontes de dados e rótulos para um problema de ML
- [ ] Avaliar criticamente a qualidade e o viés de cada fonte

## Conteúdo

### Tipos comuns de fonte de dados e rótulo

- **Comportamento implícito do usuário**: cliques, tempo de visualização, curtidas — abundante e barato de coletar, mas nem sempre reflete diretamente a intenção real do usuário.
- **Rótulos explícitos do usuário**: avaliações, denúncias, feedback direto — mais confiáveis quanto à intenção, porém mais raros e sujeitos a viés de quem se dá ao trabalho de fornecer esse feedback.
- **Anotação humana especializada**: revisores dedicados rotulando exemplos — alta qualidade, mas caro e lento, geralmente limitado a um volume pequeno de dados.
- **Heurísticas e regras**: rótulos gerados por regras simples como ponto de partida, quando não há dados rotulados suficientes ainda.

### Avaliando qualidade e viés

Toda fonte de dado carrega algum viés: dados de comportamento implícito refletem apenas o que os usuários já viram e escolheram interagir (viés de exposição); anotação humana pode carregar o viés dos próprios anotadores. Reconhecer explicitamente essas limitações, em vez de tratar qualquer fonte de dado como neutra, é um sinal de maturidade nessa etapa.

### Combinando fontes

Frequentemente a melhor abordagem combina múltiplas fontes: uma fonte abundante mas ruidosa (comportamento implícito) para o volume principal de treinamento, complementada por uma fonte menor mas mais confiável (anotação humana) para validação e ajuste fino.

## Exemplo aplicado

Em um sistema de moderação de conteúdo, dados de denúncias de usuários são abundantes mas enviesados (só refletem o que usuários notaram e se importaram em denunciar), enquanto uma equipe de revisão humana rotulando uma amostra menor, porém mais criteriosa, serve para validar e calibrar a qualidade dos rótulos derivados das denúncias.

## Erros comuns

- Tratar qualquer fonte de dado disponível como automaticamente confiável e sem viés.
- Não considerar combinar múltiplas fontes complementares de dados e rótulos.
