FROM node:14.15.0-alpine
EXPOSE 3000

RUN mkdir /srv/server
WORKDIR /srv/server
VOLUME /srv/server

COPY docker-entrypoint.prod.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.prod.sh

ENTRYPOINT ["docker-entrypoint.prod.sh"]

CMD ["yarn", "start:prod"]