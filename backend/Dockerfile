# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests first to leverage layer caching
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY prisma.config.ts ./

# Install all dependencies (including devDeps needed for the build)
RUN npm ci

# Copy source and generated Prisma client
COPY src/ ./src/
COPY prisma/ ./prisma/
COPY generated/ ./generated/

# Generate Prisma client then compile TypeScript
RUN npm run build

# ── Stage 2: production image ──────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy manifests and install production deps only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client (runtime needs it at ./generated/prisma)
COPY --from=builder /app/generated ./generated

# Copy prisma schema + migrations (needed if you run migrate deploy on startup)
COPY prisma/ ./prisma/

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "dist/main"]
