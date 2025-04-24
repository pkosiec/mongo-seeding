FROM node:22.15.0

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install --no-optional

COPY ./src /app/src

ENV CI true

CMD npm test