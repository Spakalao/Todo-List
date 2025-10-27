# Configuration Kubernetes pour Jenkins

## 📋 Étapes de configuration

### 1. Créer le secret Docker Registry dans Kubernetes

Ce secret permettra à Kubernetes de pull les images depuis Docker Hub.

```bash
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=spakalao \
  --docker-password=VOTRE_MOT_DE_PASSE \
  --docker-email=votre@email.com \
  --namespace=default
```

**Note** : Remplacez `VOTRE_MOT_DE_PASSE` par votre mot de passe Docker Hub réel.

### 2. Vérifier le secret

```bash
kubectl get secret regcred
kubectl describe secret regcred
```

### 3. Configurer Jenkins avec kubectl

#### Option A : Installer kubectl dans le conteneur Jenkins

```bash
# Entrer dans le conteneur Jenkins
docker exec -it jenkins bash

# Installer kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/

# Vérifier
kubectl version --client
```

#### Option B : Utiliser le plugin "Kubernetes CLI" dans Jenkins

1. **Manage Jenkins** → **Manage Plugins**
2. Installez le plugin **"Kubernetes CLI"**
3. Dans les **Global Tool Configuration**, configurez kubectl

### 4. Exporter et créer le credential du kubeconfig dans Jenkins

#### Étape 1 : Exporter votre kubeconfig

```bash
# Dans votre terminal local
cat ~/.kube/config > kubeconfig.txt
# ou sur Windows avec Docker Desktop Kubernetes
cat ~/.kube/config > kubeconfig.txt
```

#### Étape 2 : Créer le credential dans Jenkins

1. Ouvrir Jenkins (http://localhost:8080)
2. **Manage Jenkins** → **Manage Credentials**
3. **(global)** → **Add Credentials**
4. Remplir :
   - **Kind** : `Secret file`
   - **File** : Uploader votre fichier `~/.kube/config` (ou kubeconfig.txt)
   - **ID** : `kubeconfig-cred-id`
   - **Description** : `Kubernetes config file`
5. Cliquer sur **Create**

### 5. Modifier le Jenkinsfile (déjà fait ✅)

Le Jenkinsfile utilise déjà `kubeconfig-cred-id` dans le stage Deploy to Kubernetes.

### 6. Tester la configuration

#### Déployer manuellement pour tester

```bash
# Appliquer le deployment
kubectl apply -f k8s/deployment.yaml

# Vérifier les pods
kubectl get pods -l app=todo-list

# Voir les logs
kubectl logs -l app=todo-list

# Accéder au service (si NodePort)
# http://<node-ip>:30080
```

## 🔍 Vérifications

### Vérifier que Kubernetes peut pull l'image

```bash
# Voir les événements du pod
kubectl describe pod -l app=todo-list

# Si erreur "ImagePullBackOff" :
# - Vérifier que le secret regcred existe
# - Vérifier que les credentials Docker Hub sont corrects
```

### Vérifier l'accès depuis Jenkins

```bash
# Depuis le conteneur Jenkins
docker exec -it jenkins bash
kubectl get nodes
kubectl get pods
```

## 🚀 Déploiement via Jenkins

1. Dans Jenkins, créer un **Pipeline** qui utilise le `Jenkinsfile`
2. Lancer **Build Now**
3. Le pipeline va :
   - Build l'application
   - Créer l'image Docker
   - Push sur Docker Hub
   - Déployer sur Kubernetes (sur branche master/main)

## 📝 Commandes utiles

```bash
# Voir tous les secrets
kubectl get secrets

# Supprimer un secret
kubectl delete secret regcred

# Mettre à jour un secret
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=spakalao \
  --docker-password=NOUVEAU_PASSWORD \
  --docker-email=email@example.com \
  --dry-run=client -o yaml | kubectl apply -f -

# Voir les deployments
kubectl get deployments

# Rollback en cas de problème
kubectl rollout undo deployment/todo-list

# Scale up/down
kubectl scale deployment/todo-list --replicas=3
```

## 🐛 Résolution de problèmes

### Problème : "ImagePullBackOff"

```bash
# Vérifier le secret
kubectl get secret regcred -o yaml

# Recréer le secret si nécessaire
kubectl delete secret regcred
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=spakalao \
  --docker-password=VOTRE_PASSWORD \
  --docker-email=email@example.com
```

### Problème : "kubectl not found" dans Jenkins

Installer kubectl dans le conteneur (voir Option A ci-dessus).

### Problème : Permission denied pour le kubeconfig

```bash
# Vérifier les permissions du fichier kubeconfig
chmod 644 ~/.kube/config
```

## ✅ Checklist de configuration

- [ ] Secret `regcred` créé dans Kubernetes
- [ ] kubectl installé dans Jenkins
- [ ] Credential `kubeconfig-cred-id` créé dans Jenkins
- [ ] Deployment teste manuellement avec `kubectl apply`
- [ ] Pipeline Jenkins créé et testé

