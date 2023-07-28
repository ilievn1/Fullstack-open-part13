FROM node:18

WORKDIR /usr/src/app

EXPOSE 3003

COPY --chown=node:node . .
RUN npm ci --omit=dev

USER node
CMD npm start