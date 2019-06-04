#!/usr/bin/env bash

IMAGE_NAME="core-test"

echo "Building test image..."
docker build -t $IMAGE_NAME:$CI_BUILD_NUMBER -f ./core/Dockerfile .

echo "Running tests with coverage reporting..."

RUN_COMMAND=""
if [ "${CI_SECURE_ENV_VARS}" == "false" ]; then
    echo "No secret environmental variables - coverage reporting disabled."
    RUN_COMMAND="npm test"
fi

docker run --rm --network="host" -e CODECOV_TOKEN=$CODECOV_TOKEN $IMAGE_NAME:$CI_BUILD_NUMBER $RUN_COMMAND