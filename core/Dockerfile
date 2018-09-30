# Run with context of the upper level directory

FROM node:10-alpine

ENV DIR ./core
WORKDIR /app

# Install git
RUN apk add --update git && \
    rm -rf /tmp/* /var/cache/apk/*

# Install dependencies
COPY $DIR/package.json $DIR/package-lock.json /app/
RUN npm i

# Copy app sources
COPY ./.git/ /.git/
COPY $DIR/tsconfig.json /app/
COPY $DIR/src/ /app/src/
COPY $DIR/test/ /app/test/

# Build app
RUN npm run build
# Remove built app
RUN npm run cleanup

ENV CI true

# Run tests on container start
CMD npm test -- --ci --coverage && \
    cat ./coverage/lcov.info | ./node_modules/.bin/codacy-coverage --language typescript 
