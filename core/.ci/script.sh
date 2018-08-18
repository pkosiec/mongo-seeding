#!/bin/bash
IMAGE_NAME="mongo-seeding-test"

echo "Building test image..."
docker build -t $IMAGE_NAME:$TRAVIS_BUILD_NUMBER -f ./core/Dockerfile .
echo "Running tests with coverage reporting..."
docker run --rm --network="host" -e CODACY_PROJECT_TOKEN=$CODACY_PROJECT_TOKEN $IMAGE_NAME:$TRAVIS_BUILD_NUMBER