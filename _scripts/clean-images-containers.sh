#!/usr/bin/env bash
#eval $(minikube docker-env)

docker rm $(docker ps -q -f 'status=exited')
docker rmi $(docker images -q -f "dangling=true")
