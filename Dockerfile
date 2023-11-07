FROM node:18
# nodejs.org guides nodejs-docker-webapp

# create app directory
WORKDIR /usr/src/app

# install deps
COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Port
EXPOSE 3004

# Run app
CMD [ "npm", "start" ]
