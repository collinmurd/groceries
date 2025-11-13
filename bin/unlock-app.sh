#!/bin/bash
# Script to unlock the application by disabling the app-locked feature in MongoDB
# Usage: ./bin/unlock-app.sh [dev|prod]

set -e

# Default to dev environment
ENV=${1:-dev}

# Determine the Docker Compose file and container name
COMPOSE_FILE="docker-compose-prod.yaml"
CONTAINER_PREFIX="groceries"

# name of mongo container in compose and local
MONGO_CONTAINER="groceries-mongo"

if [ -z "$MONGO_CONTAINER" ]; then
    echo "Error: MongoDB container not found."
    exit 1
fi

echo "Found MongoDB container: $MONGO_CONTAINER"
echo "Unlocking application..."

# Execute MongoDB command to disable the app-locked feature
docker exec "$MONGO_CONTAINER" mongosh groceries --quiet --eval '
    const result = db.features.updateOne(
        { name: "app-locked" },
        { $set: { enabled: false } }
    );
    
    if (result.matchedCount === 0) {
        print("❌ Feature '\''app-locked'\'' not found in database");
        quit(1);
    } else if (result.modifiedCount > 0) {
        print("✅ Application unlocked successfully!");
        const feature = db.features.findOne({ name: "app-locked" });
        print("Current state: " + JSON.stringify(feature));
    } else {
        print("ℹ️  Application was already unlocked");
        const feature = db.features.findOne({ name: "app-locked" });
        print("Current state: " + JSON.stringify(feature));
    }
'

echo "Done!"
