FROM node:20.8.0

ARG SPARQL_ENDPOINT_URL
ENV SPARQL_ENDPOINT_URL=${SPARQL_ENDPOINT_URL}

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN npm i
RUN npm run build

ENV NODE_ENV=production
ENV HOST 0.0.0.0
ENV PORT 8080

CMD ["node", ".output/server/index.mjs"]
