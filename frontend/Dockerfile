FROM node:9.2.1-alpine

ENV PORT 80

WORKDIR /app

EXPOSE 80

ADD ./package*.json /app/
RUN npm install

ADD . /app
RUN npm run-script build

CMD yarn start
