#!/usr/bin/env bash

IMAGE_NAME="cli-test"

echo "Building test image..."
docker build -t $IMAGE_NAME:$CI_BUILD_NUMBER -f ./cli/Dockerfile .

echo "Running tests with coverage reporting..."
docker run --rm --network="host" -e CODECOV_TOKEN=$CODECOV_TOKEN $IMAGE_NAME:$CI_BUILD_NUMBER
