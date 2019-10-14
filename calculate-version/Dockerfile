FROM gittools/gitversion:5.0.2-linux

RUN apt-get update
RUN apt-get -y install python
RUN apt-get -y install jq

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]