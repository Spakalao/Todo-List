pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "spakalao/todo-list"
        DOCKER_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
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
                        # Vérifier le cluster
                        echo "=== Cluster Info ==="
                        kubectl cluster-info
                        kubectl get nodes
                        
                        # Déployer
                        echo "=== Déploiement ==="
                        kubectl apply -f k8s/deployment.yaml
                        
                        # Supprimer et recréer le service (pour éviter les conflits de port)
                        echo "=== Service ==="
                        kubectl delete svc todo-list -n default || echo "Service n'existe pas encore"
                        kubectl apply -f k8s/service.yaml
                        
                        # Mettre à jour l'image
                        kubectl set image deployment/todo-list \
                            todo-list=${DOCKER_IMAGE}:${DOCKER_TAG} \
                            -n default
                        
                        # Attendre le rollout
                        kubectl rollout status deployment/todo-list -n default --timeout=5m
                        
                        # Afficher le statut
                        echo "=== Status ==="
                        kubectl get pods -n default -l app=todo-list
                        kubectl get svc -n default -l app=todo-list
                        
                        # Afficher l'URL d'accès
                        NODE_PORT=$(kubectl get svc todo-list -n default -o jsonpath='{.spec.ports[0].nodePort}')
                        echo "🌐 Application disponible sur http://localhost:${NODE_PORT}"
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