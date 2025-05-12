FROM node:latest
WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
# Run the build command

EXPOSE 5173

CMD ["npm", "run", "dev"]