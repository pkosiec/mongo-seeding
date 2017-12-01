#!/bin/bash
echo "Building release version..."
npm run build
echo "Copying essential files to release directory..."
cp {package.json,LICENSE,README.md} ./dist
cd ./dist
echo "Publishing package..."
npm publish
