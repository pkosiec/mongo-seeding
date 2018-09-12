#!/bin/bash

echo "Tagging Docker image..."

cd ./cli
NPM_VERSION=$(node -p -e "require('./package.json').version");
cd ..

echo "Package version: $NPM_VERSION";

TAG=$(if [[ $CI_PULL_REQUEST == "false" ]] && [[ $CI_BRANCH == "master" ]]; then
  echo "latest";
  elif [[ $CI_PULL_REQUEST == "false" ]]; then
  echo "snapshot-branch-$CI_BRANCH";
  else
  echo "snapshot-PR-$CI_PULL_REQUEST_BRANCH";
fi)

if [[ $CI_PULL_REQUEST == "false" ]] && [[ $CI_BRANCH == "master" ]]; then
  ALREADY_EXISTS=$(curl https://hub.docker.com/v2/repositories/$DOCKER_IMAGE_REPOSITORY/tags/?page_size=10000 | jq -r "[.results | .[] | .name == \"$NPM_VERSION\"] | any")
fi

if [[ $ALREADY_EXISTS == "true" ]]; then
  echo "Skipping pushing image with the same NPM Version tag";
  exit 0;
fi

echo "Tagging the Docker image with $TAG tag...";
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";
docker tag $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER $DOCKER_IMAGE_REPOSITORY:$TAG;

echo "Pushing the Docker image with $TAG tag..."
docker push $DOCKER_IMAGE_REPOSITORY:$TAG;

# Push additional tag with version if necessary
if [[ $CI_PULL_REQUEST == "false" ]] && [[ $CI_BRANCH == "master" ]]; then
  echo "Tagging the Docker image with $NPM_VERSION tag...";
  docker tag $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER $DOCKER_IMAGE_REPOSITORY:$NPM_VERSION;
  echo "Pushing the Docker image with $NPM_VERSION tag...";
  docker push $DOCKER_IMAGE_REPOSITORY:$NPM_VERSION;
fi
