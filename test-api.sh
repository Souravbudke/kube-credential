#!/bin/bash

echo "🧪 Kube Credential API Testing Script"
echo "======================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URLs
ISSUANCE_URL="http://localhost:8001/api/v1"
VERIFICATION_URL="http://localhost:8002/api/v1"
WEB_URL="http://kube-credential.local"

echo -e "${BLUE}🔍 Testing Service Health${NC}"
echo "Issuance Service Health:"
curl -s $ISSUANCE_URL/health | jq '.data | {service, status, worker: .worker.workerId}'
echo
echo "Verification Service Health:"
curl -s $VERIFICATION_URL/health | jq '.data | {service, status, worker: .worker.workerId}'
echo

echo -e "${BLUE}📋 Viewing All Credentials${NC}"
curl -s $ISSUANCE_URL/credentials | jq '.data[] | {id, holderName, credentialType, issuerName, timestamp}'
echo

echo -e "${BLUE}🆔 Getting Specific Credential${NC}"
echo "Getting credential cert-001:"
curl -s $ISSUANCE_URL/credentials/cert-001 | jq '.data | {id, holderName, credentialType, data}'
echo

echo -e "${BLUE}✅ Testing Verification${NC}"
echo "Verifying credential cert-001:"
curl -s -X POST $VERIFICATION_URL/verify \
  -H "Content-Type: application/json" \
  -d '{
    "id": "cert-001",
    "holderName": "Alice Johnson",
    "credentialType": "Master Degree",
    "issueDate": "2024-05-15T00:00:00.000Z",
    "issuerName": "Tech University",
    "expiryDate": "2029-05-15T00:00:00.000Z",
    "data": {
      "degree": "Computer Science",
      "gpa": "3.9",
      "honors": "Magna Cum Laude"
    }
  }' | jq '.data | {isValid, verifiedBy, message}'
echo

echo -e "${BLUE}❌ Testing Invalid Verification${NC}"
echo "Testing with wrong data:"
curl -s -X POST $VERIFICATION_URL/verify \
  -H "Content-Type: application/json" \
  -d '{
    "id": "cert-001",
    "holderName": "Wrong Name",
    "credentialType": "Master Degree",
    "issueDate": "2024-05-15T00:00:00.000Z",
    "issuerName": "Tech University",
    "expiryDate": "2029-05-15T00:00:00.000Z",
    "data": {
      "degree": "Computer Science",
      "gpa": "3.9",
      "honors": "Magna Cum Laude"
    }
  }' | jq '.data | {isValid, message}'
echo

echo -e "${BLUE}📊 Verification History${NC}"
curl -s $VERIFICATION_URL/history | jq '.data | length as $count | "Total verifications: \($count)"'
echo

echo -e "${BLUE}🌐 Web Interface${NC}"
echo "Frontend accessible at: $WEB_URL"
echo "Direct API access:"
echo "  - Issuance Service: $ISSUANCE_URL"
echo "  - Verification Service: $VERIFICATION_URL"
echo

echo -e "${GREEN}✅ Testing Complete!${NC}"
echo "You can also test via the web interface at $WEB_URL"