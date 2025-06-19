# Use light weight node image alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

#copy packages
COPY package*.json ./

# Install react based on package dependencies
RUN npm install --include=dev --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Expose React dev server port
ENV PORT=5173
EXPOSE 5173

