FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./ 2>/dev/null || true
RUN npm ci


FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_ONLINE_ENDPOINT
ARG NEXT_PUBLIC_VLLM_CHAT
ARG NEXT_PUBLIC_VLLM_MODEL
ARG NEXT_PUBLIC_OFFLINE_API_KEY
ENV NEXT_PUBLIC_ONLINE_ENDPOINT=$NEXT_PUBLIC_ONLINE_ENDPOINT
ENV NEXT_PUBLIC_VLLM_CHAT=$NEXT_PUBLIC_VLLM_CHAT
ENV NEXT_PUBLIC_VLLM_MODEL=$NEXT_PUBLIC_VLLM_MODEL
ENV NEXT_PUBLIC_OFFLINE_API_KEY=$NEXT_PUBLIC_OFFLINE_API_KEY
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]  # ensure "start": "next start -p 3000" in package.json
