FROM node:18-alpine
LABEL org.opencontainers.image.title="Mongo Seeding" \
      org.opencontainers.image.description=" The ultimate solution for populating your MongoDB database. " \
      org.opencontainers.image.url="https://mongo-seeding.kosiec.dev" \
      org.opencontainers.image.documentation="https://mongo-seeding.kosiec.dev" \
      org.opencontainers.image.source="https://github.com/pkosiec/mongo-seeding.git" \
      org.opencontainers.image.version=${cliVersion} \
      org.opencontainers.image.licenses="MIT"

ARG cliVersion=""
ENV CLI_VERSION=${cliVersion}

RUN npm i -g "mongo-seeding-cli@${CLI_VERSION}"

WORKDIR /data

CMD seed