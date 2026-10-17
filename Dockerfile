# Production Dockerfile for InsiderJobs Portal
# Base image: Official lightweight Node.js 22 on Alpine Linux
FROM node:22-alpine AS runtime

# Set metadata and labels
LABEL maintainer="24ESKCS034" \
      description="InsiderJobs Portal - Modern Job Portal & Career Discovery Platform" \
      version="1.0.0"

# Set production environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Set working directory inside container
WORKDIR /app

# Copy dependency specifications first for Docker layer caching
COPY package.json ./

# Install production dependencies (if any packages added in future)
RUN npm install --omit=dev --no-audit --no-fund 2>/dev/null || true

# Copy application source code and static assets
COPY server.js ./
COPY script.js style.css index.html ./
COPY images/ ./images/
COPY job/ ./job/
COPY src/ ./src/

# Change ownership of application directory to the non-root 'node' user
RUN chown -R node:node /app

# Switch to non-root user for security compliance
USER node

# Expose application port
EXPOSE 3000

# Container healthcheck using built-in /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

# Start application using existing npm start command
CMD ["npm", "start"]
