FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Accept build arguments for environment variables
ARG REACT_APP_API_BASE_URL

# Set environment variables for build time
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV NODE_ENV=production

# Build the application for production
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Serve the built application
CMD ["serve", "-s", "build", "-l", "3000"]
