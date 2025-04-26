# --------- Stage 1: Build ---------
FROM node:20.15.0-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# --------- Stage 2: Serve using vite preview ---------
FROM node:20.15.0-alpine

WORKDIR /usr/src/app

# Only copy built files and necessary dependencies
COPY --from=builder /usr/src/app /usr/src/app

RUN npm install

EXPOSE 4173

# Use vite preview instead of nginx
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
