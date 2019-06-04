# Run with context of the upper level directory

#
# Stage 1 
#

FROM node:11-alpine AS builder
LABEL Maintainer="Pawel Kosiec <pawel@kosiec.net>"

ENV CORE_DIR=./core
WORKDIR /app

# Copy sources
COPY $CORE_DIR/package.json $CORE_DIR/package-lock.json $CORE_DIR/tsconfig.json /app/
COPY $CORE_DIR/src /app/src/

# Install dependencies
RUN npm install --no-optional

# Build app
RUN npm run build

# Remove sources
RUN rm -rf /app/src/

#
# Stage 2 
#

FROM node:11-alpine

ENV DIR cli
WORKDIR /cli

# Install git
RUN apk add --update git && \
    rm -rf /tmp/* /var/cache/apk/*

# Install dependencies
COPY $DIR/package.json $DIR/package-lock.json /$DIR/
RUN npm i --no-optional

# Copy core
COPY --from=builder /app/ /app/node_modules/mongo-seeding/

# Copy app sources
COPY ./codecov.yml /
COPY ./.git/ /
COPY ./$DIR/tsconfig.json /$DIR/
COPY ./$DIR/src/ /$DIR/src/
COPY ./$DIR/bin/ /$DIR/bin/
COPY ./$DIR/test/ /$DIR/test/

# Build app
RUN npm run build

# Remove built app
RUN npm run cleanup

ENV CI true

# Run tests on container start
CMD npm run test:coverage && \
    npm run test:upload-coverage 
