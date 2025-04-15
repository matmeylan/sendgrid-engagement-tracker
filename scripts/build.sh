#!/bin/bash -e

set -eo pipefail

deno run typecheck
docker build -t sendgrid-engagement-tracker .
