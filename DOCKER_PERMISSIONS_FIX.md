# Fix Docker Permissions in Jenkins

## Problem
The Jenkins pipeline was failing with this error:
```
ERROR: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock
```

## Solution Applied

### 1. Restart Jenkins with Docker Socket Mounted
```powershell
docker stop jenkins
docker rm jenkins
docker run -d --name jenkins --restart=on-failure -v jenkins_home:/var/jenkins_home -v //var/run/docker.sock:/var/run/docker.sock -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
```

### 2. Install Docker CLI in Jenkins Container
```powershell
docker exec -u root jenkins sh -c "curl -fsSL https://get.docker.com | sh"
```

### 3. Fix Docker Socket Permissions
```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### 4. Verify Docker Works
```powershell
docker exec jenkins docker ps
```

You should see the list of containers running.

## Running the Pipeline

Now you can run your Jenkins pipeline:

1. Go to Jenkins UI: http://localhost:8080
2. Open your pipeline: `todo-list-pipeline`
3. Click **Build Now**

The pipeline should now successfully build and push your Docker images to Docker Hub.

## Important Notes

⚠️ **Persistent Fix Required**: The `chmod 666` command needs to be run every time Jenkins restarts because permissions are reset by Docker Desktop on Windows.

### Quick Fix Script

Use the provided PowerShell script to fix permissions:

```powershell
.\fix-jenkins-docker.ps1
```

This script will:
- Start Jenkins if not running
- Install Docker CLI if needed
- Fix socket permissions
- Verify everything works

### Alternative: Manual Fix

```powershell
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Permanent Solution Options

1. Create a custom Jenkins image with the fix
2. Use a Jenkins init script
3. Run the fix script periodically as a scheduled task

## Testing Docker Build

You can test if Docker build works from Jenkins:

```powershell
docker exec -u jenkins jenkins sh -c "cd /tmp && docker build -t test:latest . --no-cache"
```

## Troubleshooting

If you still get permission errors:

```powershell
# Check socket permissions
docker exec jenkins ls -la /var/run/docker.sock

# Should show: srw-rw-rw- (666)

# If not, run the fix again
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

## Alternative Solutions

If the above doesn't work, consider:

1. **Use Docker-in-Docker (DinD)** - Modify Jenkinsfile to use a Docker agent
2. **Use Jenkins Docker Plugin** - Configure Docker build through Jenkins plugins
3. **Build on separate build server** - Separate Jenkins from Docker host

