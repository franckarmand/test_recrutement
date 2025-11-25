FROM node:20-alpine

WORKDIR /usr/src/app

# Copier package files
COPY package*.json ./

# Installation
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copier tout le code
COPY . .

EXPOSE 5173

ENV NODE_ENV=development

# Commande de démarrage
CMD ["npm", "run", "dev"]