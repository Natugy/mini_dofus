# Utilise l'image officielle Node.js comme image de base
FROM node:14

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le fichier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installe les dépendances de l'application
RUN npm install

# Copie le reste des fichiers de l'application dans le conteneur
COPY . .

# Expose le port sur lequel l'application écoute
EXPOSE 3000

# Définit la commande pour démarrer l'application
CMD ["npm", "start"]