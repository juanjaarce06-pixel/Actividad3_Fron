FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /srv
ENV PORT=8080
RUN npm i -g serve
COPY --from=build /app/dist ./dist
CMD ["sh","-c","serve -s -l $PORT dist"]
