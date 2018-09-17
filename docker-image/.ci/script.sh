#!/bin/bash

echo "Building image..."
cd ./docker-image
./build.sh $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER

DATA_IMPORT_PATH="$(pwd)/test/_importdata"
TESTER_IMAGE_NAME="tester:latest"
DB_NAME=dockerdb

# Import data
docker run --rm -it --network="host" -e DB_NAME=${DB_NAME} -e REPLACE_ID=true -v ${DATA_IMPORT_PATH}:${DATA_IMPORT_PATH} -w ${DATA_IMPORT_PATH} $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER
# Build & run tester
cd ./test/tester
docker build -t ${TESTER_IMAGE_NAME} .
docker run --rm -it --network="host" -e DB_NAME=${DB_NAME} ${TESTER_IMAGE_NAME}
cd ../..


cd ..
