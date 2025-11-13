#!/bin/bash

docker rm -f groceries-mongo

docker run \
    --detach \
    --name groceries-mongo-1 \
    --publish 27017:27017 \
    mongo:7
