FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npx ng build --configuration=production

FROM nginx:alpine
COPY --from=frontend-build /app/dist/frontend/browser /usr/share/nginx/html
