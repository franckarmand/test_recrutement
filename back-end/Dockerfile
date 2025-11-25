FROM node:20-alpine

WORKDIR /usr/src/app

# Copier package.json et prisma
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

COPY . .


EXPOSE 4000
