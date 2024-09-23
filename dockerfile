FROM node:18-alpine

# Create app directory 
WORKDIR /app

# Install app depedency
COPY package*.json ./

# Run npm install
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# docker all command docker -h 