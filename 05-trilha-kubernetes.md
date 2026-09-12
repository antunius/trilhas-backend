# Trilha 5 — Kubernetes (para quem desenvolve)

**Duração:** 5 semanas · 3 sessões de 45 min.

> O objetivo não é virar SRE. É saber **por que o pod dela morreu**, fazer a aplicação se comportar bem no cluster, e conseguir debugar sozinha um incidente às 3h da manhã. Sem o vocabulário do zero (cluster, node, control plane, pod, reconciliação), `kubectl` vira lista de comandos.

---

## Mapa mental

Kubernetes não “sobe um servidor”. Você declara o **estado desejado** (“quero 3 réplicas desta imagem, com esta porta, estes limites”). **Controllers** no control plane comparam com o **estado atual** (o que os nós reportam) e **reconcilam**: criam, matam, substituem até os dois coincidirem.

```
você: YAML (Deployment, Service, …)  →  API Server  →  etcd (fonte da verdade)
                                              ↓
                         scheduler escolhe um Node
                                              ↓
                         kubelet no Node sobe o Pod (containers)
                                              ↓
                         Service seleciona Pods Ready e dá IP estável virtual
```

O pod **morre** o tempo todo (deploy, OOM, liveness, preempção). Por isso a aplicação precisa ser **descartável**: stateless, SIGTERM tratado, readiness honesta.

---

## Glossário do zero

### Cluster, Node e control plane

**Cluster.** Um conjunto de máquinas gerenciadas como um sistema: control plane + workers.

**Node (worker).** Máquina (VM ou bare metal) que **roda pods**. Tem kubelet, kube-proxy (ou equivalente), runtime de container (containerd).

**Control plane.** Cérebro: API Server (a porta da frente — todo `kubectl` fala com ele), **etcd** (banco chave-valor da configuração e do estado), scheduler (em que nó o pod cabe), controller-manager (Deployment, ReplicaSet, Node, Job…). Em nuvem isso pode ser gerenciado (EKS/GKE/AKS) e você só vê os workers.

**Erro comum.** Achar que “o Kubernetes” é um processo único. É um conjunto de processos que concordam via API + etcd.

### Recurso, manifesto e API

**Recurso.** Um objeto na API: `Pod`, `Deployment`, `Service`, `ConfigMap`… Cada um tem `apiVersion`, `kind`, `metadata` (nome, namespace, labels), `spec` (desejado), `status` (observado).

**Manifesto.** O YAML (ou JSON) que descreve o spec. `kubectl apply` manda isso para o API Server.

**Namespace.** Partição lógica de nomes: `default`, `kube-system`, o do seu time. Um `Deployment` chamado `api` em `prod` e outro em `dev` não se atropelam.

**Label e seletor.** Chave-valor em metadados (`app=pedidos`). Service, Deployment e PDB **selecionam** pods por label. Sem label consistente, o Service não acha ninguém.

### Container vs Pod vs imagem

**Imagem.** Snapshot imutável do filesystem + metadados (Dockerfile buildado, no registry). Tag (`v1.2.3`) importa; `latest` em produção é armadilha.

**Container.** Processo isolado (namespaces/cgroups) rodando uma imagem. Um container = em geral um processo principal. Se ele sai, o container acabou.

**Pod.** Menor unidade **agendável**. Um ou mais containers que compartilham **rede** (mesmo `localhost`) e opcionalmente volumes. Quase sempre 1 container de app + sidecars (log, mesh). O scheduler não agenda “um container solto” — agenda o pod.

**Por que não só container?** Porque o K8s precisa de um envelope com IP, probes, volumes, política de restart. Esse envelope é o pod.

### ReplicaSet e Deployment

**ReplicaSet.** “Mantenha N pods iguais a este template.” Se um morre, cria outro.

**Deployment.** Camada acima: rollout, rollback, histórico. Troca de imagem = ReplicaSet novo + ReplicaSet antigo encolhendo. É o que você usa para app **stateless**.

**StatefulSet.** Identidade estável (`kafka-0`, `kafka-1`), disco próprio, ordem. Bancos, brokers. Não é o padrão da sua API REST.

### Service, Endpoint e Ingress

**Service.** IP virtual estável + DNS (`pedidos.default.svc.cluster.local`) na frente de pods que **nascem e morrem**. Tipos: `ClusterIP` (interno), `NodePort`, `LoadBalancer`.

**Endpoints / EndpointSlice.** A lista real de IP:porta dos pods **Ready** que casam o seletor. Pod não Ready **não** recebe tráfego.

**Ingress.** Roteamento HTTP (host, path, TLS) de fora para Services. Precisa de um *Ingress Controller* (nginx, traefik…). Service sozinho não entende hostname.

