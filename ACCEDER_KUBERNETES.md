# 🌐 Comment Accéder à Kubernetes

## 📊 Méthode 1: Ligne de Commande (kubectl)

### Commandes Principales

#### Voir le déploiement
```bash
# Statut global
kubectl get all

# Déploiement spécifique
kubectl get deployment todo-list

# En temps réel
kubectl get pods -w
```

#### Accéder aux logs
```bash
# Logs de tous les pods
kubectl logs -l app=todo-list

# Logs d'un pod spécifique
kubectl logs <nom-du-pod>

# Logs en temps réel
kubectl logs -f -l app=todo-list
```

#### Décrire les ressources
```bash
# Informations complètes sur le déploiement
kubectl describe deployment todo-list

# Informations sur les pods
kubectl describe pods -l app=todo-list

# Informations sur le service
kubectl describe svc todo-list-svc
```

#### Gérer les ressources
```bash
# Éditer le déploiement
kubectl edit deployment todo-list

# Mettre à jour l'image
kubectl set image deployment/todo-list todo-list=spakalao/todo-list:latest

# Redémarrer
kubectl rollout restart deployment/todo-list

# Rollback
kubectl rollout undo deployment/todo-list
```

## 🖥️ Méthode 2: Dashboard Kubernetes (Interface Web)

### Installation du Dashboard

```bash
# Installer le dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# Créer un utilisateur admin
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
EOF
```

### Accéder au Dashboard

```bash
# 1. Démarrer le proxy
kubectl proxy

# 2. Ouvrir dans le navigateur (dans un nouveau terminal)
start http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

# 3. Récupérer le token
kubectl -n kubernetes-dashboard create token admin-user
```

### Ou utiliser le token permanent

```bash
# Créer un token
kubectl -n kubernetes-dashboard create token admin-user --duration=24h

# Copier le token et l'utiliser dans le dashboard
```

## 🌐 Méthode 3: Port-Forward (Accès Direct)

### Accéder à un Pod spécifique

```bash
# Lister les pods
kubectl get pods

# Port-forward vers un pod
kubectl port-forward <nom-du-pod> 8080:80

# Accéder via http://localhost:8080
```

### Accéder via le Service

```bash
# Port-forward vers le service
kubectl port-forward svc/todo-list-svc 8080:80

# Accéder via http://localhost:8080
```

## 📱 Méthode 4: Quick Start Script

Créez un fichier `k8s-access.ps1`:

```powershell
# Accès rapide à Kubernetes
Write-Host "=== Kubernetes Quick Access ===" -ForegroundColor Cyan

Write-Host "`n1. Pods:" -ForegroundColor Yellow
kubectl get pods -l app=todo-list

Write-Host "`n2. Services:" -ForegroundColor Yellow
kubectl get svc

Write-Host "`n3. Deployments:" -ForegroundColor Yellow
kubectl get deployment

Write-Host "`n4. Demarrer Dashboard:" -ForegroundColor Yellow time
kubectl proxy

Write-Host "`n5. Port-forward:" -ForegroundColor Yellow
$pod = kubectl get pods -l app=todo-list -o jsonpath='{.items[0].metadata.name}'
Write-Host "kubectl port-forward $pod 8080:80"
```

## 🔍 Méthode 5: Monitoring & Debugging

### Voir les événements

```bash
# Événements du namespace
kubectl get events --sort-by='.lastTimestamp'

# Événements d'un pod
kubectl describe pod <nom-du-pod>
```

### Voir les ressources utilisées

```bash
# Installer metrics-server si pas déjà fait
kubectl top nodes
kubectl top pods -l app=todo-list
```

### Executer des commandes dans un pod

```bash
# Se connecter à un pod
kubectl exec -it <nom-du-pod> -- /bin/sh

# Ou pour shell bash
kubectl exec -it <nom-du-pod> -- /bin/bash

# Exécuter une commande
kubectl exec <nom-du-pod> -- ls -la
```

## 🎯 Méthode 6: Lens / k9s (Outils Visuels)

### Lens (Interface Desktop)
- **Télécharger:** https://k8slens.dev/
- Installation simple pour Windows
- Interface graphique complète

### k9s (Terminal Interactif)
```bash
# Installer via choco
choco install k9s

# Ou via winget
winget install k9s

# Lancer
k9s
```

## 📋 Commandes Essentielles - Cheat Sheet

```bash
# Vérifier le cluster
kubectl cluster-info

# Voir tous les resources
kubectl get all

# Lister les namespaces
kubectl get namespaces

# Changer de namespace
kubectl config set-context --current --namespace=default

# Voir les logs en temps réel
kubectl logs -f deployment/todo-list

# Scalabilité
kubectl scale deployment/todo-list --replicas=3

# HPA (Auto-scaling)
kubectl autoscale deployment todo-list --cpu-percent=50 --min=2 --max=10

# Exporter la configuration
kubectl get deployment todo-list -o yaml > backup.yaml
```

## 🚀 Démarrage Rapide

### Pour voir votre application rapidement:

```powershell
# 1. Voir les pods
kubectl get pods

# 2. Voir les services
kubectl get svc

# 3. Accéder à l'application
start http://localhost:30080

# 4. Port-forward (optionnel)
kubectl port-forward svc/todo-list-svc 8080:80
```

## 🎓 Ressources d'Apprentissage

- **Documentation officielle:** https://kubernetes.io/docs/
- **kubectl Cheat Sheet:** https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **Playground interactif:** https://www.katacoda.com/courses/kubernetes

## ✅ Checklist d'Accès

- [ ] kubectl installé ✅
- [ ] Cluster Kubernetes disponible ✅
- [ ] Application déployée ✅
- [ ] Service NodePort actif ✅
- [ ] Accès via localhost:30080 ✅

**Votre application est accessible sur: http://localhost:30080**

