# Etapa de build
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Etapa de runtime (sirve archivos estáticos con Vite Preview)
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "run", "preview"]
