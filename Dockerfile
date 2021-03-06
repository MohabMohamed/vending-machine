FROM node:17.8-alpine3.14 AS production-builder
WORKDIR /app
COPY package.json ./
COPY .sequelizerc .sequelizerc
COPY config/database.js config/database.js
RUN npm install --production

FROM node:17.8-alpine3.14 AS production
WORKDIR /app
COPY --from=production-builder /app ./
COPY ./src ./src
EXPOSE 3000
CMD ["npm", "run","start"]

FROM node:17.8-alpine3.14 AS development
WORKDIR /app
COPY --from=production-builder /app ./
COPY . .
VOLUME /app
RUN npm install
EXPOSE 3000
CMD ["npm", "run","dev"]