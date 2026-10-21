'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/app/admin/_components/AdminShell';
import { useAdminLang } from '@/app/admin/_components/AdminLangContext';

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
type Lang = 'es' | 'en';
type LabelT = { es: string; en: string };
type FieldDef = { key: string; label: LabelT; multiline?: boolean; rows?: number };
type SectionDef = { id: string; label: LabelT; icon: React.ReactNode; fields: FieldDef[] };

// ─────────────────────────────────────────────
// Textos de la UI
// ─────────────────────────────────────────────
const UI = {
  es: {
    editingSection: 'Editando sección',
    in: 'en',
    switchTab: 'Cambia de pestaña para editar otros idiomas.',
    loading: 'Cargando contenido…',
    saved: 'Cambios guardados',
    saveError: 'Error al guardar',
    saving: 'Guardando…',
    save: 'Guardar cambios',
  },
  en: {
    editingSection: 'Editing section',
    in: 'in',
    switchTab: 'Switch tabs to edit other languages.',
    loading: 'Loading content…',
    saved: 'Changes saved',
    saveError: 'Error saving',
    saving: 'Saving…',
    save: 'Save changes',
  },
} as const;

// ─────────────────────────────────────────────
// Íconos
// ─────────────────────────────────────────────
const IconHome = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconBroadcast = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
  </svg>
);
const IconGroups = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconAbout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconContact = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.2 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconOffering = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconVision = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconSocial = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);
const IconPastors = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

