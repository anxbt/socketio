# # Stage 1: Build the backend

# FROM node:18 AS backend-build

# WORKDIR /app

# COPY package*.json ./


# RUN npm install


# COPY . .

# EXPOSE 3000

# # Stage 2: Set up Nginx
# FROM nginx:latest

# # Copy the backend build files
# COPY --from=backend-build /app /usr/src/app

# # Copy Nginx configuration
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# # Copy SSL certificates
# COPY nginx/certificate.crt /etc/ssl/certs/
# COPY nginx/private.key /etc/ssl/private/

# # Expose ports for HTTP and HTTPS
# EXPOSE 80
# EXPOSE 443

# # Start backend and Nginx
# CMD ["sh", "-c", "node /usr/src/app/index.js & nginx -g 'daemon off;'"]

# Stage 1: Build the backend
FROM node:18 AS backend-build

# Set the working directory
WORKDIR /app

# Copy backend source code
COPY . .

EXPOSE 3000


# Install dependencies and build the app
RUN npm install

# Stage 2: NGINX + Node.js
FROM nginx:alpine

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Copy the backend build files
COPY --from=backend-build /app /usr/src/app

# Copy the NGINX configuration file
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates
COPY nginx/certificate.crt /etc/ssl/certs/
COPY nginx/private.key /etc/ssl/private/

# Set the working directory to the app
WORKDIR /usr/src/app

# Run both Node.js and NGINX in one container
CMD ["sh", "-c", "node /usr/src/app/index.js & nginx -g 'daemon off;'"]
