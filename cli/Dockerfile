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

WORKDIR /app

ENV CLI_DIR=./cli

# Install dependencies
COPY $CLI_DIR/package.json $CLI_DIR/package-lock.json /app/
RUN npm i --no-optional

# Copy core
COPY --from=builder /app/ /app/node_modules/mongo-seeding/

# Copy app sources
COPY $CLI_DIR/tsconfig.json /app/
COPY $CLI_DIR/src/ /app/src/
COPY $CLI_DIR/bin/ /app/bin/
COPY $CLI_DIR/test/ /app/test/

# Build app
RUN npm run build

# Remove built app
RUN npm run cleanup

ENV CI true

# Run tests on container start
CMD npm test
