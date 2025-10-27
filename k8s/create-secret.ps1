# Script PowerShell pour créer le secret Docker Registry dans Kubernetes
# Usage: .\k8s\create-secret.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$DockerPassword,
    
    [Parameter(Mandatory=$true)]
    [string]$DockerEmail
)

Write-Host "Creating Docker registry secret for Kubernetes..." -ForegroundColor Cyan

kubectl create secret docker-registry regcred `
  --docker-server=https://index.docker.io/v1/ `
  --docker-username=spakalao `
  --docker-password="$DockerPassword" `
  --docker-email="$DockerEmail" `
  --namespace=default `
  --dry-run=client -o yaml | kubectl apply -f -

Write-Host "Secret 'regcred' created successfully!" -ForegroundColor Green
kubectl get secret regcred

