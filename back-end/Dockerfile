FROM node:20-alpine

WORKDIR /usr/src/app

# Installation des dépendances
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code
COPY . .

EXPOSE 4000

# Le CMD sera overridé par docker-compose
CMD ["node", "src/index.js"]