# --- Stage 1: Build the Web Frontend ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY pnpm*.yaml ./

# If using pnpm, yarn, or bun, adapt the install command accordingly:
RUN pnpm ci

# Copy the rest of the frontend/project source
COPY . .

# Run the frontend build command (adjust if your build script is different)
RUN pnpm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy built static files from the builder stage
# Adjust 'dist' or 'build' to match your frontend output folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
