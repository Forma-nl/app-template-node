# One image for web, workers, scheduler and the migrate hook. The command
# differs; the code must not.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

FROM node:22-alpine
WORKDIR /app

# Signals reach PID 1 through tini, so SIGTERM actually stops a worker instead
# of being ignored until the kill deadline.
RUN apk add --no-cache tini

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production PORT=8080
EXPOSE 8080
USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
