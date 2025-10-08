#!/bin/bash

# Azure Deployment Script for Kube Credential Application
# This script deploys the application to Azure Kubernetes Service (AKS)

set -e

echo "🚀 Starting Azure Deployment for Kube Credential..."

# Configuration
RESOURCE_GROUP="kube-credential-rg"
LOCATION="eastus"
ACR_NAME="kubecredentialacr"
AKS_CLUSTER_NAME="kube-credential-cluster"
NODE_COUNT=1
NODE_SIZE="Standard_B2s"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  ACR Name: $ACR_NAME"
echo "  AKS Cluster: $AKS_CLUSTER_NAME"
echo ""

# Step 1: Create Resource Group
echo -e "${GREEN}Step 1: Creating Resource Group...${NC}"
az group create --name $RESOURCE_GROUP --location $LOCATION

# Step 2: Create Azure Container Registry
echo -e "${GREEN}Step 2: Creating Azure Container Registry...${NC}"
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic

# Step 3: Login to ACR
echo -e "${GREEN}Step 3: Logging into ACR...${NC}"
az acr login --name $ACR_NAME

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
echo "ACR Login Server: $ACR_LOGIN_SERVER"

# Step 4: Build and Push Docker Images
echo -e "${GREEN}Step 4: Building and Pushing Docker Images...${NC}"

# Frontend
echo -e "${BLUE}Building Frontend...${NC}"
cd ../frontend
docker build -t $ACR_LOGIN_SERVER/frontend:latest .
docker push $ACR_LOGIN_SERVER/frontend:latest

# Issuance Service
echo -e "${BLUE}Building Issuance Service...${NC}"
cd ../services/issuance-service
docker build -t $ACR_LOGIN_SERVER/issuance-service:latest .
docker push $ACR_LOGIN_SERVER/issuance-service:latest

# Verification Service
echo -e "${BLUE}Building Verification Service...${NC}"
cd ../verification-service
docker build -t $ACR_LOGIN_SERVER/verification-service:latest .
docker push $ACR_LOGIN_SERVER/verification-service:latest

cd ../../k8s

# Step 5: Create AKS Cluster
echo -e "${GREEN}Step 5: Creating AKS Cluster (this may take 5-10 minutes)...${NC}"
az aks create \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER_NAME \
  --node-count $NODE_COUNT \
  --node-vm-size $NODE_SIZE \
  --enable-addons monitoring \
  --generate-ssh-keys \
  --attach-acr $ACR_NAME

# Step 6: Get AKS Credentials
echo -e "${GREEN}Step 6: Getting AKS Credentials...${NC}"
az aks get-credentials \
  --resource-group $RESOURCE_GROUP \
  --name $AKS_CLUSTER_NAME \
  --overwrite-existing

# Step 7: Install NGINX Ingress Controller
echo -e "${GREEN}Step 7: Installing NGINX Ingress Controller...${NC}"
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller to be ready
echo "Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Step 8: Deploy Application
echo -e "${GREEN}Step 8: Deploying Application to AKS...${NC}"

# Create namespace
kubectl apply -f namespace.yaml

# Create ConfigMap
kubectl apply -f configmap.yaml

# Create Persistent Volumes
kubectl apply -f persistent-volumes.yaml

# Deploy Services
kubectl apply -f frontend.yaml
kubectl apply -f issuance-service.yaml
kubectl apply -f verification-service.yaml

# Deploy Ingress
kubectl apply -f ingress.yaml

# Step 9: Wait for deployments to be ready
echo -e "${GREEN}Step 9: Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s \
  deployment/frontend \
  deployment/issuance-service \
  deployment/verification-service \
  -n kube-credential

# Step 10: Get External IP
echo -e "${GREEN}Step 10: Getting External IP Address...${NC}"
echo "Waiting for external IP to be assigned..."
sleep 30

EXTERNAL_IP=""
while [ -z $EXTERNAL_IP ]; do
  echo "Waiting for external IP..."
  EXTERNAL_IP=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
  [ -z "$EXTERNAL_IP" ] && sleep 10
done

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Information:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  AKS Cluster: $AKS_CLUSTER_NAME"
echo "  ACR: $ACR_LOGIN_SERVER"
echo "  External IP: $EXTERNAL_IP"
echo ""
echo -e "${YELLOW}🌐 Access your application:${NC}"
echo "  Frontend: http://$EXTERNAL_IP"
echo "  Issuance API: http://$EXTERNAL_IP/api/v1/issuance"
echo "  Verification API: http://$EXTERNAL_IP/api/v1/verification"
echo ""
echo -e "${BLUE}📝 Useful Commands:${NC}"
echo "  View pods: kubectl get pods -n kube-credential"
echo "  View services: kubectl get svc -n kube-credential"
echo "  View logs: kubectl logs -f deployment/frontend -n kube-credential"
echo "  Delete deployment: ./cleanup-azure.sh"
echo ""
echo -e "${GREEN}🎉 Your Kube Credential application is now running on Azure!${NC}"
