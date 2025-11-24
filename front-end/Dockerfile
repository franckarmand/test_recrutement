FROM node:20-alpine

WORKDIR /usr/src/app

# Copier seulement package.json pour accélérer le build
COPY package*.json ./
RUN npm install

# Copier tout le code
COPY . .

EXPOSE 5173 

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
