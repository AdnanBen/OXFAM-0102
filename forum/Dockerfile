FROM node:18-alpine
WORKDIR /app

COPY . .
RUN npm install

ENV NODE_ENV production
EXPOSE 8000
ENTRYPOINT ["npm", "run", "start:migrate"]
