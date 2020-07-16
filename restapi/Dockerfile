FROM node:11.9

ARG SPARQL_ENDPOINT_URL
ENV SPARQL_ENDPOINT_URL=${SPARQL_ENDPOINT_URL}

WORKDIR /var/www/app

ADD ./package.json ./package-lock.json /var/www/app/
RUN npm ci

ADD . /var/www/app

ENV PORT 8080

CMD npm start
