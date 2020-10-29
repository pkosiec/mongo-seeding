#!/usr/bin/env bash

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../../" && pwd )

IMAGE_NAME="core-test"

cd ${ROOT_PATH}

echo "Building test image..."
docker build -t $IMAGE_NAME:$CI_BUILD_NUMBER -f ./core/Dockerfile .

echo "Running tests with coverage reporting..."
CI_ENV=`bash <(curl -s https://codecov.io/env)`
docker run --rm --network="host" $CI_ENV -e CODECOV_TOKEN=$CODECOV_TOKEN $IMAGE_NAME:$CI_BUILD_NUMBER