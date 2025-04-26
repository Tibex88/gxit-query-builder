FROM node:20.15.0-alpine
WORKDIR /usr/server/app

EXPOSE 5173

COPY ./package.json ./
RUN npm install
COPY ./ .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "run", "preview"]
