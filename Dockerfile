# --- build stage ---
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install build deps
RUN apk add --no-cache libc6-compat

# Copy package manifests and install
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy rest of the source
COPY . .

# Build the Next.js app
RUN npm run build

# --- production image ---
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# If you want smaller image: install only runtime deps
COPY package*.json ./
RUN npm ci --production --legacy-peer-deps

# Copy built app and public files from builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Expose port (use 3000 unless your app uses a different port)
EXPOSE 3000

# Use non-root user (optional)
USER node

# Start the Next.js production server (must run `npm run build` during build stage)
CMD ["npm", "run", "start"]
# --- build stage ---
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# copy everything (including prisma/)
COPY . .

# generate prisma client (ensure schema present at prisma/schema.prisma)
RUN npx prisma generate --schema=./prisma/schema.prisma

# build next
RUN npm run build
