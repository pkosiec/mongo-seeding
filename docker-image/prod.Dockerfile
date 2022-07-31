FROM node:18-alpine

ARG cliVersion=""
ENV CLI_VERSION=${cliVersion}

RUN npm i -g "mongo-seeding-cli@${CLI_VERSION}"

WORKDIR /data

CMD seed