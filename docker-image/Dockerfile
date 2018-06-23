FROM node:9-alpine
LABEL Maintainer Pawel Kosiec <pawel@kosiec.net>

WORKDIR /app

#
# Install dependencies
#

COPY package.json package-lock.json /app/
RUN npm install --production

#
# Copy app sources
#

COPY ./tsconfig.json /app/
COPY ./src/ /app/src/

#
# Set environmental variables
#

ENV DEBUG mongo-seeding

CMD npm start
