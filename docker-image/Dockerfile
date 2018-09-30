# Run with context of the upper level directory

#
# Stage 1 
#

FROM node:10-alpine AS builder
LABEL Maintainer="Pawel Kosiec <pawel@kosiec.net>"

ENV CLI_DIR=./cli
WORKDIR /app

# Copy sources
COPY $CLI_DIR/package.json $CLI_DIR/package-lock.json $CLI_DIR/tsconfig.json /app/
COPY $CLI_DIR/bin /app/bin/
COPY $CLI_DIR/src /app/src/

# Install dependencies
RUN npm install --no-optional

# Build app
RUN npm run build

# Remove sources
RUN rm -rf /app/src/

#
# Stage 2 
#

FROM node:10-alpine
WORKDIR /app

# Copy built app
COPY --from=builder /app/ /app/

# Create a symlink for "seed" command
RUN npm link

CMD seed