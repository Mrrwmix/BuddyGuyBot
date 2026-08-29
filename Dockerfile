# Use a specific Node.js version based on your project's needs (e.g., latest)
FROM node:23-alpine AS base

# Install system dependencies required by Playwright and Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash

# Set the environment variable for the application to find the system Chromium
ENV PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium-browser

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL Node.js dependencies (including devDependencies needed for building)
RUN npm ci

# Install Playwright browsers. This downloads the specific driver binaries Playwright needs.
# It uses the PUPPETEER_EXECUTABLE_PATH environment variable set above.
RUN npx playwright install chromium

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs &&\
    adduser -S nextjs -u 1001
USER nextjs

# Expose the port if the app listened on one (it doesn't currently, but good practice if it did)
# EXPOSE 3000

# The command to run the application
CMD [ "npm", "start" ]