FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV SKIP_ENV_VALIDATION=1
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
