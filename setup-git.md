# Créer un repository GitHub

## Étapes rapides

1. Aller sur https://github.com et se connecter (ou créer un compte)
2. Cliquer sur **"+"** en haut à droite → **New repository**
3. Nom : `todo-list`
4. Description : "React Todo List with CI/CD"
5. Visibilité : Privé ou Public
6. **Ne pas** cocher "Add README" (votre code existe déjà)
7. Cliquer sur **Create repository**

## Push votre code

```powershell
# Aller dans votre dossier
cd C:\Users\cash\Desktop\todo-list

# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers (sauf node_modules)
git add .

# Commit
git commit -m "Initial commit with Jenkins and K8s config"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/todo-list.git

# Push
git branch -M main
git push -u origin main
```

## Utiliser l'URL GitHub dans Jenkins

Dans la configuration du Pipeline :
- **Repository URL** : `https://github.com/VOTRE_USERNAME/todo-list.git`
- **Branches** : `*/main`

