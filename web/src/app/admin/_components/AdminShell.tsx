'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { AdminLangContext } from './AdminLangContext';

// ─── Traducciones del panel ──────────────────────────────────────
type Lang = 'es' | 'en';

const LABELS = {
  es: {
    brand: 'Iglesia Plenitud',
    adminPanel: 'Panel de administración',
    groups: { main: 'Principal', ministry: 'Ministerio', system: 'Sistema' },
    nav: {
      home: 'Inicio',
      content: 'Contenido web',
      prayerRequests: 'Solicitudes de Oración',
      users: 'Usuarios',
      settings: 'Configuración',
    },
    pageTitles: {
      '/admin': 'Inicio',
      '/admin/content': 'Contenido web',
      '/admin/users': 'Usuarios',
      '/admin/profile': 'Configuración',
      '/admin/prayer-requests': 'Solicitudes de Oración',
    } as Record<string, string>,
    userMenu: {
      profile: 'Mi Perfil',
      signOut: 'Cerrar sesión',
      signingOut: 'Saliendo...',
      panelLanguage: 'Idioma del panel',
    },
    langNames: { es: 'Español', en: 'English' },
    roles: {
      SUPER_ADMIN: 'Super Admin',
      ADMIN: 'Administrador',
      TREASURER: 'Tesorero',
      USHER: 'Ujier',
    } as Record<string, string>,
    notifications: 'Notificaciones',
    noNotifications: 'Sin notificaciones nuevas',
    comingSoon: 'Próximamente',
  },
  en: {
    brand: 'Plenitud Church',
    adminPanel: 'Administration panel',
    groups: { main: 'Main', ministry: 'Ministry', system: 'System' },
    nav: {
      home: 'Home',
      content: 'Website Content',
      prayerRequests: 'Prayer Requests',
      users: 'Users',
      settings: 'Settings',
    },
    pageTitles: {
      '/admin': 'Home',
      '/admin/content': 'Website Content',
      '/admin/users': 'Users',
      '/admin/profile': 'Settings',
      '/admin/prayer-requests': 'Prayer Requests',
    } as Record<string, string>,
    userMenu: {
      profile: 'My Profile',
      signOut: 'Sign Out',
      signingOut: 'Signing out...',
      panelLanguage: 'Panel language',
    },
    langNames: { es: 'Español', en: 'English' },
    roles: {
      SUPER_ADMIN: 'Super Admin',
      ADMIN: 'Administrator',
      TREASURER: 'Treasurer',
      USHER: 'Usher',
    } as Record<string, string>,
    notifications: 'Notifications',
    noNotifications: 'No new notifications',
    comingSoon: 'Coming soon',
  },
};

// ─── Iconos SVG inline ───────────────────────────────────────────
const Icons = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  content: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  prayer: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  chevron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  logout: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  user: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  globe: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

// ─── Grupos de navegación ────────────────────────────────────────
function buildGroups(lang: Lang, userRole: string) {
  const t = LABELS[lang];
  const isSuperOrAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return [
    {
      key: 'main',
      label: t.groups.main,
      items: [
        { href: '/admin', label: t.nav.home, icon: 'home', exact: true },
      ],
    },
    {
      key: 'ministry',
      label: t.groups.ministry,
      items: [
        isSuperOrAdmin && { href: '/admin/content', label: t.nav.content, icon: 'content' },
        { href: '/admin/prayer-requests', label: t.nav.prayerRequests, icon: 'prayer' },
      ].filter(Boolean) as { href: string; label: string; icon: string; disabled?: boolean; exact?: boolean }[],
    },
    {
      key: 'system',
      label: t.groups.system,
      items: [
        isSuperAdmin && { href: '/admin/users', label: t.nav.users, icon: 'users' },
        { href: '/admin/profile', label: t.nav.settings, icon: 'settings' },
      ].filter(Boolean) as { href: string; label: string; icon: string; disabled?: boolean; exact?: boolean }[],
    },
  ].filter(g => g.items.length > 0);
}

