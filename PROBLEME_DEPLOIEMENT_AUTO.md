# ⚠️ Problème: Déploiement Automatique Ne Fonctionne Pas

## 🎯 Problème Identifié

Le build 31 a été créé mais **n'a pas été automatiquement déployé** sur Kubernetes.

## 🔍 Pourquoi?

Dans le Jenkinsfile, le stage de déploiement Kubernetes est **conditionnel**:

```groovy
stage('Deploy to Kubernetes') {
    when {
        expression { return env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main' }
    }
    steps {
        // Déploiement...
    }
}
```

Cette condition `when` signifie que le déploiement ne se fait **QUE** sur les branches `master` ou `main`.

### Causes possibles:
1. Le build 31 a été fait sur une autre branche (pas master/main)
2. La variable d'environnement `BRANCH_NAME` n'est pas correctement définie
3. Le pipeline n'a pas exécuté le stage de déploiement

## ✅ Solution Appliquée (Manuelle)

J'ai déployé manuellement l'image 31:

```bash
kubectl set image deployment/todo-list todo-list=spakalao/todo-list:31 --record
kubectl rollout status deployment/todo-list --timeout=60s
```

## 🔧 Solutions Permanentes

### Option 1: Forcer le Déploiement (Retirer la condition)

Modifier le Jenkinsfile pour **toujours** déployer:

```groovy
stage('Deploy to Kubernetes') {
    // Retirer le "when" pour toujours déployer
    steps {
        script {
            echo "🚀 Déploiement de ${IMAGE}:${TAG} sur Kubernetes..."
            try {
                sh "kubectl set image deployment/todo-list todo-list=${IMAGE}:${TAG} -n default || true"
            } catch(Exception e) {
                echo "⚠️  Déploiement introuvable, application initiale..."
                sh "kubectl apply -f k8s/deployment.yaml"
            }
            sh "kubectl rollout status deployment/todo-list -n default --timeout=300s || true"
        }
    }
}
```

### Option 2: Vérifier la Branche dans Jenkins

Dans Jenkins:
1. Allez sur votre pipeline
2. Vérifiez le dernier build
3. Regardez dans "Environment" quelle est la valeur de `BRANCH_NAME`

### Option 3: Déploiement Manuel pour Chaque Build

Créez un script PowerShell `deploy-k8s.ps1`:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$BuildNumber
)

Write-Host "Déploiement de l'image $BuildNumber sur Kubernetes..." -ForegroundColor Cyan

kubectl set image deployment/todo-list todo-list=spakalao/todo-list:$BuildNumber --record
kubectl rollout status deployment/todoạn-list --timeout=60s

Write-Host "✅ Image $BuildNumber déployée!" -ForegroundColor Green
```

Usage:
```bash
.\deploy-k8s.ps1 -BuildNumber 31
```

### Option 4: Vérifier la Configuration Pipeline

Dans Jenkins:
1. Configure le pipeline → Build Configuration
2. Vérifiez que "Scan Repository Triggers" est activé
3. Vérifiez le paramètre "Branches to build": doit être `*/master` ou `*/main`

## 📊 Comment Vérifier

### Vérifier l'image déployée

```bash
# Version actuelle
kubectl get deployment todo-list -o jsonpath='{.spec.template.spec.containers[0].image}'

# Historique des déploiements
kubectl rollout history deployment/todo-list
```

### Vérifier les pods

```bash
kubectl get pods -l app=todo-list

# Voir l'image utilisée par chaque pod
kubectl describe pod <nom-du-pod> | grep Image:
```

## 🎯 Recommandation

**Pour un déploiement automatique fiable:**

1. **Retirez la condition `when`** du stage de déploiement dans le Jenkinsfile
2. OU **ajoutez un paramètre de branche** pour contrôler le déploiement
3. OU **utilisez les webhooks GitLab** pour déclencher le pipeline sur push vers master

## 🔄 Prochaine Fois

Pour déployer manuellement une nouvelle image:

```bash
# Trouver le dernier build
docker images | grep spakalao/todo-list

# Déployer
kubectl set image deployment/todo-list todo-list=spakalao/todo-list:<BUILD_NUMBER> --record

# Vérifier
kubectl rollout status deployment/todo-list
```

## ✅ État Actuel

- ✅ Image 31 déployée manuellement
- ✅ Kubernetes utilise maintenant: `spakalao/todo-list:31`
- ⚠️ Déploiement automatique ne fonctionne pas à cause de la condition `when`

---

**Question:** Sur quelle branche le build 31 a-t-il été fait?

