FROM gittools/gitversion:5.0.2-linux

RUN apt-get update
RUN apt-get install jq

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]