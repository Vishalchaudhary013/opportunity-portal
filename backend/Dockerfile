# Use Node 20 as base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
# We use --omit=dev to keep the image small
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose the port Render uses
EXPOSE 10000

# Start the application
CMD [ "node", "server.js" ]
