#!/bin/bash

# Azure Cleanup Script for Kube Credential Application
# This script removes all Azure resources to avoid charges

set -e

# Configuration
RESOURCE_GROUP="kube-credential-rg"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  Azure Cleanup Script${NC}"
echo ""
echo "This will delete the following resources:"
echo "  - Resource Group: $RESOURCE_GROUP"
echo "  - AKS Cluster"
echo "  - Azure Container Registry"
echo "  - All associated resources"
echo ""

read -p "Are you sure you want to continue? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo "Cleanup cancelled."
    exit 1
fi

echo -e "${RED}🗑️  Deleting Azure Resources...${NC}"

# Delete the entire resource group (this removes everything)
az group delete \
  --name $RESOURCE_GROUP \
  --yes \
  --no-wait

echo ""
echo -e "${GREEN}✅ Cleanup initiated!${NC}"
echo ""
echo "The resource group deletion is running in the background."
echo "This may take a few minutes to complete."
echo ""
echo "To check status:"
echo "  az group show --name $RESOURCE_GROUP"
echo ""