// ─── Componente principal ─────────────────────────────────────────
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('ipec_admin_lang');
      return (saved === 'en' || saved === 'es') ? saved : 'es';
    } catch { return 'es'; }
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('ipec_admin_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch { return 'dark'; }
  });
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Neutralizar el background del body para que no sangre en el admin
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = isDark ? '#0a1628' : '#eef5ff';
    return () => { document.body.style.background = prev; };
  }, [isDark]);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('ipec_admin_theme', next); } catch {}
  }

  const t = LABELS[lang];

  useEffect(() => {
    fetch('/api/admin/profile')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setUserRole(d.role || '');
          setUserName(d.name || '');
          setUserEmail(d.email || '');
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  async function handleLogout() {
    setSigningOut(true);
    setMenuOpen(false);
    try { await fetch('/api/admin/auth/logout', { method: 'POST' }); } catch {}
    window.location.href = '/';
  }

  const groups = buildGroups(lang, userRole);
  const initials = (userName || userEmail || '?').trim().charAt(0).toUpperCase();
  const displayName = userName || userEmail || '…';
  const roleLabel = t.roles[userRole] || userRole;
  const pageTitle = t.pageTitles[pathname] || (pathname.startsWith('/admin/') ? pathname.split('/admin/')[1] : 'Admin');

  // Paletas de color según tema
  const C = isDark ? {
    shellBg: 'linear-gradient(160deg, #0a1628 0%, #0d1e35 60%, #091a1a 100%)',
    sidebarBg: 'rgba(4,10,20,0.92)',
    sidebarBorder: 'rgba(255,255,255,0.07)',
    headerBg: 'rgba(4,10,20,0.92)',
    headerBorder: 'rgba(255,255,255,0.07)',
    text: '#f1f5f9',
    textMuted: '#64748b',
    textNav: '#94a3b8',
    textNavActive: '#60a5fa',
    iconNav: '#475569',
    iconNavActive: '#3b82f6',
    navActive: 'rgba(21,101,192,0.18)',
    navHover: 'rgba(255,255,255,0.05)',
    groupLabel: '#334155',
    dropdownBg: '#0f1f32',
    dropdownBorder: 'rgba(255,255,255,0.1)',
    waveLeft: ['rgba(30,136,229,0.20)', 'rgba(30,136,229,0.10)'],
    waveRight: ['rgba(104,159,56,0.20)', 'rgba(104,159,56,0.10)'],
    waveBottom: 'rgba(30,136,229,0.07)',
  } : {
    shellBg: 'linear-gradient(160deg, #e8f4ff 0%, #f5fbff 60%, #edf7ed 100%)',
    sidebarBg: 'rgba(255,255,255,0.95)',
    sidebarBorder: 'rgba(0,0,0,0.08)',
    headerBg: 'rgba(255,255,255,0.95)',
    headerBorder: 'rgba(0,0,0,0.07)',
    text: '#0f172a',
    textMuted: '#64748b',
    textNav: '#475569',
    textNavActive: '#1565C0',
    iconNav: '#94a3b8',
    iconNavActive: '#1565C0',
    navActive: 'rgba(21,101,192,0.10)',
    navHover: 'rgba(0,0,0,0.04)',
    groupLabel: '#9ca3af',
    dropdownBg: '#ffffff',
    dropdownBorder: 'rgba(0,0,0,0.1)',
    waveLeft: ['rgba(30,136,229,0.12)', 'rgba(30,136,229,0.06)'],
    waveRight: ['rgba(104,159,56,0.12)', 'rgba(104,159,56,0.06)'],
    waveBottom: 'rgba(30,136,229,0.05)',
  };

  const S = {
    shell: {
      display: 'flex', minHeight: '100vh', position: 'relative' as const,
      background: C.shellBg,
      fontFamily: 'system-ui, -apple-system, sans-serif', color: C.text,
    } as React.CSSProperties,
    sidebar: {
      width: '240px', minWidth: '240px',
      background: C.sidebarBg,
      backdropFilter: 'blur(8px)',
      borderRight: `1px solid ${C.sidebarBorder}`,
      display: 'flex', flexDirection: 'column' as const, overflow: 'hidden',
      position: 'relative' as const, zIndex: 2,
    } as React.CSSProperties,
    main: { flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', position: 'relative' as const, zIndex: 2 } as React.CSSProperties,
  };

  return (
    <div style={S.shell}>
      {/* ── Ondas de fondo SVG — position:fixed cubre TODAS las rutas ── */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.7, zIndex: 0 }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-80,0 C-20,100 60,250 50,420 C40,560 -10,660 -50,780 C-70,850 -90,890 -80,900 L-180,900 L-180,0 Z"
          fill={C.waveLeft[0]} />
        <path d="M-40,0 C30,120 90,280 80,460 C70,600 20,700 -20,820 C-40,870 -50,895 -40,900 L-140,900 L-140,0 Z"
          fill={C.waveLeft[1]} />
        <path d="M1520,900 C1460,800 1390,660 1380,510 C1370,370 1420,260 1460,140 C1490,50 1510,10 1520,0 L1620,0 L1620,900 Z"
          fill={C.waveRight[0]} />
        <path d="M1480,900 C1420,790 1350,640 1340,490 C1330,350 1380,240 1420,120 C1450,40 1470,5 1480,0 L1580,0 L1580,900 Z"
          fill={C.waveRight[1]} />
        <path d="M0,850 C300,800 700,830 1000,810 C1200,795 1350,820 1440,850 L1440,900 L0,900 Z"
          fill={C.waveBottom} />
      </svg>

      {/* ── SIDEBAR ── */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${C.sidebarBorder}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/logo-transparent.png" alt="IPEC" style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{t.brand}</div>
            <div style={{ fontSize: '10px', color: C.textMuted, marginTop: '1px' }}>{t.adminPanel}</div>
          </div>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {groups.map(group => (
            <div key={group.key} style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: C.groupLabel, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 6px' }}>
                {group.label}
              </div>
              {group.items.map(item => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href + '/') || pathname === item.href;
                const isDisabled = 'disabled' in item && item.disabled;
                return (
                  <button
                    key={item.href}
                    onClick={() => !isDisabled && router.push(item.href)}
                    title={isDisabled ? t.comingSoon : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '9px 10px', borderRadius: '7px',
                      border: 'none', cursor: isDisabled ? 'default' : 'pointer',
                      background: isActive ? C.navActive : 'transparent',
                      color: isDisabled ? C.groupLabel : isActive ? C.textNavActive : C.textNav,
                      fontSize: '13px', fontWeight: isActive ? 600 : 400,
                      textAlign: 'left', marginBottom: '2px',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive && !isDisabled) (e.currentTarget as HTMLElement).style.background = C.navHover; }}
                    onMouseLeave={e => { if (!isActive && !isDisabled) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ color: isDisabled ? C.groupLabel : isActive ? C.iconNavActive : C.iconNav, flexShrink: 0 }}>
                      {Icons[item.icon as keyof typeof Icons]}
                    </span>
                    {item.label}
                    {isDisabled && <span style={{ marginLeft: 'auto', fontSize: '10px', color: C.groupLabel }}>{t.comingSoon}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '10px 8px', borderTop: `1px solid ${C.sidebarBorder}` }}>
          <button
            onClick={handleLogout}
            disabled={signingOut}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '9px 10px', borderRadius: '7px',
              border: 'none', cursor: 'pointer', background: 'transparent',
              color: C.textMuted, fontSize: '13px', textAlign: 'left',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.textMuted; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {Icons.logout}
            {signingOut ? t.userMenu.signingOut : t.userMenu.signOut}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={S.main}>
        {/* Header */}
        <header style={{
          height: '60px',
          background: C.headerBg,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${C.headerBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0,
        }}>
          {/* Title */}
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: 0 }}>{pageTitle}</h1>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: 'none', cursor: 'pointer', background: 'transparent',
                color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {isDark ? (
                /* Sol — modo claro */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* Luna — modo oscuro */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Bell — placeholder */}
            <button
              title={t.notifications}
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: 'none', cursor: 'pointer', background: 'transparent',
                color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {Icons.bell}
            </button>

            {/* User menu */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 10px', borderRadius: '8px',
                  border: `1px solid ${C.sidebarBorder}`,
                  background: menuOpen ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'transparent',
                  cursor: 'pointer', color: C.text,
                }}
                onMouseEnter={e => { if (!menuOpen) (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { if (!menuOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {/* Avatar */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: C.text }}>
                  {displayName}
                </span>
                <span style={{ color: C.textMuted, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }}>
                  {Icons.chevron}
                </span>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  width: '240px', background: C.dropdownBg, border: `1px solid ${C.dropdownBorder}`,
                  borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                  zIndex: 100, overflow: 'hidden',
                }}>
                  {/* Identity */}
                  <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${C.sidebarBorder}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: 700, color: '#fff',
                      }}>{initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                        <div style={{ fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                        {roleLabel && (
                          <div style={{
                            display: 'inline-block', marginTop: '4px',
                            padding: '1px 8px', borderRadius: '20px',
                            background: 'rgba(21,101,192,0.2)', color: '#60a5fa',
                            fontSize: '10px', fontWeight: 600,
                          }}>{roleLabel}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{ padding: '6px' }}>
                    <button
                      onClick={() => { setMenuOpen(false); router.push('/admin/profile'); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '9px',
                        width: '100%', padding: '9px 10px', borderRadius: '7px',
                        border: 'none', cursor: 'pointer', background: 'transparent',
                        color: C.textNav, fontSize: '13px', textAlign: 'left',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.navHover; (e.currentTarget as HTMLElement).style.color = C.text; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = C.textNav; }}
                    >
                      {Icons.user}
                      {t.userMenu.profile}
                    </button>
                  </div>

                  {/* Language toggle */}
                  <div style={{ padding: '0 14px 10px', borderTop: `1px solid ${C.sidebarBorder}` }}>
                    <div style={{ fontSize: '10px', color: C.textMuted, padding: '10px 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {Icons.globe} {t.userMenu.panelLanguage}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.06)', borderRadius: '7px', padding: '3px' }}>
                      {(['es', 'en'] as Lang[]).map(code => (
                        <button
                          key={code}
                          onClick={() => { setLang(code); try { localStorage.setItem('ipec_admin_lang', code); } catch {} }}
                          style={{
                            flex: 1, padding: '5px', borderRadius: '5px', border: 'none',
                            cursor: 'pointer', fontSize: '12px', fontWeight: lang === code ? 600 : 400,
                            background: lang === code ? 'rgba(21,101,192,0.3)' : 'transparent',
                            color: lang === code ? '#60a5fa' : C.textMuted,
                          }}
                        >
                          {t.langNames[code]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sign out */}
                  <div style={{ padding: '0 6px 6px', borderTop: `1px solid ${C.sidebarBorder}` }}>
                    <button
                      onClick={handleLogout}
                      disabled={signingOut}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '9px',
                        width: '100%', padding: '9px 10px', borderRadius: '7px',
                        border: 'none', cursor: 'pointer', background: 'transparent',
                        color: C.textNav, fontSize: '13px', textAlign: 'left',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = C.textNav; }}
                    >
                      {Icons.logout}
                      {signingOut ? t.userMenu.signingOut : t.userMenu.signOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <AdminLangContext.Provider value={lang}>
          <main style={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
            {children}
          </main>
        </AdminLangContext.Provider>
      </div>
    </div>
  );
}
