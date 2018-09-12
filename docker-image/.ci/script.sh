#!/bin/bash

echo "Building image..."
cd ./docker-image
./build.sh $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER
cd ..
