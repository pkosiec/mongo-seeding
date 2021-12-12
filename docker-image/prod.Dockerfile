FROM node:17-alpine
LABEL Maintainer="Pawel Kosiec <pawel@kosiec.net>"

ARG cliVersion=""
ENV CLI_VERSION=${cliVersion}

RUN npm i -g "mongo-seeding-cli@${CLI_VERSION}"

WORKDIR /data

CMD seed