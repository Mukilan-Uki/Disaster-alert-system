FROM node:18-alpine
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy source
COPY . .

ENV PORT=5000
EXPOSE 5000
CMD ["node", "src/server.js"]
