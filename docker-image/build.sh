#!/bin/sh

IMAGE_TAG=$1

cd ..
docker build -f ./docker-image/Dockerfile -t ${IMAGE_TAG:-mongo-seeding} .