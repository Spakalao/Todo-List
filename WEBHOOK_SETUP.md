# Configuration Webhook Git → Jenkins

## 🔗 Objectif

Configurer un webhook pour déclencher automatiquement le pipeline Jenkins à chaque push sur GitHub/GitLab.

---

## 📋 GitHub Webhook

### Étape 1 : Configuration GitHub

1. Aller sur votre repository GitHub (ex: `https://github.com/spakalao/todo-list`)
2. Cliquer sur **Settings**
3. Dans le menu de gauche, cliquer sur **Webhooks**
4. Cliquer sur **Add webhook**

### Étape 2 : Configurer le webhook

- **Payload URL** : `http://<VOTRE_IP>:8080/github-webhook/`
  
  **Exemple** :
  - Si Jenkins tourne en local : `http://localhost:8080/github-webhook/`
  - Si Jenkins est accessible depuis internet : `http://<VOTRE_IP_PUBLIQUE>:8080/github-webhook/`
  
- **Content type** : `application/json`

- **Secret** : (laisser vide pour début, ou générer un secret si vous voulez sécuriser)
  
- **Which events would you like to trigger this webhook?**
  - ✅ Cocher **Just the push event** (recommandé pour commencer)
  - Ou cocher **Let me select individual events** et cocher :
    - Push
    - Pull request

- **Active** : ✅ Cochée

5. Cliquer sur **Add webhook**

### Étape 3 : Tester

1. Faire un commit et push sur votre repository
2. Vérifier dans Jenkins que le pipeline se lance automatiquement

---

## 📋 GitLab Webhook

### Étape 1 : Configuration GitLab

1. Aller sur votre projet GitLab
2. Cliquer sur **Settings** → **Webhooks**

### Étape 2 : Configurer le webhook

- **URL** : `http://<VOTRE_IP>:8080/project/todo-list-pipeline`
  
  **Exemple** :
  - Local : `http://localhost:8080/project/todo-list-pipeline`

- **Trigger** : Cocher **Push events**

- **Secret token** : (optionnel)

3. Cliquer sur **Add webhook**

### Étape 3 : Tester

Faire un push et vérifier que le pipeline démarre dans Jenkins.

---

## 🚨 Important : Accessibilité de Jenkins

### Si Jenkins est accessible uniquement en local (localhost)

Le webhook GitHub/GitLab ne pourra **pas** accéder à `localhost:8080` depuis l'extérieur.

**Solutions :**

#### Option 1 : Utiliser ngrok (pour tester rapidement)

```powershell
# Installer ngrok
# Télécharger depuis https://ngrok.com/download

# Lancer ngrok
ngrok http 8080

# Vous obtiendrez une URL publique comme : https://abc123.ngrok.io
# Utilisez cette URL dans le webhook GitHub
```

#### Option 2 : Exposer Jenkins sur internet

Si vous avez un serveur accessible publiquement :

1. Configurer le firewall pour ouvrir le port 8080
2. Utiliser votre IP publique dans le webhook

#### Option 3 : Polling (vérification périodique)

Dans Jenkins, configurer le pipeline pour vérifier automatiquement :

1. Dans votre Pipeline → **Configure**
2. Cocher **Build Triggers** → **Poll SCM**
3. Entrer : `H/5 * * * *` (vérifie toutes les 5 minutes)
4. **Save**

---

## 🧪 Tests et Debugging

### Tester le webhook manuellement

#### Depuis GitHub

1. Allez sur votre repository → **Settings** → **Webhooks**
2. Cliquez sur le webhook que vous venez de créer
3. Dans **Recent Deliveries**, trouvez le dernier événement
4. Cliquez sur le dernier événement pour voir les détails

**Réponse attendue** : `200 OK`

#### Depuis GitLab

1. Allez sur **Settings** → **Webhooks**
2. Dans **Recent events**, vérifiez les événements envoyés

### Vérifier les logs Jenkins

```powershell
# Voir les logs de Jenkins
docker logs -f jenkins

# Chercher les erreurs de webhook
docker logs jenkins 2>&1 | findstr webhook
```

### Tester le déclenchement manuel

```powershell
# Forcer un build depuis la ligne de commande
curl -X POST http://localhost:8080/job/todo-list-pipeline/build --user admin:password
```

---

## 🔧 Résolution de problèmes

### Problème : Webhook ne se déclenche pas

**Vérifications :**
1. ✅ Jenkins est bien démarré (`docker ps | findstr jenkins`)
2. ✅ Le webhook existe dans GitHub/GitLab
3. ✅ L'URL du webhook est correcte
4. ✅ Jenkins est accessible depuis internet (ou utilisez ngrok)

### Problème : "Permission denied" ou "Authentication failed"

Si vous avez configuré un secret dans le webhook, configurez le même secret dans Jenkins :

1. Jenkins → **Configure System** → **GitHub**
2. Ajouter le secret dans la configuration

### Problème : Pipeline se lance mais ne récupère pas les changements

Vérifier les credentials Git dans Jenkins :

1. **Manage Jenkins** → **Manage Credentials**
2. Ajouter les credentials Git si nécessaire

---

## 📝 Configuration avancée Jenkins

### Trigger uniquement sur certaines branches

Dans le Jenkinsfile, la condition existe déjà pour master/main :

```groovy
stage('Deploy to Kubernetes') {
  when {
    expression { return env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main' }
  }
  // ...
}
```

### Trigger manuel + webhook

Vous pouvez avoir les deux :
- **Webhook** déclenche automatiquement sur push
- **Build Now** pour déclencher manuellement

---

## ✅ Checklist Webhook

- [ ] Webhook GitHub/GitLab créé
- [ ] URL correcte configurée
- [ ] Événements configurés (push)
- [ ] Jenkins accessible (local ou via ngrok/IP publique)
- [ ] Test de push effectué
- [ ] Pipeline se lance automatiquement
- [ ] Logs Jenkins vérifiés

---

## 🎯 Exemple de configuration complète

### 1. Jenkins Pipeline créé

- Nom : `todo-list-pipeline`
- Type : Pipeline
- Définition : Pipeline script from SCM
- Repository : URL de votre repo Git
- Script Path : `Jenkinsfile`

### 2. Webhook GitHub configuré

- URL : `http://localhost:8080/github-webhook/` (ou ngrok URL)
- Events : Push
- Content type : application/json

### 3. Test

```bash
# Faire un changement
echo "# Test" >> README.md
git add README.md
git commit -m "Test webhook"
git push

# Vérifier Jenkins
# Le pipeline devrait démarrer automatiquement
```

---

## 🔗 Ressources

- [Jenkins GitHub Webhooks](https://plugins.jenkins.io/github/)
- [Jenkins GitLab Plugin](https://plugins.jenkins.io/gitlab-plugin/)
- [ngrok Documentation](https://ngrok.com/docs)

