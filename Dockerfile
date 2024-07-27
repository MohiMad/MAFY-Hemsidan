# Use an official Node runtime as the base image
FROM node:14

# Set the working directory for the frontend
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Build the frontend
RUN npm run build

# Set the working directory to the backend
WORKDIR /app/backend

# Install backend dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
