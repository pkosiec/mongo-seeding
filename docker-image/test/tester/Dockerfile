FROM node:10.10.0-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install --no-optional

COPY ./src /app/src

ENV CI true

CMD npm test