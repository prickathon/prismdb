#!/bin/sh
docker-compose -p prismdb -f /var/app/docker-compose.yml down
docker-compose -p prismdb -f /var/app/docker-compose.yml up -d
