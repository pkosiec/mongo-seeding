#!/bin/bash

echo "Building image..."
cd ./docker-image
docker build -t $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER .
cd ..
