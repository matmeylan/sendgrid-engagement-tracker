#!/bin/bash -e

set -eo pipefail

deno run typecheck
docker build -t seth_local .
docker run -it --rm -p 8080:8080 --volume ./data:/data --env-file .env.docker seth_local