# Run with context of the upper level directory

FROM node:11-alpine

ENV DIR core
WORKDIR /core

# Install git
RUN apk add --update git && \
    rm -rf /tmp/* /var/cache/apk/*

# Install dependencies
COPY $DIR/package.json $DIR/package-lock.json /$DIR/
RUN npm i

# Copy app sources
COPY ./codecov.yml /
COPY ./.git/ /
COPY ./$DIR/tsconfig.json /$DIR/
COPY ./$DIR/src/ /$DIR/src/
COPY ./$DIR/test/ /$DIR/test/

# Build app
RUN npm run build
# Remove built app
RUN npm run cleanup

ENV CI true

# Run tests on container start
CMD npm run test:coverage && \
    npm run test:upload-coverage 
