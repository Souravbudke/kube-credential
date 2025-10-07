#!/bin/bash

# Local Development Deployment Script (Docker Desktop/Minikube/Kind)
set -e

echo "🚀 Deploying Kube Credential locally..."

# Detect local Kubernetes environment
if kubectl config current-context | grep -q "docker-desktop"; then
    K8S_ENV="Docker Desktop"
    INGRESS_TYPE="nginx"
elif kubectl config current-context | grep -q "minikube"; then
    K8S_ENV="Minikube"
    INGRESS_TYPE="nginx"
elif kubectl config current-context | grep -q "kind"; then
    K8S_ENV="Kind"
    INGRESS_TYPE="nginx"
else
    K8S_ENV="Unknown"
    INGRESS_TYPE="nginx"
fi

echo "📋 Detected environment: $K8S_ENV"

# Enable ingress for local environments
if [[ $K8S_ENV == "Minikube" ]]; then
    echo "🔧 Enabling Minikube ingress addon..."
    minikube addons enable ingress
elif [[ $K8S_ENV == "Docker Desktop" ]]; then
    echo "🔧 Installing nginx ingress for Docker Desktop..."
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
fi

# Build Docker images locally
echo "🐳 Building Docker images..."

# Build issuance service
echo "  Building issuance-service..."
docker build -t kube-credential/issuance-service:latest ./services/issuance-service/

# Build verification service
echo "  Building verification-service..."
docker build -t kube-credential/verification-service:latest ./services/verification-service/

# Build frontend
echo "  Building frontend..."
docker build -t kube-credential/frontend:latest ./frontend/

# Load images into local cluster (for Kind and Minikube)
if [[ $K8S_ENV == "Kind" ]]; then
    echo "📦 Loading images into Kind cluster..."
    kind load docker-image kube-credential/issuance-service:latest
    kind load docker-image kube-credential/verification-service:latest
    kind load docker-image kube-credential/frontend:latest
elif [[ $K8S_ENV == "Minikube" ]]; then
    echo "📦 Loading images into Minikube..."
    minikube image load kube-credential/issuance-service:latest
    minikube image load kube-credential/verification-service:latest
    minikube image load kube-credential/frontend:latest
fi

# Deploy to cluster
echo "📦 Deploying to cluster..."
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f persistent-volumes.yaml
kubectl apply -f issuance-service.yaml
kubectl apply -f verification-service.yaml
kubectl apply -f frontend.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml

echo "🎉 Local deployment complete!"

# Show access instructions
echo ""
echo "🌐 Access Instructions:"
if [[ $K8S_ENV == "Minikube" ]]; then
    echo "1. Run: minikube tunnel (in a separate terminal)"
    echo "2. Add to /etc/hosts: 127.0.0.1 kube-credential.local"
    echo "3. Visit: http://kube-credential.local"
elif [[ $K8S_ENV == "Docker Desktop" ]]; then
    echo "1. Add to /etc/hosts: 127.0.0.1 kube-credential.local"
    echo "2. Visit: http://kube-credential.local"
elif [[ $K8S_ENV == "Kind" ]]; then
    echo "1. Run: kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80"
    echo "2. Visit: http://localhost:8080"
fi

echo ""
echo "🔍 Monitoring commands:"
echo "kubectl get pods -n kube-credential"
echo "kubectl get services -n kube-credential"
echo "kubectl logs -n kube-credential -l app=issuance-service -f"