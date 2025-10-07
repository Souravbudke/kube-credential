#!/bin/bash

# AWS EKS Deployment Script
set -e

echo "🚀 Deploying Kube Credential to AWS EKS..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure'"
    exit 1
fi

# Check if eksctl is available
if ! command -v eksctl &> /dev/null; then
    echo "⚠️  eksctl is not installed. Install it from: https://eksctl.io/"
fi

# Variables (modify these for your setup)
CLUSTER_NAME="${CLUSTER_NAME:-kube-credential-cluster}"
REGION="${AWS_REGION:-us-west-2}"
NODE_TYPE="${NODE_TYPE:-t3.medium}"
NODES="${NODES:-2}"
NODES_MIN="${NODES_MIN:-1}"
NODES_MAX="${NODES_MAX:-4}"

echo "📋 Configuration:"
echo "  Cluster Name: $CLUSTER_NAME"
echo "  Region: $REGION"
echo "  Node Type: $NODE_TYPE"
echo "  Nodes: $NODES (min: $NODES_MIN, max: $NODES_MAX)"
echo ""

read -p "Do you want to create a new EKS cluster? (y/N): " CREATE_CLUSTER

if [[ $CREATE_CLUSTER =~ ^[Yy]$ ]]; then
    echo "🔨 Creating EKS cluster..."
    eksctl create cluster \
        --name $CLUSTER_NAME \
        --region $REGION \
        --nodegroup-name standard-workers \
        --node-type $NODE_TYPE \
        --nodes $NODES \
        --nodes-min $NODES_MIN \
        --nodes-max $NODES_MAX \
        --managed
    
    echo "✅ EKS cluster created successfully!"
fi

# Update kubeconfig
echo "⚙️  Updating kubeconfig..."
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# Install AWS Load Balancer Controller (required for ALB ingress)
echo "🔧 Installing AWS Load Balancer Controller..."
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"

# Apply standard manifests
echo "📦 Applying standard manifests..."
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml

# Apply AWS-specific manifests
echo "☁️  Applying AWS-specific manifests..."
kubectl apply -f aws-eks-deploy.yaml

# Apply services
kubectl apply -f issuance-service.yaml
kubectl apply -f verification-service.yaml
kubectl apply -f frontend.yaml

# Apply HPA
kubectl apply -f hpa.yaml

echo "🎉 Deployment to AWS EKS complete!"

echo ""
echo "📋 Getting external load balancer URL..."
echo "This may take a few minutes..."
kubectl get service frontend-aws-lb -n kube-credential -w

echo ""
echo "🔍 To monitor the deployment:"
echo "kubectl get pods -n kube-credential -w"
echo ""
echo "💰 Cost Management:"
echo "Remember to delete the cluster when done: eksctl delete cluster --name $CLUSTER_NAME --region $REGION"