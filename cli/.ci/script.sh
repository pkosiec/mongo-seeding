#!/bin/bash

IMAGE_NAME="cli-test"

cd ./cli

echo "Building test image..."
docker build -t $IMAGE_NAME:$CI_BUILD_NUMBER .

echo "Running tests with coverage reporting..."
docker run --rm --network="host" $IMAGE_NAME:$CI_BUILD_NUMBER

cd ..