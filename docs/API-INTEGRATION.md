# API Integration - Next.js + Strapi

**Fecha:** Oct 19, 2026  
**Estado:** Guía de implementación  
**Versión:** 1.0

---

## Descripción General

Esta guía cubre cómo conectar Next.js (web y admin) con el API de Strapi v5 para:
- Obtener contenido dinámico
- Administrar usuarios
- Manejar uploads de archivos
- Caché de contenido

---

## 1. Configuración de Axios Client

### Crear cliente HTTP compartido

**Archivo:** `/shared/api/client.ts`

```typescript
import axios from 'axios';

// Tipos
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Configuración por ambiente
const getConfig = (): ApiConfig => {
  const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
  const token = process.env.STRAPI_API_TOKEN || '';

  return {
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

// Crear instancia de Axios
const apiClient = axios.create(getConfig());

// Interceptor de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default apiClient;
```

### Variables de entorno

**web/.env.example**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
STRAPI_API_TOKEN=your_api_token_here
```

**admin/.env.example**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
STRAPI_API_TOKEN=your_admin_api_token_here
```

---

## 2. Servicios de API

### Hero Service

**Archivo:** `/shared/services/heroService.ts`

```typescript
import apiClient from '@/api/client';

interface HeroContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta_button_text: string;
  cta_button_link: string;
  image: {
    url: string;
    alternativeText: string;
  };
  order: number;
}

export const heroService = {
  // Obtener héroe por idioma
  async getByLocale(locale: string): Promise<HeroContent> {
    const response = await apiClient.get(`/heroes?locale=${locale}`);
    return response.data.data[0];
  },

  // Obtener todos los héroes
  async getAll() {
    const response = await apiClient.get('/heroes');
    return response.data.data;
  },

  // Crear héroe (admin)
  async create(data: Partial<HeroContent>) {
    const response = await apiClient.post('/heroes', { data });
    return response.data.data;
  },

  // Actualizar héroe (admin)
  async update(id: number, data: Partial<HeroContent>) {
    const response = await apiClient.put(`/heroes/${id}`, { data });
    return response.data.data;
  },

  // Eliminar héroe (admin)
  async delete(id: number) {
    return await apiClient.delete(`/heroes/${id}`);
  },
};
```

### About Service

```typescript
// /shared/services/aboutService.ts
export const aboutService = {
  async getByLocale(locale: string) {
    const response = await apiClient.get(`/abouts?locale=${locale}`);
    return response.data.data[0];
  },

  async getAll() {
    const response = await apiClient.get('/abouts');
    return response.data.data;
  },

  async update(id: number, data: any) {
    const response = await apiClient.put(`/abouts/${id}`, { data });
    return response.data.data;
  },
};
```

### Services Service

```typescript
// /shared/services/servicesService.ts
export const servicesService = {
  async getByLocale(locale: string) {
    const response = await apiClient.get(`/services?locale=${locale}`);
    return response.data.data;
  },

  async getAll() {
    const response = await apiClient.get('/services');
    return response.data.data;
  },

  async create(data: any) {
    const response = await apiClient.post('/services', { data });
    return response.data.data;
  },

  async update(id: number, data: any) {
    const response = await apiClient.put(`/services/${id}`, { data });
    return response.data.data;
  },

  async delete(id: number) {
    return await apiClient.delete(`/services/${id}`);
  },
};
```

---

## 3. Hooks de React

### useHero Hook

**Archivo:** `/shared/hooks/useHero.ts`

```typescript
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { heroService } from '@/services/heroService';

export const useHero = () => {
  const locale = useLocale();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await heroService.getByLocale(locale);
        setHero(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching hero');
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, [locale]);

  return { hero, loading, error };
};
```

### useServices Hook

```typescript
// /shared/hooks/useServices.ts
export const useServices = () => {
  const locale = useLocale();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await servicesService.getByLocale(locale);
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  return { services, loading, error };
};
```

---

## 4. Caché de Contenido

### Implementar ISR (Incremental Static Regeneration)

