# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./

# Rebuild native modules like sqlite3 inside the container
RUN npm install --build-from-source

# Copy the rest of your app files
COPY . .

# Expose the port your app uses (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
