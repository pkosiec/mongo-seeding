# Run with context of the upper level directory

#
# Stage 1 
#

FROM node:10.10.0-alpine AS builder
LABEL Maintainer Pawel Kosiec <pawel@kosiec.net>

WORKDIR /app

# Copy sources
COPY ./cli/package.json ./cli/package-lock.json ./cli/tsconfig.json /app/
COPY ./cli/bin /app/bin/
COPY ./cli/src /app/src/

# Install dependencies
RUN npm install --no-optional

# Build app
RUN npm run build

# Remove sources
RUN rm -rf /app/src/

#
# Stage 2 
#

FROM node:10.10.0-alpine
WORKDIR /app

# Copy built app
COPY --from=builder /app/ /app/

# Create a symlink for "seed" command
RUN npm link

CMD seed