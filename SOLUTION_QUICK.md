# 🔧 Solution Rapide - Erreur Jenkins Pipeline

## Problème: "script returned exit code 1"

Votre Dockerfile fonctionne parfaitement en local. Le problème vient de l'exécution dans Jenkins.

## ⚡ Solutions à essayer (dans l'ordre)

### 1. Vérifier les permissions Docker
```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### 2. Vérifier que Docker fonctionne dans Jenkins
```powershell
docker exec jenkins docker ps
docker exec jenkins docker build --version
```

### 3. Tester un build Docker depuis Jenkins
```powershell
# Copier le Dockerfile dans le workspace Jenkins
docker cp Dockerfile jenkins:/tmp/Dockerfile
docker cp package.json jenkins:/tmp/package.json

# Tester le build
docker exec jenkins sh -c "cd /tmp && docker build -t test:latest ."
```

### 4. Vérifier les credentials Docker Hub
Dans Jenkins UI:
- Manage Jenkins → Manage Credentials
- Vérifiez que `docker-hub-creds` existe
- Vérifiez que l'ID est exactement: `docker-hub-creds`

### 5. Relancer avec le script de fix
```powershell
.\fix-jenkins-docker.ps1
```

## 🔍 Pour un diagnostic complet

Copiez le log COMPLET de la console output:

1. Jenkins → todo-list-pipeline
2. Build #XX → Console Output  
3. Copiez TOUT (pas seulement l'erreur)
4. Envoyez-moi le log complet

Le log va me montrer EXACTEMENT quelle commande échoue.

## 📋 Checklist avant de relancer

- [ ] Permissions Docker appliquées (chmod 666)
- [ ] Docker CLI installé dans Jenkins
- [ ] Docker fonctionne: `docker exec jenkins docker ps`
- [ ] Credentials Docker Hub configurés
- [ ] Workspace Jenkins accessible

## 🚀 Lancer le pipeline

Une fois les vérifications faites:
1. http://localhost:8080
2. todo-list-pipeline → Build Now
3. Surveillez le Console Output

