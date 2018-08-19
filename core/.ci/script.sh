#!/bin/bash

IMAGE_NAME="core-test"

echo "Building test image..."
docker build -t $IMAGE_NAME:$CI_BUILD_NUMBER -f ./core/Dockerfile .

echo "Running tests with coverage reporting..."
docker run --rm --network="host" -e CODACY_PROJECT_TOKEN=$CODACY_PROJECT_TOKEN $IMAGE_NAME:$CI_BUILD_NUMBER