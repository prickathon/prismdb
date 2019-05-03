#!/bin/sh
docker-compose -f /var/app/docker-compose.csv2rdf.yml up
docker-compose -p prismdb -f /var/app/docker-compose.yml down
docker-compose -p prismdb -f /var/app/docker-compose.yml up -d
