#!/usr/bin/env bash

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )

IMAGE_TAG=${1:-mongo-seeding}
BUILD_VERSION=${2:-production}

if [ "${BUILD_VERSION}" == "develop" ]; then
    cd ..
    docker build -f ./docker-image/dev.Dockerfile -t ${IMAGE_TAG} .
elif [ "${BUILD_VERSION}" == "production" ]; then
    cd ${ROOT_PATH}/cli
    NPM_VERSION=$(node -p -e "require('./package.json').version");
    cd ${ROOT_PATH}/docker-image
    echo "Building image for CLI version ${NPM_VERSION}..."
    docker build -f ./prod.Dockerfile --build-arg cliVersion=${NPM_VERSION} -t ${IMAGE_TAG} .
else
    echo "Unknown build type"
    exit 1
fi

