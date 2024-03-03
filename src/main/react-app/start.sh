#!/bin/bash
echo "REACT_APP_BASE_URL=http://localhost:3000" > .env
echo "REACT_APP_API_URL=http://localhost:8080" >> .env
echo "REACT_APP_WS_URL=localhost:8080" >> .env
npm start