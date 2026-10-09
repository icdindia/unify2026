#!/bin/sh
# wrap the publish fragment in a doctype for local checks (the Artifact publisher adds its own skeleton)
cd "$(dirname "$0")/../showcase" && { printf '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style></head><body>'; cat dt-design-system.html; printf '</body></html>'; } > _local.html
