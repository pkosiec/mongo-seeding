# Run with context of the upper level directory

#
# Stage 1: Core
#

FROM node:10-alpine AS coreBuilder
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
# Stage 2: CLI
#

FROM node:10-alpine
LABEL Maintainer="Pawel Kosiec <pawel@kosiec.net>"

ENV CLI_DIR=./cli
WORKDIR /app

# Install dependencies
COPY $CLI_DIR/package.json $CLI_DIR/package-lock.json /app/
RUN npm i --no-optional

# Copy built core 
COPY --from=coreBuilder /app/ /app/node_modules/mongo-seeding/

# Copy app sources
COPY $CLI_DIR/tsconfig.json /app/
COPY $CLI_DIR/src/ /app/src/
COPY $CLI_DIR/bin/ /app/bin/

# Build app
RUN npm run build

# Remove unnecessary sources
RUN rm -rf /app/src/

# Create a symlink
RUN npm link mongo-seeding-cli

CMD seed
