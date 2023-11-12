#!/bin/bash

# Check if the correct number of arguments was provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <container_name> <image_name>"
    exit 1
fi

CONTAINER_NAME=$1
IMAGE_NAME=$2

# Stop the container if it's running
echo "Stopping the container (if running)..."
docker stop $CONTAINER_NAME 2>/dev/null || true

# Remove the container
echo "Removing the container..."
docker rm $CONTAINER_NAME 2>/dev/null || true

# Rebuild the Docker image
echo "Building the Docker image..."
docker build -f ./backend/microservices/$IMAGE_NAME/Dockerfile.local -t $IMAGE_NAME ./backend

# Run the new container
echo "Starting a new container..."
docker run -d --name $CONTAINER_NAME $IMAGE_NAME

# Follow the log output of the container
echo "Following log output of the container..."
docker logs -f $CONTAINER_NAME
