# TodoList React

Cette application permet de gérer une liste de tâches : ajouter, éditer, supprimer, marquer comme terminée, archiver et restaurer.  
L’interface est simple, responsive et disponible en français et anglais.

## Installation

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez le projet :
   ```bash
   npm run dev
   ```

## Fonctionnalités

- Ajouter, modifier, supprimer des tâches
- Marquer comme terminée ou archiver
- Changer la langue de l’interface
## Pipeline CI/CD (Jenkins)

Cette app inclut un pipeline Jenkins qui:
- construit l'image Docker (`spakalao/todo-list:${BUILD_NUMBER}` et `latest`)
- pousse l'image sur Docker Hub
- déploie automatiquement sur Kubernetes (namespace `default`)

### Pré-requis
- Jenkins en cours d'exécution (conteneur ou service)
- Docker disponible pour Jenkins (Docker Desktop sur Windows)
- kubectl disponible côté Jenkins et kubeconfig monté/copier pour accéder au cluster
- Credentials Jenkins: `docker-hub-creds` (Username/Password Docker Hub)

### Fichiers clés
- `Jenkinsfile` : définition du pipeline (Build → Push → Deploy)
- `Dockerfile` : build multi-stage (Node 20 → Nginx)
- `docker-compose.yml` + `Dockerfile.jenkins` : option pour lancer Jenkins avec Docker/kubectl
- `k8s/deployment.yaml`, `k8s/service.yaml` : manifests Kubernetes

### Exécution
1) Poussez sur `master` (ou lancez « Build Now » dans Jenkins)
2) Suivez les logs du stage « Build & Push Docker Image » puis « Deploy to Kubernetes »
3) Vérifiez le déploiement:
   - `kubectl get deployment todo-list -o jsonpath='{.spec.template.spec.containers[0].image}'`
   - L'application est exposée via `NodePort` sur `http://localhost:30080`

Notes:
- Le pipeline vérifie si le `Deployment` existe, le crée si besoin, puis met à jour l'image avec le numéro de build.
- Assurez-vous que le kubeconfig de Jenkins pointe vers votre cluster (Docker Desktop ou autre).

---
Projet réalisé à des fins pédagogiques.