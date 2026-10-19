/**
 * Content Types - IPEC v2 Clean
 * Tipos TypeScript para todos los content-types de Strapi
 */

/**
 * Media Object
 * Estructura de archivos/imágenes en Strapi
 */
export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: {
      url: string;
    };
    small?: {
      url: string;
    };
    medium?: {
      url: string;
    };
    large?: {
      url: string;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Respuesta base de Strapi API
 */
export interface StrapiResponse<T> {
  data: T[] | T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Hero Section
 * Sección principal del sitio (puede haber múltiples héroes)
 */
export interface Hero {
  id: number;
  documentId?: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta_button_text?: string;
  cta_button_link?: string;
  image?: StrapiMedia;
  background_color?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

/**
 * About Section
 * Información general de la iglesia
 */
export interface About {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  image?: StrapiMedia;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

/**
 * Service
 * Servicios que ofrece la iglesia
 */
export interface Service {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  icon?: string;
  image?: StrapiMedia;
  order: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

/**
 * Contact Info
 * Información de contacto
 */
export interface Contact {
  id: number;
  documentId?: string;
  email: string;
  phone?: string;
  address?: string;
  hours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  social_links?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    telegram?: string;
  };
  map_coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * Testimonial
 * Testimonios de miembros
 */
export interface Testimonial {
  id: number;
  documentId?: string;
  author_name: string;
  author_role?: string;
  content: string;
  author_image?: StrapiMedia;
  rating?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

/**
 * Footer Content
 * Contenido del pie de página
 */
export interface Footer {
  id: number;
  documentId?: string;
  copyright_text?: string;
  quick_links?: Array<{
    label: string;
    url: string;
  }>;
  social_links?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  logo?: StrapiMedia;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

/**
 * Gallery Item
 * Imágenes de galería
 */
export interface GalleryItem {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  image: StrapiMedia;
  category?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

/**
 * Event
 * Eventos de la iglesia
 */
export interface Event {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  image?: StrapiMedia;
  event_url?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string;
}

/**
 * Settings Global
 * Configuración global del sitio
 */
export interface GlobalSettings {
  id: number;
  documentId?: string;
  site_name: string;
  site_description?: string;
  logo?: StrapiMedia;
  favicon?: StrapiMedia;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  fonts?: {
    heading?: string;
    body?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

/**
 * User (para admin)
 * Usuarios del sistema
 */
export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response Union
 * Para manejo genérico de respuestas
 */
export type ContentType =
  | Hero
  | About
  | Service
  | Contact
  | Testimonial
  | Footer
  | GalleryItem
  | Event
  | GlobalSettings;

/**
 * Parámetros de Query para Strapi
 */
export interface StrapiQueryParams {
  locale?: string;
  sort?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  filters?: Record<string, any>;
  populate?: string | string[];
}

/**
 * Respuesta de Error de Strapi
 */
export interface StrapiError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, any>;
  };
}
