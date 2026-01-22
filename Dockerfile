FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Build stage
FROM base AS build

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build static site
RUN pnpm run generate

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install serve for serving static files
RUN npm install -g serve

# Copy generated static files from build stage
COPY --from=build /app/.output/public ./public

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production

# Start the application with serve
CMD ["serve", "-s", "public", "-l", "3001"]
