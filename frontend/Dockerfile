FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./package-lock.json ./
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm", "run", "start"]
