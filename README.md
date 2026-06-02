# Mobilidad Platform

Motor de ride-hailing white label para lanzar tu propio Uber en minutos.

## Stack

- **Backend** — Express + TypeScript + PostgreSQL + Redis + Socket.io (Railway)
- **Frontend** — Next.js 14 + TailwindCSS + Clerk Auth (Vercel)
- **Infra** — Turborepo · Docker Compose · pnpm workspaces
- **White label** — `packages/brand-config` · una variable de entorno activa tu marca

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Configurar entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Levantar servicios locales (PostgreSQL + Redis)
docker compose up -d

# Correr migraciones
npm run db:migrate

# Dev con hot reload
npm run dev
```

## Lanzar tu propia marca

Ver [WHITELABEL.md](./WHITELABEL.md) — crea tu archivo de configuración de marca y establece `BRAND_ID=tumarca`.

## Estructura

```
apps/
  api/    Backend REST + WebSockets
  web/    Frontend (Next.js)
packages/
  brand-config/   Sistema de white label
  shared-types/   Tipos TypeScript compartidos
proto/            Prototipo PWA de RideMe (referencia UX/diseño)
```

## Documentación adicional

- [WHITELABEL.md](./WHITELABEL.md) — Cómo crear una nueva marca
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) — Deploy en producción
- [DATABASE_SETUP_COMPLETE.md](./DATABASE_SETUP_COMPLETE.md) — Esquema de base de datos
- [proto/PUBLISHING.md](./proto/PUBLISHING.md) — Guía de publicación en App Store / Play Store
