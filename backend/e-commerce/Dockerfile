# Use Node.js LTS
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install postgres client + bash for wait-for script
RUN apk add --no-cache postgresql-client bash

# Copy source code
COPY . .

# Add wait-for script
COPY wait-for.sh /usr/src/app/wait-for.sh
RUN chmod +x /usr/src/app/wait-for.sh

# Build the app
RUN npm run build

# Expose Nest port
EXPOSE 3000

# Start app only after Postgres is ready
CMD ["sh", "-c", "./wait-for.sh $POSTGRES_HOST node dist/main.js"]
