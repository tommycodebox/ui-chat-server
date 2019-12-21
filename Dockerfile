FROM node:10-slim

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 80

CMD [ "yarn", "start" ]