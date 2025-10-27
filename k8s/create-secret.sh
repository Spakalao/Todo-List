#!/bin/bash

# Script pour créer le secret Docker Registry dans Kubernetes
# Usage: ./k8s/create-secret.sh

echo "Creating Docker registry secret for Kubernetes..."

kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=spakalao \
  --docker-password="$DOCKER_PASSWORD" \
  --docker-email="$DOCKER_EMAIL" \
  --namespace=default \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Secret 'regcred' créé avec succès"
kubectl get secret regcred

