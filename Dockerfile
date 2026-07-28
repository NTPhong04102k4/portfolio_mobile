# ========================================
# Stage 1: Build
# ========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json only (ignore Windows lockfile)
COPY package.json ./

# Install dependencies fresh for Linux
RUN npm install

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# ========================================
# Stage 2: Serve with Nginx
# ========================================
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
