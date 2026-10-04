# ==============================================================================
# NOVA CRM - BACKEND PRODUCTION MULTI-STAGE DOCKERFILE
# Node.js 20 Alpine • Non-root Security • Minimal Attack Surface
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: DEPENDENCY INSTALLATION
# ------------------------------------------------------------------------------
FROM node:20-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && npx prisma generate

# ------------------------------------------------------------------------------
# STAGE 2: BUILD APPLICATION
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build
RUN npm prune --production

# ------------------------------------------------------------------------------
# STAGE 3: PRODUCTION RUNNER (Distroless / Minimal Alpine)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache curl openssl tzdata \
    && cp /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime \
    && echo "Asia/Ho_Chi_Minh" > /etc/timezone \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001 -G nodejs

# Copy artifacts from builder
COPY --chown=nestjs:nodejs package*.json ./
COPY --chown=nestjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=builder /app/dist ./dist
COPY --chown=nestjs:nodejs --from=builder /app/prisma ./prisma

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:4000/health/liveness || exit 1

CMD ["node", "dist/main"]
