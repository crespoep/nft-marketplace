FROM node:18
WORKDIR /smart-contracts
COPY . .
RUN npm install
USER node
ENTRYPOINT ["/bin/sh", "/smart-contracts/docker/entrypoint.sh"]
