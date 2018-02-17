FROM node:9-alpine
LABEL Maintainer Pawel Kosiec <pawel@kosiec.net>

WORKDIR /app

#
# Install git
#
RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*

#
# Install dependencies
#

COPY package.json package-lock.json /app/
RUN npm i

#
# Copy app sources
#

COPY ./.git/ /app/.git/
COPY ./tsconfig.json /app/
COPY ./src/ /app/src/
COPY ./tests/ /app/tests/

#
# Run tests on container start
#

CMD npm test -- --ci --coverage && cat ./coverage/lcov.info | ./node_modules/.bin/codacy-coverage --language typescript 
