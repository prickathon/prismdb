# syntax=docker/dockerfile:1.4

FROM node:25.9.0 AS csv2rdf-builder
ENV BASE_URL=https://prismdb.takanakahiko.me
COPY --from=csv2rdf package.json package-lock.json* /app/csv2rdf/
WORKDIR /app/csv2rdf
RUN npm ci
COPY --from=csv2rdf . /app/csv2rdf/
COPY --from=data . /app/_data/
RUN mkdir -p /app/csv2rdf/output
RUN npm run start

FROM askomics/virtuoso:7.2.5.1

ARG DBA_PASSWORD
ENV DBA_PASSWORD=${DBA_PASSWORD}

ADD ./scripts /scripts
COPY --from=csv2rdf-builder /app/csv2rdf/output /data/toLoad

RUN /scripts/setup.sh

ENV PORT 8080

CMD /scripts/start.sh
