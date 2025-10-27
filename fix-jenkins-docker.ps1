# Script pour corriger les permissions Docker dans Jenkins
# A executer apres chaque redemarrage du conteneur Jenkins

Write-Host "Correction des permissions Docker dans Jenkins..." -ForegroundColor Cyan

# Verifier si Jenkins est en cours d'execution
$jenkinsStatus = docker ps --filter "name=jenkins" --format "{{.Names}}"

if ($jenkinsStatus -notlike "*jenkins*") {
    Write-Host "Jenkins n'est pas en cours d'execution!" -ForegroundColor Red
    Write-Host "Demarrage de Jenkins..." -ForegroundColor Yellow
    
    # Demarrer Jenkins avec les bons volumes
    docker run -d --name jenkins --restart=on-failure -v jenkins_home:/var/jenkins_home -v //var/run/docker.sock:/var/run/docker.sock -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
    
    Write-Host "Attente du demarrage de Jenkins (30 secondes)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host "Installation de Docker CLI..." -ForegroundColor Yellow
    docker exec -u root jenkins sh -c "curl -fsSL https://get.docker.com | sh"
}

Write-Host "Application des permissions Docker..." -ForegroundColor Yellow
docker exec -u root jenkins chmod 666 /var/run/docker.sock

Write-Host "Verification..." -ForegroundColor Yellow
docker exec jenkins docker ps | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Permissions Docker corrigees avec succes!" -ForegroundColor Green
    Write-Host "Jenkins est accessible sur: http://localhost:8080" -ForegroundColor Cyan
} else {
    Write-Host "Erreur lors de la correction des permissions" -ForegroundColor Red
}
