# Use official Node.js LTS Alpine image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package.json + lock for caching)
COPY package*.json .npmrc* ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Production Image ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from builder
COPY package*.json .npmrc* ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]

