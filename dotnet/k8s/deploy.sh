#!/bin/bash

# ProductScanner Kubernetes Deployment Script
# This script builds Docker images and deploys to Kubernetes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAMESPACE="productscanner"
IMAGE_TAG="${IMAGE_TAG:-latest}"
REGISTRY="${REGISTRY:-}"

echo "=== ProductScanner Kubernetes Deployment ==="
echo "Image Tag: $IMAGE_TAG"
echo "Registry: ${REGISTRY:-local}"
echo ""

# Build Docker images
echo "=== Building Docker Images ==="

cd "$SCRIPT_DIR"

echo "Building API image..."
docker build -f Dockerfile.api -t productscanner-api:$IMAGE_TAG .

echo "Building Web image..."
docker build -f Dockerfile.web -t productscanner-web:$IMAGE_TAG .

# Tag and push if registry is specified
if [ -n "$REGISTRY" ]; then
    echo ""
    echo "=== Pushing Images to Registry ==="
    
    docker tag productscanner-api:$IMAGE_TAG $REGISTRY/productscanner-api:$IMAGE_TAG
    docker tag productscanner-web:$IMAGE_TAG $REGISTRY/productscanner-web:$IMAGE_TAG
    
    docker push $REGISTRY/productscanner-api:$IMAGE_TAG
    docker push $REGISTRY/productscanner-web:$IMAGE_TAG
    
    # Update deployment images
    API_IMAGE="$REGISTRY/productscanner-api:$IMAGE_TAG"
    WEB_IMAGE="$REGISTRY/productscanner-web:$IMAGE_TAG"
else
    API_IMAGE="productscanner-api:$IMAGE_TAG"
    WEB_IMAGE="productscanner-web:$IMAGE_TAG"
fi

echo ""
echo "=== Deploying to Kubernetes ==="

# Create namespace
echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMaps and Secrets
echo "Applying ConfigMaps and Secrets..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Apply Deployments with image override
echo "Deploying applications..."
kubectl apply -f k8s/deployment.yaml

# Update images if needed
kubectl set image deployment/productscanner-api api=$API_IMAGE -n $NAMESPACE || true
kubectl set image deployment/productscanner-web web=$WEB_IMAGE -n $NAMESPACE || true

# Apply Services
echo "Creating Services..."
kubectl apply -f k8s/service.yaml

# Apply Ingress
echo "Creating Ingress..."
kubectl apply -f k8s/ingress.yaml

# Apply HPA
echo "Creating Horizontal Pod Autoscalers..."
kubectl apply -f k8s/hpa.yaml

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "To check status:"
echo "  kubectl get pods -n $NAMESPACE"
echo "  kubectl get services -n $NAMESPACE"
echo "  kubectl get ingress -n $NAMESPACE"
echo ""
echo "To access the application:"
echo "  Add '127.0.0.1 productscanner.local' to /etc/hosts"
echo "  Then visit: http://productscanner.local"
echo ""
echo "Or use port-forward:"
echo "  kubectl port-forward svc/productscanner-web-service 3000:80 -n $NAMESPACE"
echo "  kubectl port-forward svc/productscanner-api-service 5000:5000 -n $NAMESPACE"
