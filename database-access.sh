#!/bin/bash

echo "🗄️  Database Access Guide"
echo "=========================="
echo

echo "📊 Direct Database Access (SQLite)"
echo "=================================="

echo "1. Access Issuance Service Database:"
echo "   kubectl exec -it -n kube-credential \$(kubectl get pods -n kube-credential -l app=issuance-service -o jsonpath='{.items[0].metadata.name}') -- sqlite3 /app/data/credentials.db"
echo

echo "2. Access Verification Service Database:"
echo "   kubectl exec -it -n kube-credential \$(kubectl get pods -n kube-credential -l app=verification-service -o jsonpath='{.items[0].metadata.name}') -- sqlite3 /app/data/verifications.db"
echo

echo "📝 Common SQLite Commands:"
echo "=========================="
echo ".tables                    # List all tables"
echo ".schema                    # Show table schemas"
echo "SELECT * FROM credentials; # View all credentials"
echo "SELECT * FROM verifications; # View all verifications"
echo ".quit                      # Exit SQLite"
echo

echo "🔍 Pod Information:"
echo "==================="
kubectl get pods -n kube-credential -o wide

echo
echo "💾 Persistent Volumes:"
echo "======================"
kubectl get pv,pvc -n kube-credential

echo
echo "🌐 Services:"
echo "============"
kubectl get services -n kube-credential