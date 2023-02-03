# Run with context of the upper level directory

#
# Stage 1: Core
#

FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json lerna.json ./

COPY cli/ /app/cli/
COPY core/ /app/core/

RUN npm install
RUN npm run bootstrap
RUN npx lerna run build --scope mongo-seeding-cli


#
# Stage 3: Final Docker image
#

FROM node:18-alpine
LABEL org.opencontainers.image.title="Mongo Seeding" \
      org.opencontainers.image.description=" The ultimate solution for populating your MongoDB database. " \
      org.opencontainers.image.url="https://mongo-seeding.kosiec.dev" \
      org.opencontainers.image.documentation="https://mongo-seeding.kosiec.dev" \
      org.opencontainers.image.source="https://github.com/pkosiec/mongo-seeding.git" \
      org.opencontainers.image.version="dev" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app

COPY --from=builder /app/cli/ /app/

# Create a symlink
RUN npm i --omit=optional --omit=dev && \
    npm link

WORKDIR /data
CMD seed
