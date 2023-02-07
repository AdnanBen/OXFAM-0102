FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production

COPY . .
RUN npm install --production

EXPOSE 8000
ENTRYPOINT ["npm", "run", "start:migrate"]
