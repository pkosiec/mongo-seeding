#!/usr/bin/env bash

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../../" && pwd )

IMAGE_NAME="cli-test"

cd ${ROOT_PATH}

echo "Building test image..."
docker build -t $IMAGE_NAME:$CI_BUILD_NUMBER -f ./cli/Dockerfile .

echo "Running tests with coverage reporting..."
docker run --rm --network="host" -e CODECOV_TOKEN=$CODECOV_TOKEN $IMAGE_NAME:$CI_BUILD_NUMBER
