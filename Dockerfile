FROM node:18-alpine

WORKDIR /src

COPY package*.json ./

COPY ./prisma/schema.prisma ./prisma/

RUN npm install --silent

COPY . /src

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]
