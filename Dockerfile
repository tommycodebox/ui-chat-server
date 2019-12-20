FROM node:10-slim

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 5000

CMD [ "node", "src/app.js" ]