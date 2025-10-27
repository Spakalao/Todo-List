# Jenkins Pipeline - Guide de Debug

## ✅ État actuel

- ✅ Jenkins opérationnel
- ✅ Docker CLI installé (v28.5.1)
- ✅ Permissions Docker correctes (srw-rw-rw-)
- ✅ Dockerfile testé localement avec succès

## 🔴 Problème en cours

Erreur: `script returned exit code 1` dans le pipeline

**Cause possible:** Une commande shell échoue quelque part dans le pipeline

## 📋 Pour identifier le problème

### Copier le log complet
1. Ouvrez http://localhost:8080
2. Cliquez sur `todo-list-pipeline`
3. Cliquez sur le dernier build (#XX) dans "Build History"
4. Cliquez sur **"Console Output"**
5. Scroll vers le bas et trouvez les lignes AVANT l'erreur
6. Copiez tout le log depuis le début du stage qui échoue

### Points à vérifier dans le log

Recherchez ces sections:

```
[Pipeline] echo
Logging into Docker Hub...
[Pipeline] sh
+ docker login ...
```

Qu'est-ce qui est affiché après? Succès ou erreur?

```
[Pipeline] echo
Verifying Docker access...
[Pipeline] sh
+ docker ps
```

Quel résultat?

```
[Pipeline] echo
Building Docker image...
[Pipeline] sh
+ docker build ...
```

Quelle est l'erreur exacte ici?

## 🛠️ Commandes utiles

### Vérifier Jenkins
```powershell
docker ps | grep jenkins
```

### Corriger les permissions
```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Tester Docker dans Jenkins
```powershell
docker exec jenkins docker ps
```

### Tester un build
```powershell
docker exec jenkins docker build -t test:latest /tmp
```

### Script de fix automatique
```powershell
.\fix-jenkins-docker.ps1
```

## 📞 Envoyer les informations

Quand vous envoyez le log, incluez:
- Les 50 dernières lignes AVANT l'erreur
- Tous les messages d'erreur
- Les sections "docker login", "docker build", "docker push"

Cela permettra d'identifier exactement quelle commande échoue!

