'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '../_components/AdminShell';
import { useAdminLang } from '../_components/AdminLangContext';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  whatsapp: string | null;
  telegramId: string | null;
  twoFactorEnabled: boolean;
  notifyTelegramPrayer: boolean;
  notifyEmailPrayer: boolean;
};

const LABELS = {
  es: {
    loading: 'Cargando...',
    personalInfo: 'Información personal',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    whatsapp: 'WhatsApp',
    telegramId: 'ID de Telegram',
    phoneHolder: '(702) 555-1234',
    telegramHolder: '@tuusuario o ID numérico',
    save: 'Guardar cambios',
    saving: 'Guardando...',
    savedOk: 'Perfil guardado correctamente.',
    nameRequired: 'El nombre es requerido.',
    changeEmail: 'Cambiar correo electrónico',
    newEmail: 'Nuevo correo',
    currentPassForEmail: 'Contraseña actual (requerida para cambiar el correo)',
    changeEmailBtn: 'Cambiar correo',
    changingEmail: 'Cambiando...',
    emailChangedOk: 'Correo actualizado correctamente.',
    changePassword: 'Cambiar contraseña',
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña',
    minChars: 'Mínimo 8 caracteres',
    repeatPassword: 'Repite la contraseña',
    changePasswordBtn: 'Cambiar contraseña',
    changingPassword: 'Cambiando...',
    passwordChangedOk: 'Contraseña cambiada correctamente.',
    pwMin8: 'La nueva contraseña debe tener al menos 8 caracteres.',
    pwNoMatch: 'Las contraseñas no coinciden.',
    roles: { SUPER_ADMIN: 'Super Administrador', ADMIN: 'Administrador', TREASURER: 'Tesorero', USHER: 'Ujier' } as Record<string, string>,
    notifications: 'Notificaciones de pedidos de oración',
    notificationsDesc: 'Elige cómo recibir alertas cuando alguien envíe una petición de oración desde el sitio.',
    notifyTelegram: 'Recibir notificaciones por Telegram',
    notifyTelegramDesc: 'Requiere que tengas un ID de Telegram configurado arriba.',
    notifyEmail: 'Recibir copia por correo electrónico',
    notifyEmailDesc: 'Se enviará al correo con el que accedes al panel.',
    inboxNote: 'Todas las peticiones se guardan siempre en peticiones@suplenitud.com, independientemente de estas opciones.',
    telegramMissing: 'Configura tu ID de Telegram en "Información personal" para activar esta opción.',
    saveNotif: 'Guardar preferencias',
    savingNotif: 'Guardando...',
    savedNotif: 'Preferencias guardadas.',
  },
  en: {
    loading: 'Loading...',
    personalInfo: 'Personal information',
    fullName: 'Full name',
    email: 'Email address',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    telegramId: 'Telegram ID',
    phoneHolder: '(702) 555-1234',
    telegramHolder: '@yourusername or numeric ID',
    save: 'Save changes',
    saving: 'Saving...',
    savedOk: 'Profile saved successfully.',
    nameRequired: 'Name is required.',
    changeEmail: 'Change email address',
    newEmail: 'New email',
    currentPassForEmail: 'Current password (required to change email)',
    changeEmailBtn: 'Change email',
    changingEmail: 'Changing...',
    emailChangedOk: 'Email updated successfully.',
    changePassword: 'Change password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    minChars: 'Minimum 8 characters',
    repeatPassword: 'Repeat password',
    changePasswordBtn: 'Change password',
    changingPassword: 'Changing...',
    passwordChangedOk: 'Password changed successfully.',
    pwMin8: 'New password must be at least 8 characters.',
    pwNoMatch: 'Passwords do not match.',
    roles: { SUPER_ADMIN: 'Super Admin', ADMIN: 'Administrator', TREASURER: 'Treasurer', USHER: 'Usher' } as Record<string, string>,
    notifications: 'Prayer request notifications',
    notificationsDesc: 'Choose how to receive alerts when someone submits a prayer request from the site.',
    notifyTelegram: 'Receive notifications via Telegram',
    notifyTelegramDesc: 'Requires a Telegram ID configured above.',
    notifyEmail: 'Receive email copy',
    notifyEmailDesc: 'Will be sent to the email you use to log in.',
    inboxNote: 'All requests are always saved to peticiones@suplenitud.com, regardless of these settings.',
    telegramMissing: 'Set your Telegram ID in "Personal information" to enable this option.',
    saveNotif: 'Save preferences',
    savingNotif: 'Saving...',
    savedNotif: 'Preferences saved.',
  },
} as const;

export default function AdminProfile() {
  return (
    <AdminShell>
      <ProfileContent />
    </AdminShell>
  );
}

