FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./package-lock.json ./
COPY . .
RUN npm ci
RUN npm build
CMD ["npm", "start"]