// ─────────────────────────────────────────────
// Secciones con labels bilingüe
// ─────────────────────────────────────────────
const SECTIONS: SectionDef[] = [
  {
    id: 'hero',
    label: { es: 'Hero', en: 'Hero' },
    icon: <IconHome />,
    fields: [
      { key: 'tagline', label: { es: 'Tagline (subtítulo pequeño)', en: 'Tagline (small subtitle)' } },
      { key: 'title', label: { es: 'Título principal', en: 'Main title' } },
      { key: 'description', label: { es: 'Descripción', en: 'Description' }, multiline: true, rows: 3 },
      { key: 'prayerAction', label: { es: 'Botón: Pedir oración', en: 'Button: Request prayer' } },
      { key: 'groupsAction', label: { es: 'Botón: Ver grupos', en: 'Button: View groups' } },
    ],
  },
  {
    id: 'live',
    label: { es: 'En Vivo', en: 'Live' },
    icon: <IconBroadcast />,
    fields: [
      { key: 'title', label: { es: 'Título', en: 'Title' } },
      { key: 'text', label: { es: 'Descripción', en: 'Description' }, multiline: true, rows: 2 },
      { key: 'schedule', label: { es: 'Horario', en: 'Schedule' } },
      { key: 'noLiveText', label: { es: 'Texto cuando no hay transmisión', en: 'Text when there is no broadcast' } },
      { key: 'watchOn', label: { es: 'Texto "Ver en:"', en: 'Text "Watch on:"' } },
      { key: 'watchYoutube', label: { es: 'Botón: YouTube', en: 'Button: YouTube' } },
      { key: 'watchFacebook', label: { es: 'Botón: Facebook', en: 'Button: Facebook' } },
    ],
  },
  {
    id: 'groups',
    label: { es: 'Grupos', en: 'Groups' },
    icon: <IconGroups />,
    fields: [
      { key: 'label', label: { es: 'Etiqueta de sección', en: 'Section label' } },
      { key: 'title', label: { es: 'Título', en: 'Title' } },
      { key: 'smallTitle', label: { es: 'Título: Pequeños Grupos', en: 'Title: Small Groups' } },
      { key: 'smallText', label: { es: 'Texto: Pequeños Grupos', en: 'Text: Small Groups' }, multiline: true, rows: 2 },
      { key: 'join', label: { es: 'Botón: Unirse', en: 'Button: Join' } },
      { key: 'trainingTitle', label: { es: 'Título: Formación', en: 'Title: Training' } },
      { key: 'trainingText', label: { es: 'Texto: Formación', en: 'Text: Training' }, multiline: true, rows: 2 },
      { key: 'learn', label: { es: 'Botón: Aprender más', en: 'Button: Learn more' } },
      { key: 'plenitudeTitle', label: { es: 'Título: Grupos Plenitud', en: 'Title: Plenitud Groups' } },
      { key: 'plenitudeText', label: { es: 'Texto: Grupos Plenitud', en: 'Text: Plenitud Groups' }, multiline: true, rows: 2 },
      { key: 'discover', label: { es: 'Botón: Descubrir grupos', en: 'Button: Discover groups' } },
    ],
  },
  {
    id: 'about',
    label: { es: 'Acerca de', en: 'About' },
    icon: <IconAbout />,
    fields: [
      { key: 'label', label: { es: 'Etiqueta de sección', en: 'Section label' } },
      { key: 'title', label: { es: 'Título', en: 'Title' } },
      { key: 'text', label: { es: 'Texto principal', en: 'Main text' }, multiline: true, rows: 3 },
      { key: 'meetPastors', label: { es: 'Enlace: Conocer pastores', en: 'Link: Meet pastors' } },
    ],
  },
  {
    id: 'contact',
    label: { es: 'Contacto', en: 'Contact' },
    icon: <IconContact />,
    fields: [
      { key: 'label', label: { es: 'Etiqueta de sección', en: 'Section label' } },
      { key: 'title', label: { es: 'Título', en: 'Title' } },
      { key: 'prayerTitle', label: { es: 'Título del formulario de oración', en: 'Prayer form title' } },
      { key: 'prayerDescription', label: { es: 'Descripción del formulario', en: 'Form description' }, multiline: true, rows: 2 },
      { key: 'contactChannel', label: { es: 'Texto: Elegir canal de contacto', en: 'Text: Choose contact channel' } },
      { key: 'name', label: { es: 'Label: Nombre', en: 'Label: Name' } },
      { key: 'request', label: { es: 'Label: Petición', en: 'Label: Request' } },
      { key: 'send', label: { es: 'Botón: Enviar', en: 'Button: Send' } },
      { key: 'successTitle', label: { es: 'Mensaje de éxito (título)', en: 'Success message (title)' } },
      { key: 'successText', label: { es: 'Mensaje de éxito (texto)', en: 'Success message (text)' }, multiline: true, rows: 2 },
      { key: 'callUs', label: { es: 'Botón: Llamar', en: 'Button: Call' } },
      { key: 'contactWhatsApp', label: { es: 'Botón: WhatsApp', en: 'Button: WhatsApp' } },
      { key: 'contactTelegram', label: { es: 'Botón: Telegram', en: 'Button: Telegram' } },
      { key: 'close', label: { es: 'Botón: Cerrar', en: 'Button: Close' } },
    ],
  },
  {
    id: 'offering',
    label: { es: 'Ofrendas', en: 'Offering' },
    icon: <IconOffering />,
    fields: [
      { key: 'label', label: { es: 'Etiqueta de sección', en: 'Section label' } },
      { key: 'title', label: { es: 'Título', en: 'Title' } },
      { key: 'text', label: { es: 'Descripción', en: 'Description' }, multiline: true, rows: 3 },
      { key: 'notice', label: { es: 'Aviso (texto de seguridad)', en: 'Notice (security text)' } },
      { key: 'action', label: { es: 'Botón: Acción', en: 'Button: Action' } },
    ],
  },
  {
    id: 'vision',
    label: { es: 'Visión', en: 'Vision' },
    icon: <IconVision />,
    fields: [
      { key: 'label', label: { es: 'Etiqueta de sección', en: 'Section label' } },
      { key: 'title', label: { es: 'Título', en: 'Title' } },
      { key: 'text', label: { es: 'Texto principal', en: 'Main text' }, multiline: true, rows: 3 },
      { key: 'reach', label: { es: 'Pilar: Alcanzar', en: 'Pillar: Reach' } },
      { key: 'reachText', label: { es: 'Texto: Alcanzar', en: 'Text: Reach' } },
      { key: 'strengthen', label: { es: 'Pilar: Consolidar', en: 'Pillar: Strengthen' } },
      { key: 'strengthenText', label: { es: 'Texto: Consolidar', en: 'Text: Strengthen' } },
      { key: 'form', label: { es: 'Pilar: Formar', en: 'Pillar: Form' } },
      { key: 'formText', label: { es: 'Texto: Formar', en: 'Text: Form' } },
      { key: 'send', label: { es: 'Pilar: Enviar', en: 'Pillar: Send' } },
      { key: 'sendText', label: { es: 'Texto: Enviar', en: 'Text: Send' } },
      { key: 'quote', label: { es: 'Cita destacada', en: 'Featured quote' }, multiline: true, rows: 3 },
      { key: 'schedule', label: { es: 'Horario + teléfono', en: 'Schedule + phone' } },
    ],
  },
  {
    id: 'social',
    label: { es: 'Instagram', en: 'Instagram' },
    icon: <IconSocial />,
    fields: [
      { key: 'label', label: { es: 'Etiqueta de sección', en: 'Section label' } },
      { key: 'title', label: { es: 'Título', en: 'Title' } },
      { key: 'text', label: { es: 'Descripción', en: 'Description' }, multiline: true, rows: 2 },
      { key: 'action', label: { es: 'Botón: Abrir Instagram', en: 'Button: Open Instagram' } },
    ],
  },
  {
    id: 'pastors',
    label: { es: 'Pastores', en: 'Pastors' },
    icon: <IconPastors />,
    fields: [
      { key: 'story', label: { es: 'Etiqueta "Historia"', en: 'Label "Story"' } },
      { key: 'heroTitle', label: { es: 'Título del hero', en: 'Hero title' }, multiline: true, rows: 2 },
      { key: 'heroText', label: { es: 'Texto del hero', en: 'Hero text' }, multiline: true, rows: 2 },
      { key: 'marioName', label: { es: 'Pastor Mario: nombre', en: 'Pastor Mario: name' } },
      { key: 'marioSubtitle', label: { es: 'Pastor Mario: subtítulo', en: 'Pastor Mario: subtitle' } },
      { key: 'marioBio1', label: { es: 'Pastor Mario: biografía (párrafo 1)', en: 'Pastor Mario: biography (paragraph 1)' }, multiline: true, rows: 3 },
      { key: 'marioBio2', label: { es: 'Pastor Mario: biografía (párrafo 2)', en: 'Pastor Mario: biography (paragraph 2)' }, multiline: true, rows: 3 },
      { key: 'ghtiLink', label: { es: 'Enlace al GHTI (texto)', en: 'GHTI link (text)' } },
      { key: 'journeyLabel', label: { es: 'Etiqueta "Jornada"', en: 'Label "Journey"' } },
      { key: 'journeyTitle', label: { es: 'Título de la jornada', en: 'Journey title' }, multiline: true, rows: 2 },
      { key: 'milestone1Title', label: { es: 'Hito 1: Título', en: 'Milestone 1: Title' } },
      { key: 'milestone1Text', label: { es: 'Hito 1: Texto', en: 'Milestone 1: Text' }, multiline: true, rows: 2 },
      { key: 'milestone2Title', label: { es: 'Hito 2: Título', en: 'Milestone 2: Title' } },
      { key: 'milestone2Text', label: { es: 'Hito 2: Texto', en: 'Milestone 2: Text' }, multiline: true, rows: 2 },
      { key: 'milestone3Title', label: { es: 'Hito 3: Título', en: 'Milestone 3: Title' } },
      { key: 'milestone3Text', label: { es: 'Hito 3: Texto', en: 'Milestone 3: Text' }, multiline: true, rows: 2 },
      { key: 'milestone4Title', label: { es: 'Hito 4: Título', en: 'Milestone 4: Title' } },
      { key: 'milestone4Text', label: { es: 'Hito 4: Texto', en: 'Milestone 4: Text' }, multiline: true, rows: 2 },
      { key: 'adrianaName', label: { es: 'Pastora Adriana: nombre', en: 'Pastor Adriana: name' } },
      { key: 'adrianaSubtitle', label: { es: 'Pastora Adriana: subtítulo', en: 'Pastor Adriana: subtitle' } },
      { key: 'adrianaBio1', label: { es: 'Pastora Adriana: biografía (párrafo 1)', en: 'Pastor Adriana: biography (paragraph 1)' }, multiline: true, rows: 3 },
      { key: 'adrianaBio2', label: { es: 'Pastora Adriana: biografía (párrafo 2)', en: 'Pastor Adriana: biography (paragraph 2)' }, multiline: true, rows: 3 },
      { key: 'valuesLabel', label: { es: 'Etiqueta "Valores"', en: 'Label "Values"' } },
      { key: 'value1', label: { es: 'Valor 1', en: 'Value 1' }, multiline: true, rows: 2 },
      { key: 'value2', label: { es: 'Valor 2', en: 'Value 2' }, multiline: true, rows: 2 },
      { key: 'value3', label: { es: 'Valor 3', en: 'Value 3' }, multiline: true, rows: 2 },
      { key: 'value4', label: { es: 'Valor 4', en: 'Value 4' }, multiline: true, rows: 2 },
      { key: 'ghtiLabel', label: { es: 'Etiqueta "Global Harvest Online"', en: 'Label "Global Harvest Online"' } },
      { key: 'ghtiTitle', label: { es: 'Título GHTI', en: 'GHTI title' } },
      { key: 'ghtiText', label: { es: 'Texto GHTI', en: 'GHTI text' }, multiline: true, rows: 3 },
      { key: 'visitInstagram', label: { es: 'Botón: Visitar Instagram', en: 'Button: Visit Instagram' } },
    ],
  },
];

