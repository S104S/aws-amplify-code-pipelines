#!/bin/bash
WIPE_LOCALSTACK=$1
export DEBUG=1
export LAMBDA_EXECUTOR=docker
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

BASEDIR="$( cd $DIR/.. && pwd)"
DOCKER_DIR="$BASEDIR/_docker"

echo $BASEDIR
echo $DOCKER_DIR

cd $DOCKER_DIR

if [[ "$WIPE_LOCALSTACK" == "y" ]]; then
  echo "Wiping localstack state...."
  ls
  sudo rm -R ./volume
#  ls
fi
docker-compose up
