#!/bin/bash
set -e

# Configuration
PROJECT_ID="hosting-server-505409"
REGION="us-west1"
REPO_NAME="tracker-repo"
IMAGE_NAME="us-west1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/soc-track:latest"
VM_NAME="db-tracker"
ZONE="us-west1-b"
REMOTE_DIR="~/soc-track"

echo "========================================="
echo "1. Building Docker image locally..."
echo "========================================="
docker build -t $IMAGE_NAME .

echo ""
echo "========================================================"
echo "💡 Image built successfully!"
echo "   Tagged: $IMAGE_NAME"
echo "========================================================"
read -p "Proceed with pushing to Artifact Registry and updating VM? (y/N): " -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "❌ Deployment aborted. No changes pushed to production."
    exit 0
fi

echo ""
echo "========================================="
echo "2. Pushing image to Google Artifact Registry..."
echo "========================================="
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
docker push $IMAGE_NAME

echo ""
echo "========================================="
echo "3. Updating VM ($VM_NAME)..."
echo "========================================="
# Ensure remote directory structure exists
gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="mkdir -p $REMOTE_DIR/data $REMOTE_DIR/uploads"

# Copy docker-compose.yml
gcloud compute scp vm-setup/docker-compose.yml $VM_NAME:$REMOTE_DIR/docker-compose.yml --zone=$ZONE --project=$PROJECT_ID

# Copy .env if it exists locally
if [ -f .env ]; then
    gcloud compute scp .env $VM_NAME:$REMOTE_DIR/.env --zone=$ZONE --project=$PROJECT_ID
fi

# Ensure web_net exists, pull the latest image, and restart containers on the VM
gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="
    docker network inspect web_net >/dev/null 2>&1 || docker network create web_net
    gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
    cd $REMOTE_DIR
    docker compose pull
    docker compose up -d
"

echo ""
echo "========================================="
echo "✅ Deployment Complete! "
echo "   soc_track.rejit.in is now live via Caddy ingress."
echo "========================================="
