FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies (use npm ci for reproducible installs)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
ENV NODE_ENV=production
# Ensure files and node binaries are executable to avoid permission errors
RUN chmod -R a+rx /app && [ -d node_modules/.bin ] && chmod -R a+rx node_modules/.bin || true
RUN npm run build

FROM nginx:1.31.3-alpine

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Use a custom nginx config to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
