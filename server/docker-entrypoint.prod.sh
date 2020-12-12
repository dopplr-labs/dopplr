#!/bin/sh

echo "Installing node modules..."
yarn install

echo "Building server..."
yarn build

echo "Running server..."
exec "$@"
