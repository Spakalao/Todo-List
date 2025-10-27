# ✅ Checklist Finale - Configuration CI/CD Complète

## 🎯 Configuration Docker

- [x] Dockerfile créé
- [x] Image Docker buildée (`spakalao/todo-list:latest`)
- [x] Image pushée sur Docker Hub (`docker push spakalao/todo-list:latest`)
- [x] Application testée localement (`docker run`)
- [x] `.dockerignore` configuré

## 🚀 Configuration Kubernetes

- [x] `deployment.yaml` créé avec :
  - [x] 2 replicas
  - [x] Service NodePort (port 30080)
  - [x] Resources limits
  - [x] `imagePullSecrets: regcred`

- [x] `ingress.yaml` créé (production avec TLS)
- [x] Secret Docker Registry créé (`kubectl create secret docker-registry regcred`)
- [x] Cluster Kubernetes accessible (`kubectl get nodes`)

## 🔧 Configuration Jenkins

### Installation

- [x] Jenkins installé et accessible (http://localhost:8080)
- [x] Plugins installés :
  - [x] Pipeline
  - [x] Docker Pipeline
  - [x] Kubernetes CLI
  - [x] Credentials Binding

### Credentials

- [ ] Credential Docker Hub créé :
  - ID : `docker-hub-creds`
  - Username : `spakalao`
  - Password : [votre mot de passe]

- [ ] Credential Kubernetes créé (optionnel) :
  - Kind : Secret file
  - ID : `kubeconfig-cred-id`
  - File : Uploader `~/.kube/config`

### Pipeline

- [ ] Pipeline créé :
  - Nom : `todo-list-pipeline`
  - Type : Pipeline
  - Définition : Pipeline script from SCM
  - SCM : Git
  - Repository : [URL de votre repo]
  - Script Path : `Jenkinsfile`

## 🔗 Configuration Webhook (Optionnel mais recommandé)

### GitHub

- [ ] Repository GitHub créé
- [ ] Code pushé sur GitHub
- [ ] Webhook créé dans GitHub :
  - URL : `http://localhost:8080/github-webhook/` (ou ngrok)
  - Events : Push
- [ ] Test de push effectué
- [ ] Pipeline se lance automatiquement

### GitLab

- [ ] Repository GitLab créé
- [ ] Code pushé sur GitLab
- [ ] Webhook créé dans GitLab :
  - URL : `http://localhost:8080/project/todo-list-pipeline`
  - Trigger : Push events
- [ ] Test effectué

## 🧪 Tests

### Test Manuel Docker

```powershell
docker run -d -p 8090:80 --name todo-app spakalao/todo-list:latest
# Vérifier : http://localhost:8090
```

### Test Manuel Kubernetes

```powershell
kubectl apply -f k8s/deployment.yaml
kubectl get pods -l app=todo-list
kubectl get svc todo-list-svc
# Accéder : http://localhost:30080
```

### Test Pipeline Jenkins

- [ ] Lancer "Build Now" dans Jenkins
- [ ] Vérifier que tous les stages passent :
  - [ ] Checkout
  - [ ] Install Dependencies
  - [ ] Build
  - [ ] Docker Build & Push
  - [ ] Deploy to Kubernetes (sur master/main)

## 📊 Monitoring et Vérification

### Vérifications Kubernetes

```powershell
# Voir les pods
kubectl get pods -l app=todo-list

# Voir les logs
kubectl logs -l app=todo-list

# Voir les events
kubectl get events --sort-by=.metadata.creationTimestamp

# Describe le deployment
kubectl describe deployment todo-list

# Voir les services
kubectl get svc
```

### Vérifications Jenkins

```powershell
# Logs Jenkins
docker logs -f jenkins

# Voir les builds
# Dans Jenkins UI : todo-list-pipeline → Build History

# Voir la console du dernier build
# Jenkins UI → todo-list-pipeline → Last Build → Console Output
```

## 🔍 Debugging

### Si le pipeline échoue

1. **Stage "Install Dependencies" échoue** :
   - Vérifier `package.json`
   - Vérifier que `node_modules` existe (garder dans .gitignore)

2. **Stage "Build" échoue** :
   - Vérifier `npm run build` fonctionne localement
   - Vérifier les dépendances

3. **Stage "Docker Build" échoue** :
   - Vérifier Docker daemon accessible
   - Vérifier Dockerfile
   - Vérifier credentials `docker-hub-creds`

4. **Stage "Docker Push" échoue** :
   - Vérifier login Docker Hub
   - Vérifier credentials
   - Vérifier internet dans Jenkins

5. **Stage "Deploy to K8s" échoue** :
   - Vérifier cluster K8s accessible
   - Vérifier kubectl installé dans Jenkins
   - Vérifier secret `regcred` dans K8s
   - Vérifier deployment.yaml

### Commandes utiles pour debug

```powershell
# Entrer dans le conteneur Jenkins
docker exec -it jenkins bash

# Vérifier Docker dans Jenkins
docker exec -it jenkins docker ps

# Vérifier kubectl
docker exec -it jenkins kubectl version --client

# Tester manual push
docker exec -it jenkins docker push spakalao/todo-list:test
```

## 📁 Fichiers créés

- [x] `Dockerfile`
- [x] `Jenkinsfile`
- [x] `.dockerignore`
- [x] `k8s/deployment.yaml`
- [x] `k8s/ingress.yaml`
- [x] `k8s/README.md`
- [x] `k8s/KUBERNETES_SETUP.md`
- [x] `k8s/create-secret.ps1`
- [x] `k8s/create-secret.sh`
- [x] `JENKINS_SETUP.md`
- [x] `WEBHOOK_SETUP.md`
- [x] `SETUP_COMPLETE.md`
- [x] `CHECKLIST_FINALE.md` (ce fichier)

## 🎓 Commandes de référence

### Docker

```powershell
# Build
docker build -t spakalao/todo-list:latest .

# Push
docker push spakalao/todo-list:latest

# Run local
docker run -d -p 8090:80 --name todo-app spakalao/todo-list:latest

# Logs
docker logs -f todo-app

# Stop/Remove
docker stop todo-app
docker rm todo-app
```

### Kubernetes

```powershell
# Appliquer
kubectl apply -f k8s/deployment.yaml

# Voir
kubectl get all -l app=todo-list

# Logs
kubectl logs -l app=todo-list -f

# Scale
kubectl scale deployment/todo-list --replicas=3

# Delete
kubectl delete -f k8s/deployment.yaml
```

### Jenkins

```powershell
# Status
docker ps -a | findstr jenkins

# Logs
docker logs -f jenkins

# Restart
docker restart jenkins

# Entrer dedans
docker exec -it jenkins bash
```

## 🎉 Une fois tout configuré

Votre workflow complet sera :

1. **Push sur GitHub/GitLab** → Webhook déclenche Jenkins
2. **Jenkins** → Build l'application
3. **Jenkins** → Crée l'image Docker et la push sur Docker Hub
4. **Jenkins** → Déploie sur Kubernetes
5. **Kubernetes** → Pull l'image depuis Docker Hub
6. **Kubernetes** → Déploie les pods
7. **Service** → Route le trafic vers l'application

**Résultat** : Votre application est automatiquement déployée à chaque push sur master/main ! 🚀

## 📚 Documentation

Consultez les fichiers suivants pour plus de détails :

- `JENKINS_SETUP.md` - Configuration Jenkins détaillée
- `WEBHOOK_SETUP.md` - Configuration webhooks
- `SETUP_COMPLETE.md` - Vue d'ensemble complète
- `k8s/README.md` - Déploiement Kubernetes manuel
- `k8s/KUBERNETES_SETUP.md` - Configuration K8s pour Jenkins

