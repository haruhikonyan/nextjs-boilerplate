#!/bin/bash

set -xe

git config --global --add safe.directory /nextjs-boilerplate

sudo chown -R vscode:vscode /nextjs-boilerplate/node_modules

pnpm config set store-dir /home/vscode/.local/share/pnpm/store
pnpm install --frozen-lockfile
