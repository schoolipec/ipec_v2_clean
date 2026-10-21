'use client';

import { createContext, useContext } from 'react';

export type AdminLang = 'es' | 'en';

export const AdminLangContext = createContext<AdminLang>('es');

export function useAdminLang(): AdminLang {
  return useContext(AdminLangContext);
}
