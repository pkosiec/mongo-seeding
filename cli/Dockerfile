FROM node:9-alpine
LABEL Maintainer Pawel Kosiec <pawel@kosiec.net>

WORKDIR /app

#
# Install dependencies
#

COPY package.json package-lock.json /app/
COPY dist /app/dist/
COPY bin /app/bin/
COPY node_modules /app/node_modules/

RUN npm link

ENTRYPOINT seed