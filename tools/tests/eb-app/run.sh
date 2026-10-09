#!/usr/bin/env bash
# Regression suite for the Enterprise Brain React prototype. See README.md.
#   bash tools/tests/eb-app/run.sh [--build] [suite ...]
set -euo pipefail
exec node "$(dirname "$0")/run.mjs" "$@"
