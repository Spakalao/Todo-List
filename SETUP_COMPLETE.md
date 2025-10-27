# 🚀 Configuration complète CI/CD avec Jenkins + Kubernetes

## 📦 Résumé de la configuration

Ce projet est maintenant configuré pour un pipeline CI/CD complet :

- ✅ **Docker** : Image `spakalao/todo-list` sur Docker Hub
- ✅ **Jenkins** : Jenkins avec pipeline déclaratif
- ✅ **Kubernetes** : Manifests prêts pour déploiement
- ✅ **CI/CD** : Pipeline automatique de build → push → deploy

## 🎯 Étapes finales

### 1. Créer le secret Docker dans Kubernetes

```powershell
# Option A : Via PowerShell (Windows)
.\k8s\create-secret.ps1 -DockerPassword "VOTRE_MOT_DE_PASSE" -DockerEmail "votre@email.com"

# Option B : Via kubectl directement
kubectl create secret docker-registry regcred `
  --docker-server=https://index.docker.io/v1/ `
  --docker-username=spakalao `
  --docker-password="VOTRE_MOT_DE_PASSE" `
  --docker-email="votre@email.com" `
  --namespace=default
```

### 2. Configurer les credentials dans Jenkins

1. Aller sur http://localhost:8080
2. **Manage Jenkins** → **Manage Credentials**
3. **(global)** → **Add Credentials**

#### Credential Docker Hub :

- **Kind** : `Username with password`
- **Username** : `spakalao`
- **Password** : votre mot de passe Docker Hub
- **ID** : `docker-hub-creds`
- **Description** : Docker Hub credentials

#### Credential Kubernetes (Optionnel si besoin) :

- **Kind** : `Secret file`
- **File** : Uploader votre `~/.kube/config`
- **ID** : `kubeconfig-cred-id`
- **Description** : Kubernetes config

### 3. Activer Kubernetes dans Docker Desktop

1. Ouvrir **Docker Desktop**
2. **Settings** → **Kubernetes**
3. Cocher **"Enable Kubernetes"**
4. **Apply & Restart**
5. Attendre que l'icône Kubernetes soit verte

### 4. Tester le déploiement manuel

```powershell
# Appliquer le deployment
kubectl apply -f k8s/deployment.yaml

# Vérifier les pods
kubectl get pods -l app=todo-list

# Voir les logs
kubectl logs -l app=todo-list -f

# Accéder à l'application
# NodePort: http://localhost:30080
```

### 5. Créer le Pipeline dans Jenkins

1. **New Item** → `todo-list-pipeline`
2. **Pipeline** → **OK**
3. **Pipeline** → **Definition** : `Pipeline script from SCM`
4. **SCM** : `Git`
5. **Repository URL** : URL de votre repo (ou local)
6. **Branches** : `*/main` ou `*/master`
7. **Script Path** : `Jenkinsfile`
8. **Save**
9. **Build Now**

## 📁 Structure des fichiers

```
todo-list/
├── Dockerfile                    # Build de l'image Docker
├── Jenkinsfile                   # Pipeline CI/CD
├── .dockerignore                 # Fichiers ignorés par Docker
├── k8s/
│   ├── deployment.yaml          # Deployment + Service K8s
│   ├── ingress.yaml             # Ingress avec TLS (prod)
│   ├── create-secret.ps1        # Script PowerShell pour secret
│   ├── create-secret.sh         # Script bash pour secret
│   ├── README.md                # Guide déploiement K8s
│   └── KUBERNETES_SETUP.md      # Configuration K8s pour Jenkins
├── JENKINS_SETUP.md             # Guide Jenkins
├── setup-kubernetes.md          # Installation K8s
└── SETUP_COMPLETE.md            # Ce fichier
```

## 🎬 Commandes utiles

### Docker

```powershell
# Build
docker build -t spakalao/todo-list:latest .

# Push
docker push spakalao/todo-list:latest

# Run
docker run -d -p 8090:80 --name todo-app spakalao/todo-list:latest
```

### Kubernetes

```powershell
# Voir les deployments
kubectl get deployments

# Voir les pods
kubectl get pods

# Voir les services
kubectl get svc

# Logs
kubectl logs -l app=todo-list

# Desc
kubectl describe pod -l app=todo-list

# Delete
kubectl delete -f k8s/deployment.yaml
```

### Jenkins

```powershell
# Logs Jenkins
docker logs -f jenkins

# Entrer dans Jenkins
docker exec -it jenkins bash

# Restart Jenkins
docker restart jenkins
```

## 🔗 URLs importantes

- **Jenkins** : http://localhost:8080
- **Todo App (local)** : http://localhost:8090
- **Todo App (K8s NodePort)** : http://localhost:30080
- **Docker Hub** : https://hub.docker.com/r/spakalao/todo-list

## ✅ Checklist finale

- [ ] Secret `regcred` créé dans K8s
- [ ] Credentials Docker Hub configurés dans Jenkins
- [ ] Kubernetes activé dans Docker Desktop
- [ ] Pipeline Jenkins créé
- [ ] Premier build réussi
- [ ] Application accessible via Kubernetes

## 🎯 Prochaines étapes (Bonus)

1. **Ajouter des tests** dans le pipeline
2. **Configurer Webhooks** pour auto-trigger
3. **Ajouter un Ingress** avec un domaine réel
4. **Configurer HTTPS** avec cert-manager
5. **Monitorer** avec Prometheus/Grafana

## 📚 Documentation

- [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Hub](https://docs.docker.com/docker-hub/)