**Erro comum.** Expor a app só com ClusterIP e achar que a internet chega. Falta Ingress ou LoadBalancer.

### ConfigMap e Secret

**ConfigMap.** Config não sensível injetada em env ou volume.

**Secret.** Dado sensível. **Por padrão é base64, não criptografia.** Proteção de verdade: encryption at rest no etcd, RBAC, ou cofre externo.

### Volume, PVC e PV

**Volume no pod.** Disco visível aos containers do pod. `emptyDir` morre com o pod.

**PersistentVolume (PV) / PersistentVolumeClaim (PVC).** Pedido de disco que **sobrevive** ao pod (StatefulSet, banco). Deployment stateless em geral **não** escreve em PVC local.

### kubelet, probes e cgroups

**kubelet.** Agente no node: sobe o que o scheduler mandou, roda probes, reporta status, mata o que estourou memória (via cgroup).

**cgroup.** Limite de CPU/memória do container. É isso que `resources.limits` configura.

**Probe.** HTTP/TCP/exec periódico.
- **Liveness:** processo zumbi? → **restart**.
- **Readiness:** posso receber tráfego? → sai dos Endpoints, **sem** restart.
- **Startup:** JVM lenta para subir; segura a liveness.

### Requests, limits e QoS

**Request.** Reserva para o scheduler (“este pod precisa de 256Mi”). Nó sem capacidade → pod `Pending`.

**Limit.** Teto. CPU: *throttle* (fica lento). Memória: **OOMKill** (exit 137).

**QoS.** Guaranteed / Burstable / BestEffort — quem o kubelet mata primeiro sob pressão no nó.

### Reconciliação (o conceito que unifica tudo)

Você não “liga o servidor”. Você declara spec. Um controller **loopa**: diff(spec, status) → ações. Por isso deletar um pod de um Deployment **não** desliga o serviço: o ReplicaSet cria outro. Para desligar de verdade, mude o spec (replicas=0) ou delete o Deployment.

---

## Semana 1 — Objetos essenciais

**1. O que é um Pod e por que ele existe, se quase sempre tem só um container?**
> É a menor unidade agendável. Containers no mesmo pod compartilham rede (mesmo `localhost`) e podem compartilhar volumes. O caso de mais de um container é o *sidecar*: coletor de log, proxy de service mesh, agente de métricas.

**2. Deployment, ReplicaSet e Pod — como se relacionam?**
> O Deployment declara o estado desejado e gerencia ReplicaSets. Cada ReplicaSet garante N réplicas de um template de pod. Num rollout, o Deployment cria um novo ReplicaSet e reduz o antigo gradualmente — é isso que permite rollback (o ReplicaSet anterior ainda existe).

**3. Service e Ingress — diferença?**
> Service dá um endereço estável e balanceamento para um conjunto de pods (que nascem e morrem com IPs diferentes), via seletor de labels. `ClusterIP` é interno, `NodePort` expõe porta no nó, `LoadBalancer` provisiona um LB da nuvem. **Ingress** é roteamento HTTP em camada 7: host, path, TLS — um ponto de entrada para vários serviços.

**4. Como o Service descobre os pods?**
> Por **labels e seletores**. O Service mantém uma lista de endpoints com os pods que casam com o seletor **e** estão *Ready*. Pod que falha na readiness probe sai da lista e para de receber tráfego.

**5. ConfigMap e Secret — qual a pegadinha do Secret?**
> Secret é apenas **base64**, não criptografia. Por padrão fica em texto quase claro no etcd. Proteção real exige encryption-at-rest habilitada, RBAC restrito, ou um gerenciador externo (Vault, Secrets Manager, External Secrets Operator).

**6. Quando usar StatefulSet em vez de Deployment?**
> Quando cada réplica precisa de identidade estável (`app-0`, `app-1`), armazenamento próprio persistente e ordem determinística de criação/remoção. Bancos, Kafka, Zookeeper. Aplicação stateless usa Deployment.

**7. O que o control plane faz, numa frase?**
> Expõe a API, persiste o estado no etcd, agenda pods e reconcilia recursos até o cluster parecer com o YAML.

**8. Desenhe (papel) um Deployment de 2 réplicas + Service ClusterIP.**
> Dois pods em nós (possivelmente diferentes), cada um com IP próprio; o Service com IP virtual; kube-proxy/CNI encaminha para os endpoints Ready. Se um pod morre, ReplicaSet cria outro com **outro** IP; o Service continua o mesmo.

---

## Semana 2 — Recursos, JVM em container e probes ⭐

> **Aqui estão as perguntas que mais aparecem para desenvolvedora Java em entrevista de plataforma.**

**1. Requests e limits — qual a diferença?**
> `requests` é o que o scheduler **reserva** para decidir em qual nó o pod cabe. `limits` é o teto que o container pode consumir. Se `requests` for muito baixo, o pod é agendado em nó lotado e sofre. Se `limits` for muito baixo, o pod é morto ou estrangulado.

