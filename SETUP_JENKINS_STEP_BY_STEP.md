# 🎯 Configuration Jenkins - Guide pas à pas

## 📋 Prérequis

- ✅ Jenkins accessible sur http://localhost:8080
- ✅ Mot de passe Docker Hub disponible
- ✅ Repository Git créé (ou code local)

---

## 🚀 Étape 1 : Créer le Credential Docker Hub

### Méthode 1 : Via l'interface Jenkins (Graphique)

1. **Ouvrir Jenkins** : http://localhost:8080

2. **Se connecter** si demandé :
   - Username : `admin` (ou celui configuré)
   - Password : Le mot de passe affiché lors du premier démarrage de Jenkins
     - Si oublié : `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`

3. **Aller dans les paramètres** :
   - Cliquer sur **"Manage Jenkins"** dans le menu de gauche

4. **Gérer les credentials** :
   - Cliquer sur **"Manage Credentials"**

5. **Sélectionner le scope** :
   - Cliquer sur **(global)** dans "Stores scoped to Jenkins"

6. **Ajouter un credential** :
   - Cliquer sur **"Add Credentials"** en haut à gauche (ou dans "Global credentials")

7. **Remplir le formulaire** :
   ```
   Kind: [Dropdown] → Sélectionner "Username with password"
   Scope: Global (par défaut)
   Username: spakalao
   Password: [Entrer votre mot de passe Docker Hub]
   ID: docker-hub-creds  ⚠️ C'est important !
   Description: Docker Hub credentials for CI/CD
   ```

8. **Créer** : Cliquer sur **"OK"** ou **"Create"**

9. **Vérifier** : Le credential `docker-hub-creds` devrait apparaître dans la liste

### Méthode 2 : Via Jenkins CLI (pour les habitués)

Si vous préférez la ligne de commande :

```bash
# Créer le credential via XML
docker exec -it jenkins bash
```

Créer un fichier `credentials.xml` dans le conteneur (mais la méthode graphique est plus simple).

---

## 🎬 Étape 2 : Créer le Pipeline

### 1. Créer un nouvel élément

1. Dans Jenkins, cliquer sur **"New Item"** dans le menu de gauche

2. Nommer le pipeline :
   - **Item name** : `todo-list-pipeline`
   - **Type** : Sélectionner **"Pipeline"** 
   - Cliquer sur **OK**

### 2. Configurer le Pipeline

Vous arrivez sur la page de configuration. Remplir :

#### General (Section générale)

- **Description** (optionnel) : "CI/CD Pipeline for React Todo List"

#### Build Triggers (Déclencheurs - optionnel pour l'instant)

- Vous pouvez laisser vide pour l'instant
- Ou cocher **"Poll SCM"** et entrer `H/5 * * * *` pour vérifier toutes les 5 minutes

#### Pipeline (Section principale)

**Definition** : Sélectionner **"Pipeline script from SCM"**

**SCM** : Sélectionner **"Git"**

**Repositories** :

##### Option A : Repository local (pour développement local)

```
Repository URL: file:///C:/Users/cash/Desktop/todo-list
```

⚠️ Sur Windows, utilisez le format `file:///` avec des slashs forwards.

##### Option B : Repository Git distant (GitHub/GitLab)

```
Repository URL: https://github.com/votreusername/todo-list.git
```

Si repository privé, cliquer sur **"Add"** sous Credentials :
- Kind: Username with password
- Username: votre username GitHub
- Password: votre token GitHub (Personal Access Token)
- ID: github-credentials

**Credentials** : Sélectionner les credentials créés (si repository privé)

**Branches to build** : `*/main` ou `*/master`

**Script Path** : `Jenkins holder`

**Lightweight checkout** : Décocher (optionnel)

### 3. Sauvegarder

Cliquer sur **"Save"** en bas de la page

---

## 🧪 Étape 3 : Lancer le premier build

### Lancer le build

1. Vous êtes maintenant sur la page du pipeline `todo-list-pipeline`
2. Cliquer sur **"Build Now"** dans le menu de gauche
3. Un build apparaît dans **"Build History"** avec le numéro #1

