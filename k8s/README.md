# Kubernetes Deployment Guide - Azure AKS

This directory contains Kubernetes manifests and deployment scripts for the Kube Credential application backend services deployed on **Azure Kubernetes Service (AKS)**.

## Current Architecture

- **Frontend**: Deployed on Vercel (https://kubecredential.souravbudke.tech/)
- **Backend**: Deployed on Azure AKS (Southeast Asia region)
- **HTTPS Tunnel**: ngrok (for demo/development)

## Quick Start - Azure AKS

### Prerequisites
- Azure CLI installed and configured (`az login`)
- Azure for Students subscription (or your own subscription)
- kubectl installed and configured

### Deploy to Azure AKS
```bash
cd k8s
chmod +x deploy-azure.sh
./deploy-azure.sh
```

### Access the Application
- **Frontend**: https://kubecredential.souravbudke.tech/
- **Backend API**: Available via ngrok tunnel (see deployment output)
- **Direct API**: `https://your-ngrok-url.ngrok-free.app/`

### Cleanup
```bash
cd k8s
./cleanup-azure.sh
```

## Deployment Components

### Core Services (Azure AKS)
- **Issuance Service**: Handles credential creation and storage
- **Verification Service**: Validates credentials against the issuance service

### Frontend (Vercel)
- **React Application**: Hosted on Vercel with global CDN
- **Serverless Proxy**: Handles API routing to Azure AKS

### Kubernetes Resources
- **Namespace**: `kube-credential` - Isolates all application resources
- **ConfigMaps**: Application configuration and environment variables
- **PersistentVolumes**: SQLite database storage using Azure Managed Disks
- **Deployments**: Container orchestration with health checks and 2 replicas each
- **Services**: Internal service discovery and load balancing
- **Ingress**: External access routing via NGINX controller
- **Azure Container Registry**: Stores Docker images for services

## Architecture

```
Internet → Vercel (Frontend) → ngrok (HTTPS) → Azure AKS Ingress → Backend Services
                                                                ↓
                                                        ├→ Issuance Service (Port 3000)
                                                        └→ Verification Service (Port 3000)
                                                                                        ↓
                                                                                Calls Issuance Service
```

## Scaling Configuration

- **Issuance Service**: 2 replicas (can be scaled to 10+)
- **Verification Service**: 2 replicas (can be scaled to 10+)
- **Frontend**: Auto-scaling handled by Vercel platform

## Access URLs

### Production (Azure AKS + Vercel)
- **Frontend**: https://kubecredential.souravbudke.tech/
- **Backend API**: Available via ngrok tunnel (see deployment output)
- **Direct API**: `https://your-ngrok-url.ngrok-free.app/`

### Azure AKS Resources
- **Load Balancer**: External IP (provided after deployment)
- **Container Registry**: kubecredentialacr.azurecr.io
- **Region**: Southeast Asia (Singapore)

## Monitoring Commands

```bash
# Check pod status
kubectl get pods -n kube-credential

# View services
kubectl get services -n kube-credential

# Monitor deployment
kubectl get pods -n kube-credential -w

# Check logs
kubectl logs -n kube-credential -l app=issuance-service -f
kubectl logs -n kube-credential -l app=verification-service -f

# Check ingress
kubectl get ingress -n kube-credential
```

## Troubleshooting

### Common Issues

1. **Images not found**: Make sure Docker images are built and available
2. **Ingress not working**: Ensure ingress controller is installed
3. **Services not accessible**: Check if all pods are running and ready
4. **Database issues**: Verify persistent volumes are mounted correctly

### Debug Commands

```bash
# Describe problematic pods
kubectl describe pod <pod-name> -n kube-credential

# Get detailed service info
kubectl describe service <service-name> -n kube-credential

# Check events
kubectl get events -n kube-credential --sort-by=.metadata.creationTimestamp

# Port forward for direct access
kubectl port-forward -n kube-credential service/issuance-service 3001:3000
kubectl port-forward -n kube-credential service/verification-service 3002:3000
```

## Cleanup

### Azure AKS
```bash
# Delete application
kubectl delete namespace kube-credential

# Optional: Delete Azure resources (run cleanup-azure.sh script)
cd k8s
./cleanup-azure.sh
```

## Cost Considerations

### Azure AKS Estimated Costs (Southeast Asia)
- **AKS Control Plane**: FREE (Azure for Students)
- **Worker Node** (Standard_B2s: 2vCPU, 4GB RAM): ~$30/month
- **Container Registry (Basic)**: ~$5/month
- **Load Balancer**: ~$20/month
- **Managed Disks (2GB)**: ~$0.40/month
- **Network Bandwidth**: ~$2/month
- **Total**: ~$57-58/month

**💡 Tip**: Use Azure for Students subscription for free credits, or scale down to smaller instances for development.

## Security Notes

- All services run as non-root users
- Network policies can be added for additional isolation
- Secrets should be used for sensitive configuration (currently using ConfigMaps for demo)
- Consider using service mesh (Istio/Linkerd) for production environments