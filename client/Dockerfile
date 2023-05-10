FROM node:16.15.1-alpine3.16

WORKDIR /client
COPY . .
RUN npm install

ENTRYPOINT ["/bin/sh", "/client/docker/entrypoint.sh"]
