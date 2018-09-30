FROM node:10-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm i

# Copy app sources
COPY tsconfig.json /app/
COPY src/ /app/src/
COPY test/ /app/test/

# Build app
RUN npm run build
# Remove built app
RUN npm run cleanup

ENV CI true

# Run tests on container start
CMD npm test
