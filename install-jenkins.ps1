# Script d'installation Jenkins complet
# Installe et configure Jenkins avec Docker

Write-Host "Installation de Jenkins avec Docker..." -ForegroundColor Cyan

# Arrêter et supprimer l'ancien conteneur si existant
Write-Host "Nettoyage de l'ancienne installation..." -ForegroundColor Yellow
docker stop jenkins 2>$null
docker rm jenkins 2>$null

# Construire l'image Jenkins personnalisée
Write-Host "Construction de l'image Jenkins personnalisee..." -ForegroundColor Yellow
docker build -f Dockerfile.jenkins -t jenkins-custom:latest .

# Démarrer Jenkins avec docker-compose
Write-Host "Demarrage de Jenkins..." -ForegroundColor Yellow
docker-compose up -d

# Attendre que Jenkins démarre
Write-Host "Attente du demarrage de Jenkins (60 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# Corriger les permissions Docker
Write-Host "Correction des permissions Docker..." -ForegroundColor Yellow
docker exec -u root jenkins chmod 666 /var/run/docker.sock

# Vérifier que tout fonctionne
Write-Host "Verification..." -ForegroundColor Yellow
docker exec jenkins docker ps | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Jenkins installe avec succes!" -ForegroundColor Green
    Write-Host "Accedez a Jenkins sur: http://localhost:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Mot de passe initial:" -ForegroundColor Yellow
    Write-Host "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword" -ForegroundColor White
} else {
    Write-Host "Erreur lors de l'installation" -ForegroundColor Red
}

