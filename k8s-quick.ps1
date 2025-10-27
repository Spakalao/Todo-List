# Script d'accès rapide à Kubernetes
Write-Host "=== Kubernetes Quick Access ===" -ForegroundColor Cyan
Write-Host ""

# Menu
Write-Host "Choisissez une option:" -ForegroundColor Yellow
Write-Host "1. Voir les pods" -ForegroundColor White
Write-Host "2. Voir les services" -ForegroundColor White
Write-Host "3. Voir les déploiements" -ForegroundColor White
Write-Host "4. Voir les logs" -ForegroundColor White
Write-Host "5. Démarrer Dashboard" -ForegroundColor White
Write-Host "6. Port-forward vers l'application" -ForegroundColor White
Write-Host "7. Tout afficher" -ForegroundColor White
Write-Host "8. Ouvrir l'application (localhost:30080)" -ForegroundColor White
Write-Host "0. Quitter" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Votre choix"

switch ($choice) {
    "1" {
        Write-Host "`nPods:" -ForegroundColor Green
        kubectl get pods -l app=todo-list
    }
    "2" {
        Write-Host "`nServices:" -ForegroundColor Green
        kubectl get svc
    }
    "3" {
        Write-Host "`nDéploiements:" -ForegroundColor Green
        kubectl get deployment
    }
    "4" {
        Write-Host "`nLogs:" -ForegroundColor Green
        kubectl logs -l app=todo-list --tail=20
    }
    "5" {
        Write-Host "`nDémarrage du dashboard..." -ForegroundColor Green
        Write-Host "URL: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/" -ForegroundColor Yellow
        Start-Process "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"
        kubectl proxy
    }
    "6" {
        Write-Host "`nPort-forward..." -ForegroundColor Green
        $pod = kubectl get pods -l app=todo-list -o jsonpath='{.items[0].metadata.name}'
        Write-Host "Connexion au pod: $pod" -ForegroundColor Yellow
        Write-Host "Accédez via: http://localhost:8080" -ForegroundColor Cyan
        kubectl port-forward $pod 8080:80
    }
    "7" {
        Write-Host "`n=== TOUT ===" -ForegroundColor Green
        Write-Host "`nPods:" -ForegroundColor Yellow
        kubectl get pods -l app=todo-list
        Write-Host "`nServices:" -ForegroundColor Yellow
        kubectl get svc
        Write-Host "`nDéploiements:" -ForegroundColor Yellow
        kubectl get deployment
    }
    "8" {
        Write-Host "`nOuverture de l'application..." -ForegroundColor Green
        Start-Process "http://localhost:30080"
    }
    "0" {
        Write-Host "Au revoir!" -ForegroundColor Green
        exit
    }
    default {
        Write-Host "Choix invalide" -ForegroundColor Red
    }
}

Write-Host ""

