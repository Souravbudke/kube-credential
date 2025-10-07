# Deployment script for Kubernetes manifests
#!/bin/bash

set -e

echo "🚀 Deploying Kube Credential to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster"
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Apply manifests in order
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

echo "⚙️  Creating ConfigMap..."
kubectl apply -f configmap.yaml

echo "💾 Creating Persistent Volume Claims..."
kubectl apply -f persistent-volumes.yaml

echo "🔧 Deploying Issuance Service..."
kubectl apply -f issuance-service.yaml

echo "✅ Deploying Verification Service..."
kubectl apply -f verification-service.yaml

echo "🌐 Deploying Frontend..."
kubectl apply -f frontend.yaml

echo "🔀 Creating Ingress..."
kubectl apply -f ingress.yaml

echo "📊 Setting up Horizontal Pod Autoscalers..."
kubectl apply -f hpa.yaml

echo "🎉 Deployment complete!"

echo ""
echo "📋 Checking deployment status..."
kubectl get pods -n kube-credential
echo ""
kubectl get services -n kube-credential
echo ""
kubectl get ingress -n kube-credential

echo ""
echo "🔍 To monitor the deployment:"
echo "kubectl get pods -n kube-credential -w"
echo ""
echo "🌐 To access the application:"
echo "1. Add '127.0.0.1 kube-credential.local' to your /etc/hosts file"
echo "2. Visit http://kube-credential.local"
echo ""
echo "📊 To view logs:"
echo "kubectl logs -n kube-credential -l app=issuance-service"
echo "kubectl logs -n kube-credential -l app=verification-service"
echo "kubectl logs -n kube-credential -l app=frontend"