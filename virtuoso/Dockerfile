FROM askomics/virtuoso:7.2.5.1

ARG DBA_PASSWORD
ENV DBA_PASSWORD=${DBA_PASSWORD}

ADD ./scripts /scripts
ADD ./data /data

RUN /scripts/setup.sh

ENV PORT 8080

CMD /scripts/start.sh
