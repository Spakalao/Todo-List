pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "spakalao/todo-list"
        DOCKER_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"  // ou /var/jenkins_home/.kube/config si Docker
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build & Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin docker.io
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest .
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "🚀 Déploiement de ${DOCKER_IMAGE}:${DOCKER_TAG} sur Kubernetes..."
                    
                    sh '''
                        # Vérifier la connexion Kubernetes
                        kubectl version --client
                        
                        # Appliquer les manifests
                        kubectl apply -f k8s/deployment.yaml
                        kubectl apply -f k8s/service.yaml
                        
                        # Mettre à jour l'image du déploiement
                        kubectl set image deployment/todo-list \
                            todo-list=${DOCKER_IMAGE}:${DOCKER_TAG} \
                            -n default
                        
                        # Attendre que le rollout soit terminé
                        kubectl rollout status deployment/todo-list -n default --timeout=5m
                        
                        # Afficher le statut des pods
                        echo "=== Status des Pods ==="
                        kubectl get pods -n default -l app=todo-list
                        
                        # Afficher les services
                        echo "=== Services ==="
                        kubectl get svc -n default -l app=todo-list
                    '''
                    
                    echo "✅ Déploiement terminé avec succès !"
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Pipeline réussi - Build #${BUILD_NUMBER}"
            echo "🎉 Application déployée : ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
        failure {
            echo "❌ Pipeline échoué - Build #${BUILD_NUMBER}"
        }
        always {
            cleanWs()
        }
    }
}