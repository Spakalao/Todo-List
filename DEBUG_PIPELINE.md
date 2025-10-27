# Guide de Debug du Pipeline Jenkins

## Erreur: "script returned exit code 1"

Cette erreur signifie qu'une commande shell dans le pipeline a échoué. Pour comprendre exactement laquelle, nous avons besoin du log complet.

## Comment obtenir le log complet

1. Ouvrez Jenkins: http://localhost:8080
2. Cliquez sur le pipeline `todo-list-pipeline`
3. Dans "Build History", cliquez sur le dernier build (#XX)
4. Cliquez sur **"Console Output"**
5. **Copiez TOUT le contenu** de la console output
6. Collez-le dans votre message

## Causes possibles

### 1. Permissions Docker
Si vous voyez: `permission denied while trying to connect to the Docker daemon socket`

**Solution:**
```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### 2. Erreur de build Docker
Si vous voyez des erreurs de type:
- `failed to solve`
- `ERROR: failed to build`
- `COPY failed`

**Vérification:** Testez le build manuellement:
```powershell
docker build -t test:latest .
```

### 3. Erreur Docker login
Si vous voyez: `Error response from daemon: Get ... unauthorized`

**Solution:** Vérifiez les credentials dans Jenkins:
- Manage Jenkins → Manage Credentials
- Vérifiez que `docker-hub-creds` existe avec le bon mot de passe

### 4. Erreur Docker push
Si vous voyez: `denied: requested access to the resource is denied`

**Solutions:**
- Vérifiez que vous êtes connecté: `docker login`
- Vérifiez le nom de l'image (doit être `spakalao/todo-list`)
- Vérifiez que le repository existe sur Docker Hub

### 5. Problème de réseau
Si vous voyez: `dial tcp ... no such host`

**Solution:** Vérifiez la connectivité réseau du conteneur Jenkins

## Tests rapides

### Test 1: Docker fonctionne dans Jenkins?
```powershell
docker exec jenkins docker ps
```

### Test 2: Docker build fonctionne?
```powershell
docker exec jenkins sh -c "cd /var/jenkins_home/workspace/todo-list-pipeline && docker build -t test:latest ."
```

### Test 3: Jenkins peut accéder à Docker Hub?
```powershell
docker exec jenkins docker pull alpine
```

## Solution automatique

Exécutez le script de fix:
```powershell
.\fix-jenkins-docker.ps1
```

Ce script vérifie et corrige automatiquement les problèmes courants.

