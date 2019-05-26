FROM node:8.16.0-alpine

WORKDIR /app

COPY . .

RUN npm install --silent \
  && npm run heroku-postbuild

CMD ["npm", "start"]