FROM gittools/gitversion:5.0.2-linux

RUN sudo apt-get install jq

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]