# Kubernetes Deployment Guide

This directory contains Kubernetes manifests and deployment scripts for the Kube Credential application.

## Quick Start

### Local Development (Recommended for Testing)

1. **Prerequisites:**
   - Docker Desktop with Kubernetes enabled, OR
   - Minikube, OR
   - Kind cluster

2. **Deploy:**
   ```bash
   cd k8s
   chmod +x deploy-local.sh
   ./deploy-local.sh
   ```

### AWS EKS Deployment

1. **Prerequisites:**
   - AWS CLI configured (`aws configure`)
   - kubectl installed
   - eksctl installed (optional, for cluster creation)

2. **Deploy:**
   ```bash
   cd k8s
   chmod +x deploy-aws.sh
   ./deploy-aws.sh
   ```

### Generic Kubernetes Cluster

1. **Prerequisites:**
   - kubectl configured to your cluster
   - Ingress controller installed

2. **Deploy:**
   ```bash
   cd k8s
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Deployment Components

### Core Services
- **Issuance Service**: Handles credential creation and storage
- **Verification Service**: Validates credentials against the issuance service
- **Frontend**: React application for user interface

### Kubernetes Resources
- **Namespace**: `kube-credential` - Isolates all application resources
- **ConfigMaps**: Application configuration and environment variables
- **PersistentVolumes**: SQLite database storage for both services
- **Deployments**: Container orchestration with health checks
- **Services**: Internal service discovery and load balancing
- **Ingress**: External access routing
- **HPA**: Horizontal Pod Autoscaling based on CPU/memory usage

## Architecture

```
Internet → Ingress → Frontend (React App)
                  ↓
                  ├→ Issuance Service (Port 3000)
                  └→ Verification Service (Port 3000)
                                    ↓
                              Calls Issuance Service
```

## Scaling Configuration

- **Issuance Service**: 2-10 replicas (auto-scales at 70% CPU)
- **Verification Service**: 2-10 replicas (auto-scales at 70% CPU)  
- **Frontend**: 2-5 replicas (auto-scales at 70% CPU)

## Access URLs

### Local Development
- Frontend: `http://kube-credential.local`
- Issuance API: `http://kube-credential.local/issuance`
- Verification API: `http://kube-credential.local/verification`

### AWS EKS
- External Load Balancer URL (provided after deployment)

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
kubectl logs -n kube-credential -l app=frontend -f

# Check ingress
kubectl get ingress -n kube-credential

# Check HPA status
kubectl get hpa -n kube-credential
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

### Local Development
```bash
kubectl delete namespace kube-credential
```

### AWS EKS
```bash
# Delete application
kubectl delete namespace kube-credential

# Delete cluster (if you created one)
eksctl delete cluster --name kube-credential-cluster --region us-west-2
```

## Cost Considerations

### AWS EKS Estimated Costs (us-west-2)
- **EKS Control Plane**: ~$73/month
- **Worker Nodes** (2x t3.medium): ~$60/month
- **Load Balancer**: ~$16/month
- **EBS Volumes**: ~$2/month
- **Total**: ~$151/month

**💡 Tip**: Use AWS Free Tier eligible instances (t2.micro/t3.micro) for development and testing to minimize costs.

## Security Notes

- All services run as non-root users
- Network policies can be added for additional isolation
- Secrets should be used for sensitive configuration (currently using ConfigMaps for demo)
- Consider using service mesh (Istio/Linkerd) for production environments