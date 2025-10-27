# Configuration Kubernetes Locale

## Option 1 : Docker Desktop (Recommandé - Plus Simple)

1. Ouvrir Docker Desktop
2. Aller dans **Settings** → **Kubernetes**
3. Cocher **"Enable Kubernetes"**
4. Cliquer sur **"Apply & Restart"**
5. Attendre que le cluster démarre (icône Kubernetes en bas à droite)

C'est tout ! kubectl est déjà inclus dans Docker Desktop.

## Option 2 : Minikube (Pour plus de contrôle)

### Installation sur Windows

1. Installer Chocolatey (si pas déjà installé)
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

2. Installer Minikube
```powershell
choco install minikube
```

3. Démarrer Minikube
```powershell
minikube start --driver=hyperv
```

### Installation sur Linux (WSL)

```bash
# Installer kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Installer Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Démarrer Minikube
minikube start
```

## Vérification

```bash
# Vérifier la connexion
kubectl get nodes

# Voir la configuration
kubectl config view
```

## Commandes utiles

```bash
# Voir les pods
kubectl get pods -A

# Voir les services
kubectl get svc -A

# Voir les nodes
kubectl get nodes
```

