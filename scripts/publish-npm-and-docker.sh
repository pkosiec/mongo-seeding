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

echo "Building and pushing Docker images..."

IMAGE_VERSION_TAG=$(node -p -e "require('./cli/package.json').version");
echo "Using tag: ${IMAGE_VERSION_TAG}"

docker buildx create --name mongo-seeding-bldr --bootstrap --use

docker buildx build --push \
  --platform linux/amd64,linux/arm64 \
  --builder mongo-seeding-bldr \
  --tag ${IMAGE_NAME}:${IMAGE_VERSION_TAG} \
  --build-arg cliVersion=${IMAGE_VERSION_TAG} \
  --file ./docker-image/prod.Dockerfile  .

read -p "Push the Docker image ${IMAGE_VERSION_TAG} as latest (y/n)?" choice
case "$choice" in 
  y|Y ) 
    echo "Tagging and pushing Docker image with '${IMAGE_LATEST_TAG}' tag..."
    docker tag ${IMAGE_NAME}:${IMAGE_VERSION_TAG} ${IMAGE_NAME}:${IMAGE_LATEST_TAG}
    docker push ${IMAGE_NAME}:${IMAGE_LATEST_TAG} ;;
  n|N ) echo "Skipping...";;
  * ) echo "invalid";;
esac

docker buildx rm mongo-seeding-bldr
