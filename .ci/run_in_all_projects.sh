#!/bin/bash
TASK_TYPE=$1
CI_DIR_NAME=".ci"

for dir in */ ; do
    PATH="$dir$CI_DIR_NAME/$TASK_TYPE.sh"
    if [ ! -f "$PATH" ]; then
        continue
    fi
    
    echo ">> Running $TASK_TYPE in directory $dir..."
    ./$PATH
done