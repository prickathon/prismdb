FROM tenforce/virtuoso:1.3.1-virtuoso7.2.2

RUN unlink /data
RUN ln -s /var/lib/virtuoso/db /data_

ADD ./scripts /scripts
ADD ./data /data_

RUN /scripts/setup.sh

WORKDIR /data_

CMD /scripts/start.sh
