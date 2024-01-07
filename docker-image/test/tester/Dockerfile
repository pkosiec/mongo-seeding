FROM node:20.10-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install --no-optional

COPY ./src /app/src

ENV CI true

CMD npm test