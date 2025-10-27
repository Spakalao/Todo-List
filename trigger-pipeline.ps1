# Script pour déclencher le pipeline Jenkins
# Nécessite l'authentification Jenkins

param(
    [string]$Username = "admin",
    [string]$Password = "",
    [string]$JenkinsUrl = "http://localhost:8080",
    [string]$JobName = "todo-list-pipeline"
)

Write-Host "🎯 Déclenchement du pipeline Jenkins: $JobName" -ForegroundColor Cyan

# Si le mot de passe n'est pas fourni, demander
if ($Password -eq "") {
    Write-Host "Entrez le mot de passe Jenkins:" -ForegroundColor Yellow
    $SecurePassword = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

# Créer les credentials en base64
$pair = "${Username}:${Password}"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)

try {
    # Obtenir le crumb (token CSRF)
    Write-Host "🔐 Authentification..." -ForegroundColor Yellow
    $crumbResponse = Invoke-WebRequest -Uri "$JenkinsUrl/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)" `
        -Headers @{Authorization = "Basic $base64"} `
        -Method Get
    
    $crumb = $crumbResponse.Content
    
    # Déclencher le build
    Write-Host "🚀 Lancement du build..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "$JenkinsUrl/job/$JobName/build" `
        -Headers @{
            Authorization = "Basic $base64"
            $crumb.Split(':')[0] = $crumb.Split(':')[1]
        } `
        -Method Post
    
    Write-Host "✅ Pipeline déclenché avec succès!" -ForegroundColor Green
    Write-Host "📊 Suivez le build: $JenkinsUrl/job/$JobName" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Ouvrez $JenkinsUrl dans votre navigateur et cliquez sur 'Build Now'"
}

