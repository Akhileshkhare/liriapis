# Use the official Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Express app runs on (e.g., 3000)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
