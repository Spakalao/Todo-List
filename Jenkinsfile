pipeline {
  agent any

  environment {
    IMAGE = "spakalao/todo-list"
    TAG = "${env.BUILD_NUMBER}"
    REGISTRY = "docker.io"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            echo 'Logging into Docker Hub...'
            sh "docker login -u $DOCKER_USER -p $DOCKER_PASS ${REGISTRY}"
            
            echo 'Building Docker image with Node.js 20 (from Dockerfile)...'
            sh "docker build -t ${IMAGE}:${TAG} ."
            sh "docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
            
            echo 'Pushing images to Docker Hub...'
            sh "docker push ${IMAGE}:${TAG}"
            sh "docker push ${IMAGE}:latest"
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      when {
        expression { return env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main' }
      }
      steps {
        script {
          try {
            // Essayer de mettre à jour l'image du déploiement existant
            sh "kubectl set image deployment/todo-list todo-list=${IMAGE}:${TAG} -n default --record || true"
          } catch(Exception e) {
            echo "Deployment not found, applying new deployment..."
            sh "kubectl apply -f k8s/deployment.yaml"
          }
          // Attendre que le déploiement soit prêt
          sh "kubectl rollout status deployment/todo-list -n default --timeout=300s || true"
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
    success {
      echo "✅ Pipeline succeeded: Build #${env.BUILD_NUMBER}"
      echo "Image: ${IMAGE}:${TAG}"
    }
    failure {
      echo "❌ Pipeline failed at Build #${env.BUILD_NUMBER}"
    }
  }
}

