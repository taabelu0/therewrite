# From https://blog.dsoderlund.consulting/react-nginx-docker-multistage
# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:14.18.1-alpine3.11 AS builder
# Set working directory
WORKDIR /app

COPY build/ build/

# install node modules and build assets
#RUN npm run build

# nginx state for serving content
FROM nginx:1.21.1-alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
