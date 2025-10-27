# 🎯 Configuration du Pipeline Jenkins - Guide Complet

## 📋 Étape 1: Accéder à Jenkins

1. Ouvrez votre navigateur
2. Allez sur **http://localhost:8080**

## 🔐 Étape 2: Récupérer le mot de passe initial

Si c'est la première fois que vous utilisez Jenkins, récupérez le mot de passe :

```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Copiez le mot de passe affiché**

## 📝 Étape 3: Configuration initiale Jenkins

1. **Collez le mot de passe** dans la page de déverrouillage
2. Cliquez sur **"Install suggested plugins"** (installation des plugins recommandés)
3. Attendez la fin de l'installation (quelques minutes)
4. **Créez un compte admin** :
   - Username: `admin`
   - Password: (choisissez votre mot de passe)
   - Email: (votre email)
5. Cliquez sur **"Save and Continue"**
6. Cliquez sur **"Start using Jenkins"**

## 🔑 Étape 4: Configurer les Credentials Docker Hub

1. Dans le menu de gauche, cliquez sur **"Manage Jenkins"**
2. Cliquez sur **"Manage Credentials"**
3. Cliquez sur **(global)** dans "Stores scoped to Jenkins"
4. Cliquez sur **"Add Credentials"** (en haut à gauche)
5. Remplissez le formulaire :
   ```
   Kind: Username with password
   Scope: Global
   Username: spakalao
   Password: [votre mot de passe Docker Hub]
   ID: docker-hub-creds  ← IMPORTANT!
   Description: Docker Hub Credentials
   ```
6. Cliquez sur **"Create"**

## 🚀 Étape 5: Créer le Pipeline

1. Dans le menu de gauche, cliquez sur **"New Item"**
2. **Nom** : `todo-list-pipeline`
3. Sélectionnez **"Pipeline"**
4. Cliquez sur **"OK"**

## ⚙️ Étape 6: Configurer le Pipeline

Vous êtes maintenant dans la page de configuration du pipeline. Remplissez :

### Section "General"
- **Description** (optionnel) : "CI/CD Pipeline for Todo List"

### Section "Pipeline"
- **Definition** : Sélectionnez **"Pipeline script from SCM"**
- **SCM** : Sélectionnez **"Git"**
- **Repositories** :
  ```
  Repository URL: https://gitlab.com/saidi.amine2023/todolist.git
  Credentials: (laisser vide si public)
  Branches to build: */master
  ```
- **Script Path** : `Jenkinsfile`

### Cliquez sur **"Save"**

## 🎬 Étape 7: Lancer le premier Build

1. Vous êtes maintenant sur la page du pipeline `todo-list-pipeline`
2. Cliquez sur **"Build Now"** dans le menu de gauche
3. Un build apparaît dans **"Build History"** avec le numéro #1
4. Cliquez sur le numéro **#1**
5. Cliquez sur **"Console Output"** pour voir les logs en temps réel

## ✅ Étape 8: Vérifier le résultat

Le pipeline va exécuter :
1. ✅ **Checkout** - Récupère le code depuis Git
2. ✅ **Build & Push Docker Image** - Build et push sur Docker Hub
3. ✅ **Deploy to Kubernetes** - Déploiement (si sur master)

## 🔄 Étape 9: Avant chaque Build (IMPORTANT!)

**Avant de lancer chaque build**, vous devez corriger les permissions Docker :

```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

## 📊 Vérifier le résultat

### Sur Docker Hub
Allez sur https://hub.docker.com/r/spakalao/todo-list
Votre image devrait apparaître : `spakalao/todo-list:BUILD_NUMBER`

### Sur Kubernetes (si déployé)
```powershell
kubectl get pods -l app=todo-list
kubectl get svc todo-list-svc
```

## 🐛 Si ça ne marche pas

### Erreur "permission denied"
```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
docker exec jenkins docker ps
```

### Erreur "credentials not found"
Vérifiez que l'ID des credentials est exactement `docker-hub-creds`

### Erreur "failed to push"
Vérifiez votre mot de passe Docker Hub

## 🎉 C'est tout!

Votre pipeline est maintenant configuré et prêt à l'emploi. Chaque fois que vous lancez un build, il va automatiquement :
- Build votre application
- Créer une image Docker
- La push sur Docker Hub
- La déployer sur Kubernetes (si sur master)

**Bon build! 🚀**

