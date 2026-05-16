FROM node:20-slim

# Install system tools for file conversion
RUN apt-get update && apt-get install -y \
    libreoffice \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Install frontend dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy all source files
COPY client ./client
COPY server ./server

# Build React frontend
RUN cd client && npm run build

# Copy built frontend into server/public so Express can serve it
RUN cp -r client/dist server/public

EXPOSE 5000

CMD ["node", "server/index.js"]
