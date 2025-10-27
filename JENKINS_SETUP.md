# Configuration Jenkins pour le Pipeline CI/CD

## 📋 Prérequis

1. **Jenkins** (installé et accessible sur http://localhost:8080)
2. **Credentials Docker Hub** configurés
3. **Cluster Kubernetes** accessible (optionnel pour la dernière étape)

## 🔧 Configuration de Jenkins

### 1. Installer les plugins nécessaires

Allez dans **Manage Jenkins** → **Manage Plugins** → **Available** et installez :

- ✅ **Git** (généralement déjà installé)
- ✅ **Pipeline**
- ✅ **Docker Pipeline**
- ✅ **Kubernetes CLI**
- ✅ **Credentials Binding**

### 2. Configurer les Credentials

#### Credentials Docker Hub

1. **Manage Jenkins** → **Manage Credentials**
2. **(global)** → **Add Credentials**
3. Remplir :
   - **Kind** : `Username with password`
   - **Username** : `spakalao`
   - **Password** : votre mot de passe Docker Hub
   - **ID** : `docker-hub-creds`
   - **Description** : Docker Hub Credentials

### 3. Créer le Pipeline

#### Option A : Pipeline déclaratif (via Jenkinsfile)

1. **New Item** → Nom : `todo-list-pipeline`
2. Sélectionner **Pipeline**
3. Dans **Pipeline** :
   - **Definition** : `Pipeline script from SCM`
   - **SCM** : `Git`
   - **Repository URL** : votre repo Git (ou local si développement)
   - **Branch** : `*/main` ou `*/master`
   - **Script Path** : `Jenkinsfile`

#### Option B : Pipeline depuis un repo Git

Si votre code est sur GitHub/GitLab :

1. Créer un nouveau job **Multibranch Pipeline**
2. Configuration Git :
   - **Project Repository** : URL de votre repo
   - **Scan Multibranch Pipeline Triggers** : cocher **Build when branch origin is updated**

## 🚀 Utilisation du Pipeline

### Étapes du Pipeline

1. **Checkout** : Récupère le code depuis Git
2. **Install Dependencies** : Lance `npm ci`
3. **Build** : Lance `npm run build`
4. **Docker Build & Push** :
   - Build l'image Docker
   - Tag avec le numéro de build
   - Push sur Docker Hub (`spakalao/todo-list:BUILD_NUMBER` et `:latest`)
5. **Deploy to Kubernetes** (uniquement sur master/main) :
   - Met à jour ou crée le déploiement Kubernetes

### Lancer le Pipeline

1. Dans Jenkins, cliquez sur votre pipeline
2. **Build Now**
3. Suivez la progression dans **Console Output**

### Vérifier les déploiements

```bash
# Vérifier les pods
kubectl get pods -l app=todo-list

# Vérifier le service
kubectl get svc todo-list-svc

# Accéder à l'application
# Si NodePort: http://<node-ip>:30080
# Si Ingress: http://todo-list.yourdomain.com
```

## 🔄 Webhooks (Bonus)

Pour déclencher automatiquement le pipeline à chaque push Git :

### GitHub

1. Dans votre repo GitHub → **Settings** → **Webhooks**
2. **Add webhook**
3. **Payload URL** : `http://your-jenkins-url/github-webhook/`
4. **Content type** : `application/json`
5. **Events** : Cocher **Just the push event**

### GitLab

1. Dans votre projet GitLab → **Settings** → **Webhooks**
2. **URL** : `http://your-jenkins-url/project/todo-list-pipeline`
3. **Trigger** : Cocher **Push events**

## 📝 Commandes utiles

```powershell
# Lancer le pipeline manuellement
# Via Jenkins UI : Build Now

# En ligne de commande
docker exec jenkins java -jar /var/jenkins_home/war/WEB-INF/jenkins-cli.jar -s http://localhost:8080 build todo-list-pipeline

# Voir les logs du pipeline
docker logs -f jenkins
```

## 🐛 Résolution de problèmes

### Problème : "Cannot connect to Docker daemon"

Ajoutez Jenkins au groupe Docker dans WSL ou utilisez le socket Docker :
```yaml
# Dans Jenkins container, monter le socket Docker
-v /var/run/docker.sock:/var/run/docker.sock
```

### Problème : "Credentials not found"

Vérifiez que l'ID `docker-hub-creds` existe dans Jenkins → Manage Credentials.

### Problème : "kubectl not found"

Installez `kubectl` dans le conteneur Jenkins ou utilisez un plugin Kubernetes.

## 📚 Ressources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Kubernetes Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)

