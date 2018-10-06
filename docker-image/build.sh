#!/usr/bin/env bash

IMAGE_TAG=${1:-mongo-seeding}
BUILD_VERSION=${2:-production}

if [ "${BUILD_VERSION}" == "develop" ]; then
    cd ..
    docker build -f ./docker-image/dev.Dockerfile -t ${IMAGE_TAG} .
elif [ "${BUILD_VERSION}" == "production" ]; then
    cd ../cli
    NPM_VERSION=$(node -p -e "require('./package.json').version");
    cd ../docker-image
    docker build -f ./prod.Dockerfile --build-arg cliVersion=${NPM_VERSION} -t ${IMAGE_TAG} .
else
    echo "Unknown build type"
    exit 1
fi

