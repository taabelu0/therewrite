#!/bin/bash
rm -r build/*
npm run build
rm -r ../resources/static/*
cp -r build/* ../resources/static
cp build/index.html ../resources/templates