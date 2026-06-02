# White Label Guide — Mobilidad Platform

La plataforma Mobilidad es el motor que impulsa múltiples marcas de ride-hailing.
Para lanzar una nueva marca necesitas cambiar **un archivo de configuración y una variable de entorno**.

## Arquitectura

```
movilidad-platform/
├── apps/
│   ├── api/          — Backend Express + PostgreSQL (compartido entre marcas)
│   └── web/          — Frontend Next.js (consume brand-config)
├── packages/
│   ├── brand-config/ — ✅ Sistema de white label
│   │   └── src/brands/
│   │       ├── mobilidad.ts  — Marca Mobilidad (default)
│   │       └── rideme.ts     — Marca RideMe (ejemplo)
│   └── shared-types/ — Tipos TypeScript compartidos
└── proto/            — Prototipo PWA de RideMe (referencia de diseño/UX)
```

## Cómo crear una nueva marca en 5 pasos

### 1. Crear el archivo de configuración de marca

```bash
cp packages/brand-config/src/brands/mobilidad.ts packages/brand-config/src/brands/miuberjr.ts
```

Edita `miuberjr.ts` con los datos de tu marca:

```typescript
export const miuberjrBrand: BrandConfig = {
  id: 'miuberjr',
  appName: 'MiUberJr',
  tagline: 'El viaje que soñaste',
  colors: {
    primary: '#FF6B00',      // ← Tu color de marca
    secondary: '#FFD000',
    // ...resto de colores
  },
  fares: {
    currency: 'COP',         // ← Tu moneda (COP, USD, ARS, etc.)
    baseFare: 5000,
    perKmRate: 1800,
    platformCommissionPercent: 15,
    // ...
  },
  legal: {
    companyName: 'MiUberJr S.A.S.',
    jurisdiction: 'Colombia',
    contactEmail: 'legal@miuberjr.co',
  },
  // ...
};
```

### 2. Registrar la marca en el índice

En `packages/brand-config/src/index.ts`, agrega:

```typescript
export { miuberjrBrand } from './brands/miuberjr';

export function getBrand(id: string): BrandConfig {
  const brands = {
    mobilidad: ...,
    rideme: ...,
    miuberjr: require('./brands/miuberjr').miuberjrBrand,  // ← Agregar aquí
  };
  // ...
}
```

### 3. Activar la marca vía variable de entorno

En tu `.env` o en Vercel/Railway:

```bash
BRAND_ID=miuberjr
```

### 4. Build

```bash
npm run build
```

### 5. Deploy

La misma codebase, diferente `BRAND_ID` → diferente marca. El backend es compartido o puedes desplegarlo separado cambiando la variable `API_URL`.

## Qué controla cada marca

| Categoría | Qué se personaliza |
|-----------|-------------------|
| **Identidad** | Nombre, tagline, logo, descripción |
| **Colores** | Paleta completa (primary, secondary, accent, fondos, textos) |
| **Tipografía** | Fuentes sans y mono |
| **Tarifas** | Moneda, tarifa base, $/km, $/min, surge máx, comisión, min/max |
| **Features** | Negociación, viajes programados, chat, surge, cuentas corporativas |
| **Legal** | Razón social, jurisdicción, email legal, RFC/NIT/CUIT |
| **i18n** | Idiomas soportados y default |
| **Maps** | Proveedor de mapas (Google, Mapbox, OpenStreetMap) |

## Marcas actuales

| ID | Nombre | Moneda | Estado |
|----|--------|--------|--------|
| `mobilidad` | Mobilidad | MXN | ✅ Default |
| `rideme` | RideMe | MXN | ✅ Disponible |

## Estructura de deploy multi-marca

Para operar múltiples marcas en producción simultáneamente:

```
Vercel Project "mobilidad"  → BRAND_ID=mobilidad → mobilidad.mx
Vercel Project "rideme"     → BRAND_ID=rideme     → rideme.app
Vercel Project "miuberjr"   → BRAND_ID=miuberjr   → miuberjr.co
```

Todos apuntan al mismo repositorio. Un solo deploy de Railway corre el API compartido.

## Prototipo de referencia

El directorio `proto/` contiene el prototipo PWA interactivo de RideMe (sin build step).
Úsalo para explorar la UX de pasajero, conductor y admin antes de implementar cambios.

```bash
# Abrir el prototipo en el navegador
open proto/RideMe.html
```
