# Plano de Estudos: Machine Learning Clássico
### Do fundamento matemático ao modelo em produção
**Versão 3** — cada tópico agora tem explicação (o que é, por que existe, até onde ir).

**Escopo:** ML clássico (dados tabulares, aprendizado supervisionado e não supervisionado) + engenharia de ML em produção.
**Fora de escopo por decisão:** deep learning e LLMs.
**Duração:** 40 semanas a 6–8h/semana. Ajustável.

**Como este documento está organizado:** cada módulo abre com *por que ele existe* e *o que você será capaz de fazer*. Em seguida vem a tabela de profundidade e, logo depois, a **explicação de cada tópico** — inclusive os de N1, para você saber o que está pulando de propósito. Os exemplos numéricos, derivações e exercícios continuam na seção “núcleo”.

---

# ÍNDICE

- [Como usar este plano](#0-como-usar-este-plano)
- [Módulo 1 — Álgebra linear](#módulo-1--álgebra-linear-3-semanas)
- [Módulo 2 — Cálculo e otimização](#módulo-2--cálculo-e-otimização-3-semanas)
- [Módulo 3 — Probabilidade](#módulo-3--probabilidade-3-semanas)
- [Módulo 4 — Estatística inferencial](#módulo-4--estatística-inferencial-3-semanas)
- [Módulo 5 — Teoria do aprendizado](#módulo-5--teoria-do-aprendizado-3-semanas)
- [Módulo 6 — Modelos lineares](#módulo-6--modelos-lineares-4-semanas)
- [Módulo 7 — Modelos baseados em árvores](#módulo-7--modelos-baseados-em-árvores-5-semanas)
- [Módulo 8 — Outros supervisionados](#módulo-8--outros-supervisionados-2-semanas)
- [Módulo 9 — Não supervisionado](#módulo-9--aprendizado-não-supervisionado-3-semanas)
- [Módulo 10 — Métricas e avaliação](#módulo-10--métricas-e-avaliação-3-semanas)
- [Módulo 11 — Feature engineering](#módulo-11--feature-engineering-3-semanas)
- [Módulo 12 — Workflow e interpretabilidade](#módulo-12--workflow-e-interpretabilidade-2-semanas)
- [Módulo 13 — ML em produção](#módulo-13--ml-em-produção-6-semanas)
- [Escala de profundidade consolidada](#escala-de-profundidade--tabela-consolidada)
- [Glossário](#glossário-de-referência)
- [Biblioteca de referência](#biblioteca-de-referência)

---

# 0. Como usar este plano

## 0.1 A escala de profundidade

A pergunta "até onde eu devo saber" precisa de uma régua. Uso esta, 5 níveis:

| Nível | Nome | Você consegue... |
|---|---|---|
| **N1** | Reconhecer | Saber que existe e para que serve. Não trava numa conversa. |
| **N2** | Usar | Aplicar com biblioteca, escolher hiperparâmetros conscientemente, ler a doc. |
| **N3** | Explicar | Explicar no quadro branco, sem fórmula, incluindo limitações e quando **não** usar. |
| **N4** | Derivar | Escrever a matemática no papel e derivar o resultado central. |
| **N5** | Implementar | Codar do zero em NumPy, sem consultar nada. |

Os níveis são **cumulativos** (N4 implica N3, N2, N1) e não são ordenados por dificuldade crescente de forma perfeita — N5 às vezes é mais fácil que N4.

**Regra geral deste plano:** a maior parte do conteúdo é alvo **N3**. Um conjunto pequeno e estratégico vai a **N4/N5**. Muita coisa fica em N1 de propósito, e isso é uma escolha, não uma lacuna.

## 0.2 O que exige N5 (implementar do zero)

São apenas cinco coisas. Se você fizer só isso, o resto encaixa:

1. Gradiente descendente para regressão linear
2. Regressão logística com log-loss
3. Uma árvore de decisão (critério de Gini + split recursivo)
4. k-means
5. Validação cruzada k-fold com split temporal

## 0.3 Ferramentas

```
Python 3.11+
numpy, pandas (ou polars), scipy
scikit-learn
xgboost, lightgbm
matplotlib, seaborn
shap
mlflow (experiment tracking)
jupyter
```

Ambiente: use `uv` ou `poetry`. Fixe seeds em tudo (`random_state=42` em todo lugar) desde o dia 1 — reprodutibilidade é hábito, não etapa.

## 0.4 Regra de estudo

Cada módulo tem três blocos:
- **📖 Ler/assistir** — consumo
- **✍️ Exercícios de papel** — matemática à mão
- **💻 Exercícios de código** — implementação

**Nenhum módulo está fechado sem os três.** Se você pular os exercícios de papel, em seis meses você vai ser mais um que "usa sklearn". A diferença entre saber usar e ser referência mora exatamente ali.

## 0.5 Como ler a explicação de cada tópico

Para cada tema, use três perguntas:

| Pergunta | O que responde |
|---|---|
| **O que é** | A ideia em uma frase, sem jargão circular |
| **Por que existe** | Qual problema de modelagem, produto ou produção isso resolve |
| **Até onde ir** | O comportamento concreto do nível alvo (N1–N5) |

Se um tópico está em N1, a explicação existe para você **reconhecer o nome numa conversa** e não abrir um livro. Se está em N5, a explicação diz o que você tem que **codar**.

## 0.6 O arco do plano (como os módulos se encadeiam)

```
Matemática (1–2)  →  Incerteza (3–4)  →  Generalização (5)
        →  Modelos (6–9)  →  Julgamento (10–12)  →  Produção (13)
```

- **1–2** dão a língua em que o modelo “pensa” (vetores, gradientes).
- **3–4** dão a língua em que você **defende** o modelo (probabilidade, A/B, p-valor).
- **5** explica por que treino ≠ produção (viés-variância, leakage, split).
- **6–9** são as ferramentas. Lineares e árvores levam o peso; o resto é repertório.
- **10–12** são o julgamento: métrica, feature, workflow, explicação.
- **13** é onde backend e ML se encontram: skew, serving, drift, deploy.

---

# MÓDULO 1 — Álgebra linear (3 semanas)

**Por que este módulo existe.** Quase todo modelo clássico é “pegar um vetor de features, combiná-lo com pesos e produzir um número”. Sem álgebra linear você usa a biblioteca; com ela você entende *o que* a biblioteca está fazendo quando reclama de shape, quando Ridge encolhe pesos, quando PCA “gira” os dados.

**Ao terminar você consegue:** escrever `ŷ = Xw` no papel, calcular produto escalar, normas e cosseno à mão, multiplicar matrizes, e explicar autovalor só na intuição do PCA.

## 1.1 O que estudar e até onde

| Tópico | Nível alvo | Por que |
|---|---|---|
| Vetor, escalar, dimensão | N4 | Vocabulário base |
| Produto escalar (dot product) | **N5** | É a operação central de todo modelo linear |
| Norma L1, L2, L∞ | **N4** | É literalmente a regularização |
| Similaridade por cosseno | **N4** | Base de kNN, clustering, busca |
| Multiplicação de matrizes | **N5** | Como o modelo processa um batch |
| Transposta, inversa, identidade | N3 | Aparece na equação normal |
| Posto (rank), independência linear | N3 | Explica multicolinearidade |
| Determinante | N2 | Aparece pouco na prática |
| Autovalor e autovetor | N3 | Só para entender PCA |
| Decomposição SVD | N2 | Reconhecer, saber que PCA usa |
| Espaço vetorial, base, transformação linear (formal) | N1 | ⛔ Não invista tempo aqui |

## 1.2 O que você precisa saber, na prática

### Produto escalar

```
a · b = Σ aᵢbᵢ = a₁b₁ + a₂b₂ + ... + aₙbₙ
```

**Exemplo numérico:**
```
a = [2, 3, 1]
b = [1, 0, 4]

a · b = (2)(1) + (3)(0) + (1)(4) = 2 + 0 + 4 = 6
```

**Por que importa:** a predição de qualquer modelo linear é *exatamente* um produto escalar entre o vetor de features e o vetor de pesos, mais o viés:

```
ŷ = w · x + b
```

Quando você entrega uma feature para o modelo online do seu time, ela vira uma posição nesse vetor `x`. O peso `wᵢ` correspondente diz quanto aquela feature empurra a predição pra cima ou pra baixo. É esse o mecanismo inteiro.

### Normas

```
Norma L1 (Manhattan):  ||x||₁ = Σ |xᵢ|
Norma L2 (Euclidiana): ||x||₂ = √(Σ xᵢ²)
```

**Exemplo:**
```
x = [3, -4]

||x||₁ = |3| + |-4| = 7
||x||₂ = √(9 + 16) = √25 = 5
```

**Por que importa:** regularização L1 (Lasso) penaliza `||w||₁`, regularização L2 (Ridge) penaliza `||w||₂²`. A diferença geométrica entre essas duas normas é a razão de o Lasso zerar coeficientes e o Ridge não. Voltaremos a isso no Módulo 6 com o desenho.

### Similaridade por cosseno

```
cos(a, b) = (a · b) / (||a||₂ · ||b||₂)
```

**Exemplo, continuando com a e b acima:**
```
a · b   = 6
||a||₂  = √(4 + 9 + 1) = √14 ≈ 3.742
||b||₂  = √(1 + 0 + 16) = √17 ≈ 4.123

cos = 6 / (3.742 × 4.123) = 6 / 15.43 ≈ 0.389
```

Resultado próximo de 0 = vetores quase ortogonais = pouco parecidos. Próximo de 1 = muito parecidos. Próximo de -1 = opostos.

**Diferença crucial em relação à distância euclidiana:** o cosseno ignora magnitude e olha só direção. Dois usuários com o mesmo padrão de gosto mas volumes de consumo muito diferentes têm cosseno alto e distância euclidiana alta. Escolher entre as duas é uma decisão de modelagem, não um detalhe.

### Multiplicação de matrizes

```
X (n×d) · W (d×1) = ŷ (n×1)
```

Ou seja: `n` exemplos, cada um com `d` features, multiplicados pelo vetor de pesos, produzindo `n` predições **de uma vez**. É por isso que ML é rápido: um batch inteiro vira uma operação de BLAS.

**Exemplo:**
```
X = [[1, 2, 3],      w = [ 0.5]
     [4, 5, 6]]           [-1.0]
                          [ 2.0]

linha 1: (1)(0.5) + (2)(-1.0) + (3)(2.0) = 0.5 - 2 + 6 = 4.5
linha 2: (4)(0.5) + (5)(-1.0) + (6)(2.0) = 2.0 - 5 + 12 = 9.0

ŷ = [4.5, 9.0]
```

Regra de compatibilidade: `(n×d) · (d×k) = (n×k)`. A dimensão do meio tem que bater. 90% dos erros de shape em ML são isso.

### Autovalores — só a intuição

Um autovetor de uma matriz é uma direção que a transformação **não gira**, só estica ou encolhe. O autovalor é o quanto ela estica.

```
A v = λ v
```

No PCA você calcula a matriz de covariância dos dados e pega seus autovetores: são as direções de maior variância. Os autovalores dizem quanta variância cada direção captura. Isso é tudo o que você precisa. Não decore o cálculo manual de autovalores para matrizes 3×3 — ninguém faz isso na prática.

## 1.3 O que você NÃO precisa saber

⛔ Formas de Jordan, espaços duais, produto tensorial, demonstração do teorema espectral, cálculo manual de inversa de matriz 4×4, mudança de base formal. Se um dia precisar, você aprende no dia.

## 1.4 Recursos

| Recurso | Link | Tempo |
|---|---|---|
| Essence of Linear Algebra (3Blue1Brown) | https://www.3blue1brown.com/topics/linear-algebra | 3h — **comece por aqui** |
| Mathematics for Machine Learning, cap. 2–4 | https://mml-book.github.io/ | leitura de referência |
| NumPy: linear algebra | https://numpy.org/doc/stable/reference/routines.linalg.html | consulta |

## 1.5 Exercícios

**✍️ Papel**

1. Dado `a = [1, 2, 2]` e `b = [3, 0, 4]`, calcule `a·b`, `||a||₂`, `||b||₂` e `cos(a,b)` à mão.
   *(resposta: 11, 3, 5, 0.733)*
2. Prove que `a · a = ||a||₂²`. Duas linhas.
3. Multiplique à mão:
   ```
   [[2, 1],     [[1, 0],
    [0, 3]]  ×   [4, 2]]
   ```
   *(resposta: [[6, 2], [12, 6]])*
4. Explique em texto por que `X·w` calcula todas as predições de uma vez, e o que aconteceria se você transpusesse `X` por engano.
5. Dois vetores têm cosseno 0.99 mas distância euclidiana enorme. Descreva um cenário real onde isso acontece e diga qual métrica você usaria.

**💻 Código**

1. Implemente `dot(a, b)`, `norm_l1(x)`, `norm_l2(x)` e `cosine_similarity(a, b)` com loops Python puro. Compare com NumPy usando `np.allclose`.
2. Implemente multiplicação de matrizes com três loops aninhados. Compare tempo com `np.dot` numa matriz 500×500. Anote a diferença — vai ser da ordem de 100×.
3. Gere 1000 vetores aleatórios de dimensão 10. Encontre o par mais similar por cosseno. Depois refaça por distância euclidiana. Os pares são os mesmos? Investigue por quê.

---

# MÓDULO 2 — Cálculo e otimização (3 semanas)

## 2.1 O que estudar e até onde

| Tópico | Nível alvo |
|---|---|
| Derivada como taxa de variação | N4 |
| Derivada de funções básicas (potência, exp, log) | **N4** |
| Regra da cadeia | **N5** |
| Derivada parcial e gradiente | **N5** |
| Gradiente descendente | **N5** |
| Learning rate e convergência | N3 |
| Convexidade | N3 |
| Mínimo local vs global | N3 |
| SGD e mini-batch | N3 |
| Método de Newton, quasi-Newton (L-BFGS) | N2 |
| Multiplicadores de Lagrange | N1 |
| Integrais, séries, EDOs | N1 — ⛔ ignore |

## 2.2 O núcleo

### Derivadas que você precisa saber de cor

```
d/dx (xⁿ)     = n·xⁿ⁻¹
d/dx (eˣ)     = eˣ
d/dx (ln x)   = 1/x
d/dx (c)      = 0
d/dx (f + g)  = f' + g'
d/dx (f·g)    = f'g + fg'
```

**Regra da cadeia** (a mais importante de todas):
```
d/dx f(g(x)) = f'(g(x)) · g'(x)
```

### Gradiente

O gradiente é o vetor de derivadas parciais. Ele aponta na direção de **maior crescimento** da função.

```
∇f = [∂f/∂w₁, ∂f/∂w₂, ..., ∂f/∂wₙ]
```

Para minimizar, você anda no sentido **oposto** ao gradiente. Isso é o gradiente descendente inteiro:

```
w ← w − α · ∇L(w)
```

onde `α` é a taxa de aprendizado (learning rate).

### Derivação completa: regressão linear com MSE

Esta é a derivação que você **precisa** conseguir fazer de olhos fechados. É o "hello world" matemático de ML.

**Modelo:**
```
ŷᵢ = w·xᵢ + b
```

**Função de perda (MSE):**
```
L(w, b) = (1/n) · Σᵢ (yᵢ − ŷᵢ)²
        = (1/n) · Σᵢ (yᵢ − w·xᵢ − b)²
```

**Derivando em relação a w** (regra da cadeia: derivada do quadrado × derivada do interno):
```
∂L/∂w = (1/n) · Σᵢ 2(yᵢ − w·xᵢ − b) · (−xᵢ)
      = −(2/n) · Σᵢ xᵢ(yᵢ − ŷᵢ)
```

**Derivando em relação a b:**
```
∂L/∂b = −(2/n) · Σᵢ (yᵢ − ŷᵢ)
```

**Leitura intuitiva:** o gradiente é a média dos resíduos, ponderada pela feature. Se os resíduos são grandes e positivos onde `x` é grande, o gradiente empurra `w` pra cima. Faz sentido físico.

### Exemplo numérico passo a passo

```
Dados:  x = [1, 2, 3]
        y = [2, 4, 6]
Início: w = 0, b = 0, α = 0.01

--- Iteração 1 ---
ŷ = [0, 0, 0]
resíduos (y − ŷ) = [2, 4, 6]

L = (1/3)(4 + 16 + 36) = 56/3 ≈ 18.67

∂L/∂w = −(2/3)[(1)(2) + (2)(4) + (3)(6)] = −(2/3)(28) ≈ −18.67
∂L/∂b = −(2/3)[2 + 4 + 6]                = −(2/3)(12) = −8.00

w ← 0 − 0.01(−18.67) = 0.1867
b ← 0 − 0.01(−8.00)  = 0.0800

--- Iteração 2 ---
ŷ = [0.2667, 0.4533, 0.6400]
resíduos = [1.7333, 3.5467, 5.3600]

L = (1/3)(3.004 + 12.579 + 28.730) ≈ 14.77   ← caiu de 18.67. Está funcionando.
```

Faça isso à mão por 3 iterações uma vez na vida. Depois disso, gradiente descendente deixa de ser mágica.

### Learning rate — o que acontece quando você erra

| α | Efeito |
|---|---|
| Muito pequeno | Converge, mas leva uma eternidade |
| Adequado | Perda cai suave e monotonicamente |
| Grande demais | Perda oscila, sobe e desce |
| Absurdo | Perda vira `NaN` ou `inf` — diverge |

**Diagnóstico prático:** sempre plote a curva de perda por iteração. É o `System.out.println` do ML.

### Convexidade

Uma função convexa tem **um único mínimo**. Nesse caso, gradiente descendente sempre chega no ótimo global.

- Convexas: regressão linear com MSE, regressão logística com log-loss, SVM linear, Ridge, Lasso
- Não convexas: redes neurais, k-means, árvores

Isso é uma boa notícia para você: **quase todo ML clássico é convexo**. Os modelos que você vai estudar aqui têm garantia de convergência para o ótimo global. É uma das razões pelas quais são tão confiáveis em produção.

## 2.3 Recursos

| Recurso | Link |
|---|---|
| Essence of Calculus (3Blue1Brown), cap. 1–4 | https://www.3blue1brown.com/topics/calculus |
| Gradient Descent, visualmente | https://mlu-explain.github.io/ |
| Mathematics for Machine Learning, cap. 5 e 7 | https://mml-book.github.io/ |
| Sebastian Ruder — overview de otimizadores | https://www.ruder.io/optimizing-gradient-descent/ |

## 2.4 Exercícios

**✍️ Papel**

1. Derive `f(x) = (3x + 1)²` usando regra da cadeia. *(resposta: `6(3x+1)`)*
2. Derive `f(x) = ln(1 + e^x)`. *(resposta: `e^x/(1+e^x)` = sigmoide. Guarde este resultado, ele volta no Módulo 6.)*
3. Refaça o exemplo numérico acima por mais duas iterações à mão. Confirme que a perda continua caindo.
4. Com `α = 1.0` no mesmo exemplo, calcule a iteração 1. O que acontece? Explique.
5. Por que a regularização L2 mantém o problema convexo? Uma frase.

**💻 Código**

1. Implemente gradiente descendente do zero para regressão linear simples, em NumPy. Sem sklearn. Plote a curva de perda.
2. Rode o mesmo código com `α ∈ {0.0001, 0.01, 0.1, 1.0}`. Plote as quatro curvas no mesmo gráfico. Guarde esse gráfico — ele vale uma apresentação inteira para o seu time.
3. Implemente a **equação normal** (solução fechada) e compare com o resultado do gradiente descendente:
   ```
   w = (XᵀX)⁻¹ Xᵀy
   ```
   Depois responda: por que na prática quase ninguém usa a equação normal? *(dica: custo `O(d³)` da inversão, e instabilidade quando `XᵀX` é mal condicionada)*

---

# MÓDULO 3 — Probabilidade (3 semanas)

## 3.1 O que estudar e até onde

| Tópico | Nível alvo |
|---|---|
| Espaço amostral, evento, probabilidade | N3 |
| Probabilidade condicional | **N4** |
| Independência | N3 |
| Teorema de Bayes | **N5** |
| Variável aleatória (discreta e contínua) | N3 |
| Esperança e variância | **N4** |
| Distribuição de Bernoulli e Binomial | **N4** |
| Distribuição Normal | **N4** |
| Distribuição de Poisson | N2 |
| Máxima verossimilhança (MLE) | **N4** |
| Lei dos grandes números | N3 |
| Teorema central do limite | N3 |
| Cadeias de Markov, processos estocásticos | N1 — ⛔ |
| Inferência bayesiana completa (MCMC, priors) | N1 |

## 3.2 O núcleo

### Probabilidade condicional e Bayes

```
P(A|B) = P(A ∩ B) / P(B)

Bayes:  P(A|B) = P(B|A) · P(A) / P(B)
```

### Exemplo trabalhado — por que isso muda decisões de produto

Um sistema de detecção de fraude:
- **Prevalência:** 1% das transações são fraude
- **Sensibilidade (recall):** o modelo pega 99% das fraudes reais
- **Especificidade:** 95% das transações legítimas são corretamente liberadas (ou seja, 5% de falso positivo)

Uma transação foi marcada como fraude. Qual a probabilidade de realmente ser?

```
P(marcado) = P(marcado | fraude)·P(fraude) + P(marcado | legítima)·P(legítima)
           = (0.99)(0.01) + (0.05)(0.99)
           = 0.0099 + 0.0495
           = 0.0594

P(fraude | marcado) = 0.0099 / 0.0594 = 0.1667
```

**16.7%.** Um modelo com 99% de recall e 95% de especificidade acerta apenas 1 em cada 6 alertas.

Essa conta é a razão de existirem filas de revisão manual, thresholds ajustáveis e sistemas em camadas. Quando o evento é raro, **a taxa base domina tudo**. Se você entender só isso deste módulo, já valeu.

### Esperança e variância

```
E[X] = Σ xᵢ · P(xᵢ)              (discreto)
Var[X] = E[(X − E[X])²] = E[X²] − (E[X])²
Desvio padrão = √Var[X]
```

Propriedades que você usa direto:
```
E[aX + b] = a·E[X] + b
Var[aX + b] = a²·Var[X]
Var[X + Y] = Var[X] + Var[Y]     (somente se X e Y independentes)
```

### Distribuições que importam

**Bernoulli** — um experimento binário. `P(X=1) = p`, `E[X] = p`, `Var[X] = p(1−p)`.
→ É o modelo probabilístico de toda classificação binária. Clique/não clique, fraude/não fraude.

**Binomial** — `n` Bernoullis independentes. `E[X] = np`, `Var[X] = np(1−p)`.
→ Base de todo teste A/B com métrica de conversão.

**Normal** — `E[X] = μ`, `Var[X] = σ²`. Regra prática: 68% dentro de 1σ, 95% dentro de 2σ, 99.7% dentro de 3σ.
→ Base do erro em regressão, de intervalos de confiança e de detecção de outlier por z-score.

### Máxima verossimilhança — a ponte entre probabilidade e ML

Este é o conceito que amarra o módulo inteiro. **Toda função de perda vem de uma suposição de distribuição.**

**Caso 1: classificação binária → log-loss**

Assumindo Bernoulli, a verossimilhança dos dados é:
```
L = Πᵢ pᵢ^yᵢ · (1 − pᵢ)^(1−yᵢ)
```

Aplicando log (que preserva o argmax e transforma produto em soma):
```
log L = Σᵢ [ yᵢ·log(pᵢ) + (1 − yᵢ)·log(1 − pᵢ) ]
```

Negando, para virar minimização:
```
Log Loss = −(1/n) · Σᵢ [ yᵢ·log(pᵢ) + (1 − yᵢ)·log(1 − pᵢ) ]
```

**Isso é exatamente a função de perda da regressão logística.** Ela não foi inventada — ela é a consequência matemática de assumir que os rótulos são Bernoulli.

**Caso 2: regressão → MSE**

Assumindo que o erro é normal com variância constante, `y = w·x + b + ε` com `ε ~ N(0, σ²)`, e maximizando a verossimilhança, você chega em minimizar `Σ(yᵢ − ŷᵢ)²`. **MSE é a consequência de assumir ruído gaussiano.**

Isso responde a pergunta "por que MSE e não erro absoluto?": porque MSE assume gaussiano e MAE assume distribuição de Laplace, que tem caudas mais pesadas — e é por isso que MAE é mais robusta a outliers.

Quando você entende isso, você para de escolher função de perda por costume e passa a escolher por hipótese sobre os dados. É um degrau de maturidade grande.

## 3.3 Recursos

| Recurso | Link |
|---|---|
| StatQuest — canal completo | https://www.youtube.com/@statquest |
| Seeing Theory (probabilidade visual e interativa) | https://seeing-theory.brown.edu/ |
| Think Stats (livro gratuito, orientado a código) | https://greenteapress.com/wp/think-stats-3e/ |
| Mathematics for Machine Learning, cap. 6 | https://mml-book.github.io/ |

## 3.4 Exercícios

**✍️ Papel**

1. Refaça a conta de Bayes da fraude com prevalência de 10% em vez de 1%. *(resposta: ≈ 68.8%)* Compare e explique por que a diferença é tão grande.
2. Um teste tem 99.9% de sensibilidade e especificidade, para uma doença com prevalência de 1 em 100.000. Calcule o valor preditivo positivo. Reflita sobre triagem em massa.
3. Derive `E[X]` e `Var[X]` para a Bernoulli a partir da definição.
4. Derive o log-loss a partir da verossimilhança da Bernoulli, sem consultar o texto acima.
5. Um modelo prevê `p = 0.9` e o rótulo real é `0`. Qual a contribuição desse exemplo para o log-loss? *(resposta: `−log(0.1) ≈ 2.30`)* Compare com um modelo que previu `p = 0.6` e errou *(`−log(0.4) ≈ 0.92`)*. Explique por que o log-loss pune confiança errada de forma tão agressiva.

**💻 Código**

1. Simule o cenário de fraude com 1.000.000 de transações amostradas. Verifique empiricamente o resultado de 16.7%.
2. Implemente `log_loss(y_true, y_pred)` do zero, com clipping para evitar `log(0)`. Compare com `sklearn.metrics.log_loss`.
3. Simule 10.000 amostras de médias de 30 lançamentos de dado. Plote o histograma. Você acabou de demonstrar o teorema central do limite.

---

# MÓDULO 4 — Estatística inferencial (3 semanas)

Este é o módulo que a maioria dos engenheiros pula, e é o que mais aparece em reunião. Vale investir.

## 4.1 O que estudar e até onde

| Tópico | Nível alvo |
|---|---|
| Amostra vs população | N3 |
| Erro padrão | **N4** |
| Intervalo de confiança | **N4** |
| Teste de hipótese, H₀ e H₁ | **N4** |
| p-valor (e o que ele NÃO é) | **N4** |
| Erro tipo I e tipo II | **N4** |
| Poder estatístico | **N3** |
| Cálculo de tamanho de amostra | **N3** |
| Teste t, teste z, qui-quadrado | N2 |
| Correção para múltiplas comparações | N3 |
| Bootstrap | **N3** |
| Paradoxo de Simpson | N3 |
| Confusão e causalidade | N3 |
| Inferência causal formal (DAGs, do-calculus) | N1 |

## 4.2 O núcleo

### Erro padrão e intervalo de confiança

```
Erro padrão da média:      SE = σ / √n
IC de 95% (aproximado):    x̄ ± 1.96 · SE
```

**A intuição que importa:** a incerteza cai com `√n`, não com `n`. Para reduzir a barra de erro pela metade, você precisa de **4× mais dados**. Isso explica por que testes A/B demoram tanto e por que "vamos rodar mais um dia" quase nunca resolve.

### p-valor — a definição correta

> O p-valor é a probabilidade de observar um efeito **pelo menos tão extremo quanto o observado**, assumindo que a hipótese nula é verdadeira.

O que ele **não** é:
- ❌ A probabilidade de a hipótese nula ser verdadeira
- ❌ A probabilidade de o resultado ter sido por acaso
- ❌ Uma medida do tamanho do efeito

Um p-valor de 0.001 com um efeito de +0.02% é estatisticamente significativo e praticamente irrelevante. **Significância estatística não é significância prática.** Essa frase, dita na hora certa numa reunião, já é meio caminho para ser referência.

### Tamanho de amostra para teste A/B

Regra prática para 80% de poder e α = 5%, por grupo:

```
n ≈ 16 · σ² / Δ²
```

Para métrica de proporção (CTR, conversão), `σ² = p(1−p)`:

```
n ≈ 16 · p(1−p) / Δ²
```

**Exemplo:** CTR base de 5%, você quer detectar uma melhoria absoluta de 0.5 pontos percentuais.

```
p(1−p) = 0.05 × 0.95 = 0.0475
Δ = 0.005
Δ² = 0.000025

n ≈ 16 × 0.0475 / 0.000025 = 16 × 1900 = 30.400 por grupo
```

Ou seja, ~61.000 usuários no total. Se o seu teste tem 5.000 usuários, **ele não consegue detectar esse efeito** — e um resultado "não significativo" ali não significa "não funcionou", significa "não dá pra saber".

Saber fazer essa conta antes do teste, e não depois, é uma das habilidades que mais rapidamente te dá autoridade técnica.

### Erros tipo I e II

|  | H₀ verdadeira | H₀ falsa |
|---|---|---|
| **Rejeitou H₀** | Erro tipo I (α) — falso positivo | ✅ Acerto (poder = 1−β) |
| **Não rejeitou** | ✅ Acerto | Erro tipo II (β) — falso negativo |

### Múltiplas comparações

Se você testa 20 métricas com α = 0.05, a chance de pelo menos um falso positivo é:
```
1 − (0.95)²⁰ = 1 − 0.358 = 0.642
```

**64%.** É por isso que "olhamos vários segmentos e num deles deu significativo" quase sempre é ruído. Correções: Bonferroni (conservadora, `α/m`) ou Benjamini-Hochberg (controla FDR, mais usada na prática).

### Paradoxo de Simpson

Uma tendência que aparece em cada subgrupo pode **inverter** quando os grupos são agregados. Acontece quando há uma variável de confusão desbalanceada entre grupos.

Exemplo clássico: modelo B tem taxa de acerto maior que A em usuários novos **e** em usuários antigos, mas menor no agregado — porque B recebeu proporcionalmente mais usuários novos, que são mais difíceis.

**Consequência prática:** sempre olhe as métricas segmentadas, não só o agregado.

### Bootstrap

Técnica para estimar incerteza de qualquer estatística sem assumir distribuição:
1. Reamostre os dados com reposição, mesmo tamanho `n`
2. Calcule a estatística
3. Repita 1000–10000 vezes
4. O percentil 2.5 e 97.5 dessa distribuição é seu IC de 95%

É especialmente útil para métricas onde a teoria é complicada — NDCG, AUC, métricas de negócio compostas. Vale N3.

## 4.3 Recursos

| Recurso | Link |
|---|---|
| StatQuest — p-valores e testes | https://www.youtube.com/@statquest |
| Statistical Rethinking (curso gratuito, mais profundo) | https://github.com/rmcelreath/stat_rethinking_2024 |
| Trustworthy Online Controlled Experiments (Kohavi) — livro pago, referência de A/B | https://experimentguide.com/ |
| Evan Miller — calculadoras e ensaios de A/B | https://www.evanmiller.org/ab-testing/ |

## 4.4 Exercícios

**✍️ Papel**

1. Sua página tem 2% de conversão. Você quer detectar +0.2pp. Calcule o `n` necessário por grupo. *(resposta: ≈ 78.400)*
2. Você roda 10 testes independentes, todos com α=0.05, e nenhum efeito é real. Qual a probabilidade de pelo menos um dar "significativo"? *(resposta: 40.1%)*
3. Escreva a definição correta de p-valor de memória, e três interpretações erradas comuns.
4. Construa um exemplo numérico de paradoxo de Simpson com dois grupos e duas variantes. Verifique a inversão à mão.
5. Um teste A/B rodou 3 dias e deu p = 0.06. O PM quer rodar "só mais um dia até dar significativo". Escreva a resposta técnica em 3 frases. *(dica: peeking, taxa de erro tipo I inflada, necessidade de definir horizonte antes)*

**💻 Código**

1. Implemente bootstrap do zero para calcular IC de 95% da mediana de um dataset.
2. Simule 1000 testes A/B sem efeito real. Conte quantos dão p < 0.05. Deve dar ~5%.
3. Simule o problema do *peeking*: rode um teste A/B sem efeito real, checando significância a cada 100 usuários e parando no primeiro p < 0.05. Repita 1000 vezes. Qual a taxa real de falso positivo? *(spoiler: muito acima de 5%)* Este experimento é material de apresentação.

---

# MÓDULO 5 — Teoria do aprendizado (3 semanas)

## 5.1 O que estudar e até onde

| Tópico | Nível alvo |
|---|---|
| Formalização do problema de aprendizado | N3 |
| Risco empírico vs risco esperado | N3 |
| Overfitting e underfitting | **N4** |
| Decomposição viés-variância | **N4** |
| Regularização L1 e L2 | **N4** |
| Validação: holdout, k-fold, estratificado, temporal | **N5** |
| Data leakage — catálogo completo | **N4** |
| Curva de aprendizado | N3 |
| Maldição da dimensionalidade | N3 |
| No Free Lunch | N2 |
| Dimensão VC, limites PAC | N1 — ⛔ teoria pura |

## 5.2 O núcleo

### A formalização

Existe uma função verdadeira desconhecida `f` que mapeia entradas em saídas. Você observa `n` pares `(xᵢ, yᵢ)` com ruído. Seu objetivo é encontrar `ĥ` que aproxime `f` **em dados que você nunca viu**.

```
Risco empírico (o que você mede):    R̂(h) = (1/n) Σ L(yᵢ, h(xᵢ))
Risco esperado (o que você quer):    R(h)  = E[L(y, h(x))]
```

Minimizar o primeiro não garante minimizar o segundo. **Toda a disciplina de validação existe por causa dessa lacuna.**

### Decomposição viés-variância

```
Erro esperado = Viés² + Variância + Ruído irredutível
```

| Componente | O que é | Como reduzir |
|---|---|---|
| **Viés** | Erro por o modelo ser rígido demais para capturar o padrão | Modelo mais complexo, mais features |
| **Variância** | Erro por o modelo ser sensível demais aos dados de treino específicos | Mais dados, regularização, ensemble |
| **Ruído** | Aleatoriedade inerente ao problema | Nada. É o teto. |

**Diagnóstico prático — a tabela que resolve 80% dos problemas:**

| Erro treino | Erro validação | Diagnóstico | Ação |
|---|---|---|---|
| Alto | Alto | Underfitting (viés alto) | Modelo mais complexo, melhores features |
| Baixo | Alto | Overfitting (variância alta) | Regularizar, mais dados, simplificar |
| Baixo | Baixo | ✅ Bom | Vá para produção |
| Alto | Baixo | Algo está errado | Bug, leakage invertido, split ruim |

Cole essa tabela na parede.

### Regularização — a matemática e a geometria

```
Ridge (L2):   L = MSE + λ · Σ wⱼ²
Lasso (L1):   L = MSE + λ · Σ |wⱼ|
Elastic Net:  L = MSE + λ₁ · Σ |wⱼ| + λ₂ · Σ wⱼ²
```

**Por que L1 zera coeficientes e L2 não?**

Pense geometricamente. Você está minimizando o MSE sujeito a uma restrição no tamanho dos pesos.

- A restrição L2 (`Σwⱼ² ≤ t`) desenha um **círculo** no espaço de pesos
- A restrição L1 (`Σ|wⱼ| ≤ t`) desenha um **losango** (com quinas nos eixos)

As curvas de nível do MSE são elipses que crescem a partir da solução sem restrição. A solução está onde a elipse toca a região de restrição pela primeira vez.

Um losango tem **quinas nos eixos**. Uma elipse tem alta probabilidade de tocar exatamente numa quina — e quina no eixo significa **coeficiente exatamente zero**. Um círculo não tem quinas, então o toque acontece em ponto genérico, com todos os coeficientes pequenos mas não nulos.

Consequência prática: **Lasso faz seleção de features automaticamente. Ridge só encolhe.**

Quando usar cada uma:
- Muitas features, você suspeita que poucas importam → **Lasso**
- Features correlacionadas, todas provavelmente contribuem → **Ridge**
- Não sei → **Elastic Net**, e deixe a validação cruzada escolher a mistura

### Validação — e onde ela quebra

| Estratégia | Quando usar | Cuidado |
|---|---|---|
| Holdout simples | Dataset grande (>100k) | Alta variância se pequeno |
| k-fold (k=5 ou 10) | Padrão para dados i.i.d. | ⛔ **Errado para séries temporais** |
| Estratificado | Classes desbalanceadas | Sempre use em classificação |
| Group k-fold | Múltiplas linhas por entidade (usuário, sessão) | Sem isso, o mesmo usuário aparece em treino e teste = leakage |
| **TimeSeriesSplit** | Qualquer coisa com componente temporal | Treina no passado, valida no futuro. Só isso é honesto. |
| Nested CV | Quando você faz seleção de hiperparâmetro **e** quer estimativa não enviesada | Caro, mas correto |

**A regra de ouro:** seu split de validação tem que imitar a relação temporal e de entidade que existe em produção. Se em produção você prevê o futuro a partir do passado, seu split tem que fazer o mesmo. Todo desvio disso é uma promessa que o modelo não vai cumprir.

### Catálogo de data leakage

Vazamento é a causa nº 1 de modelo que vai 0.95 offline e 0.60 em produção. Aprenda a reconhecer os tipos:

| Tipo | Descrição | Exemplo |
|---|---|---|
| **Target leakage** | Uma feature contém informação do alvo | `valor_reembolso` como feature para prever `houve_reembolso` |
| **Temporal** | Feature usa informação posterior ao momento da predição | Média de compras do usuário **calculada hoje**, aplicada a um exemplo de 6 meses atrás |
| **De preprocessing** | Scaler/imputer ajustado no dataset completo antes do split | `StandardScaler().fit(X)` antes do `train_test_split` |
| **De grupo** | Mesma entidade em treino e teste | Múltiplas sessões do mesmo usuário divididas aleatoriamente |
| **Por duplicata** | Linhas duplicadas caem nos dois lados | Dataset com registros repetidos |
| **De seleção** | O dataset foi filtrado usando informação do futuro | "Só usuários que continuaram ativos" |

**Teste de sanidade infalível:** se o resultado é bom demais, é leakage. Não é sorte. Um AUC de 0.99 num problema de negócio real é praticamente sempre um bug.

**Prevenção estrutural:** use `sklearn.pipeline.Pipeline` para tudo. O pipeline garante que o preprocessing seja ajustado só no fold de treino de cada iteração da validação cruzada. Isso elimina uma categoria inteira de erro por construção.

### Maldição da dimensionalidade

Em alta dimensão, todos os pontos ficam aproximadamente equidistantes entre si. A intuição geométrica de "vizinho próximo" desmorona.

Consequências:
- kNN degrada rapidamente acima de ~20 features
- Você precisa de exponencialmente mais dados conforme adiciona features
- Métricas de distância perdem poder discriminativo

Mitigações: seleção de features, redução de dimensionalidade (PCA), ou usar modelos que lidam bem com isso (árvores, modelos lineares regularizados).

## 5.3 Recursos

| Recurso | Link |
|---|---|
| MLU-Explain: Bias-Variance, Train/Test Split, Double Descent | https://mlu-explain.github.io/ |
| ISLP (Introduction to Statistical Learning, Python), cap. 2, 5 e 6 | https://www.statlearning.com/ |
| PDF direto do ISLP | https://hastie.su.domains/ISLP/ISLP_website.pdf |
| scikit-learn: cross-validation | https://scikit-learn.org/stable/modules/cross_validation.html |
| scikit-learn: common pitfalls (leia inteiro) | https://scikit-learn.org/stable/common_pitfalls.html |

## 5.4 Exercícios

**✍️ Papel**

1. Desenhe as regiões de restrição L1 e L2 em 2D, com curvas de nível de MSE. Marque onde cada uma toca. Explique o zero do Lasso a partir do seu desenho.
2. Para cada um dos 6 tipos de leakage, escreva um exemplo tirado do **seu domínio de trabalho**. Esse exercício vale mais que os outros cinco juntos.
3. Você tem 10.000 eventos de 500 usuários e quer prever churn. Qual estratégia de split? Justifique em 3 frases.
4. Explique por que `Erro = Viés² + Variância + Ruído` implica que existe um limite inferior de erro que nenhum modelo alcança.

**💻 Código**

1. Implemente `k_fold_split(n, k)` e `time_series_split(n, k)` do zero, retornando índices. Sem sklearn.
2. Construa deliberadamente um caso de leakage: aplique `StandardScaler` no dataset inteiro antes do split, meça o AUC. Depois faça certo com `Pipeline`. Documente a diferença.
3. Gere dados sintéticos com relação polinomial. Ajuste polinômios de grau 1 a 20. Plote erro de treino e de validação nos mesmos eixos. Você acabou de desenhar a curva de viés-variância com dados próprios.
4. Pegue um dataset com componente temporal. Compare o AUC obtido com `KFold` aleatório vs `TimeSeriesSplit`. A diferença é o tamanho da mentira que o k-fold aleatório te contaria.

---

# MÓDULO 6 — Modelos lineares (4 semanas)

## 6.1 Regressão linear

**Nível alvo: N5**

```
Modelo:   ŷ = w₀ + w₁x₁ + w₂x₂ + ... + wₐxₐ = wᵀx
Perda:    MSE = (1/n) Σ (yᵢ − ŷᵢ)²
Solução:  w = (XᵀX)⁻¹Xᵀy      (equação normal)
          ou gradiente descendente
```

**Pressupostos** (que quase nunca se sustentam por completo, mas você precisa saber quais são):
1. Linearidade da relação
2. Independência dos erros
3. Homocedasticidade (variância constante do erro)
4. Normalidade dos resíduos
5. Ausência de multicolinearidade severa

**Diagnóstico de resíduos:** plote `resíduo × predição`. Se aparecer padrão (funil, curva), um pressuposto quebrou. Funil = heterocedasticidade. Curva = relação não linear que você não capturou.

**Interpretação do coeficiente:** `wⱼ` é a variação esperada em `y` quando `xⱼ` aumenta em 1 unidade, **mantendo todo o resto constante**. Essa última cláusula é onde a interpretação quebra quando há multicolinearidade.

**Multicolinearidade:** features correlacionadas fazem `XᵀX` ficar quase singular. Os coeficientes ficam instáveis e com sinais absurdos. Detecte com VIF (Variance Inflation Factor); VIF > 10 é sinal de alerta. Resolva removendo features ou usando Ridge.

## 6.2 Ridge, Lasso, Elastic Net

**Nível alvo: N4**

Já cobertos matematicamente no Módulo 5. Aqui, a prática:

| Hiperparâmetro | O que faz | Como escolher |
|---|---|---|
| `alpha` (λ) | Força da regularização | Validação cruzada em escala log: `[0.001, 0.01, 0.1, 1, 10, 100]` |
| `l1_ratio` (Elastic Net) | Mistura entre L1 e L2 | CV entre 0.1 e 0.9 |

⚠️ **Regularização exige features padronizadas.** Sem isso, features com escalas maiores são penalizadas de forma desproporcional. Use `StandardScaler` dentro do `Pipeline`, sempre.

## 6.3 Regressão logística

**Nível alvo: N5**

É o modelo mais importante de toda a sua carreira em ML. É a baseline de produção padrão da indústria, é rápido, é interpretável, é calibrado, e vence modelos complexos com mais frequência do que se admite.

```
Função sigmoide:  σ(z) = 1 / (1 + e^(−z))
Modelo:           p = σ(wᵀx)
Perda:            Log Loss (derivada no Módulo 3)
```

**A propriedade mais elegante:** a derivada do log-loss em relação a `w` é

```
∂L/∂w = (1/n) · Σᵢ (pᵢ − yᵢ) · xᵢ
```

Idêntica em forma à da regressão linear com MSE — resíduo vezes feature. Isso não é coincidência, é consequência da família exponencial. É um bom detalhe pra ter na manga.

**Interpretação por odds ratio:**

```
odds = p / (1 − p)
log(odds) = wᵀx           ← o modelo é linear no log-odds

e^wⱼ = fator multiplicativo nas odds quando xⱼ aumenta em 1
```

**Exemplo:** `wⱼ = 0.693` → `e^0.693 = 2.0` → aumentar `xⱼ` em uma unidade **dobra as odds** do evento.

Essa forma de comunicar resultado (`"essa feature dobra as chances"`) funciona muito melhor com stakeholders do que falar em coeficientes.

**Hiperparâmetros no sklearn:**

| Parâmetro | Efeito |
|---|---|
| `C` | Inverso da regularização. `C` pequeno = mais regularização. Contraintuitivo, cuidado. |
| `penalty` | `'l2'` (padrão), `'l1'`, `'elasticnet'` |
| `solver` | `'lbfgs'` (padrão), `'liblinear'` (datasets pequenos), `'saga'` (grande + L1) |
| `class_weight` | `'balanced'` para desbalanceamento |
| `max_iter` | Aumente se aparecer warning de convergência |

## 6.4 Recursos

| Recurso | Link |
|---|---|
| MLU-Explain: Linear Regression e Logistic Regression (interativos) | https://mlu-explain.github.io/ |
| ISLP, cap. 3 (linear) e 4 (logística) | https://www.statlearning.com/ |
| scikit-learn: linear models (doc excelente, leia inteiro) | https://scikit-learn.org/stable/modules/linear_model.html |
| StatQuest: Logistic Regression série | https://www.youtube.com/@statquest |

## 6.5 Exercícios

**✍️ Papel**

1. Derive `∂L/∂w` do log-loss até chegar em `(p − y)·x`. Use a identidade `σ'(z) = σ(z)(1 − σ(z))`.
2. Um modelo logístico tem coeficiente `0.405` para a feature "usuário premium". Interprete em linguagem de negócio. *(resposta: `e^0.405 ≈ 1.5`, aumenta as odds em 50%)*
3. Explique por que padronizar features é obrigatório com regularização mas opcional sem ela.
4. Você tem 50 features, 30 delas altamente correlacionadas entre si. Ridge ou Lasso? Justifique.
5. Prove que `σ(−z) = 1 − σ(z)`.

**💻 Código**

1. **Implemente regressão logística do zero** em NumPy: sigmoide, log-loss, gradiente, gradiente descendente. Valide contra o sklearn no mesmo dataset — os coeficientes devem bater com 3 casas decimais.
2. Ajuste Ridge com `alpha` variando em escala log e plote os coeficientes vs `alpha` (caminho de regularização). Faça o mesmo com Lasso. Compare os dois gráficos: você vai ver os coeficientes do Lasso batendo em zero exato.
3. Crie um dataset com multicolinearidade proposital (duas features quase idênticas). Ajuste regressão linear simples e observe os coeficientes. Depois ajuste Ridge. Documente a estabilização.
4. Treine uma logística e extraia os odds ratios ordenados. Escreva um parágrafo interpretando os 5 maiores, como se fosse pro seu PM.

---

# MÓDULO 7 — Modelos baseados em árvores (5 semanas)

Este é o módulo mais importante para dados tabulares. Em problemas de negócio com tabelas, gradient boosting continua sendo o estado da arte.

## 7.1 Árvore de decisão

**Nível alvo: N5**

Uma árvore particiona o espaço de features recursivamente, escolhendo a cada nó a divisão que mais reduz a impureza.

**Critérios de impureza:**

```
Gini:     G = 1 − Σ pₖ²
Entropia: H = − Σ pₖ · log₂(pₖ)
MSE:      para regressão, variância do nó
```

### Exemplo numérico completo de um split

Nó com 10 amostras: 6 positivas, 4 negativas.

```
Gini do pai     = 1 − (0.6² + 0.4²) = 1 − (0.36 + 0.16) = 0.48
Entropia do pai = −0.6·log₂(0.6) − 0.4·log₂(0.4)
                = −0.6·(−0.737) − 0.4·(−1.322)
                = 0.442 + 0.529 = 0.971
```

Candidato a split: `feature_x < 5`, que separa em:
- **Esquerda:** 4 amostras, todas positivas
- **Direita:** 6 amostras, 2 positivas e 4 negativas

```
Gini esquerda = 1 − (1.0² + 0.0²) = 0                    ← nó puro
Gini direita  = 1 − ((2/6)² + (4/6)²)
              = 1 − (0.111 + 0.444) = 0.444

Gini ponderado = (4/10)(0) + (6/10)(0.444) = 0.267

Ganho = 0.48 − 0.267 = 0.213
```

O algoritmo testa **todos** os splits possíveis em **todas** as features e escolhe o de maior ganho. Depois repete recursivamente. Isso é o CART inteiro.

**Hiperparâmetros e o que fazem:**

| Parâmetro | Efeito | Valor típico |
|---|---|---|
| `max_depth` | Profundidade máxima. Controle nº 1 de overfitting. | 3–10 |
| `min_samples_split` | Mínimo de amostras para tentar dividir | 20–100 |
| `min_samples_leaf` | Mínimo de amostras numa folha | 10–50 |
| `max_features` | Features consideradas por split | `'sqrt'` para floresta |
| `ccp_alpha` | Poda por complexidade de custo | via CV |

**Vantagens:** interpretável, não precisa de escalonamento, lida com não-linearidade e interação automaticamente, aceita features categóricas e numéricas juntas.

**Desvantagens:** instável (mudar poucos dados muda a árvore inteira), overfitting fácil, não extrapola fora do intervalo de treino, fronteiras de decisão sempre paralelas aos eixos.

## 7.2 Random Forest (bagging)

**Nível alvo: N3**

Duas fontes de aleatoriedade:
1. **Bootstrap** — cada árvore treina numa reamostragem com reposição
2. **Subamostragem de features** — cada split considera só um subconjunto aleatório de features

A predição é a média (regressão) ou voto (classificação) de todas as árvores.

**Por que funciona:** árvores individuais têm viés baixo e variância alta. Promediar `T` modelos com correlação `ρ` reduz a variância para aproximadamente:

```
ρσ² + (1−ρ)σ²/T
```

Quanto **menos correlacionadas** as árvores, maior a redução. É exatamente por isso que a subamostragem de features existe: ela força as árvores a serem diferentes umas das outras.

**OOB (out-of-bag):** cada árvore não viu ~37% das amostras (as que ficaram de fora do bootstrap). Isso dá uma estimativa de validação **grátis**, sem separar dados. `oob_score=True`.

> Por que 37%? A probabilidade de uma amostra não ser escolhida em `n` sorteios com reposição é `(1 − 1/n)ⁿ → 1/e ≈ 0.368`.

⚠️ **Armadilha crítica — importância de features:** o `feature_importances_` padrão (baseado em impureza) é **enviesado** em favor de features de alta cardinalidade e contínuas. Não confie nele para tomar decisão. Use **permutation importance** ou **SHAP**. Esta é uma das armadilhas mais comuns e menos conhecidas do sklearn, e apontar isso numa revisão de código já te posiciona.

## 7.3 Gradient Boosting

**Nível alvo: N4 (a mecânica) e N2 (o código)**

Boosting é o oposto conceitual de bagging: em vez de treinar modelos independentes em paralelo, você treina **sequencialmente**, cada modelo corrigindo o erro do anterior.

**O algoritmo, em pseudocódigo:**

```
F₀(x) = valor inicial (média de y, para regressão)

para m = 1 até M:
    rᵢ = −∂L(yᵢ, F(xᵢ))/∂F(xᵢ)     ← pseudo-resíduos (gradiente negativo)
    treine uma árvore hₘ para prever rᵢ
    Fₘ(x) = Fₘ₋₁(x) + ν · hₘ(x)     ← ν = learning rate (shrinkage)
```

Para MSE, o gradiente negativo é simplesmente o resíduo `y − ŷ`. É por isso que a explicação popular "boosting ajusta os resíduos" está certa nesse caso e é uma simplificação nos outros.

### Exemplo numérico

```
y = [10, 20, 30]

F₀ = média = 20                → predições: [20, 20, 20]
resíduos                        = [−10, 0, 10]

Árvore 1 ajusta os resíduos e prevê h₁ = [−8, 0, 8]
Com ν = 0.1:
F₁ = [20, 20, 20] + 0.1·[−8, 0, 8] = [19.2, 20.0, 20.8]

novos resíduos = [−9.2, 0, 9.2]     ← caíram pouco, de propósito
```

**O papel do learning rate:** com `ν = 0.1`, cada árvore corrige apenas 10% do erro. Isso torna o aprendizado lento e **muito mais robusto**. É o mesmo princípio da regularização: passos pequenos generalizam melhor.

**A relação fundamental de tuning:**
```
learning_rate ↓  ⟹  n_estimators ↑
```
Elas são inversamente proporcionais. A prática padrão: fixe `learning_rate` baixo (0.01–0.05) e use **early stopping** para descobrir o `n_estimators` ideal.

### XGBoost e LightGBM — hiperparâmetros que importam

| Parâmetro | O que controla | Faixa típica |
|---|---|---|
| `learning_rate` / `eta` | Tamanho do passo | 0.01–0.1 |
| `n_estimators` | Número de árvores | 100–5000, com early stopping |
| `max_depth` | Profundidade | 3–10 |
| `num_leaves` (LGBM) | Folhas por árvore | < 2^max_depth |
| `min_child_weight` | Peso mínimo numa folha | 1–20 |
| `subsample` | Fração de linhas por árvore | 0.6–1.0 |
| `colsample_bytree` | Fração de features por árvore | 0.6–1.0 |
| `reg_alpha` / `reg_lambda` | Regularização L1 / L2 | 0–10 |
| `scale_pos_weight` | Desbalanceamento | `n_neg / n_pos` |

**Ordem prática de tuning:**
1. Fixe `learning_rate = 0.05`, use early stopping para achar `n_estimators`
2. Ajuste `max_depth` e `min_child_weight` (capacidade)
3. Ajuste `subsample` e `colsample_bytree` (aleatorização)
4. Ajuste `reg_alpha` e `reg_lambda` (regularização)
5. Reduza `learning_rate` para 0.01 e aumente `n_estimators` proporcionalmente

**XGBoost vs LightGBM:**

| | XGBoost | LightGBM |
|---|---|---|
| Crescimento da árvore | Por nível (level-wise) | Por folha (leaf-wise) |
| Velocidade | Mais lento | Mais rápido, especialmente com muitas linhas |
| Overfitting | Mais resistente por padrão | Mais propenso; controle com `num_leaves` |
| Categóricas nativas | Suporte mais recente | Suporte maduro |

Na dúvida, comece com LightGBM por velocidade de iteração.

## 7.4 Recursos

| Recurso | Link |
|---|---|
| MLU-Explain: Decision Trees e Random Forest (interativos) | https://mlu-explain.github.io/ |
| StatQuest: Gradient Boost Parts 1–4 (a melhor explicação existente) | https://www.youtube.com/@statquest |
| Documentação XGBoost — Introduction to Boosted Trees | https://xgboost.readthedocs.io/en/stable/tutorials/model.html |
| LightGBM — parameter tuning | https://lightgbm.readthedocs.io/en/latest/Parameters-Tuning.html |
| scikit-learn: permutation importance | https://scikit-learn.org/stable/modules/permutation_importance.html |
| ISLP, cap. 8 | https://www.statlearning.com/ |

## 7.5 Exercícios

**✍️ Papel**

1. Nó com 20 amostras, 15 positivas. Calcule Gini e entropia. *(resposta: 0.375 e 0.811)*
2. Calcule o ganho de Gini de um split que produz [8 pos, 0 neg] e [7 pos, 5 neg]. *(resposta: pai 0.375; ponderado ≈ 0.243; ganho ≈ 0.132)*
3. Prove que a probabilidade de uma amostra ficar fora do bootstrap tende a `1/e`.
4. Explique em 4 frases por que Random Forest reduz variância mas não viés, e por que boosting reduz viés mas pode aumentar variância.
5. Um colega diz que `feature_importances_` do Random Forest mostra que a feature `user_id` é a mais importante. Explique o que aconteceu.

**💻 Código**

1. **Implemente uma árvore de decisão do zero:** função de Gini, busca do melhor split, construção recursiva, predição. Limite por `max_depth`. Compare a acurácia com `DecisionTreeClassifier`.
2. Implemente Random Forest reusando sua árvore: bootstrap + subamostragem de features + voto. Compare com sklearn.
3. Implemente gradient boosting simples para regressão com `DecisionTreeRegressor(max_depth=2)` como aprendiz base. Plote a perda vs número de árvores para `ν ∈ {0.01, 0.1, 0.5, 1.0}`.
4. Num dataset real, compare: `feature_importances_` vs `permutation_importance` vs SHAP. Documente as divergências no ranking. Isso vira uma apresentação interna direto.
5. Rode uma busca de hiperparâmetros no LightGBM seguindo a ordem de tuning descrita acima. Registre cada experimento no MLflow.

---

# MÓDULO 8 — Outros supervisionados (2 semanas)

Módulo curto de propósito. São algoritmos que você precisa conhecer, mas não dominar.

| Algoritmo | Nível | O essencial |
|---|---|---|
| **k-NN** | **N5** | Sem treino; classifica pela maioria dos `k` vizinhos. Escolha de `k` (par vs ímpar), métrica de distância, **obrigatório escalonar**, degrada em alta dimensão. Conceitualmente importante: é a base de busca vetorial. |
| **Naive Bayes** | N3 | Bayes com a suposição (falsa mas útil) de independência entre features. Muito rápido, baseline decente para texto. |
| **SVM** | N3 | Maximiza a margem entre classes. Truque do kernel para não-linearidade (RBF). Hoje: pouco usado em tabular, mas conceito de margem vale. `C` e `gamma` são os hiperparâmetros. Não escala bem acima de ~50k linhas. |
| **Modelos lineares generalizados (GLM)** | N2 | Regressão de Poisson para contagem, Gamma para valores positivos assimétricos. Útil quando MSE não é a suposição certa. |
| **Modelos de sobrevivência** | N1 | Cox, Kaplan-Meier. Só saiba que existem e servem para "tempo até evento". |

**Recursos:** ISLP cap. 4 e 9; scikit-learn https://scikit-learn.org/stable/modules/neighbors.html e https://scikit-learn.org/stable/modules/svm.html

**💻 Exercício:** implemente k-NN do zero, com escolha de métrica (euclidiana e cosseno) parametrizável. Meça o tempo de predição com 10, 100 e 1000 features e demonstre empiricamente a maldição da dimensionalidade.

---

# MÓDULO 9 — Aprendizado não supervisionado (3 semanas)

## 9.1 k-means

**Nível alvo: N5**

```
1. Escolha k centroides iniciais (use k-means++, não aleatório)
2. Atribua cada ponto ao centroide mais próximo
3. Recalcule cada centroide como a média dos seus pontos
4. Repita 2–3 até estabilizar
```

Minimiza a inércia (soma dos quadrados intra-cluster):
```
J = Σₖ Σ_{x ∈ Cₖ} ||x − μₖ||²
```

**Limitações que você precisa saber:** assume clusters esféricos e de tamanho similar; sensível à inicialização (por isso `n_init`); precisa de `k` definido a priori; sensível a outliers; **exige escalonamento**.

**Escolha de k:** método do cotovelo (inércia vs k) e **silhouette score** (melhor, porque tem interpretação absoluta: varia de −1 a 1, acima de 0.5 é razoável).

## 9.2 Outros métodos de clustering

| Método | Nível | Quando |
|---|---|---|
| **DBSCAN** | N3 | Clusters de forma arbitrária, detecta outliers automaticamente, não precisa de `k`. Parâmetros: `eps` e `min_samples`. |
| **Hierárquico** | N2 | Quando você quer um dendrograma e não sabe `k` |
| **Gaussian Mixture** | N2 | Clustering probabilístico (atribuição suave em vez de rígida) |

## 9.3 PCA

**Nível alvo: N4**

```
1. Centralize os dados (subtraia a média)  ← e padronize, se as escalas diferem
2. Calcule a matriz de covariância C = (1/n) XᵀX
3. Calcule autovalores e autovetores de C
4. Ordene por autovalor decrescente
5. Projete nos primeiros p autovetores
```

Cada autovetor é uma **componente principal** — uma direção de máxima variância. O autovalor correspondente é a variância capturada.

```
Razão de variância explicada = λᵢ / Σλⱼ
```

**Regra prática:** escolha `p` tal que a variância explicada acumulada chegue a 90–95%. Plote o scree plot.

**Cuidados:** PCA é linear; destrói interpretabilidade (as componentes não têm significado de negócio); **exige padronização** se as features têm escalas diferentes; é sensível a outliers.

**Não confunda:** PCA é para redução de dimensionalidade e compressão. t-SNE e UMAP são para **visualização apenas** — as distâncias globais no gráfico não são confiáveis, e usar t-SNE como preprocessing para um modelo é um erro comum.

## 9.4 Detecção de anomalia

**Nível alvo: N3** — e relevante direto para o seu trabalho com observabilidade.

| Método | Ideia |
|---|---|
| **Z-score / IQR** | Estatístico simples, univariado |
| **Isolation Forest** | Anomalias são isoladas com poucos splits aleatórios. Rápido, escala bem. |
| **Local Outlier Factor** | Compara densidade local do ponto com a dos vizinhos |
| **One-Class SVM** | Aprende a fronteira do "normal" |

**Conexão com o seu contexto:** detecção de anomalia em séries de métricas (latência, taxa de erro, throughput) é uma aplicação natural de ML sobre a infraestrutura de observabilidade que você já mantém. É um projeto de alto valor e baixo risco político — se o modelo errar, o pior caso é um alerta a mais.

## 9.5 Recursos

| Recurso | Link |
|---|---|
| StatQuest: PCA passo a passo | https://www.youtube.com/@statquest |
| scikit-learn: clustering (comparação visual excelente) | https://scikit-learn.org/stable/modules/clustering.html |
| scikit-learn: outlier detection | https://scikit-learn.org/stable/modules/outlier_detection.html |
| ISLP, cap. 12 | https://www.statlearning.com/ |
| Distill: How to Use t-SNE Effectively | https://distill.pub/2016/misread-tsne/ |

## 9.6 Exercícios

**✍️ Papel**

1. Faça uma iteração de k-means à mão com `k=2` e os pontos `[1, 2, 8, 9]` em 1D, com centroides iniciais `c₁=1` e `c₂=2`. Mostre a atribuição e os novos centroides.
2. Calcule a matriz de covariância 2×2 do dataset `[(1,2), (3,4), (5,7)]` à mão.
3. Explique por que k-means falha em clusters em forma de lua crescente e qual método usar no lugar.
4. Por que PCA exige padronização quando as features têm unidades diferentes? *(dica: pense numa feature em reais e outra em anos)*

**💻 Código**

1. Implemente k-means do zero, com k-means++ para inicialização. Compare com sklearn.
2. Implemente PCA do zero via `np.linalg.eig` sobre a matriz de covariância. Compare com `sklearn.decomposition.PCA` — os autovetores podem ter sinal invertido, o que é normal.
3. Gere dados em forma de dois crescentes (`make_moons`). Aplique k-means e DBSCAN. Visualize a diferença.
4. **Projeto aplicado:** pegue uma série real de latência do seu serviço, aplique Isolation Forest e compare os pontos marcados com os incidentes que você já conhece. Meça precisão e recall contra o histórico do PagerDuty.

---

# MÓDULO 10 — Métricas e avaliação (3 semanas)

Módulo curto em conteúdo e enorme em impacto. Escolher a métrica errada é o erro mais caro em ML aplicado, porque contamina todas as decisões subsequentes.

## 10.1 Classificação

### A matriz de confusão

```
                    Previsto
                 Pos      Neg
Real  Pos  |    TP   |   FN   |   ← FN = você deixou passar
      Neg  |    FP   |   TN   |   ← FP = alarme falso
```

### Exemplo trabalhado

Detector de spam. 1000 e-mails, 50 são spam. O modelo marca 60, dos quais 45 são realmente spam.

```
TP = 45      FP = 15
FN =  5      TN = 935

Acurácia  = (45 + 935) / 1000 = 0.980
Precisão  = TP/(TP+FP) = 45/60 = 0.750
Recall    = TP/(TP+FN) = 45/50 = 0.900
F1        = 2·(0.75·0.90)/(0.75+0.90) = 1.35/1.65 = 0.818
```

**O detalhe que importa:** um modelo que marca **tudo como não-spam** tem acurácia de 95% e recall de 0. Ele é inútil e parece bom. É por isso que acurácia é quase sempre a métrica errada.

### Quando usar cada métrica

| Métrica | Fórmula | Use quando |
|---|---|---|
| **Precisão** | TP/(TP+FP) | Falso positivo é caro (bloquear conta legítima, spam na caixa principal) |
| **Recall** | TP/(TP+FN) | Falso negativo é caro (não detectar fraude, não detectar doença) |
| **F1** | média harmônica | Precisa de um número só e as duas importam igualmente |
| **Fβ** | com β>1 pesa recall | Quando você sabe a razão de custo entre os erros |
| **AUC-ROC** | área sob TPR×FPR | Comparar capacidade de **ordenação**; ruim com desbalanceamento severo |
| **PR-AUC** | área sob precisão×recall | Classe positiva rara. **Sempre prefira a ROC nesse caso.** |
| **Log Loss** | ver Módulo 3 | Você precisa de **probabilidades** calibradas, não só de ordenação |
| **Brier Score** | MSE das probabilidades | Alternativa ao log loss, menos sensível a extremos |

**Por que AUC-ROC engana com desbalanceamento:** a taxa de falso positivo tem no denominador o total de negativos. Se você tem 1.000.000 de negativos e 1.000 positivos, adicionar 1.000 falsos positivos muda a FPR em 0.1% (quase nada no gráfico) mas destrói a precisão, caindo de 100% para 50%. A curva ROC simplesmente não mostra esse dano. A curva PR mostra.

### Threshold: a decisão mais subestimada

Modelos produzem **probabilidades**. A conversão em decisão binária é uma escolha de negócio, não do modelo. O padrão de 0.5 quase nunca é ótimo.

Como escolher direito:
1. Estime o custo de FP e o custo de FN em unidade de negócio (R$, tempo, risco)
2. Para cada threshold candidato, calcule o custo esperado total
3. Escolha o mínimo

Se você não consegue estimar os custos, pelo menos plote precisão e recall vs threshold e escolha com o time do produto olhando junto.

### Calibração

Um modelo está calibrado se, entre todos os casos onde ele diz 0.7, aproximadamente 70% realmente acontecem.

- **Importa muito** quando a probabilidade alimenta uma decisão econômica (preço, limite de crédito, lance em leilão de anúncio)
- **Não importa** se você só usa a ordenação (ranking)

Diagnóstico: **curva de calibração** (reliability diagram). Correção: `CalibratedClassifierCV` com Platt scaling (sigmoide) ou isotônica.

⚠️ Boosting e SVM produzem scores **mal calibrados** por padrão. Regressão logística já sai calibrada, por construção. Esse é um argumento subestimado a favor da logística quando a probabilidade importa.

## 10.2 Regressão

| Métrica | Característica |
|---|---|
| **MAE** | Erro médio absoluto. Robusto a outliers. Mesma unidade do alvo. |
| **RMSE** | Penaliza erros grandes quadraticamente. Sensível a outliers. |
| **MAPE** | Percentual. ⚠️ Explode quando `y` é próximo de zero. Assimétrica. |
| **R²** | Fração da variância explicada. Cuidado: pode ser negativo, e sempre sobe ao adicionar features (use R² ajustado). |
| **Quantile loss** | Quando você quer prever um percentil, não a média |

**Escolha prática:** se erros grandes são desproporcionalmente ruins, RMSE. Se todos os erros pesam igual, MAE.

## 10.3 Ranking

Relevante direto se o modelo online do seu time ordena resultados.

**NDCG (Normalized Discounted Cumulative Gain):**

```
DCG@k = Σᵢ₌₁ᵏ relᵢ / log₂(i + 1)
NDCG@k = DCG@k / IDCG@k
```

**Exemplo:** relevâncias dos 3 primeiros resultados: `[3, 1, 2]`

```
DCG  = 3/log₂(2) + 1/log₂(3) + 2/log₂(4)
     = 3/1.000 + 1/1.585 + 2/2.000
     = 3.000 + 0.631 + 1.000 = 4.631

Ordenação ideal seria [3, 2, 1]:
IDCG = 3/1.000 + 2/1.585 + 1/2.000
     = 3.000 + 1.262 + 0.500 = 4.762

NDCG = 4.631 / 4.762 = 0.972
```

O desconto logarítmico codifica a intuição de que a posição 1 vale muito mais que a posição 10.

| Métrica | Use quando |
|---|---|
| **NDCG@k** | Relevância graduada (0 a 5) |
| **MRR** | Só existe um resultado certo; mede a posição dele |
| **MAP** | Vários relevantes, relevância binária |
| **Recall@k** | Estágio de recuperação de candidatos |

## 10.4 Recursos

| Recurso | Link |
|---|---|
| MLU-Explain: Precision & Recall, ROC & AUC (interativos) | https://mlu-explain.github.io/ |
| scikit-learn: model evaluation (referência completa) | https://scikit-learn.org/stable/modules/model_evaluation.html |
| scikit-learn: calibração de probabilidade | https://scikit-learn.org/stable/modules/calibration.html |
| Google MLCC: Classification e métricas | https://developers.google.com/machine-learning/crash-course/classification |

## 10.5 Exercícios

**✍️ Papel**

1. Um modelo tem TP=80, FP=120, FN=20, TN=9780. Calcule acurácia, precisão, recall, F1. Diga se você colocaria em produção e o que precisaria saber antes. *(resposta: 0.986, 0.400, 0.800, 0.533)*
2. FP custa R$ 5 (revisão manual) e FN custa R$ 500 (fraude não detectada). Com a matriz acima, calcule o custo total. Depois calcule para um threshold mais agressivo que gera TP=95, FP=400, FN=5. Qual é melhor? *(custo A: 120×5 + 20×500 = R$ 10.600; custo B: 400×5 + 5×500 = R$ 4.500 → B)*
3. Calcule NDCG@3 para as relevâncias `[2, 3, 0]`. *(DCG = 2 + 1.893 + 0 = 3.893; IDCG = 3 + 1.262 + 0 = 4.262; NDCG ≈ 0.913)*
4. Explique em 5 frases por que AUC-ROC engana num problema com 0.1% de positivos.

**💻 Código**

1. Implemente do zero: `precision`, `recall`, `f1`, `confusion_matrix`, `roc_auc_score`. Valide contra sklearn.
2. Implemente `ndcg_at_k(relevancias, k)` do zero.
3. Treine um modelo num dataset desbalanceado (1% positivos). Plote curva ROC e curva PR lado a lado. Documente o quanto elas contam histórias diferentes.
4. Implemente uma função `optimal_threshold(y_true, y_prob, cost_fp, cost_fn)` que varre thresholds e retorna o de custo mínimo, junto com o gráfico de custo vs threshold.
5. Treine LightGBM e regressão logística no mesmo dataset. Plote as curvas de calibração das duas. Depois aplique `CalibratedClassifierCV` no LightGBM e replote.

---

# MÓDULO 11 — Feature engineering (3 semanas)

Em ML tabular, feature engineering costuma dar mais ganho que troca de algoritmo. E é a área onde seu trabalho atual já toca diretamente.

## 11.1 Variáveis numéricas

| Técnica | Fórmula | Quando |
|---|---|---|
| **Padronização** | `(x − μ)/σ` | Padrão para modelos lineares, kNN, SVM, PCA |
| **Min-Max** | `(x − min)/(max − min)` | Quando você precisa de faixa limitada |
| **Robust scaling** | `(x − mediana)/IQR` | Presença de outliers |
| **Log** | `log(1 + x)` | Distribuição assimétrica à direita (valores, contagens) |
| **Binning** | discretização | Capturar não-linearidade em modelo linear |
| **Clipping** | winsorização em percentis | Limitar influência de outliers |

⚠️ Árvores **não precisam** de escalonamento. Modelos lineares, kNN, SVM e PCA **precisam**.

## 11.2 Variáveis categóricas

| Técnica | Como | Cuidado |
|---|---|---|
| **One-hot** | Uma coluna binária por categoria | Explode com alta cardinalidade |
| **Ordinal** | Mapeia para inteiros | ⚠️ Só use se houver ordem real |
| **Target encoding** | Substitui pela média do alvo naquela categoria | ⚠️ **Vaza se feito errado** |
| **Frequency encoding** | Substitui pela frequência da categoria | Simples e surpreendentemente eficaz |
| **Hashing trick** | Hash para `k` buckets fixos | Cardinalidade ilimitada, colisões aceitáveis |
| **Categórica nativa** | LightGBM e CatBoost suportam direto | Geralmente a melhor opção hoje |

### Target encoding com suavização

O problema: uma categoria com 2 amostras tem média de alvo baseada em ruído puro. A solução é puxar em direção à média global, proporcionalmente à escassez de dados:

```
encoded = (n_cat · média_cat + m · média_global) / (n_cat + m)
```

**Exemplo:** categoria com 5 amostras, média local de 0.8; média global 0.2; `m = 10`:

```
encoded = (5 × 0.8 + 10 × 0.2) / (5 + 10)
        = (4.0 + 2.0) / 15
        = 0.400
```

A média local era 0.8, mas com só 5 amostras a estimativa é frágil, então o valor final é puxado para 0.4.

⚠️ **Regra inviolável:** target encoding deve ser calculado **dentro de cada fold da validação cruzada**, usando somente os dados de treino daquele fold. Calcular no dataset inteiro é target leakage direto, e é o erro mais comum com essa técnica.

## 11.3 Valores faltantes

| Estratégia | Quando |
|---|---|
| Remover linhas | Poucas linhas afetadas, faltante aleatório |
| Remover coluna | >50% faltante e sem sinal |
| Média / mediana | Numérica, faltante aleatório |
| Moda | Categórica |
| Constante ("Desconhecido") | Categórica, e o fato de faltar tem significado |
| **Indicador de faltante** | **Quase sempre.** Adicione `col_is_missing` como feature binária. |
| Imputação por modelo (KNN, MICE) | Faltante estruturado, e você tem tempo |
| Deixar como está | XGBoost e LightGBM lidam com `NaN` nativamente |

**A pergunta que importa:** *por que* o dado está faltando? Se falta porque o usuário não preencheu, o fato de faltar é sinal. Se falta por bug de coleta, é ruído. São situações completamente diferentes, com tratamentos diferentes. Essa é uma pergunta de domínio, não de estatística.

## 11.4 Features temporais

Se há timestamp, extraia:
- Componentes cíclicos: hora, dia da semana, mês, feriado
- **Encoding cíclico:** hora 23 e hora 0 são adjacentes, mas `|23 − 0| = 23`. Corrija com `sin(2πh/24)` e `cos(2πh/24)`.
- Tempo desde o último evento
- Features de janela: contagem/média/desvio nos últimos 1, 7, 30 dias
- Tendência: razão entre janela curta e janela longa

⚠️⚠️ **Point-in-time correctness:** toda feature agregada tem que ser calculada usando **apenas dados anteriores ao instante da predição**. Se você calcula "média de compras do usuário" com o dataset inteiro e aplica a um exemplo de 6 meses atrás, você acabou de colocar o futuro dentro do passado. O modelo vai parecer excelente offline e falhar em produção.

Este é o conceito mais importante da interseção entre o seu trabalho atual e ML. Vale N4 e voltamos a ele no Módulo 13.

## 11.5 Seleção de features

| Método | Tipo | Custo |
|---|---|---|
| Correlação, qui-quadrado, mutual information | Filtro | Barato, ignora interações |
| RFE (Recursive Feature Elimination) | Wrapper | Caro, mais preciso |
| Coeficientes do Lasso | Embutido | Grátis, só linear |
| Permutation importance | Pós-hoc | Médio, confiável |
| SHAP | Pós-hoc | Caro, o mais informativo |

**Por que remover features:** menos latência de inferência, menos features para manter no pipeline, menos superfície de falha em produção, menos overfitting. Numa arquitetura onde cada feature é uma chamada a um store, cada feature removida é latência e custo economizados de verdade.

## 11.6 Recursos

| Recurso | Link |
|---|---|
| Kaggle Learn: Feature Engineering (curso gratuito, prático) | https://www.kaggle.com/learn/feature-engineering |
| scikit-learn: preprocessing | https://scikit-learn.org/stable/modules/preprocessing.html |
| Feature Engineering for Machine Learning (Zheng & Casari) | livro — O'Reilly |
| Feature-engine (biblioteca) | https://feature-engine.trainindata.com/ |

## 11.7 Exercícios

**✍️ Papel**

1. Calcule o target encoding suavizado de uma categoria com 3 amostras, média local 0.9, média global 0.15, `m = 20`. *(resposta: `(3×0.9 + 20×0.15)/23 = (2.7+3.0)/23 ≈ 0.248`)*
2. Escreva o encoding cíclico de "dia da semana" e explique por que ele é melhor que ordinal para um modelo linear.
3. Liste 5 features que você poderia criar a partir dos dados que o seu time já produz hoje, e para cada uma diga qual o risco de point-in-time.
4. Uma feature tem 40% de valores faltantes e ainda assim melhora o modelo. Dê duas explicações possíveis.

**💻 Código**

1. Implemente `TargetEncoder` como transformer do sklearn (`fit`/`transform`), com suavização, e garanta que funcione corretamente dentro de `cross_val_score`.
2. Demonstre o leakage: aplique target encoding no dataset inteiro, meça AUC via CV. Depois faça certo dentro do pipeline. Documente a diferença — vai ser grande.
3. Construa um dataset temporal e crie features de janela de 7 e 30 dias **com point-in-time correto**. Depois crie a versão errada (usando o dataset inteiro). Compare AUC em validação temporal. Escreva o resultado — esse é material de apresentação para o seu time.
4. Compare 5 encodings de categórica (one-hot, ordinal, target, frequency, nativo do LightGBM) num dataset com cardinalidade alta. Tabele AUC, tempo de treino e número de colunas resultantes.

---

# MÓDULO 12 — Workflow e interpretabilidade (2 semanas)

## 12.1 O workflow correto

```
1. Definir a métrica de negócio        ← antes de qualquer código
2. Definir a métrica offline proxy     ← e verificar se correlaciona com a de negócio
3. Montar o split de validação         ← imitando produção
4. Baseline burro                      ← média, classe majoritária, ou heurística existente
5. Modelo linear simples
6. Análise de erro
7. Feature engineering
8. Modelo mais complexo (boosting)
9. Tuning de hiperparâmetro
10. Calibração, se necessário
11. Escolha de threshold com o time de produto
12. Teste em shadow / A/B
```

**Passos 1 a 4 valem mais que 5 a 11.** Um baseline bem construído com métrica certa vence um modelo sofisticado com métrica errada, sempre.

**Regra #1 do Google:** não tenha medo de lançar um produto sem ML. Uma heurística boa te leva a 50% do ganho com 5% do esforço, e serve de baseline honesto para provar que o ML acrescenta algo.

## 12.2 Análise de erro

A atividade de maior retorno em todo o ciclo, e a mais negligenciada.

1. Separe os casos onde o modelo errou mais
2. Agrupe manualmente por padrão: segmento, faixa de valor, período, tipo de usuário
3. Quantifique cada grupo
4. Pergunte, para cada um: falta feature? há ruído no rótulo? é um subproblema distinto?
5. Priorize o maior grupo

Uma hora de análise de erro costuma render mais que uma semana de tuning de hiperparâmetro.

## 12.3 Tuning de hiperparâmetro

| Método | Quando |
|---|---|
| Grid Search | Poucos parâmetros, espaço pequeno |
| **Random Search** | Padrão. Comprovadamente melhor que grid com o mesmo orçamento. |
| Otimização bayesiana (Optuna) | Treino caro, muitos parâmetros |
| Successive Halving | Orçamento limitado, muitas configurações |

**Por que random vence grid:** normalmente só 2 ou 3 hiperparâmetros importam de verdade. Grid search desperdiça avaliações variando parâmetros irrelevantes em todas as combinações; random search explora mais valores distintos dos parâmetros que importam.

Optuna: https://optuna.org/

## 12.4 Desbalanceamento de classes

| Estratégia | Observação |
|---|---|
| `class_weight='balanced'` | Primeira tentativa. Simples e frequentemente suficiente. |
| `scale_pos_weight` (XGB/LGBM) | Equivalente para boosting |
| Undersampling da majoritária | Perde informação, mas acelera treino |
| Oversampling da minoritária | Risco de overfitting |
| SMOTE | Gera exemplos sintéticos. ⚠️ Superestimado; funciona pior do que a fama sugere, e **nunca** aplique antes do split |
| Ajustar o threshold | **Frequentemente a melhor solução, e a mais simples** |

Antes de reamostrar qualquer coisa, tente só mexer no threshold. Muita gente pula direto para SMOTE e resolve com complexidade um problema de decisão.

## 12.5 Interpretabilidade

| Ferramenta | O que dá |
|---|---|
| Coeficientes lineares | Interpretação global exata (em modelo linear) |
| Permutation importance | Importância global confiável |
| **SHAP** | Contribuição **por predição** e agregável para visão global. Padrão da indústria. |
| Partial Dependence Plot | Efeito marginal de uma feature |
| ICE plots | Como o efeito varia por indivíduo |
| LIME | Explicação local por aproximação. Menos usado que SHAP hoje. |

**SHAP** vale N3. Ele decompõe cada predição na contribuição de cada feature, com base em valores de Shapley da teoria dos jogos. Na prática: você consegue responder "por que este usuário específico recebeu score 0.83?", que é a pergunta que auditoria, suporte e produto sempre fazem.

Docs: https://shap.readthedocs.io/
Livro gratuito: https://christophm.github.io/interpretable-ml-book/

## 12.6 Rastreamento de experimentos

Se você não registra, você não sabe o que já tentou. Use MLflow (https://mlflow.org/) ou Weights & Biases.

Registre sempre: hash dos dados, seed, hiperparâmetros, métricas em todos os folds, versão do código, tempo de treino, ambiente.

## 12.7 Exercícios

**💻 Código**

1. Monte um `Pipeline` completo: imputação → encoding → escalonamento → modelo, e rode `cross_val_score`. Verifique que nada vaza.
2. Compare Grid Search vs Random Search vs Optuna com o **mesmo orçamento de tempo**. Tabele o melhor resultado de cada um.
3. Rode SHAP num modelo LightGBM. Gere o summary plot e o waterfall de 3 predições individuais. Escreva a explicação de cada uma em linguagem de negócio.
4. Faça uma análise de erro estruturada: separe o pior decil de predições, agrupe por segmento, e escreva um documento de uma página com as três hipóteses mais prováveis e o que testar em seguida.

---

# MÓDULO 13 — ML em produção (6 semanas)

Aqui seu background de backend vira vantagem direta. Este módulo é onde você se diferencia.

## 13.1 A base conceitual

**Leitura obrigatória, antes de qualquer coisa:**
📌 **Rules of Machine Learning — Martin Zinkevich (Google)**
https://developers.google.com/machine-learning/guides/rules-of-ml

43 regras, ~1h de leitura, escrito por quem operou ML em escala no Google. É o melhor custo-benefício de todo este plano. Leia inteiro, depois releia a cada 6 meses.

**Paper fundamental:**
📌 *Hidden Technical Debt in Machine Learning Systems* (Sculley et al., Google, NeurIPS 2015)
https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

## 13.2 Features em produção

### Point-in-time correctness — de novo, porque é o que mais importa

Ao montar um dataset de treino, cada linha precisa conter o valor que a feature tinha **no instante em que a predição teria sido feita** — não o valor de hoje.

```
❌ ERRADO
   SELECT user_id, AVG(valor) AS media_compras
   FROM compras GROUP BY user_id
   → junta com eventos históricos

✅ CERTO
   Para cada evento no instante t, calcular a média usando
   somente compras com timestamp < t
```

Errar isso produz um modelo que parece ótimo na validação e falha na produção — e o pior é que a falha é silenciosa e demora semanas para ser diagnosticada.

### Training-serving skew

A feature calculada no pipeline de treino (batch, Spark/SQL) difere da calculada no serving (online, Java). Causas comuns:
- Duas implementações independentes da mesma lógica que divergem
- Timezone diferente entre os dois caminhos
- Tratamento de nulo diferente
- Arredondamento e tipo numérico diferentes
- Ordem de operações diferente em agregações

**Mitigações, em ordem de robustez:**
1. Uma única implementação compartilhada entre treino e serving (ideal)
2. Feature store que serve os dois caminhos a partir da mesma definição
3. **Logging das features no momento do serving**, e usar esses logs como fonte de verdade do treino
4. Testes automatizados que comparam as duas implementações num conjunto fixo de casos

A opção 3 é a mais pragmática e a mais subestimada: se você registra exatamente o vetor de features que o modelo viu em produção, o skew deixa de ser possível por construção.

### Feature store

| Conceito | Descrição |
|---|---|
| Offline store | Histórico completo, para treino. Data warehouse ou data lake. |
| Online store | Baixa latência, para inferência. Redis, Cassandra, DynamoDB. |
| Registry | Definições versionadas das features |
| Materialização | Processo que empurra do offline para o online |
| Freshness | Há quanto tempo o valor foi atualizado |
| TTL | Por quanto tempo o valor continua válido |

Referências: Feast (https://feast.dev/), e a arquitetura do Michelangelo (Uber) — https://www.uber.com/blog/michelangelo-machine-learning-platform/

## 13.3 Serving

| Padrão | Latência | Quando |
|---|---|---|
| Batch prediction | horas | Predições estáveis, consumidas depois (churn, segmentação) |
| Online prediction | ms | Depende de contexto de requisição |
| Streaming | segundos | Reage a eventos em tempo quase real |

**Formatos de modelo para serving:** ONNX (portável, roda em JVM), PMML (legado), Treelite/`m2cgen` (compila árvores para código nativo), ou serviço Python separado.

**Decisão arquitetural que você vai enfrentar:** modelo dentro do serviço Java vs. serviço Python separado.

| | Modelo embarcado (ONNX na JVM) | Serviço Python separado |
|---|---|---|
| Latência | Menor, sem hop de rede | +1 a 5ms |
| Deploy | Acoplado ao serviço | Independente |
| Ecossistema ML | Limitado | Completo |
| Operação | Um sistema a menos | Um sistema a mais |

Não existe resposta certa universal. Existe a resposta certa para o seu SLA.

**Padrões de resiliência que você já conhece, aplicados a ML:**
- Timeout na chamada de features, com fallback para valor padrão
- Circuit breaker no serviço de modelo, com fallback para heurística ou modelo anterior
- Cache de predições para entradas repetidas
- Degradação graciosa: se o modelo cai, o produto continua funcionando com regras simples

Esse último ponto é onde muita equipe de ML falha e onde um engenheiro de backend tem instinto natural. **Todo sistema de ML precisa de um caminho que funcione sem o modelo.**

## 13.4 Monitoramento

Você já domina o ferramental. O que muda são as métricas.

**Camada 1 — Sistema** (o que você já monitora)
`latência p50/p95/p99`, `throughput`, `taxa de erro`, `saturação`

**Camada 2 — Dados**
- Taxa de feature faltante, por feature
- Freshness da feature
- Distribuição de cada feature (média, desvio, percentis)
- Taxa de valor fora do domínio esperado

**Camada 3 — Modelo**
- Distribuição dos scores de saída
- Taxa de predição positiva a um dado threshold
- Drift em relação à janela de baseline

**Camada 4 — Negócio** (com atraso de rótulo)
- Métricas reais: CTR, conversão, taxa de fraude capturada
- Comparação com o grupo de holdout

### Detecção de drift — PSI

**Population Stability Index:**

```
PSI = Σᵢ (atualᵢ% − esperadoᵢ%) · ln(atualᵢ% / esperadoᵢ%)
```

| PSI | Interpretação |
|---|---|
| < 0.10 | Estável |
| 0.10 – 0.25 | Mudança moderada, investigar |
| > 0.25 | Mudança significativa, agir |

Alternativas: teste de Kolmogorov-Smirnov (numérica), qui-quadrado (categórica), distância de Wasserstein.

**Data drift vs concept drift:**
- **Data drift** — `P(X)` mudou. As entradas são diferentes. Detectável imediatamente.
- **Concept drift** — `P(y|X)` mudou. A relação entre entrada e saída mudou. **Só detectável quando os rótulos chegam**, o que pode levar dias ou semanas.

Concept drift é o problema mais perigoso porque é invisível ao monitoramento em tempo real. A defesa é o holdout permanente e a comparação contínua com uma baseline.

**Ferramentas:** Evidently AI (https://www.evidentlyai.com/), ou métricas customizadas no Prometheus, que é o caminho natural dado o seu stack. Um dashboard de saúde de modelo no Grafana usa exatamente o mesmo ferramental de Micrometer que você já opera — a diferença está em quais séries você expõe.

## 13.5 Deploy e experimentação

| Padrão | Descrição |
|---|---|
| **Shadow** | Modelo novo recebe tráfego real, responde para o log, não para o usuário. Zero risco. Sempre comece aqui. |
| **Canary** | 1% → 5% → 25% → 100%, com métricas de guarda em cada etapa |
| **A/B test** | Comparação estatística formal (revise o Módulo 4) |
| **Interleaving** | Para ranking: intercala resultados dos dois modelos numa lista só. Precisa de muito menos tráfego que A/B. |
| **Holdout permanente** | 1% que nunca recebe o modelo. Mede o impacto acumulado ao longo de meses. |

**Métricas offline vs online:** o AUC subir não garante que a conversão sobe. Documente a correlação histórica entre suas métricas offline e online — quando ela existe, você ganha velocidade de iteração; quando não existe, você sabe que precisa testar tudo online.

## 13.6 Ciclo de vida

**Retreino:**
- Por agenda (diário, semanal) — simples, previsível
- Por gatilho de drift — eficiente, mais complexo
- Por degradação de métrica — reativo demais, mas necessário como rede de segurança

**Feedback loop:** o modelo influencia quais dados serão coletados para o próximo modelo. Um recomendador que só mostra itens populares gera dados que reforçam a popularidade. Mitigação: exploração deliberada, randomização de uma fração do tráfego, propensity weighting.

**Custo:** treino, inferência, armazenamento e computação de features. Modele isso explicitamente — features raramente usadas são dívida técnica pura (Regra #28 do Zinkevich).

## 13.7 Recursos

| Recurso | Link |
|---|---|
| 📌 Rules of Machine Learning (Google) | https://developers.google.com/machine-learning/guides/rules-of-ml |
| Hidden Technical Debt in ML Systems | https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html |
| Designing Machine Learning Systems — Chip Huyen | livro, O'Reilly |
| Machine Learning Engineering — Andriy Burkov | http://www.mlebook.com/ |
| Made With ML (curso gratuito de MLOps) | https://madewithml.com/ |
| applied-ml — casos reais de engenharia de empresas | https://github.com/eugeneyan/applied-ml |
| Eugene Yan — blog sobre ML aplicado e recsys | https://eugeneyan.com/ |
| Uber Michelangelo | https://www.uber.com/blog/michelangelo-machine-learning-platform/ |
| Google MLOps: pipelines de entrega contínua | https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning |
| Feast (feature store open source) | https://feast.dev/ |
| Evidently AI (monitoramento e drift) | https://www.evidentlyai.com/ |

## 13.8 Projeto final

Este é o entregável que fecha o plano inteiro. Suba um modelo em produção, mesmo que num ambiente interno:

**Requisitos:**
1. Pipeline de treino reprodutível, com seed fixa e dados versionados
2. Dataset construído com **point-in-time correctness verificável**
3. Validação temporal, não k-fold aleatório
4. Serviço de inferência com SLA de latência declarado
5. Feature lookup online com cache, timeout e fallback
6. **Logging das features servidas**, para eliminar skew por construção
7. Métricas no Prometheus: latência p99, distribuição de scores, taxa de feature ausente, throughput
8. Dashboard no Grafana com as 4 camadas de monitoramento
9. Detecção de drift com PSI, comparando janela móvel vs baseline
10. Deploy em Kubernetes via Helm, com rollout canário
11. Fallback para heurística quando o modelo está indisponível
12. Documento de uma página: como retreinar, como reverter, o que monitorar

**Um projeto assim, documentado, é mais convincente que qualquer certificado.** É a diferença entre "estudei ML" e "opero ML".

---

# ESCALA DE PROFUNDIDADE — TABELA CONSOLIDADA

Referência rápida do que exige que nível.

## N5 — Implementar do zero (7 itens)
Produto escalar e multiplicação de matrizes · Gradiente descendente · Regressão logística com log-loss · Teorema de Bayes · Árvore de decisão com Gini · k-means · k-fold e time-series split

## N4 — Derivar a matemática (13 itens)
Normas e similaridade por cosseno · Derivadas básicas e regra da cadeia · Esperança e variância · Distribuições Bernoulli/Binomial/Normal · Máxima verossimilhança · Erro padrão e intervalo de confiança · Teste de hipótese e p-valor · Decomposição viés-variância · Regularização L1 e L2 · Data leakage (catálogo) · Regressão linear e pressupostos · Métricas de classificação · Gradient boosting (mecânica) · Point-in-time correctness

## N3 — Explicar no quadro (o grosso do plano)
Autovalores e PCA · Convexidade · Poder estatístico e tamanho de amostra · Bootstrap · Paradoxo de Simpson · Múltiplas comparações · Maldição da dimensionalidade · Estratégias de validação · Random Forest e OOB · k-NN · Naive Bayes · SVM · DBSCAN · Detecção de anomalia · Calibração · Métricas de ranking · Feature engineering completo · SHAP · Feature store · Training-serving skew · Drift e PSI · Padrões de deploy

## N2 — Usar com biblioteca
Determinante · SVD · Poisson · Testes t/z/qui-quadrado · Newton e L-BFGS · GLM · Clustering hierárquico · Gaussian Mixture · Hiperparâmetros avançados de XGBoost/LightGBM

## N1 — Só reconhecer ⛔ não invista tempo
Formas de Jordan, espaços duais, teorema espectral · Integrais e EDOs · Multiplicadores de Lagrange · Cadeias de Markov · MCMC e inferência bayesiana completa · Dimensão VC e limites PAC · Inferência causal formal (DAGs) · Modelos de sobrevivência

---

# CRONOGRAMA (40 semanas)

| Semanas | Módulo | Entregável |
|---|---|---|
| 1–3 | Álgebra linear | Funções vetoriais em NumPy puro |
| 4–6 | Cálculo e otimização | Gradiente descendente do zero + gráfico de learning rates |
| 7–9 | Probabilidade | Log-loss implementado, simulação de Bayes |
| 10–12 | Estatística inferencial | Simulação do problema de *peeking* em A/B |
| 13–15 | Teoria do aprendizado | Curva de viés-variância com dados próprios |
| 16–19 | Modelos lineares | **Regressão logística do zero, validada contra sklearn** |
| 20–24 | Árvores e boosting | **Árvore do zero + comparação de importâncias** |
| 25–26 | Outros supervisionados | k-NN do zero, demo da maldição da dimensionalidade |
| 27–29 | Não supervisionado | k-means e PCA do zero + detecção de anomalia em latência real |
| 30–32 | Métricas | Função de threshold ótimo por custo + curvas de calibração |
| 33–35 | Feature engineering | **Demo de leakage de point-in-time com números** |
| 36–37 | Workflow e SHAP | Análise de erro estruturada, uma página |
| 38–40 | Produção | **Projeto final completo** |

Os entregáveis em **negrito** são os que viram apresentação interna. Cinco apresentações ao longo de um ano é a cadência que constrói reputação sem parecer forçado.

---

# GLOSSÁRIO DE REFERÊNCIA

### Fundamentos
| Termo | Definição |
|---|---|
| **Feature** | Variável de entrada do modelo |
| **Label / target** | A resposta que o modelo tenta prever |
| **Ground truth** | O valor real observado |
| **Instância** | Uma linha do dataset |
| **Parâmetro** | O que o modelo aprende (pesos) |
| **Hiperparâmetro** | O que você configura antes do treino |
| **Função de perda** | Mede o erro; é o que o treino minimiza |
| **Gradiente descendente** | Otimização por passos na direção oposta ao gradiente |
| **Learning rate** | Tamanho do passo na otimização |
| **Convergência** | Quando o treino estabiliza |
| **Convexidade** | Função com um único mínimo; garante ótimo global |
| **Risco empírico** | Erro medido no dataset de treino |
| **Risco esperado** | Erro verdadeiro na população; o que você realmente quer |
| **i.i.d.** | Independente e identicamente distribuído. Suposição base que dados temporais violam. |

### Qualidade e validação
| Termo | Definição |
|---|---|
| **Overfitting** | Decorou o treino, falha em dado novo |
| **Underfitting** | Simples demais, erra até no treino |
| **Viés (bias)** | Erro por rigidez do modelo |
| **Variância** | Erro por sensibilidade ao dataset específico |
| **Ruído irredutível** | Aleatoriedade inerente; o teto de desempenho |
| **Regularização** | Penalizar complexidade para generalizar |
| **Ridge / L2** | Regularização que encolhe coeficientes |
| **Lasso / L1** | Regularização que zera coeficientes (seleção de features) |
| **Elastic Net** | Combinação de L1 e L2 |
| **Validação cruzada** | Treinar e testar em múltiplas divisões |
| **Estratificação** | Manter a proporção de classes em cada fold |
| **Group split** | Split que mantém a mesma entidade de um lado só |
| **TimeSeriesSplit** | Treina no passado, valida no futuro |
| **Nested CV** | CV dentro de CV, para estimativa não enviesada com tuning |
| **Data leakage** | Informação indevida vazou para as features |
| **Target leakage** | A feature contém informação do alvo |
| **Curva de aprendizado** | Erro em função do volume de dados |
| **Maldição da dimensionalidade** | Distâncias perdem significado em alta dimensão |
| **No Free Lunch** | Nenhum algoritmo é o melhor para todos os problemas |

### Estatística
| Termo | Definição |
|---|---|
| **Erro padrão** | Desvio padrão da estimativa; cai com √n |
| **Intervalo de confiança** | Faixa plausível para o parâmetro |
| **H₀ / H₁** | Hipótese nula e alternativa |
| **p-valor** | P(observar isto ou mais extremo \| H₀ verdadeira) |
| **Erro tipo I (α)** | Falso positivo: rejeitar H₀ verdadeira |
| **Erro tipo II (β)** | Falso negativo: não rejeitar H₀ falsa |
| **Poder (1−β)** | Chance de detectar um efeito real |
| **Bonferroni / Benjamini-Hochberg** | Correções para múltiplas comparações |
| **Bootstrap** | Estimar incerteza por reamostragem |
| **Paradoxo de Simpson** | Tendência que inverte ao agregar grupos |
| **Peeking** | Checar significância repetidamente; infla falso positivo |
| **Confusão (confounder)** | Variável que afeta causa e efeito simultaneamente |

### Algoritmos
| Termo | Definição |
|---|---|
| **Sigmoide** | `1/(1+e^-z)`; mapeia real para (0,1) |
| **Odds ratio** | `e^w`; fator multiplicativo nas chances |
| **Gini** | Medida de impureza: `1 − Σp²` |
| **Entropia** | Medida de impureza: `−Σp·log₂p` |
| **Ganho de informação** | Redução de impureza produzida por um split |
| **Bagging** | Treinar modelos em paralelo sobre bootstraps e promediar |
| **Boosting** | Treinar modelos sequencialmente, cada um corrigindo o anterior |
| **Bootstrap** | Reamostragem com reposição |
| **OOB** | Amostras fora do bootstrap; validação grátis (~37%) |
| **Shrinkage** | Learning rate no boosting; passos pequenos regularizam |
| **Pseudo-resíduo** | Gradiente negativo que a próxima árvore ajusta |
| **Early stopping** | Parar quando a métrica de validação para de melhorar |
| **Leaf-wise / level-wise** | Estratégias de crescimento (LightGBM / XGBoost) |
| **Truque do kernel** | Operar em alta dimensão sem calcular a projeção (SVM) |
| **Margem** | Distância entre a fronteira e os pontos mais próximos |
| **Inércia** | Soma dos quadrados intra-cluster (k-means) |
| **Silhouette** | Qualidade de cluster, de −1 a 1 |
| **Componente principal** | Direção de máxima variância (PCA) |
| **Variância explicada** | Fração da variância capturada por componente |

### Métricas
| Termo | Definição |
|---|---|
| **Matriz de confusão** | TP, FP, FN, TN |
| **Precisão** | TP/(TP+FP) — dos previstos positivos, quantos acertei |
| **Recall** | TP/(TP+FN) — dos positivos reais, quantos peguei |
| **F1 / Fβ** | Média harmônica; β pesa recall |
| **AUC-ROC** | Qualidade de ordenação; engana com desbalanceamento |
| **PR-AUC** | Alternativa correta para classe rara |
| **Log Loss** | Pune confiança errada; deriva da Bernoulli |
| **Brier Score** | MSE das probabilidades |
| **Calibração** | Score 0.7 corresponde a 70% real? |
| **Platt scaling / isotônica** | Métodos de calibração |
| **Threshold** | Corte que transforma probabilidade em decisão |
| **MAE / RMSE / MAPE / R²** | Métricas de regressão |
| **NDCG@k** | Ganho acumulado descontado, normalizado |
| **MRR** | Inverso da posição do primeiro acerto |
| **MAP** | Precisão média sobre múltiplos relevantes |

### Features
| Termo | Definição |
|---|---|
| **Padronização** | `(x−μ)/σ` |
| **One-hot** | Uma coluna binária por categoria |
| **Target encoding** | Categoria vira média do alvo; exige suavização e cuidado com leakage |
| **Frequency encoding** | Categoria vira sua frequência |
| **Hashing trick** | Hash para número fixo de buckets |
| **Encoding cíclico** | `sin`/`cos` para variáveis circulares (hora, mês) |
| **Winsorização** | Cortar valores em percentis extremos |
| **Indicador de faltante** | Coluna binária sinalizando ausência |
| **Feature de janela** | Agregação sobre período (7d, 30d) |
| **Permutation importance** | Importância medida embaralhando a feature |
| **SHAP** | Contribuição de cada feature por predição |
| **PDP / ICE** | Efeito marginal de feature, global e individual |

### Produção
| Termo | Definição |
|---|---|
| **Feature store** | Repositório central de features, offline e online |
| **Offline / online store** | Histórico para treino / baixa latência para inferência |
| **Materialização** | Empurrar features do offline para o online |
| **Freshness** | Há quanto tempo a feature foi atualizada |
| **Point-in-time correctness** | Usar o valor da feature no instante da predição |
| **Training-serving skew** | Feature calculada diferente no treino e no serving |
| **Backfill** | Recalcular histórico de uma feature nova |
| **Data drift** | `P(X)` mudou |
| **Concept drift** | `P(y\|X)` mudou |
| **PSI** | Population Stability Index; mede drift |
| **Label delay** | Demora até o rótulo real ficar disponível |
| **Shadow deploy** | Modelo recebe tráfego mas não responde ao usuário |
| **Canary** | Rollout gradual com métricas de guarda |
| **Interleaving** | Comparar rankings intercalando resultados |
| **Holdout permanente** | Fatia que nunca recebe o modelo |
| **Model registry** | Catálogo versionado de modelos |
| **Feedback loop** | O modelo influencia os dados do próximo modelo |
| **Degradação graciosa** | O produto funciona mesmo com o modelo fora |
| **ONNX** | Formato portável de modelo, roda na JVM |

---

# BIBLIOTECA DE REFERÊNCIA

## Gratuitos, em ordem de prioridade

| # | Recurso | Link |
|---|---|---|
| 1 | **Rules of Machine Learning** (Google) — leia primeiro | https://developers.google.com/machine-learning/guides/rules-of-ml |
| 2 | **MLU-Explain** — explicações visuais interativas | https://mlu-explain.github.io/ |
| 3 | **ISLP** — Introduction to Statistical Learning (Python) | https://www.statlearning.com/ |
| 4 | ISLP PDF direto | https://hastie.su.domains/ISLP/ISLP_website.pdf |
| 5 | **scikit-learn User Guide** — a melhor doc de ML que existe | https://scikit-learn.org/stable/user_guide.html |
| 6 | scikit-learn: Common Pitfalls | https://scikit-learn.org/stable/common_pitfalls.html |
| 7 | **StatQuest** (YouTube) | https://www.youtube.com/@statquest |
| 8 | **3Blue1Brown** — álgebra linear e cálculo | https://www.3blue1brown.com/ |
| 9 | Mathematics for Machine Learning | https://mml-book.github.io/ |
| 10 | Google ML Crash Course | https://developers.google.com/machine-learning/crash-course |
| 11 | Kaggle Learn (cursos curtos e práticos) | https://www.kaggle.com/learn |
| 12 | Interpretable ML Book (Molnar) | https://christophm.github.io/interpretable-ml-book/ |
| 13 | Made With ML (MLOps) | https://madewithml.com/ |
| 14 | applied-ml — casos reais de empresas | https://github.com/eugeneyan/applied-ml |
| 15 | Eugene Yan — blog | https://eugeneyan.com/ |
| 16 | Elements of Statistical Learning (avançado) | https://hastie.su.domains/ElemStatLearn/ |
| 17 | Seeing Theory | https://seeing-theory.brown.edu/ |

## Livros pagos que valem

| Livro | Autor | Para quê |
|---|---|---|
| Hands-On Machine Learning (3ª ed.), Parte I | Aurélien Géron | O melhor livro prático. Ignore a Parte II (deep learning). |
| Designing Machine Learning Systems | Chip Huyen | ML em produção. Leia junto com o Módulo 13. |
| Machine Learning Engineering | Andriy Burkov | Complementar ao anterior |
| Trustworthy Online Controlled Experiments | Kohavi, Tang, Xu | A referência definitiva de A/B testing |
| Feature Engineering for ML | Zheng & Casari | Aprofunda o Módulo 11 |

## Documentação de biblioteca (leia como se fosse livro)

- scikit-learn: https://scikit-learn.org/stable/user_guide.html
- XGBoost: https://xgboost.readthedocs.io/
- LightGBM: https://lightgbm.readthedocs.io/
- SHAP: https://shap.readthedocs.io/
- Optuna: https://optuna.org/
- MLflow: https://mlflow.org/

---

# O QUE FICOU DE FORA (e quando voltar)

Deep learning e LLMs foram removidos por decisão de escopo. Vale registrar por quê isso faz sentido e quando reconsiderar.

**Por que faz sentido agora:** em dados tabulares — que é a maior parte do ML de negócio, e provavelmente o que o modelo do seu time faz — gradient boosting continua competitivo ou superior a redes neurais. Além disso, toda a base deste plano (viés-variância, validação, leakage, métricas, produção) é pré-requisito para deep learning. Nada aqui será desperdiçado.

**Quando voltar:** quando o problema envolver dados não estruturados de forma central — imagem, áudio, texto livre — ou quando você precisar de embeddings aprendidos. Aí o caminho natural é PyTorch e a série *Zero to Hero* do Karpathy.

Por ora, dominar ML clássico + produção é um posicionamento mais raro e mais valioso do que conhecer superficialmente redes neurais.
