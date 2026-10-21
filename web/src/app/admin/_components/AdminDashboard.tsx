'use client';

import { useAdminLang } from './AdminLangContext';

type Props = {
  userName: string;
  userRole: string;
  userCount: number | null;
};

const LABELS = {
  es: {
    greeting: (h: number) => h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches',
    adminPanel: 'Panel de administración IPEC',
    roles: { SUPER_ADMIN: 'Super Admin', ADMIN: 'Administrador', TREASURER: 'Tesorero', USHER: 'Ujier' } as Record<string, string>,
    statUsers: 'Usuarios registrados',
    statUsersDesc: 'Cuentas activas en el sistema',
    statSections: 'Secciones de contenido',
    statSectionsDesc: 'idiomas por sección',
    statLangs: 'Idiomas activos',
    quickLinks: 'Accesos rápidos',
    linkContent: 'Editar contenido web',
    linkContentDesc: 'Modifica textos, títulos y descripciones del sitio en 5 idiomas',
    linkUsers: 'Gestión de usuarios',
    linkUsersDesc: 'Invita nuevos usuarios, cambia roles o elimina cuentas',
    linkProfile: 'Mi perfil y contraseña',
    linkProfileDesc: 'Actualiza tu información personal y cambia tu contraseña',
    prayerTitle: 'Solicitudes de oración',
    prayerDesc: 'Las solicitudes de oración se guardan en la base de datos. Revísalas en la sección "Pedidos de oración" del menú lateral.',
  },
  en: {
    greeting: (h: number) => h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening',
    adminPanel: 'IPEC Administration Panel',
    roles: { SUPER_ADMIN: 'Super Admin', ADMIN: 'Administrator', TREASURER: 'Treasurer', USHER: 'Usher' } as Record<string, string>,
    statUsers: 'Registered users',
    statUsersDesc: 'Active accounts in the system',
    statSections: 'Content sections',
    statSectionsDesc: 'languages per section',
    statLangs: 'Active languages',
    quickLinks: 'Quick access',
    linkContent: 'Edit web content',
    linkContentDesc: 'Modify texts, titles and descriptions of the site in 5 languages',
    linkUsers: 'User management',
    linkUsersDesc: 'Invite new users, change roles or delete accounts',
    linkProfile: 'My profile & password',
    linkProfileDesc: 'Update your personal information and change your password',
    prayerTitle: 'Prayer requests',
    prayerDesc: 'Prayer requests are saved in the database. Review them in the "Prayer Requests" section of the sidebar.',
  },
} as const;

const CONTENT_SECTIONS = 9; // Hero, En Vivo, Grupos, Acerca de, Contacto, Ofrendas, Visión, Instagram, Pastores

function StatCard({ label, value, description, icon, color }: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div style={{
      background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px', padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginTop: '4px' }}>{label}</div>
      <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{description}</div>
    </div>
  );
}

function QuickLink({ label, description, href, icon }: {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 16px', borderRadius: '10px',
        background: '#0a1628', border: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none', color: 'inherit',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(21,101,192,0.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.background = '#0a1628';
      }}
    >
      <div style={{ color: '#3b82f6', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{description}</div>
      </div>
      <svg style={{ marginLeft: 'auto', color: '#334155', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </a>
  );
}

export default function AdminDashboard({ userName, userRole, userCount }: Props) {
  const lang = useAdminLang();
  const t = LABELS[lang];
  const hour = new Date().getHours();
  const isSuperOrAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      {/* Saludo */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>
          {t.greeting(hour)}, {userName.split(' ')[0]} 👋
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          {t.roles[userRole] || userRole} · {t.adminPanel}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        {isSuperOrAdmin && userCount !== null && (
          <StatCard
            label={t.statUsers}
            value={userCount}
            description={t.statUsersDesc}
            color="rgba(21,101,192,0.2)"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
          />
        )}
        <StatCard
          label={t.statSections}
          value={CONTENT_SECTIONS}
          description={`5 ${t.statSectionsDesc}`}
          color="rgba(46,125,50,0.2)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          }
        />
        <StatCard
          label={t.statLangs}
          value={5}
          description="ES, EN, PT, KO, DE"
          color="rgba(131,58,180,0.2)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          }
        />
      </div>

      {/* Accesos rápidos */}
      {isSuperOrAdmin && (
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            {t.quickLinks}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <QuickLink
              label={t.linkContent}
              description={t.linkContentDesc}
              href="/admin/content"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
            />
            {userRole === 'SUPER_ADMIN' && (
              <QuickLink
                label={t.linkUsers}
                description={t.linkUsersDesc}
                href="/admin/users"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              />
            )}
            <QuickLink
              label={t.linkProfile}
              description={t.linkProfileDesc}
              href="/admin/profile"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            />
          </div>
        </div>
      )}

      {/* Nota de pedidos de oración */}
      <div style={{
        marginTop: '32px', padding: '14px 16px',
        background: 'rgba(21,101,192,0.08)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px',
      }}>
        <svg style={{ flexShrink: 0, color: '#3b82f6', marginTop: '1px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#93c5fd' }}>{t.prayerTitle}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{t.prayerDesc}</div>
        </div>
      </div>
    </div>
  );
}
