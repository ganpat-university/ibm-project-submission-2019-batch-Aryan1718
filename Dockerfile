FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Set file permissions
RUN chmod -R 755 /usr/src/app

EXPOSE 8000

CMD [ "node", "app.js" ]