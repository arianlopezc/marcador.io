FROM node:18-alpine3.15 as builder

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm ci \
    && npm run build:worker \
    && npm prune --production

# --- BUILDING PRODUCTION DOCKER CONTAINER --- #

FROM node:18-alpine3.15

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json /usr/src/app/
COPY --from=builder /usr/src/app/node_modules/ /usr/src/app/node_modules/
COPY --from=builder /usr/src/app/dist/apps/marcador.processor /usr/src/app/dist/

RUN chown -R node /usr/src/app
USER node

CMD ["node", "dist/main.js"]