#!/usr/bin/env bash

# standard bash error handling
set -o nounset # treat unset variables as an error and exit immediately.
set -o errexit # exit immediately when a command fails.
set -E         # needs to be set if we want the ERR trap

IMAGE_NAME="ghcr.io/pkosiec/mongo-seeding"
IMAGE_LATEST_TAG="latest"

set -e

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )
cd ${ROOT_PATH}

echo "Publishing NPM packages..."
lerna publish --pre-dist-tag next

echo "Building Docker image..."

IMAGE_VERSION_TAG=$(node -p -e "require('./cli/package.json').version");
echo "Using tag: ${IMAGE_VERSION_TAG}"

docker build -f ./docker-image/prod.Dockerfile --build-arg cliVersion=${IMAGE_VERSION_TAG} -t ${IMAGE_NAME}:${IMAGE_VERSION_TAG} .

echo "Pushing Docker image..."
docker push ${IMAGE_NAME}:${IMAGE_VERSION_TAG}

read -p "Push the Docker image ${IMAGE_VERSION_TAG} as latest (y/n)?" choice
case "$choice" in 
  y|Y ) 
    echo "Tagging and pushing Docker image with '${IMAGE_LATEST_TAG}' tag..."
    docker tag ${IMAGE_NAME}:${IMAGE_VERSION_TAG} ${IMAGE_NAME}:${IMAGE_LATEST_TAG}
    docker push ${IMAGE_NAME}:${IMAGE_LATEST_TAG} ;;
  n|N ) echo "Skipping...";;
  * ) echo "invalid";;
esac
