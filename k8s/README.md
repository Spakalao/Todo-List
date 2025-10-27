# Déploiement Kubernetes pour Todo List

## Fichiers disponibles

- `deployment.yaml` : Deployment et Service pour l'application
- `ingress.yaml` : Ingress avec TLS pour la production

## Déploiement

### 1. Déploiement de base (development/staging)

```bash
# Appliquer le deployment et le service
kubectl apply -f deployment.yaml

# Vérifier les pods
kubectl get pods -l app=todo-list

# Vérifier le service
kubectl get svc todo-list-svc

# Accéder via NodePort (remplacer <node-ip> par l'IP de votre node)
# http://<node-ip>:30080
```

### 2. Déploiement production avec Ingress + TLS

```bash
# 1. Modifier ingress.yaml pour votre domaine
# Remplacer todo-list.yourdomain.com par votre domaine

# 2. Appliquer le deployment
kubectl apply -f deployment.yaml

# 3. Appliquer l'ingress (nécessite cert-manager pour TLS automatique)
kubectl apply -f ingress.yaml

# 4. Vérifier l'ingress
kubectl get ingress todo-list-ingress
```

## Mise à jour de l'image

```bash
# 1. Build et push la nouvelle image
docker build -t spakalao/todo-list:1.1.0 .
docker push spakalao/todo-list:1.1.0

# 2. Mettre à jour l'image dans Kubernetes
kubectl set image deployment/todo-list todo-list=spakalao/todo-list:1.1.0

# Ou modifier directement le fichier deployment.yaml
# Changer: image: spakalao/todo-list:latest vers image: spakalao/todo-list:v1.1.0
# Puis: kubectl apply -f deployment.yaml
```

## Commandes utiles

```bash
# Voir les logs
kubectl logs -l app=todo-list

# Scale up/down
kubectl scale deployment/todo-list --replicas=3

# Supprimer tout
kubectl delete -f deployment.yaml
kubectl delete -f ingress.yaml
```

## Configuration requise

- Kubernetes cluster (minikube, kind, EKS, GKE, AKS, etc.)
- Pour l'ingress TLS : cert-manager installé sur le cluster
- Image Docker accessible depuis le cluster (Docker Hub, registry privé, etc.)

