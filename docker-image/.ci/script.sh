#!/usr/bin/env bash

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../../" && pwd )

echo "Building image..."
cd ${ROOT_PATH}/docker-image

COMMIT_TAG=$(git tag -l --points-at HEAD | xargs)
BUILD_VERSION="develop"
if [ "${COMMIT_TAG}" != "" ]; then
    BUILD_VERSION="production"
fi

./build.sh $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER $BUILD_VERSION

DATA_IMPORT_PATH="$(pwd)/test/_importdata"
TESTER_IMAGE_NAME="tester:latest"
DB_NAME=dockertestdb

# Import data
docker run --rm -it --network="host" -e DB_NAME=${DB_NAME} -e REPLACE_ID=true SET_TIMESTAMPS=true -v ${DATA_IMPORT_PATH}:${DATA_IMPORT_PATH} -w ${DATA_IMPORT_PATH} $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER

# Build & run tester
cd ${ROOT_PATH}/docker-image/test/tester
docker build -t ${TESTER_IMAGE_NAME} .
docker run --rm -it --network="host" -e DB_NAME=${DB_NAME} ${TESTER_IMAGE_NAME}

