# =========== BASE IMAGE & ENVIRONMENT ===========
# Use slim Node image—alpine
FROM node:18.17.1-alpine AS base

# In Render production dependencies only
ENV NODE_ENV=production

# =========== BUILD STAGE ===========
# Install build tools to compile sqlite3 (native dependency) only during build
FROM base AS build

RUN apk add --no-cache \
      python3 \
      make \
      g++ \
      sqlite-dev

WORKDIR /usr/src/app

# Copy only package files first for layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev) so knex migrations, TypeScript, etc. can build if you need
RUN npm ci

# Copy the rest of your source
COPY . .

# If you have build steps (e.g. transpile, bundle), run them here
# RUN npm run build

# =========== PRODUCTION STAGE ===========
FROM base

# Install only production deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built artifacts from the build stage
COPY --from=build /usr/src/app ./

# Create and use a directory for SQLite so it can be mounted as a volume
RUN mkdir -p /usr/src/app/data
VOLUME [ "/usr/src/app/data" ]

# Expose port (3000) and optional livereload (35729) only if you actually use it in prod
EXPOSE 3000

# Default start command—use your production entrypoint
CMD ["node", "index.js"]