### Suivre le build en temps réel

1. Cliquer sur le build #1
2. Cliquer sur **"Console Output"** dans le menu
3. Vous voyez la sortie du build en temps réel

### Ce qui devrait se passer

Le pipeline va exécuter ces stages :

1. **Checkout** ✅ → Récupère le code
2. **Install Dependencies** ✅ → `npm ci`
3. **Build** ✅ → `npm run build`
4. **Docker Build & Push** ✅ → Build et push sur Docker Hub
5. **Deploy to Kubernetes** ⚠️ → Se lance seulement sur master/main

### Si tout est vert ✅

Félicitations ! Votre pipeline fonctionne !

### Si erreur ❌

Voir la section **Résolution de problèmes** ci-dessous.

---

## 📊 Étape 4 : Vérifier le résultat

### Vérifier Docker Hub

```powershell
# Vérifier que l'image a été pushée
docker pull spakalao/todo-list:latest
```

Ou aller sur https://hub.docker.com/r/spakalao/todo-list

### Vérifier Kubernetes (si déployé)

```powershell
kubectl get pods -l app=todo-list
kubectl get svc todo-list-svc
```

### Accéder à l'application

Si le service NodePort est configuré :
- URL : http://localhost:30080

---

## 🐛 Résolution de problèmes

### Erreur : "Credentials not found: docker-hub-creds"

**Solution** :
1. Vérifier que le credential existe : Jenkins → Manage Credentials
2. Vérifier que l'ID est exactement `docker-hub-creds` (respecter la casse)
3. Re-créer le credential avec le bon ID

### Erreur : "Failed to push to Docker Hub"

**Solutions** :
1. Vérifier que vous êtes connecté à internet depuis Jenkins
2. Vérifier le mot de passe Docker Hub
3. Vérifier que le repository `spakalao/todo-list` existe sur Docker Hub
4. Tester manuellement :
   ```powershell
   docker exec -it jenkins bash
   docker login -u spakalao -p VOTRE_PASSWORD
   ```

### Erreur : "npm: not found" ou "node: not found"

**Solution** :
- Vérifier que les outils sont disponibles dans le conteneur Jenkins
- Ou utiliser une image Jenkins avec Node.js pré-installé

### Erreur : "kubectl: not found"

**Solution** :
```bash
# Installer kubectl dans le conteneur Jenkins
docker exec -it jenkins bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/
```

### Erreur : "Cannot connect to Docker daemon"

**Solution** :
Le conteneur Jenkins doit accéder au daemon Docker EVITER DE MONTER LE SOCKET DOCKER DANS JENKINS CAR C'EST UNE HABITUDE.

### Repository local non trouvé

**Solution** :
- Utiliser le chemin absolu : `file:///C:/Users/cash/Desktop/todo-list`
- Ou push sur GitHub et utiliser l'URL GitHub

---

## 🎯 Checklist de configuration

- [ ] Credential `docker-hub-creds` créé dans Jenkins
- [ ] Pipeline `todo-list-pipeline` créé
- [ ] Repository URL configuré (local ou distant)
- [ ] Script Path = `Jenkinsfile`
- [ ] Premier build lancé
- [ ] Build réussi (toutes les étapes passées)
- [ ] Image pushée sur Docker Hub vérifiée

---

## 📚 Commandes utiles

### Voir les logs Jenkins

```powershell
docker logs -f jenkins complete
```

### Entrer dans le conteneur Jenkins

```powershell
docker exec -it jenkins bash
```

### Forcer un nouveau build

Dans Jenkins UI : **Build Now**

Ou en CLI :
```powershell
curl -X POST http://localhost:8080/job/todo-list-pipeline/build --user admin:password
```

---

## 🎉 Une fois tout configuré

Votre workflow sera :

1. **Code push** → both Jenkins
2. **Jenkins** → Build + Test + Docker + Deploy
3. **Docker Hub** → Image stockée
4. **Kubernetes** → App déployée
5. **User** → Accède à l'application sur http://localhost:30080

Félicitations ! Votre pipeline CI/CD est opérationnel ! 🚀