function ProfileContent() {
  const lang = useAdminLang();
  const t = LABELS[lang];
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '', telegramId: '' });
  const [emailForm, setEmailForm] = useState({ newEmail: '', currentPassword: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifForm, setNotifForm] = useState({ notifyTelegramPrayer: false, notifyEmailPrayer: false });
  const [saving, setSaving] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [savingNotif, setSavingNotif] = useState(false);
  const [msg, setMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    fetch('/api/admin/profile')
      .then(r => {
        if (r.status === 401) { router.replace('/admin/sign-in'); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setProfile(data);
        setForm({ name: data.name || '', phone: data.phone || '', whatsapp: data.whatsapp || '', telegramId: data.telegramId || '' });
        setNotifForm({ notifyTelegramPrayer: !!data.notifyTelegramPrayer, notifyEmailPrayer: !!data.notifyEmailPrayer });
      });
  }, [router]);

  function flash(setter: (v: string) => void, text: string) {
    setter(text);
    setTimeout(() => setter(''), 3500);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError(t.nameRequired); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, ...data } : null);
        flash(setMsg, t.savedOk);
      } else {
        setError(data.error || 'Error al guardar.');
      }
    } finally { setSaving(false); }
  }

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');
    setSavingEmail(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: emailForm.newEmail, currentPassword: emailForm.currentPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, email: data.email } : null);
        setEmailForm({ newEmail: '', currentPassword: '' });
        flash(setEmailMsg, t.emailChangedOk);
      } else {
        setEmailError(data.error || 'Error al cambiar el correo.');
      }
    } finally { setSavingEmail(false); }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword.length < 8) { setPwError(t.pwMin8); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError(t.pwNoMatch); return; }
    setSavingPw(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        flash(setPwMsg, t.passwordChangedOk);
      } else {
        setPwError(data.error || 'Error al cambiar la contraseña.');
      }
    } finally { setSavingPw(false); }
  }

  async function saveNotifications(e: React.FormEvent) {
    e.preventDefault();
    setSavingNotif(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifForm),
      });
      const data = await res.json();
      if (res.ok) {
        setNotifForm({ notifyTelegramPrayer: !!data.notifyTelegramPrayer, notifyEmailPrayer: !!data.notifyEmailPrayer });
        flash(setNotifMsg, t.savedNotif);
      }
    } finally { setSavingNotif(false); }
  }

  if (!profile) {
    return <div style={{ color: '#94a3b8', padding: '32px' }}>{t.loading}</div>;
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: '#cbd5e1', marginBottom: '6px',
  };
  const cardStyle: React.CSSProperties = {
    background: '#1e293b', borderRadius: '12px', padding: '24px',
    border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px',
  };
  const gridTwo: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px', marginBottom: '16px',
  };

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>

        {/* Encabezado */}
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 700, color: 'white',
          }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{profile.name}</p>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>
              {profile.email} · {t.roles[profile.role] || profile.role}
            </p>
          </div>
        </div>

        {/* Información personal */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 20px' }}>{t.personalInfo}</h2>
          <form onSubmit={saveProfile}>
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>{t.fullName} *</label>
                <input style={inputStyle} value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={t.fullName} required
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.phone}</label>
                <input style={inputStyle} value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder={t.phoneHolder}
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
            </div>
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>{t.whatsapp}</label>
                <input style={inputStyle} value={form.whatsapp}
                  onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                  placeholder={t.phoneHolder}
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.telegramId}</label>
                <input style={inputStyle} value={form.telegramId}
                  onChange={e => setForm(f => ({ ...f, telegramId: e.target.value }))}
                  placeholder={t.telegramHolder}
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
            </div>
            {error && <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '12px' }}>{error}</p>}
            {msg && <p style={{ fontSize: '13px', color: '#22c55e', marginBottom: '12px' }}>{msg}</p>}
            <button type="submit" disabled={saving} style={{
              padding: '10px 24px',
              background: saving ? '#334155' : 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            }}>
              {saving ? t.saving : t.save}
            </button>
          </form>
        </div>

        {/* Cambiar correo electrónico */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>{t.changeEmail}</h2>
          <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 20px' }}>
            {lang === 'es' ? `Correo actual: ${profile.email}` : `Current email: ${profile.email}`}
          </p>
          <form onSubmit={saveEmail}>
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>{t.newEmail}</label>
                <input type="email" style={inputStyle} value={emailForm.newEmail}
                  onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))}
                  placeholder="nuevo@correo.com" required
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.currentPassForEmail}</label>
                <input type="password" style={inputStyle} value={emailForm.currentPassword}
                  onChange={e => setEmailForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="••••••••" required
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
            </div>
            {emailError && <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '12px' }}>{emailError}</p>}
            {emailMsg && <p style={{ fontSize: '13px', color: '#22c55e', marginBottom: '12px' }}>{emailMsg}</p>}
            <button type="submit" disabled={savingEmail} style={{
              padding: '10px 24px',
              background: savingEmail ? '#334155' : 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '14px', fontWeight: 600, cursor: savingEmail ? 'not-allowed' : 'pointer',
            }}>
              {savingEmail ? t.changingEmail : t.changeEmailBtn}
            </button>
          </form>
        </div>

        {/* Cambiar contraseña */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 20px' }}>{t.changePassword}</h2>
          <form onSubmit={savePassword}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{t.currentPassword}</label>
              <input type="password" style={inputStyle} value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="••••••••" required
                onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                onBlur={e => { e.target.style.borderColor = '#334155'; }}
              />
            </div>
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>{t.newPassword}</label>
                <input type="password" style={inputStyle} value={pwForm.newPassword}
                  onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  placeholder={t.minChars} required
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.confirmPassword}</label>
                <input type="password" style={inputStyle} value={pwForm.confirmPassword}
                  onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder={t.repeatPassword} required
                  onFocus={e => { e.target.style.borderColor = '#1565C0'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
            </div>
            {pwError && <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '12px' }}>{pwError}</p>}
            {pwMsg && <p style={{ fontSize: '13px', color: '#22c55e', marginBottom: '12px' }}>{pwMsg}</p>}
            <button type="submit" disabled={savingPw} style={{
              padding: '10px 24px',
              background: savingPw ? '#334155' : 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '14px', fontWeight: 600, cursor: savingPw ? 'not-allowed' : 'pointer',
            }}>
              {savingPw ? t.changingPassword : t.changePasswordBtn}
            </button>
          </form>
        </div>

        {/* Notificaciones de pedidos de oración */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{t.notifications}</h2>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 20px' }}>{t.notificationsDesc}</p>

          <form onSubmit={saveNotifications}>
            {/* Toggle Telegram */}
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '14px 16px', borderRadius: '10px',
              background: notifForm.notifyTelegramPrayer ? 'rgba(21,101,192,0.12)' : '#0f172a',
              border: `1px solid ${notifForm.notifyTelegramPrayer ? 'rgba(59,130,246,0.35)' : '#1e293b'}`,
              cursor: !form.telegramId.trim() ? 'not-allowed' : 'pointer',
              marginBottom: '10px', transition: 'all 0.2s',
              opacity: !form.telegramId.trim() ? 0.6 : 1,
            }}>
              <input
                type="checkbox"
                checked={notifForm.notifyTelegramPrayer}
                disabled={!form.telegramId.trim()}
                onChange={e => setNotifForm(f => ({ ...f, notifyTelegramPrayer: e.target.checked }))}
                style={{ marginTop: '2px', accentColor: '#3b82f6', width: '16px', height: '16px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '3px' }}>
                  {t.notifyTelegram}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {!form.telegramId.trim() ? t.telegramMissing : t.notifyTelegramDesc}
                </div>
              </div>
            </label>

            {/* Toggle Email */}
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '14px 16px', borderRadius: '10px',
              background: notifForm.notifyEmailPrayer ? 'rgba(21,101,192,0.12)' : '#0f172a',
              border: `1px solid ${notifForm.notifyEmailPrayer ? 'rgba(59,130,246,0.35)' : '#1e293b'}`,
              cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s',
            }}>
              <input
                type="checkbox"
                checked={notifForm.notifyEmailPrayer}
                onChange={e => setNotifForm(f => ({ ...f, notifyEmailPrayer: e.target.checked }))}
                style={{ marginTop: '2px', accentColor: '#3b82f6', width: '16px', height: '16px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '3px' }}>
                  {t.notifyEmail}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{t.notifyEmailDesc}</div>
              </div>
            </label>

            {/* Nota de inbox fijo */}
            <div style={{
              padding: '10px 14px', borderRadius: '8px',
              background: 'rgba(46,125,50,0.1)', border: '1px solid rgba(74,222,128,0.2)',
              fontSize: '12px', color: '#4ade80', marginBottom: '16px',
              display: 'flex', alignItems: 'flex-start', gap: '8px',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {t.inboxNote}
            </div>

            {notifMsg && <p style={{ fontSize: '13px', color: '#22c55e', marginBottom: '12px' }}>{notifMsg}</p>}
            <button type="submit" disabled={savingNotif} style={{
              padding: '10px 24px',
              background: savingNotif ? '#334155' : 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '14px', fontWeight: 600, cursor: savingNotif ? 'not-allowed' : 'pointer',
            }}>
              {savingNotif ? t.savingNotif : t.saveNotif}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
