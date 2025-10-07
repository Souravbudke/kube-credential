#!/bin/bash

echo "📊 Kube Credential Data Viewer"
echo "=============================="
echo

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ISSUANCE_URL="http://localhost:8001/api/v1"
VERIFICATION_URL="http://localhost:8002/api/v1"

echo -e "${BLUE}🏗️  System Overview${NC}"
echo "================================"
kubectl get pods -n kube-credential
echo

echo -e "${BLUE}📋 All Credentials Summary${NC}"
echo "================================"
curl -s $ISSUANCE_URL/credentials | jq -r '
  .data[] | 
  "ID: \(.id)\nHolder: \(.holderName)\nType: \(.credentialType)\nIssuer: \(.issuerName)\nIssued: \(.timestamp)\n" + 
  "Worker: \(.issuedBy)\n" + 
  (if .data then "Data: \(.data | tostring)\n" else "" end) + 
  "---"
'
echo

echo -e "${BLUE}📊 Credentials Count by Type${NC}"
echo "================================"
curl -s $ISSUANCE_URL/credentials | jq -r '
  .data | 
  group_by(.credentialType) | 
  map({type: .[0].credentialType, count: length}) | 
  .[] | 
  "\(.type): \(.count)"
'
echo

echo -e "${BLUE}👥 Active Workers${NC}"
echo "================================"
echo "Issuance Service Worker:"
curl -s $ISSUANCE_URL/worker | jq -r '.data | "ID: \(.workerId)\nHostname: \(.hostname)\nStarted: \(.timestamp)"'
echo
echo "Verification Service Worker:"
curl -s $VERIFICATION_URL/worker | jq -r '.data | "ID: \(.workerId)\nHostname: \(.hostname)\nStarted: \(.timestamp)"'
echo

echo -e "${BLUE}📈 Verification Statistics${NC}"
echo "================================"
TOTAL_VERIFICATIONS=$(curl -s $VERIFICATION_URL/history | jq '.data | length')
VALID_VERIFICATIONS=$(curl -s $VERIFICATION_URL/history | jq '.data | map(select(.isValid == true)) | length')
echo "Total Verifications: $TOTAL_VERIFICATIONS"
echo "Valid Verifications: $VALID_VERIFICATIONS"
echo

echo -e "${GREEN}📝 Quick Commands${NC}"
echo "================================"
echo "View all credentials:     curl -s $ISSUANCE_URL/credentials | jq"
echo "Get specific credential:  curl -s $ISSUANCE_URL/credentials/{ID} | jq"
echo "View verification history: curl -s $VERIFICATION_URL/history | jq"
echo "Test verification:        ./test-api.sh"
echo "Web interface:           http://kube-credential.local"