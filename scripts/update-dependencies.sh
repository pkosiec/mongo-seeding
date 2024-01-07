#!/usr/bin/env bash

# standard bash error handling
set -o nounset # treat unset variables as an error and exit immediately.
set -o errexit # exit immediately when a command fails.
set -E         # needs to be set if we want the ERR trap

ROOT_PATH=$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )

DIRECTORIES=(
    "/"
    "core"
    "cli"
    "docker-image/test/tester"
    "examples/import-data/example"
    "examples/custom-docker-image/sample-data"
    "examples/mongoose-express/example"
)
DIRECTORIES_WITH_FORCE=(
  "examples/import-data-ts/example"
)

echo "Updating dependencies..."

function updateDependencies() {
    echo "> $1"
    cd $2
    npm outdated || true
    if [ "$3" = true ] ; then
      echo "Forcing update..."
      npm update --force
    else
      npm update
      npm audit fix
    fi
}

for directory in "${DIRECTORIES[@]}"
   do
     CURRENT_PATH=${ROOT_PATH}/${directory}
     updateDependencies ${directory} ${CURRENT_PATH} false
   done

for directory in "${DIRECTORIES_WITH_FORCE[@]}"
   do
     CURRENT_PATH=${ROOT_PATH}/${directory}
     updateDependencies ${directory} ${CURRENT_PATH} true
   done


echo "Bringing back symlinks..."

cd ${ROOT_PATH}
npm run bootstrap
