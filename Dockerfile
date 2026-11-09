FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/uploads

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Uploaded PDFs: mount a persistent volume here
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
VOLUME /app/uploads

USER node

EXPOSE 3000

CMD ["node", "server.js"]
