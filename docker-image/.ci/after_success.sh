#!/usr/bin/env bash

[ "${CI_PULL_REQUEST}" == "false" ] && [ "${CI_BRANCH}" == "master" ] && IS_MASTER=1 || IS_MASTER=0
[ "${CI_PULL_REQUEST}" == "true" ] && IS_PR=1 || IS_PR=0

if [ $IS_MASTER -eq 0 ] && [ $IS_PR -eq 0 ]; then
  echo "Skipping pushing image for a branch $CI_BRANCH";
  exit 0;
fi

if [ "${CI_SECURE_ENV_VARS}" == "false"]; then
  echo "Secret environmental variables are not available. Skipping pushing image...";
  exit 0;
fi

COMMIT_TAG=$(git tag -l --points-at HEAD | xargs)
if [ $IS_MASTER -eq 1 ] && [ $COMMIT_TAG == "" ]; then
  echo "Skipping pushing untagged image on master";
  exit 0;
fi

echo "Tagging Docker image..."
TAG=$(if [ $IS_MASTER -eq 1 ]; then
  echo "latest";
  else
  echo "snapshot-PR-$CI_PULL_REQUEST_BRANCH";
fi)

echo "Tagging the Docker image with $TAG tag...";
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";
docker tag $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER $DOCKER_IMAGE_REPOSITORY:$TAG;

echo "Pushing the Docker image with $TAG tag..."
docker push $DOCKER_IMAGE_REPOSITORY:$TAG;

# Push additional tag with version if necessary
if [ $IS_MASTER -eq 1 ]; then
  cd ./cli
  NPM_VERSION=$(node -p -e "require('./package.json').version");
  cd ..
  echo "Package version: $NPM_VERSION";

  echo "Tagging the Docker image with $NPM_VERSION tag...";
  docker tag $DOCKER_IMAGE_REPOSITORY:$CI_BUILD_NUMBER $DOCKER_IMAGE_REPOSITORY:$NPM_VERSION;
  echo "Pushing the Docker image with $NPM_VERSION tag...";
  docker push $DOCKER_IMAGE_REPOSITORY:$NPM_VERSION;
fi
