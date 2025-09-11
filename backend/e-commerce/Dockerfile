# Use Node.js LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install bash, curl, and postgres client
RUN apk add --no-cache bash curl postgresql-client

# Copy source code
COPY . .

# Add wait-for script
COPY wait-for.sh /usr/src/app/wait-for.sh
RUN chmod +x /usr/src/app/wait-for.sh

# Build the NestJS app
RUN npm run build

# Expose NestJS port
EXPOSE 3000

# Start app only after Postgres is ready
CMD ["sh", "-c", "./wait-for.sh $POSTGRES_HOST node dist/main.js"]
