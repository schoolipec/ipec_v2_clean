FROM strapi/strapi:v5-latest

# Etiquetas
LABEL maintainer="IPEC <info@suplenitud.com>"
LABEL description="Strapi v5 CMS para IPEC v2 Clean"
LABEL version="1.0"

# Variables de entorno
ENV NODE_ENV=development \
    NODE_OPTIONS="--max-old-space-size=2048"

# Working directory
WORKDIR /app

# Copiar package.json si existe (para dependencias adicionales)
COPY package*.json ./

# Instalar dependencias si existen
RUN if [ -f package.json ]; then npm install; fi

# Copiar configuración
COPY ./config ./config 2>/dev/null || true
COPY ./src ./src 2>/dev/null || true
COPY ./public ./public 2>/dev/null || true

# Crear directorios necesarios
RUN mkdir -p /app/extensions /app/plugins /app/middlewares && \
    chown -R node:node /app

# Cambiar a usuario no-root
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:1337/admin/login || exit 1

# Exponer puerto
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "develop"]
