FROM node:20-alpine

WORKDIR /usr/src/app

# Copier package.json et prisma
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Ne PAS exécuter prisma generate ici si tu montes un volume local
# CMD sera overridé par docker-compose

EXPOSE 4000
