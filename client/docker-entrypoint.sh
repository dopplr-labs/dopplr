#!/bin/sh

if [ ! -d "node_modules" ] || [ ! "$(ls -A node_modules)" ]; then
  echo "Node modules not installed. Installing..."
  yarn install
fi

echo "Starting your app..."

exec "$@"
