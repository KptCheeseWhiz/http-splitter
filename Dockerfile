FROM node:fermium-alpine AS build

RUN mkdir /app
WORKDIR /app

COPY ./ /app/
RUN npm install
RUN echo -n > /app/.env
RUN echo -n "[]" > /app/src/proxies.json
RUN npm run build

FROM node:fermium-alpine AS final

RUN mkdir /app
WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/out /app/

RUN npm prune

USER node
CMD ["npm", "run", "start:docker"]