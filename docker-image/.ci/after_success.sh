#!/bin/bash

echo "Tagging Docker image..."
cd ./docker-image

export NPM_VERSION=$(node -p -e "require('./package.json').version");
echo "Package version: $NPM_VERSION";

export TAG=`if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_BRANCH == "master" ]]; then
  echo "latest"; else
  echo "PR-$TRAVIS_PULL_REQUEST_BRANCH";
fi`

if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_BRANCH == "master" ]]; then
  export ALREADY_EXISTS=$(curl https://hub.docker.com/v2/repositories/$DOCKER_IMAGE_REPOSITORY/tags/?page_size=10000 | jq -r "[.results | .[] | .name == \"$NPM_VERSION\"] | any");
fi

if [ $ALREADY_EXISTS == "true" ]; then
  echo "Skipping pushing image with the same NPM Version tag";
  exit 0;
fi

echo "Tag: $TAG";
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";
docker tag $DOCKER_IMAGE_REPOSITORY:$TRAVIS_BUILD_NUMBER $DOCKER_IMAGE_REPOSITORY:$TAG;

echo "Pushing the Docker image with $TAG tag..."
docker push $DOCKER_IMAGE_REPOSITORY:$TAG;

# Push additional tag with version if necessary
if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_BRANCH == "master" ]]; then
  echo "Tagging the Docker image with $NPM_VERSION tag...";
  docker tag $DOCKER_IMAGE_REPOSITORY:$TRAVIS_BUILD_NUMBER $DOCKER_IMAGE_REPOSITORY:$NPM_VERSION;
  echo "Pushing the Docker image with $NPM_VERSION tag...";
  docker push $DOCKER_IMAGE_REPOSITORY:$NPM_VERSION;
fi
