FROM node:alpine
EXPOSE 3000

RUN mkdir /srv/server
WORKDIR /srv/server
VOLUME /srv/server

COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["yarn", "start:dev"]