// ─────────────────────────────────────────────
// Idiomas del sitio
// ─────────────────────────────────────────────
const LOCALES = [
  { code: 'es', label: 'Español', flag: '🇲🇽' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const;
type LocaleCode = 'en' | 'es' | 'pt' | 'ko' | 'de';
type AllContent = Partial<Record<LocaleCode, Record<string, string>>>;

// ─────────────────────────────────────────────
// Wrapper (patrón: AdminShell envuelve al hijo que usa useAdminLang)
// ─────────────────────────────────────────────
export default function AdminContentPage() {
  return (
    <AdminShell>
      <ContentMain />
    </AdminShell>
  );
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────
function ContentMain() {
  const lang = useAdminLang() as Lang;
  const ui = UI[lang];
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<SectionDef>(SECTIONS[0]);
  const [selectedLocale, setSelectedLocale] = useState<LocaleCode>('es');
  const [allContent, setAllContent] = useState<AllContent>({});
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchSection = useCallback(async (sectionId: string) => {
    setLoadingContent(true);
    setSaveStatus('idle');
    try {
      const res = await fetch(`/api/admin/content?section=${sectionId}`);
      if (res.status === 401 || res.status === 403) {
        router.replace('/admin/sign-in');
        return;
      }
      const data = await res.json();
      setAllContent(data);
    } catch {
      setAllContent({});
    } finally {
      setLoadingContent(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSection(selectedSection.id);
  }, [selectedSection.id, fetchSection]);

  function handleFieldChange(key: string, value: string) {
    setAllContent((prev) => ({
      ...prev,
      [selectedLocale]: {
        ...(prev[selectedLocale] || {}),
        [key]: value,
      },
    }));
    setSaveStatus('idle');
  }

  async function handleSave() {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: selectedSection.id,
          locale: selectedLocale,
          data: allContent[selectedLocale] || {},
        }),
      });
      if (res.status === 401 || res.status === 403) {
        router.replace('/admin/sign-in');
        return;
      }
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  const currentData = allContent[selectedLocale] || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Tabs de secciones (barra horizontal scrollable) ── */}
      <div style={{
        overflowX: 'auto',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: '#0f172a',
        flexShrink: 0,
        scrollbarWidth: 'none',
      }}>
        <div style={{ display: 'flex', padding: '0 20px', minWidth: 'max-content' }}>
          {SECTIONS.map((sec) => {
            const active = sec.id === selectedSection.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '13px 14px',
                  background: 'none', border: 'none',
                  borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
                  color: active ? '#93c5fd' : '#64748b',
                  fontSize: '13px', fontWeight: active ? 700 : 400,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  marginBottom: '-1px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = '#64748b'; }}
              >
                <span style={{ color: active ? '#3b82f6' : '#475569', display: 'flex', flexShrink: 0 }}>
                  {sec.icon}
                </span>
                {sec.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Área de contenido scrollable ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>

        {/* Tabs de idioma del sitio */}
        <div style={{
          display: 'flex', gap: '4px',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {LOCALES.map((loc) => {
            const active = loc.code === selectedLocale;
            return (
              <button
                key={loc.code}
                onClick={() => setSelectedLocale(loc.code)}
                style={{
                  padding: '9px 16px',
                  background: 'none', border: 'none',
                  borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
                  color: active ? '#93c5fd' : '#64748b',
                  fontSize: '13px', fontWeight: active ? 700 : 400,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  marginBottom: '-1px',
                  transition: 'color 0.15s',
                }}
              >
                <span>{loc.flag}</span>
                {loc.label}
              </button>
            );
          })}
        </div>

        {/* Aviso idioma activo */}
        <div style={{
          background: 'rgba(21,101,192,0.12)',
          border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#93c5fd',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {ui.editingSection} <strong style={{ margin: '0 4px' }}>{selectedSection.label[lang]}</strong>
          {ui.in} <strong style={{ marginLeft: '4px' }}>{LOCALES.find(l => l.code === selectedLocale)?.flag} {LOCALES.find(l => l.code === selectedLocale)?.label}</strong>.{' '}
          {ui.switchTab}
        </div>

        {/* Campos del formulario */}
        {loadingContent ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#475569', gap: '10px', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {ui.loading}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {selectedSection.fields.map((field) => (
              <div key={field.key}>
                <label style={{
                  display: 'block',
                  fontSize: '12px', fontWeight: 600, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}>
                  {field.label[lang]}
                  <span style={{ color: '#334155', fontWeight: 400, textTransform: 'none', marginLeft: '8px', letterSpacing: 0 }}>
                    [{field.key}]
                  </span>
                </label>
                {field.multiline ? (
                  <textarea
                    value={currentData[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    rows={field.rows ?? 3}
                    style={{
                      width: '100%', padding: '10px 12px',
                      background: '#1e293b', border: '1px solid #334155',
                      borderRadius: '8px', color: '#f1f5f9',
                      fontSize: '14px', lineHeight: '1.6',
                      outline: 'none', resize: 'vertical',
                      fontFamily: 'system-ui, sans-serif',
                      boxSizing: 'border-box', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#334155'; }}
                  />
                ) : (
                  <input
                    type="text"
                    value={currentData[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px',
                      background: '#1e293b', border: '1px solid #334155',
                      borderRadius: '8px', color: '#f1f5f9',
                      fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#334155'; }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Barra de guardar ── */}
        {!loadingContent && (
          <div style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',
          }}>
            {saveStatus === 'success' && (
              <span style={{ fontSize: '13px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {ui.saved}
              </span>
            )}
            {saveStatus === 'error' && (
              <span style={{ fontSize: '13px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {ui.saveError}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || loadingContent}
              style={{
                padding: '9px 22px',
                background: saving || loadingContent
                  ? '#334155'
                  : 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
                border: 'none', borderRadius: '8px', color: 'white',
                fontSize: '13px', fontWeight: 700,
                cursor: saving || loadingContent ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '7px',
                transition: 'opacity 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              {saving ? ui.saving : ui.save}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
