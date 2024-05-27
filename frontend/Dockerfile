# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN echo "installing dependencies with node"
RUN node --version
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
RUN echo "building dependencies with node"
RUN node --version
ARG BUILD_ENV=.env
ENV NEXT_PRIVATE_STANDALONE=true
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN find . -type f -name '.env**.*' -delete
COPY ./$BUILD_ENV .env
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH=/app/node_modules/sharp
ENV NEXT_PRIVATE_STANDALONE=true
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]