# Script de déploiement manuel sur Kubernetes
param(
    [Parameter(Mandatory=$false)]
    [string]$BuildNumber = "latest"
)

Write-Host "=== Déploiement sur Kubernetes ===" -ForegroundColor Cyan
Write-Host ""

# Si build number n'est pas spécifié, chercher la dernière image
if ($BuildNumber -eq "latest") {
    Write-Host "Aucun numéro de build spécifié." -ForegroundColor Yellow
    Write-Host "Images disponibles:" -ForegroundColor Yellow
    docker images | Select-String "spakalao/todo-list" | Select-Object -First 10
    
    $BuildNumber = Read-Host "`nEntrez le numéro de build à déployer (ou 'latest')"
}

Write-Host "`nDéploiement de spakalao/todo-list:$BuildNumber..." -ForegroundColor Green

try {
    # Mettre à jour l'image
    kubectl set image deployment/todo-list todo-list=spakalao/todo-list:$BuildNumber --record
    
    Write-Host "`nAttente du déploiement..." -ForegroundColor Yellow
    kubectl rollout status deployment/todo-list --timeout=60s
    
    # Vérifier l'image déployée
    $deployedImage = kubectl get deployment todo-list -o jsonpath='{.spec.template.spec.containers[0].image}'
    
    Write-Host "`n✅ Déploiement réussi!" -ForegroundColor Green
    Write-Host "Image déployée: $deployedImage" -ForegroundColor Cyan
    Write-Host "`nPods:" -ForegroundColor Yellow
    kubectl get pods -l app=todo-list
    
    Write-Host "`nAccès: http://localhost:30080" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Erreur lors du déploiement" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

