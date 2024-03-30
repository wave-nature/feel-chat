FROM node

WORKDIR /app

COPY package.json /app

RUN npm insall

COPY . /app

EXPOSE 80

CMD ["npm", "dev"]