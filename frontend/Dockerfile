# Build stage
FROM node:18 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install dependencies (all deps needed for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Runtime stage
FROM nginx:1.31.3-alpine

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
