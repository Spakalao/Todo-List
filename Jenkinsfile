pipeline {
    agent any

    environment {
        IMAGE = "spakalao/todo-list"
        TAG = "${env.BUILD_NUMBER}"        // Tag unique pour chaque build
        LATEST_TAG = "latest"              // Tag de confort pour tests locaux
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
                        // Corriger permissions Docker si nécessaire
                        sh 'sudo chmod 666 /var/run/docker.sock || true'

                        echo '🔐 Connexion à Docker Hub...'
                        sh '''
                            docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" docker.io
                        '''

                        echo "⚙️  Construction de l’image Docker ${IMAGE}:${TAG}..."
                        sh """
                            docker build -t ${IMAGE}:${TAG} -t ${IMAGE}:${LATEST_TAG} .
                        """

                        echo '☁️  Push de l’image sur Docker Hub...'
                        sh """
                            docker push ${IMAGE}:${TAG}
                            docker push ${IMAGE}:${LATEST_TAG}
                        """
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
                    echo "🚀 Déploiement de ${IMAGE}:${TAG} sur Kubernetes..."
                    try {
                        // Met à jour le déploiement si il existe
                        sh "kubectl set image deployment/todo-list todo-list=${IMAGE}:${TAG} -n default --record || true"
                    } catch(Exception e) {
                        echo "⚠️ Déploiement introuvable, création initiale..."
                        sh "kubectl apply -f k8s/deployment.yaml"
                    }

                    // Attendre que le déploiement soit complètement disponible
                    echo "⏳ Attente du rollout..."
                    sh "kubectl wait --for=condition=available deployment/todo-list -n default --timeout=300s"

                    // Vérifie l'image réellement déployée
                    sh "kubectl describe deployment todo-list -n default | grep Image"

                    // Vérification rapide HTTP (corrigé pour Groovy)
                    echo "🔍 Test de disponibilité de l'application..."
                    sh 'curl -f http://$(minikube ip):30080 || echo "⚠️ L\'application ne répond pas encore"'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Pipeline réussi - Build #${env.BUILD_NUMBER} (${IMAGE}:${TAG})"
        }
        failure {
            echo "❌ Pipeline échoué - Build #${env.BUILD_NUMBER}"
        }
    }
}

