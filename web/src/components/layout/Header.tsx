'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTheme } from '@/components/ThemeProvider';

const locales = [
  { code: 'en', label: 'English', flagCode: 'us' },
  { code: 'es', label: 'Español', flagCode: 'mx' },
  { code: 'pt', label: 'Português', flagCode: 'br' },
  { code: 'ko', label: '한국어', flagCode: 'kr' },
  { code: 'de', label: 'Deutsch', flagCode: 'de' },
];

const NON_EN_LOCALES = ['es', 'pt', 'ko', 'de'];

function switchLocale(locale: string) {
  const pathname = window.location.pathname;
  let cleanPath = pathname;
  for (const loc of NON_EN_LOCALES) {
    if (pathname === `/${loc}`) { cleanPath = '/'; break; }
    if (pathname.startsWith(`/${loc}/`)) { cleanPath = pathname.slice(loc.length + 1); break; }
  }
  const newPath = locale === 'en' ? (cleanPath || '/') : `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
  window.location.href = newPath;
}

export default function Header() {
  const t = useTranslations('header');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const langRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown de idioma al click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  // Clases dinámicas según tema
  const headerClass = isDark
    ? 'bg-[#082942] text-white shadow-md'
    : 'bg-white text-gray-900 border-b border-gray-200 shadow-sm';

  const navLinkClass = isDark
    ? 'hover:text-green-400 transition-colors'
    : 'text-gray-700 hover:text-[#2E7D32] transition-colors';

  const langBtnClass = isDark
    ? 'border border-white/30 text-white hover:border-green-400 transition-colors'
    : 'border border-gray-300 text-gray-700 hover:border-[#2E7D32] transition-colors';

  const toggleBtnClass = isDark
    ? 'text-white hover:bg-white/10 rounded-md p-2 transition-colors'
    : 'text-gray-700 hover:bg-gray-100 rounded-md p-2 transition-colors';

  const mobileMenuClass = isDark
    ? 'bg-[#082942] border-t border-white/10'
    : 'bg-white border-t border-gray-200';

  return (
    <header className={`sticky top-0 z-50 ${headerClass}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20 md:h-28">

        {/* Logo — dimensiones reales del archivo: ~640x640 (cuadrado) */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src={isDark ? '/assets/logo-dark.png' : '/assets/logo-transparent.png'}
            alt="Iglesia Plenitud en Cristo"
            width={640}
            height={640}
            className="h-16 sm:h-20 md:h-24 w-auto"
            priority
          />
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controles derechos: tema + idioma + hamburguesa */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Toggle de tema */}
          <button onClick={toggleTheme} className={toggleBtnClass} aria-label="Cambiar tema">
            {isDark ? (
              // Ícono sol → pasar a claro
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" strokeWidth={2} />
                <path strokeLinecap="round" strokeWidth={2}
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              // Ícono luna → pasar a oscuro
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Selector de idioma */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-1.5 text-sm font-medium rounded-md px-2.5 py-1.5 ${langBtnClass}`}
            >
              {/* Bandera del locale activo */}
              {(() => {
                const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
                const active = locales.find((l) => l.code !== 'en' && pathname.startsWith(`/${l.code}`)) ?? locales[0];
                return (
                  <img
                    src={`https://flagcdn.com/w20/${active.flagCode}.png`}
                    srcSet={`https://flagcdn.com/w40/${active.flagCode}.png 2x`}
                    width={20}
                    height={15}
                    alt={active.label}
                    className="rounded-sm object-cover"
                  />
                );
              })()}
              <span className="hidden sm:inline uppercase text-xs font-bold tracking-wide">
                {locales.find((l) => {
                  if (typeof window === 'undefined') return l.code === 'en';
                  const p = window.location.pathname;
                  return l.code !== 'en' ? p.startsWith(`/${l.code}`) : !locales.filter(x => x.code !== 'en').some(x => p.startsWith(`/${x.code}`));
                })?.code.toUpperCase() ?? 'EN'}
              </span>
              <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {locales.map((loc) => {
                  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
                  const isActive = loc.code === 'en'
                    ? !locales.filter(x => x.code !== 'en').some(x => pathname.startsWith(`/${x.code}`))
                    : pathname.startsWith(`/${loc.code}`);
                  return (
                    <button
                      key={loc.code}
                      onClick={() => { switchLocale(loc.code); setLangOpen(false); }}
                      className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition-colors ${isActive ? 'bg-gray-50 font-semibold text-[#2E7D32]' : 'hover:bg-gray-50'}`}
                    >
                      <img
                        src={`https://flagcdn.com/w20/${loc.flagCode}.png`}
                        srcSet={`https://flagcdn.com/w40/${loc.flagCode}.png 2x`}
                        width={20}
                        height={15}
                        alt={loc.label}
                        className="rounded-sm object-cover flex-shrink-0"
                      />
                      <span>{loc.label}</span>
                      {isActive && (
                        <svg className="w-4 h-4 text-[#2E7D32] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hamburguesa móvil */}
          <button
            className={`md:hidden ${toggleBtnClass}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <nav className={`md:hidden px-4 py-4 flex flex-col gap-4 text-sm font-medium ${mobileMenuClass}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
