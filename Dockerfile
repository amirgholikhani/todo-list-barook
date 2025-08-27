# syntax=docker/dockerfile:1

# 1) Builder
FROM node:22-alpine AS deps
WORKDIR /app

# Install deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN   if [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile;   elif [ -f yarn.lock ]; then yarn --frozen-lockfile;   else npm ci; fi

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 2) Runner
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Use Next.js standalone output if available
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
