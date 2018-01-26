#!/bin/bash
set -e 
echo "Testing package..."
npm run test
echo "Building release version..."
npm run build
echo "Copying essential files to release directory..."
cp {package.json,LICENSE,README.md} ./dist
cd ./dist
echo "Publishing package..."
npm publish
echo "Cleaning up..."
rm -rf ./dist