**2. O que acontece ao estourar o limite de CPU? E o de memória?**
> CPU é **compressível**: o container sofre *throttling* — fica lento, mas não morre. Memória é **incompressível**: estourar o limite resulta em **OOMKilled** — o container é morto imediatamente pelo kernel e reiniciado. Essa distinção é pergunta clássica.

**3. Meu pod Java foi OOMKilled, mas o `-Xmx` era menor que o limite. Por quê?**
> Porque **heap não é a memória total do processo**. Além do heap existem: metaspace, stacks de threads (~1MB cada — 200 threads = 200MB), buffers diretos (`DirectByteBuffer`, usado por Netty e drivers), cache de código do JIT, e memória nativa de bibliotecas. Regra prática: heap em torno de 70-75% do limite do container, e monitorar RSS, não só heap.

**4. Como configurar a JVM para container?**
> Usar `-XX:MaxRAMPercentage=75` em vez de `-Xmx` fixo — assim a aplicação se adapta se o limite do pod mudar. JVMs modernas já leem os cgroups e enxergam o limite corretamente (`UseContainerSupport`, ligado por padrão). Também vale conferir se a contagem de CPUs disponíveis está correta, porque ela define o tamanho do pool de GC e do `ForkJoinPool.commonPool`.

**5. Liveness, readiness e startup probe — qual a diferença?**
> - **Liveness:** "o processo está saudável?" Se falhar, o kubelet **reinicia** o container.
> - **Readiness:** "posso receber tráfego?" Se falhar, o pod sai dos endpoints do Service, mas **não** é reiniciado.
> - **Startup:** dá um período de graça para aplicações que sobem devagar (JVM!) antes de a liveness começar a valer.

**6. Qual o erro clássico com probes?**
> Colocar checagem de dependência externa (banco, outro serviço) na **liveness**. Banco fica lento → todas as réplicas falham a liveness → todas reiniciam ao mesmo tempo → o serviço inteiro cai, quando o problema era só degradação. Dependência externa vai na **readiness**. Liveness deve checar apenas se o processo local está funcional.
>
> Com Spring Boot Actuator: `/actuator/health/liveness` e `/actuator/health/readiness` (habilitados com `management.endpoint.health.probes.enabled=true`).

**7. O que são as classes de QoS?**
> `Guaranteed` (requests == limits em tudo), `Burstable` (requests < limits), `BestEffort` (nada definido). Sob pressão de memória no nó, o kubelet despeja primeiro BestEffort, depois Burstable. Serviço crítico deve ser Guaranteed ou Burstable com requests realistas.

---

## Semana 3 — Deploy, shutdown e escala

**1. Descreva o que acontece num rolling update.**
> O Deployment cria um ReplicaSet novo e vai subindo pods novos e derrubando antigos, respeitando `maxSurge` (quantos a mais que o desejado) e `maxUnavailable` (quantos a menos). Pods novos só recebem tráfego depois de passar na readiness. Se algo falha, `kubectl rollout undo` volta para o ReplicaSet anterior.

**2. O que acontece quando um pod é encerrado? ⭐**
> Em ordem: (1) o pod é marcado como *Terminating* e **removido dos endpoints do Service**; (2) o hook `preStop` é executado, se houver; (3) o container recebe **SIGTERM**; (4) passado o `terminationGracePeriodSeconds` (padrão 30s), vem **SIGKILL**.
>
> A aplicação precisa tratar o SIGTERM: parar de aceitar novas requisições, terminar as em andamento, fechar o consumidor Kafka commitando o offset, fechar o pool de conexões, e então sair.

**3. Por que ainda perco requisições no deploy mesmo com graceful shutdown?**
> Porque a remoção dos endpoints e o envio do SIGTERM acontecem **em paralelo**, e a propagação da mudança de endpoint pelos proxies leva alguns instantes. Nesse intervalo o pod já está encerrando e ainda recebe tráfego. A correção prática é um `preStop` com um `sleep 5-10s`: o pod continua atendendo enquanto os balanceadores atualizam, e só então começa o shutdown.

**4. Como configurar isso no Spring Boot?**
> `server.shutdown=graceful` e `spring.lifecycle.timeout-per-shutdown-phase=20s`, com `terminationGracePeriodSeconds` maior que esse valor no manifesto.

**5. Como funciona o HPA?**
> Escala o número de réplicas com base em métricas — CPU, memória ou métrica customizada. Para serviço orientado a evento, a métrica boa é o **consumer lag do Kafka**, não CPU (via KEDA ou adapter de métricas customizadas). Escalar por CPU um consumidor bloqueado em I/O não funciona.

