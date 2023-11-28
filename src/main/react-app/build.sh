#!/bin/bash
rm -r build/*
echo "REACT_APP_BASE_URL=" > .env
echo "REACT_APP_API_URL=" >> .env
echo "NODE_ENV=production" >> .env
npm run build
rm -r ../resources/static/*
cp -r build/* ../resources/static
cp build/index.html ../resources/templates