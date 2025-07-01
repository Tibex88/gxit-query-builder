# --------- Stage 1: Build ---------
FROM node:20.15.0-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# --------- Stage 2: Serve with Node ---------
FROM node:20.15.0-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy React static files and server code
COPY --from=builder /usr/src/app/dist ./dist
COPY server.js ./

EXPOSE 4173

CMD ["npm", "run", "start"]
