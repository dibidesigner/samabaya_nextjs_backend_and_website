
# # --- Stage 1: Build ---
# FROM node:22-alpine AS builder
# WORKDIR /app

# # Install dependencies
# COPY package*.json ./
# RUN npm ci

# # Copy source code and build
# COPY . .
# RUN npm run build

# # --- Stage 2: Production ---
# FROM node:22-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# # Copy standalone Next.js build
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

# # Expose port
# EXPOSE 3000

# # Start app using standalone server
# CMD ["node", "server.js"]


# --- Stage 1: Build ---
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# --- Stage 2: Production ---
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# install chromium
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    fonts-liberation \
    xdg-utils \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]