**6. Para que serve um PodDisruptionBudget?**
> Garante um mínimo de réplicas disponíveis durante *disrupções voluntárias* (drenagem de nó, upgrade do cluster). Sem PDB, uma manutenção pode derrubar todas as réplicas do serviço de uma vez.

**7. Como você faz uma app ficar apta a escalar horizontalmente?**
> Stateless: sem estado em memória entre requisições, sessão externalizada, sem afinidade de sessão, sem escrita em disco local, e idempotência onde há retry. Toda a discussão de escala começa aqui.

---

## Semana 4 — Debug e incidentes

### Comandos que precisam estar na ponta dos dedos
```bash
kubectl get pods -w                          # acompanhar em tempo real
kubectl describe pod <pod>                   # eventos — onde está a causa raiz
kubectl logs <pod> --previous                # logs do container que MORREU
kubectl logs -f <pod> -c <container>
kubectl exec -it <pod> -- sh
kubectl top pod / kubectl top node           # uso real de recursos
kubectl port-forward <pod> 8080:8080         # acessar localmente
kubectl get events --sort-by=.lastTimestamp
kubectl rollout status / undo deployment/<x>
```

### Diagnósticos (saber a causa e a checagem de cada um)

| Sintoma | Causas prováveis | Primeiro comando |
|---|---|---|
| `CrashLoopBackOff` | App morre ao subir: config faltando, dependência inacessível, exceção no startup, liveness agressiva demais | `kubectl logs --previous` |
| `OOMKilled` | Limite de memória menor que o consumo real; heap mal dimensionado; vazamento | `describe pod` (exit code 137) + heap dump |
| `ImagePullBackOff` | Tag errada, registry privado sem `imagePullSecret` | `describe pod` |
| `Pending` | Nenhum nó com recurso suficiente; nodeSelector/taint; PVC não provisionado | `describe pod` (seção Events) |
| `Evicted` | Pressão de recurso no nó; QoS BestEffort | `describe node` |
| Readiness nunca passa | Endpoint errado, timeout curto demais, app lenta para subir sem startup probe | `kubectl exec` + curl interno |
| 503 intermitente no deploy | Falta graceful shutdown / preStop | testar deploy sob carga |

### Laboratórios
Cluster local com **kind** ou **k3d**:
1. Subir a aplicação Spring da trilha 3 com probes, requests/limits e HPA.
2. Definir `limits.memory=256Mi` sem ajustar a JVM. Observar o OOMKilled. Corrigir com `MaxRAMPercentage`.
3. Apontar a liveness para um endpoint que checa o banco, derrubar o banco, e assistir todas as réplicas reiniciarem. Corrigir movendo para readiness.
4. Rodar um teste de carga durante um rolling update **sem** graceful shutdown e contar os erros. Adicionar `preStop` + `server.shutdown=graceful` e repetir.
5. Matar um pod no meio do consumo Kafka e verificar se o offset foi commitado corretamente.

---

## Semana 5 — Síntese

Explique reconciliação, pod, Service e probes sem YAML. Depois as perguntas.

### Perguntas-síntese (nível sênior)

- Seu serviço tem p99 alto só nos primeiros 2 minutos após cada deploy. Explique e resolva. *(JIT warm-up + readiness passando cedo demais.)*
- Um dos pods consome o dobro de CPU dos outros. O que investiga? *(Hot partition do Kafka, distribuição desigual de key, afinidade de conexão persistente.)*
- Como você faria uma migração de banco compatível com rolling update? *(Expand-and-contract: primeiro aditivo, deploy, depois remoção — nunca mudança destrutiva no mesmo deploy.)*
- Seu serviço depende de outro que fica instável. O que muda no seu manifesto e no seu código? *(Readiness não cai por dependência; timeout, retry com backoff e circuit breaker no código.)*
- Por que aumentar réplicas nem sempre aumenta a vazão? *(Gargalo no banco, pool de conexões, número de partições Kafka, lock.)*
- Deletei o pod e ele voltou. O que eu realmente deletei?

### Checklist de fluência (60 segundos)

- [ ] Cluster, node, control plane, etcd, kubelet
- [ ] Pod vs container vs Deployment vs ReplicaSet
- [ ] Service, endpoints, Ready, Ingress
- [ ] Request vs limit; CPU throttle vs OOMKill
- [ ] Liveness vs readiness vs startup
- [ ] SIGTERM, preStop, rolling update
- [ ] Secret não é criptografia
- [ ] App stateless = premissa do HPA

## Recursos
- Documentação oficial do Kubernetes — as páginas de *Pod Lifecycle* e *Configure Liveness, Readiness and Startup Probes* são curtas e definitivas.
- Spring Boot Reference — seção *Kubernetes Probes* e *Graceful Shutdown*.
