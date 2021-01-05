#!/usr/bin/env bash

IMAGE_NAME="pkosiec/mongo-seeding"
IMAGE_LATEST_TAG="latest"

set -e

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )
cd ${ROOT_PATH}

echo "Publishing NPM packages..."
lerna publish --pre-dist-tag next

echo "Building Docker image..."

IMAGE_VERSION_TAG=$(node -p -e "require('./cli/package.json').version");
echo "Using tag: ${IMAGE_VERSION_TAG}"

docker build -f ./docker-image/prod.Dockerfile --build-arg cliVersion=${NPM_VERSION} -t ${IMAGE_NAME}:${IMAGE_VERSION_TAG} .

echo "Tagging Docker image with '${IMAGE_LATEST_TAG}' tag..."
docker tag ${IMAGE_NAME}:${IMAGE_VERSION_TAG} ${IMAGE_NAME}:${IMAGE_LATEST_TAG}

echo "Pushing images..."
docker push ${IMAGE_NAME}:${IMAGE_VERSION_TAG}
docker push ${IMAGE_NAME}:${IMAGE_LATEST_TAG}
