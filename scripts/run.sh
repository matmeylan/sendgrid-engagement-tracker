#!/bin/bash -e

set -eo pipefail

docker run -it --rm -p 8080:8080 --env-file .env.production sendgrid-engagement-tracker