En Next.js, puedes cachear contenido de Strapi:

```typescript
// /web/src/app/[locale]/page.tsx
import { heroService } from '@/services/heroService';

export async function generateStaticParams() {
  return [
    { locale: 'es' },
    { locale: 'en' },
    { locale: 'pt' },
    { locale: 'ko' },
    { locale: 'de' },
  ];
}

export async function generateMetadata({ params }: any) {
  const hero = await heroService.getByLocale(params.locale);
  return {
    title: hero.title,
    description: hero.subtitle,
  };
}

export default async function HomePage({ params }: any) {
  const hero = await heroService.getByLocale(params.locale);

  return <Hero data={hero} />;
}

// ISR - Revalidar cada 60 segundos
export const revalidate = 60;
```

---

## 5. Generar API Tokens en Strapi

### Desde Panel Admin

1. Ir a **Settings > API Tokens**
2. Crear nuevo token
3. Seleccionar permisos:
   - **Para Next.js web:** Solo lectura (READ)
   - **Para admin:** Lectura y escritura (READ + WRITE)
4. Copiar token y guardar en `.env`

### Via GraphQL (opcional)

Strapi también soporta GraphQL. Ver docs en https://docs.strapi.io/graphql

---

## 6. Estructura de Carpetas para Servicios

```
shared/
├── api/
│   ├── client.ts          # Cliente Axios configurado
│   └── endpoints.ts       # Constantes de endpoints
├── hooks/
│   ├── useHero.ts
│   ├── useAbout.ts
│   ├── useServices.ts
│   └── useContact.ts
├── services/
│   ├── heroService.ts
│   ├── aboutService.ts
│   ├── servicesService.ts
│   └── contactService.ts
└── types/
    ├── hero.ts
    ├── about.ts
    └── service.ts
```

---

## 7. Ejemplo de Uso en Componentes (Web)

```typescript
// /web/src/app/[locale]/components/HeroSection.tsx
'use client';

import { useHero } from '@/hooks/useHero';
import Image from 'next/image';

export default function HeroSection() {
  const { hero, loading, error } = useHero();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hero) return null;

  return (
    <section className="hero-section">
      <Image
        src={hero.image.url}
        alt={hero.image.alternativeText}
        width={1200}
        height={600}
      />
      <h1>{hero.title}</h1>
      <p>{hero.subtitle}</p>
      <a href={hero.cta_button_link}>{hero.cta_button_text}</a>
    </section>
  );
}
```

---

## 8. Ejemplo de Uso en Admin

```typescript
// /admin/src/app/[locale]/components/HeroEditor.tsx
'use client';

import { useState } from 'react';
import { heroService } from '@/services/heroService';
import { Button, TextInput, Textarea } from '@mantine/core';

export default function HeroEditor({ initialData }) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await heroService.update(initialData.id, formData);
      alert('Héroe actualizado');
    } catch (error) {
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-editor">
      <TextInput
        label="Título"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <Textarea
        label="Descripción"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Button onClick={handleSave} loading={loading}>
        Guardar
      </Button>
    </div>
  );
}
```

---

## 9. Testing de API

### Test local con curl

```bash
# Obtener héroes en español
curl "http://localhost:1337/api/heroes?locale=es"

# Obtener héroes en inglés
curl "http://localhost:1337/api/heroes?locale=en"

# Crear héroe (requiere token)
curl -X POST "http://localhost:1337/api/heroes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Bienvenido",
      "subtitle": "A nuestra iglesia",
      "order": 1
    }
  }'
```

---

## 10. Rate Limiting & Error Handling

### Retry Logic

```typescript
export const apiClient = axios.create(getConfig());

let retryCount = 0;
const MAX_RETRIES = 3;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      return apiClient.request(error.config);
    }
    throw error;
  }
);
```

---

**Próximos Pasos:**
1. Crear servicios para todos los content-types
2. Implementar hooks reutilizables
3. Setup de caché ISR
4. Testing de endpoints
5. Documentar endpoints disponibles

---

**Última actualización:** Oct 19, 2026
