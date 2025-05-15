FROM node:latest

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]