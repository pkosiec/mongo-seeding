#!/usr/bin/env bash

set -e
ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )

DIRECTORIES=(
    "/"
    "core"
    "cli"
    "docker-image/test/tester"
    "examples/import-data/example"
    "examples/import-data-ts/example"
    "examples/custom-docker-image/sample-data"
)

echo "Updating dependencies..."

function updateDependencies() {
    echo "> $1"
    cd ${ROOT_PATH}/${1}
    npm outdated
    npm update
}

for directory in "${DIRECTORIES[@]}"
   do
     updateDependencies ${directory}
   done

echo "Bringing back symlinks..."
cd ${ROOT_PATH}
npm run bootstrap