FROM node:15.5.1-alpine3.10

EXPOSE 8080

COPY . /vue_app

WORKDIR /vue_app

RUN npm install

CMD [ "npm" , "run" , "serve"]