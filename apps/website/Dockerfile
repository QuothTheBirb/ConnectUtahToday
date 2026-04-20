FROM node:20-alpine AS base

# 1. Prune stage
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo@^2
WORKDIR /app
COPY . .
# Generate a pruned version of the monorepo for the website
RUN turbo prune @connect-utah-today/website --docker

# 2. Install stage
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo@^2
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm ci

# Build the project
COPY --from=builder /app/out/full/ .
RUN --mount=type=secret,id=DOTENV_PRIVATE_KEY_PRODUCTION,env=DOTENV_PRIVATE_KEY_PRODUCTION turbo run build

# 3. Runner stage
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# The standalone output folder needs to be copied
COPY --from=installer --chown=nextjs:nodejs /app/apps/website/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/website/.next/static ./apps/website/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/website/public ./apps/website/public

CMD ["node", "apps/website/server.js"]
