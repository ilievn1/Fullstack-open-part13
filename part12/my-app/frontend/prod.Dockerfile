FROM node:18 AS build

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev

RUN npm run build

EXPOSE 80

FROM nginx

COPY --from=build /usr/src/app/build /usr/share/nginx/html