FROM tenforce/virtuoso:virtuoso7.2.5

ARG DBA_PASSWORD
ENV DBA_PASSWORD=${DBA_PASSWORD}

ADD ./scripts /scripts
ADD ./data /data

ENV VIRT_HTTPServer_ServerPort 1234

CMD ["/bin/bash", "/virtuoso.sh"]
