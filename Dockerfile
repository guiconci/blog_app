# Use official Node.js image
#FROM node:18
FROM node:18-alpine

# Set environment to development so devDependencies like nodemon are installed
ENV NODE_ENV=development

# Install build tools for sqlite3
RUN apk add --no-cache python3 make g++ sqlite sqlite-dev py3-setuptools

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./

# Rebuild native modules like sqlite3 inside the container
RUN npm install --include=dev
#--build-from-source sqlite3

# Copy the rest of your app files
COPY . .

# Expose the port your app uses (adjust if needed)
EXPOSE 3000
EXPOSE 35729

# Start the app
CMD ["node", "index.js"]

# LIVE RELOAD
# CMD ["npm", "run", "dev"]
