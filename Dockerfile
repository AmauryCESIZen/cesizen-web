# ── Étape 1 : construction du React avec Vite ────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code et build
COPY . .
# L'URL de l'API est injectée au moment du build (chemin relatif /api en prod)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ── Étape 2 : service des fichiers statiques avec nginx ──────
FROM nginx:1.27-alpine AS web

# Configuration nginx (gère le routing côté React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers compilés depuis l'étape de build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
