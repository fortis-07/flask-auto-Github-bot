#!/bin/bash

PR_ID=$1

# Stop and remove the Docker container
docker stop $(cat /tmp/container-$PR_ID)
docker rm $(cat /tmp/container-$PR_ID)

# Remove the cloned repo
rm -rf repo-$PR_ID

# Remove the container ID file
rm /tmp/container-$PR_ID