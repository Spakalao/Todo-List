pipeline {
    agent any

    environment {
        IMAGE = "spakalao/todo-list"
        TAG = "${env.BUILD_NUMBER}"
        LATEST_TAG = "latest"
        DOCKER_HOST = "unix:///var/run/docker.sock"
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
                        sh 'sudo chmod 666 /var/run/docker.sock || true'
                        sh 'docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" docker.io'
                        sh "docker build -t ${IMAGE}:${TAG} -t ${IMAGE}:${LATEST_TAG} ."
                        sh "docker push ${IMAGE}:${TAG}"
                        sh "docker push ${IMAGE}:${LATEST_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Déploiement de ${IMAGE}:${TAG} sur Kubernetes..."

                    def deployExists = sh(
                        script: "kubectl get deployment todo-list -n default",
                        returnStatus: true
                    ) == 0

                    if (!deployExists) {
                        echo "✨ Déploiement introuvable, création initiale..."
                        sh "kubectl apply -f k8s/deployment.yaml"
                        sh "sleep 10"
                    }

                    echo "📦 Mise à jour de l'image..."
                    sh "kubectl set image deployment/todo-list todo-list=${IMAGE}:${TAG} -n default"

                    echo "⏳ Attente du rollout complet..."
                    sh "kubectl rollout status deployment/todo-list -n default --timeout=300s"

                    echo "🔍 Vérification de l'image déployée..."
                    sh "kubectl get deployment todo-list -n default -o jsonpath='{.spec.template.spec.containers[0].image}'"
                }
            }
        }
    }

    post {
        always { cleanWs() }
        success { echo "✅ Pipeline réussi - Build #${env.BUILD_NUMBER} (${IMAGE}:${TAG})" }
        failure { echo "❌ Pipeline échoué - Build #${env.BUILD_NUMBER}" }
    }
}
