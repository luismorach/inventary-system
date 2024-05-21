#stage 1:build
FROM node:18.14.1-alpine AS build

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm install

COPY * /app

RUN npm run build --prod

RUN ls -alt

#stage 2:expose
FROM nginx:1.17.1-alpine

COPY --from=build /usr/src/app/dist/app usr/share/nginx/html

COPY --from=build /usr/src/app/nginx.conf etc/nginx/conf.d/default.conf

EXPOSE 80