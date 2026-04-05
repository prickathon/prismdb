FROM node:25.9.0-slim

ARG SPARQL_ENDPOINT_URL
ENV SPARQL_ENDPOINT_URL=${SPARQL_ENDPOINT_URL}

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm i

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["node", ".output/server/index.mjs"]
