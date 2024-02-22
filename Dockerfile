FROM node:18-alpine

RUN npm install -g prisma

WORKDIR /src

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
