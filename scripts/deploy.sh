#!/bin/bash -e

set -eo pipefail

deno run typecheck
kamal deploy