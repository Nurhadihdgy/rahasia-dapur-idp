# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine
# Salin hasil build
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Salin konfigurasi Nginx agar rute seperti /admin tidak 404
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Perbaikan: Hapus koma di akhir baris ini
CMD ["nginx", "-g", "daemon off;"]