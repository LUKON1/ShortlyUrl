FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./

RUN npm install --production

COPY server/ .
COPY shared/ ../shared/

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]