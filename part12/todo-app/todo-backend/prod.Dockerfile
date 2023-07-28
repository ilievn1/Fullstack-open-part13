FROM node:16


WORKDIR /usr/src/app

USER node
COPY --chown=node:node . .

RUN npm ci

CMD ["npm", "start"]