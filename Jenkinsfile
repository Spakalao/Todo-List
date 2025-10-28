pipeline {
    agent any

    environment {
        IMAGE = "spakalao/todo-list"
        TAG = "${env.BUILD_NUMBER}"              // Tag unique pour chaque build
        LATEST_TAG = "latest"                    // Tag de confort pour les tests locaux
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
                        // Corriger les permissions sur le socket Docker (si besoin)
                        sh 'sudo chmod 666 /var/run/docker.sock || true'
                        
                        echo '🔐 Connexion à Docker Hub...'
                        sh '''
                            docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" docker.io
                        '''
                        
                        echo "⚙️  Construction de l’image Docker ${IMAGE}:${TAG}..."
                        sh """
                            docker build -t ${IMAGE}:${TAG} -t ${IMAGE}:${LATEST_TAG} .
                        """

                        echo '☁️  Envoi de l’image sur Docker Hub...'
                        sh """
                            docker push ${IMAGE}:${TAG}
                            docker push ${IMAGE}:${LATEST_TAG}
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Déploiement de ${IMAGE}:${TAG} sur Kubernetes..."
                    
                    // Vérifier si le déploiement existe
                    def deployExists = sh(
                        script: "kubectl get deployment todo-list -n default 2>/dev/null",
                        returnStatus: true
                    ) == 0
                    
                    if (deployExists) {
                        // Déploiement existe, mettre à jour l'image
                        echo "📦 Mise à jour du déploiement existant..."
                        sh "kubectl set image deployment/todo-list todo-list=${IMAGE}:${TAG} -n default"
                    } else {
                        // Déploiement n'existe pas, créer
                        echo "✨ Création d'un nouveau déploiement..."
                        sh "kubectl apply -f k8s/deployment.yaml"
                        // Mettre à jour avec la bonne image
                        sh "kubectl set image deployment/todo-list todo-list=${IMAGE}:${TAG} -n default"
                    }

                    echo "⏳ Attente du déploiement..."
                    sh "kubectl rollout status deployment/todo-list -n default --timeout=300s || true"

                    echo "✅ Nouvelle image déployée : ${IMAGE}:${TAG}"
                    sh "kubectl describe deployment todo-list -n default | grep Image"
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
