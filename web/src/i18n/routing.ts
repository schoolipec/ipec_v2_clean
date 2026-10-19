import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en', 'pt', 'ko', 'de'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/about': {
      es: '/acerca-de',
      en: '/about',
      pt: '/sobre',
      ko: '/정보',
      de: '/uber-uns'
    },
    '/services': {
      es: '/servicios',
      en: '/services',
      pt: '/servicos',
      ko: '/서비스',
      de: '/dienstleistungen'
    },
    '/contact': {
      es: '/contacto',
      en: '/contact',
      pt: '/contato',
      ko: '/연락',
      de: '/kontakt'
    },
    '/groups': {
      es: '/grupos',
      en: '/groups',
      pt: '/grupos',
      ko: '/그룹',
      de: '/gruppen'
    },
  }
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
