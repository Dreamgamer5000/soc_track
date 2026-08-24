#!/bin/bash
set -e

PROJECT_ID="hosting-server-505409"
VM_NAME="db-tracker"
ZONE="us-west1-b"
REMOTE_DIR="~/soc-track/data"

echo "========================================="
echo "Pushing local database to VM..."
echo "========================================="

if [ ! -f prisma/dev.db ]; then
    echo "❌ Local database prisma/dev.db not found!"
    exit 1
fi

# Ensure remote dir exists
gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="mkdir -p $REMOTE_DIR"

# Backup existing remote DB if present
gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="[ -f $REMOTE_DIR/dev.db ] && cp $REMOTE_DIR/dev.db $REMOTE_DIR/dev.db.bak || true"

# Copy local DB to VM
gcloud compute scp prisma/dev.db $VM_NAME:$REMOTE_DIR/dev.db --zone=$ZONE --project=$PROJECT_ID

# Restart container to refresh connection
gcloud compute ssh $VM_NAME --zone=$ZONE --project=$PROJECT_ID --command="cd ~/soc-track && docker compose restart app"

echo "✅ Database successfully pushed and container restarted!"
