FROM node:18-alpine
WORKDIR /app

COPY . .
RUN npm install

ENV NODE_ENV production
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
