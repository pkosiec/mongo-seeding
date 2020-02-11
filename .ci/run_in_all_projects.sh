#!/usr/bin/env bash
TASK_TYPE=$1
CI_DIR_NAME=".ci"

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )
cd ${ROOT_PATH}

set -e

echo "=== Task $TASK_TYPE ==="

echo "Setting environmental variables..."
export CI_BUILD_NUMBER=$TRAVIS_BUILD_NUMBER
export CI_PULL_REQUEST=$TRAVIS_PULL_REQUEST
export CI_PULL_REQUEST_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH
export CI_BRANCH=$TRAVIS_BRANCH
export CI_SECURE_ENV_VARS=$TRAVIS_SECURE_ENV_VARS

echo "Scanning all directories on root..."
for dir in */ ; do
    cd ${ROOT_PATH}
    SCRIPT_PATH="$dir$CI_DIR_NAME/$TASK_TYPE.sh"
    if [ ! -f "$SCRIPT_PATH" ]; then
        echo "Script file `${SCRIPT_PATH}` not found. Skipping..."
        continue
    fi
    
    echo ">> Running $TASK_TYPE in directory $dir..."
    eval $SCRIPT_PATH
done