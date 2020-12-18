#!/bin/sh

echo "Installing node modules..."
yarn install

echo "Starting your app..."

exec "$@"
