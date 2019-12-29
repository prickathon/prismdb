#!/bin/sh
docker-compose -p prismdb -f /var/app/docker-compose.yml down

docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)
docker volume rm -f $(docker volume ls -q)

