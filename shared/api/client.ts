/**
 * Axios HTTP Client - IPEC v2 Clean
 * Cliente centralizado para todas las llamadas al API de Strapi
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Interfaz de configuración del cliente
 */
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

/**
 * Obtener configuración del cliente según el ambiente
 */
const getConfig = (): ApiClientConfig => {
  // En Next.js, NEXT_PUBLIC_* está disponible en browser y server
  // Variables internas solo en server
  const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL ||
                  process.env.STRAPI_URL ||
                  'http://localhost:1337/api';

  const token = process.env.STRAPI_API_TOKEN || '';

  return {
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

/**
 * Crear instancia de Axios
 */
const apiClient: AxiosInstance = axios.create(getConfig());

/**
 * Interceptor de request
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error.message);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response con retry logic
 */
let retryCount = 0;
const MAX_RETRIES = 2;

apiClient.interceptors.response.use(
  (response) => {
    retryCount = 0;
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig;

    // Retry en error 429 (Too Many Requests)
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      retryCount++;
      const delay = 1000 * Math.pow(2, retryCount); // Exponential backoff

      console.warn(`[API] Rate limited. Retry ${retryCount}/${MAX_RETRIES} after ${delay}ms`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(config);
    }

    // Log de errores
    console.error('[API Response Error]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

/**
 * Exportar cliente
 */
export default apiClient;

/**
 * Tipo de error de Strapi
 */
export interface StrapiErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Helper para chequear si es error de Strapi
 */
export const isStrapiError = (error: unknown): error is AxiosError<StrapiErrorResponse> => {
  return axios.isAxiosError(error) && error.response?.data?.error !== undefined;
};

/**
 * Helper para obtener mensaje de error
 */
export const getErrorMessage = (error: unknown): string => {
  if (isStrapiError(error)) {
    return error.response.data.error.message || 'Error desconocido del servidor';
  }

  if (axios.isAxiosError(error)) {
    return error.message || 'Error de conexión';
  }

  return 'Error inesperado';
};
