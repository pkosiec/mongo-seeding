FROM node:9.4.0-alpine
LABEL Maintainer Pawel Kosiec <pawel@kosiec.net>

WORKDIR /app

#
# Install dependencies
#

COPY package.json package-lock.json /app/
RUN npm i

#
# Copy app sources
#

COPY ./tsconfig.json /app/
COPY ./src/ /app/src/
COPY ./tests/ /app/tests/

#
# Run tests on container start
#

CMD npm test -- --ci
