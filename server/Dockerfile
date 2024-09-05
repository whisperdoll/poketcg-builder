# Use the official Node.js image as the base image
FROM node:14

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy over package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the WebSocket server port
EXPOSE 8080

# Command to run the WebSocket server
CMD ["pnpm", "start"]
