# ⚠️ IMPORTANT - Lire avant de lancer le pipeline!

## 🔧 Problème identifié

Les permissions Docker dans Jenkins se perdent et doivent être ré-appliquées.

## ✅ Solution

**AVANT chaque build du pipeline**, exécutez cette commande:

```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

## 🚀 Workflow recommandé

### Option 1: Manuel (si vous lancez de temps en temps)

1. **Corrigez les permissions:**
   ```powershell
   docker exec -u root jenkins chmod 666 /var/run/docker.sock
   ```

2. **Vérifiez que ça fonctionne:**
   ```powershell
   docker exec jenkins docker ps
   ```

3. **Lancez le pipeline dans Jenkins:**
   - Ouvrez http://localhost:8080
   - `todo-list-pipeline` → Build Now

### Option 2: Automatique avec le script

Utilisez le script PowerShell fourni:

```powershell
.\fix-jenkins-docker.ps1
```

Ce script fait tout automatiquement.

## 📝 Notes

- ⚠️ Les permissions doivent être ré-appliquées **AVANT CHAQUE BUILD**
- ✅ Docker CLI est déjà installé dans Jenkins
- ✅ Le Jenkinsfile est à jour
- ✅ Votre Dockerfile fonctionne correctement

## 🔍 Vérification rapide

Pour vérifier que tout est OK:

```powershell
# 1. Vérifier Jenkins
docker ps | grep jenkins

# 2. Vérifier Docker dans Jenkins
docker exec jenkins docker --version

# 3. Vérifier les permissions
docker exec jenkins ls -la /var/run/docker.sock
# Doit afficher: srw-rw-rw-
```

## 🎯 Maintenant, lancez votre build!

1-hr ↱↙ http://localhost:8080 → todo-list-pipeline → Build Now

