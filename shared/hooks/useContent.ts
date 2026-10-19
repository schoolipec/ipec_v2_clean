/**
 * Custom Hooks - IPEC v2 Clean
 * Hooks reutilizables para fetchear contenido de Strapi
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import type { StrapiQueryParams, StrapiErrorResponse } from '../types/content.types';
import { AxiosError } from 'axios';

/**
 * Hook genérico para obtener contenido
 */
export const useContent = <T,>(
  fetchFn: (locale: string, params?: StrapiQueryParams) => Promise<T | T[]>,
  options?: {
    skip?: boolean;
    dependencies?: any[];
    onError?: (error: AxiosError<StrapiErrorResponse>) => void;
  }
) => {
  const locale = useLocale();
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<StrapiErrorResponse> | null>(null);

  const fetchContent = useCallback(async () => {
    if (options?.skip) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn(locale);
      setData(result);
    } catch (err) {
      const error = err as AxiosError<StrapiErrorResponse>;
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [locale, options, fetchFn]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent, ...(options?.dependencies || [])]);

  const refetch = useCallback(() => {
    fetchContent();
  }, [fetchContent]);

  return { data, loading, error, refetch };
};

/**
 * Hook para obtener un elemento por ID
 */
export const useContentById = <T,>(
  fetchFn: (id: number | string, params?: StrapiQueryParams) => Promise<T>,
  id?: number | string,
  options?: {
    skip?: boolean;
    onError?: (error: AxiosError<StrapiErrorResponse>) => void;
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<StrapiErrorResponse> | null>(null);

  const fetch = useCallback(async () => {
    if (options?.skip || !id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn(id);
      setData(result);
    } catch (err) {
      const error = err as AxiosError<StrapiErrorResponse>;
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [id, options, fetchFn]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
};

/**
 * Hook para actualizar contenido
 */
export const useUpdateContent = <T,>(
  updateFn: (id: number | string, data: Partial<T>) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError<StrapiErrorResponse>) => void;
  }
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<StrapiErrorResponse> | null>(null);

  const update = useCallback(
    async (id: number | string, data: Partial<T>) => {
      try {
        setLoading(true);
        setError(null);
        const result = await updateFn(id, data);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as AxiosError<StrapiErrorResponse>;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updateFn, options]
  );

  return { update, loading, error };
};

/**
 * Hook para crear contenido
 */
export const useCreateContent = <T,>(
  createFn: (data: Partial<T>) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError<StrapiErrorResponse>) => void;
  }
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<StrapiErrorResponse> | null>(null);

  const create = useCallback(
    async (data: Partial<T>) => {
      try {
        setLoading(true);
        setError(null);
        const result = await createFn(data);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as AxiosError<StrapiErrorResponse>;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [createFn, options]
  );

  return { create, loading, error };
};

/**
 * Hook para eliminar contenido
 */
export const useDeleteContent = (
  deleteFn: (id: number | string) => Promise<boolean>,
  options?: {
    onSuccess?: () => void;
    onError?: (error: AxiosError<StrapiErrorResponse>) => void;
  }
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<StrapiErrorResponse> | null>(null);

  const delete_ = useCallback(
    async (id: number | string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await deleteFn(id);
        options?.onSuccess?.();
        return result;
      } catch (err) {
        const error = err as AxiosError<StrapiErrorResponse>;
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [deleteFn, options]
  );

  return { delete: delete_, loading, error };
};

/**
 * Hook para búsqueda
 */
export const useSearch = <T,>(
  searchFn: (query: string, locale: string) => Promise<T[]>,
  options?: {
    debounceMs?: number;
    onError?: (error: AxiosError<StrapiErrorResponse>) => void;
  }
) => {
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<StrapiErrorResponse> | null>(null);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (!query) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchFn(query, locale);
        setResults(data);
      } catch (err) {
        const error = err as AxiosError<StrapiErrorResponse>;
        setError(error);
        options?.onError?.(error);
      } finally {
        setLoading(false);
      }
    }, options?.debounceMs || 300);

    return () => clearTimeout(debounceTimer);
  }, [query, locale, searchFn, options]);

  return { query, setQuery, results, loading, error };
};
