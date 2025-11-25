FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copier seulement package.json et lock pour optimiser le cache Docker
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copier le reste du projet
COPY . .

# Générer les fichiers de build Vite
RUN npm run build
