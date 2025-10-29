# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- build ----------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Public envs baked into the client at build time
ARG NEXT_PUBLIC_ONLINE_ENDPOINT
ARG NEXT_PUBLIC_VLLM_CHAT
ARG NEXT_PUBLIC_VLLM_MODEL
ARG NEXT_PUBLIC_OFFLINE_API_KEY
ENV NEXT_PUBLIC_ONLINE_ENDPOINT=$NEXT_PUBLIC_ONLINE_ENDPOINT
ENV NEXT_PUBLIC_VLLM_CHAT=$NEXT_PUBLIC_VLLM_CHAT
ENV NEXT_PUBLIC_VLLM_MODEL=$NEXT_PUBLIC_VLLM_MODEL
ENV NEXT_PUBLIC_OFFLINE_API_KEY=$NEXT_PUBLIC_OFFLINE_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# next.config.ts should have:  output: "standalone"
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
