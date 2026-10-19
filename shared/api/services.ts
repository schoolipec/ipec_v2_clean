/**
 * API Services - IPEC v2 Clean
 * Servicios reutilizables para cada content-type de Strapi
 */

import apiClient, { StrapiErrorResponse } from './client';
import type {
  Hero,
  About,
  Service,
  Contact,
  Testimonial,
  Footer,
  GalleryItem,
  Event,
  GlobalSettings,
  StrapiResponse,
  StrapiQueryParams,
} from '../types/content.types';
import { AxiosError } from 'axios';

/**
 * Factory function para crear servicios de contenido reutilizables
 */
const createContentService = <T,>(endpoint: string) => ({
  /**
   * Obtener todos los registros
   */
  async getAll(params?: StrapiQueryParams) {
    try {
      const response = await apiClient.get<StrapiResponse<T>>(`/${endpoint}`, {
        params,
      });
      return response.data.data;
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  /**
   * Obtener un registro por ID
   */
  async getById(id: number | string, params?: StrapiQueryParams) {
    try {
      const response = await apiClient.get<StrapiResponse<T>>(`/${endpoint}/${id}`, {
        params,
      });
      return Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  /**
   * Obtener por idioma/locale
   */
  async getByLocale(locale: string, params?: Omit<StrapiQueryParams, 'locale'>) {
    try {
      const response = await apiClient.get<StrapiResponse<T>>(`/${endpoint}`, {
        params: { ...params, locale },
      });
      return Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  /**
   * Crear nuevo registro
   */
  async create(data: Partial<T>, params?: StrapiQueryParams) {
    try {
      const response = await apiClient.post<StrapiResponse<T>>(`/${endpoint}`, { data }, {
        params,
      });
      return Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  /**
   * Actualizar registro
   */
  async update(id: number | string, data: Partial<T>, params?: StrapiQueryParams) {
    try {
      const response = await apiClient.put<StrapiResponse<T>>(`/${endpoint}/${id}`, { data }, {
        params,
      });
      return Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  /**
   * Eliminar registro
   */
  async delete(id: number | string) {
    try {
      await apiClient.delete(`/${endpoint}/${id}`);
      return true;
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  /**
   * Contar registros
   */
  async count(params?: StrapiQueryParams) {
    try {
      const response = await apiClient.get<StrapiResponse<T>>(`/${endpoint}/count`, {
        params,
      });
      return (response.data as any).count || 0;
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },
});

/**
 * Instancias de servicios para cada content-type
 */
export const heroService = createContentService<Hero>('heroes');
export const aboutService = createContentService<About>('abouts');
export const serviceService = createContentService<Service>('services');
export const contactService = createContentService<Contact>('contacts');
export const testimonialService = createContentService<Testimonial>('testimonials');
export const footerService = createContentService<Footer>('footers');
export const galleryService = createContentService<GalleryItem>('gallery-items');
export const eventService = createContentService<Event>('events');
export const globalSettingsService = createContentService<GlobalSettings>('global-settings');

/**
 * Servicio especial para obtener configuración global del sitio
 */
export const settingsService = {
  async getSettings() {
    try {
      const response = await apiClient.get<StrapiResponse<GlobalSettings>>('/global-settings');
      const data = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  async updateSettings(data: Partial<GlobalSettings>) {
    try {
      // Si existe configuración, actualizar el primer registro
      const existing = await this.getSettings();
      if (existing?.id) {
        return globalSettingsService.update(existing.id, data);
      } else {
        // Si no existe, crear
        return globalSettingsService.create(data);
      }
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },
};

/**
 * Servicio de búsqueda/filtrado avanzado
 */
export const searchService = {
  async searchContent<T>(
    contentType: string,
    query: string,
    locale?: string
  ): Promise<T[]> {
    try {
      const response = await apiClient.get<StrapiResponse<T>>(`/${contentType}`, {
        params: {
          'filters[title][$containsi]': query,
          ...(locale && { locale }),
        },
      });
      return Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  /**
   * Búsqueda multi-campo
   */
  async advancedSearch<T>(
    contentType: string,
    filters: Record<string, any>,
    locale?: string
  ): Promise<T[]> {
    try {
      const params: any = { ...filters };
      if (locale) params.locale = locale;

      const response = await apiClient.get<StrapiResponse<T>>(`/${contentType}`, {
        params,
      });
      return Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },
};

/**
 * Servicio de upload de archivos
 */
export const uploadService = {
  async uploadFile(file: File, fieldName: string = 'files') {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await apiClient.post<StrapiResponse<any>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  async uploadMultiple(files: File[], fieldName: string = 'files') {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(fieldName, file);
      });

      const response = await apiClient.post<StrapiResponse<any>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },

  async deleteFile(fileId: number) {
    try {
      await apiClient.delete(`/upload/files/${fileId}`);
      return true;
    } catch (error) {
      throw error as AxiosError<StrapiErrorResponse>;
    }
  },
};

export default {
  heroService,
  aboutService,
  serviceService,
  contactService,
  testimonialService,
  footerService,
  galleryService,
  eventService,
  globalSettingsService,
  settingsService,
  searchService,
  uploadService,
};
