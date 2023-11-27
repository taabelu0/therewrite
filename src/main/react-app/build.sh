#!/bin/bash
rm -r build/*
echo "BASE_URL=https://rewrite-your.work" > .env
echo "API_URL=https://rewrite-your.work" >> .env
npm run build
rm -r ../resources/static/*
cp -r build/* ../resources/static
cp build/index.html ../resources/templates