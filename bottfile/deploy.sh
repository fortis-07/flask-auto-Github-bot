#!/bin/bash

PR_ID=$1
BRANCH_NAME=$2

# Clone the repo with the specific branch
git clone --branch $BRANCH_NAME https://github.com/hngprojects/flask-example.git repo-$PR_ID

cd repo-$PR_ID

# Build and run the Docker container
docker-compose up -d --build

# Save the container ID
echo $(docker-compose ps -q web) > /tmp/container-$PR_ID