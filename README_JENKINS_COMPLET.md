# 🚀 Installation Complète Jenkins CI/CD

Guide complet pour installer et configurer Jenkins avec Docker pour votre pipeline CI/CD.

## 📋 Prérequis

- Docker Desktop installé et lancé
- Git installé
- Un compte Docker Hub

## 🔧 Installation (Une seule fois)

### Étape 1: Installation automatique

Exécutez le script d'installation:

```powershell
.\install-jenkins.ps1
```

Ce script va:
1. Arrêter l'ancien Jenkins (si existe)
2. Construire une image Jenkins personnalisée avec Docker
3. Démarrer Jenkins avec les bonnes configurations
4. Corriger les permissions Docker automatiquement

### Étape 2: Configuration initiale

1. Ouvrez http://localhost:8080
2. Récupérez le mot de passe initial:
   ```powershell
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Choisissez "Install suggested plugins"
4. Créez un compte admin
5. Jenkins est maintenant prêt!

### Étape 3: Configuration Docker Hub

1. Manage Jenkins → Manage Credentials
2. (global) → Add Credentials
3. Remplissez:
   - **Kind:** Username with password
   - **Username:** spakalao
   - **Password:** votre mot de passe Docker Hub
   - **ID:** docker-hub-creds
   - **Description:** Docker Hub Credentials

### Étape 4: Créer le Pipeline

1. New Item → Nom: `todo-list-pipeline`
2. Type: **Pipeline**
3. Dans Pipeline:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** https://gitlab.com/saidi.amine2023/todolist.git
   - **Branch:** */master
   - **Script Path:** Jenkinsfile

## 🎯 Utilisation

### Lancer un build

1. Ouvrez Jenkins: http://localhost:8080
2. Cliquez sur `todo-list-pipeline`
3. Cliquez sur "Build Now"
4. Cliquez sur le numéro du build pour voir les logs
5. C'est tout! ✅

## 🔧 Solutions aux problèmes

### Problème: "permission denied" sur Docker

Si vous voyez cette erreur, exécutez:

```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Redémarrer Jenkins

```powershell
docker-compose restart jenkins
```

### Voir les logs

```powershell
docker-compose logs -f jenkins
```

### Réinstaller complètement

```powershell
docker-compose down -v
.\install-jenkins.ps1
```

## 📁 Structure des fichiers

- `Dockerfile.jenkins` - Image Jenkins personnalisée avec Docker
- `docker-compose.yml` - Configuration Jenkins
- `Jenkinsfile` - Définition du pipeline CI/CD
- `install-jenkins.ps1` - Script d'installation automatique
- `jenkins-init.groovy` - Script d'initialisation Jenkins

## 🎉 C'est prêt!

Votre pipeline CI/CD est maintenant opérationnel. Chaque commit sur master déclenchera:
1. ✅ Build de l'application React
2. ✅ Création de l'image Docker
3. ✅ Push vers Docker Hub
4. ✅ Déploiement sur Kubernetes

## 🔄 Workflow

1. **Développement** → Code sur Git
2. **Push** → GitLab/GitHub
3. **Jenkins** → Build automatique
4. **Docker Hub** → Image stockée
5. **Kubernetes** → Application déployée

Profitez! 🚀

