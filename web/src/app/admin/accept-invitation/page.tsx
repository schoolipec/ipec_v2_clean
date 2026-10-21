'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LABELS = {
  es: {
    invalidLink: 'Enlace de invitación inválido.',
    goToLogin: 'Ir al inicio de sesión',
    title: 'Activa tu cuenta',
    subtitle: 'Has sido invitado al panel de administración.',
    subtitleSub: 'Crea tu contraseña para continuar.',
    password: 'Contraseña',
    passwordPlaceholder: 'Mínimo 8 caracteres',
    confirm: 'Confirmar contraseña',
    confirmPlaceholder: 'Repite la contraseña',
    errorMin: 'La contraseña debe tener al menos 8 caracteres.',
    errorMatch: 'Las contraseñas no coinciden.',
    errorConn: 'Error de conexión.',
    activating: 'Activando...',
    activate: 'Activar cuenta',
  },
  en: {
    invalidLink: 'Invalid invitation link.',
    goToLogin: 'Go to sign in',
    title: 'Activate your account',
    subtitle: 'You have been invited to the administration panel.',
    subtitleSub: 'Create your password to continue.',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    confirm: 'Confirm password',
    confirmPlaceholder: 'Repeat your password',
    errorMin: 'Password must be at least 8 characters.',
    errorMatch: 'Passwords do not match.',
    errorConn: 'Connection error.',
    activating: 'Activating...',
    activate: 'Activate account',
  },
} as const;

type Lang = 'es' | 'en';

function useLang(): Lang {
  const [lang, setLang] = useState<Lang>('es');
  useEffect(() => {
    const nav = navigator.language || 'es';
    setLang(nav.startsWith('en') ? 'en' : 'es');
  }, []);
  return lang;
}

export default function AcceptInvitation() {
  const lang = useLang();
  const t = LABELS[lang];
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#ef4444' }}>{t.invalidLink}</p>
          <a href="/admin/sign-in" style={{ color: '#1565C0', marginTop: '16px', display: 'block' }}>
            {t.goToLogin}
          </a>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError(t.errorMin); return; }
    if (password !== confirm) { setError(t.errorMatch); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.replace('/admin/content');
      } else {
        setError(data.error || t.errorConn);
      }
    } catch {
      setError(t.errorConn);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #061828 0%, #0a2240 100%)',
      padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: '#1e293b',
        borderRadius: '16px', padding: '40px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12"/>
              <path d="M2 2l20 20M14.36 14.36A3.5 3.5 0 0 1 8 12"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{t.title}</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0 0', lineHeight: 1.5 }}>
            {t.subtitle}<br/>{t.subtitleSub}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              required
              autoFocus
              style={{
                width: '100%', padding: '12px 14px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9',
                fontSize: '15px', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1565C0'; }}
              onBlur={(e) => { e.target.style.borderColor = '#334155'; }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              {t.confirm}
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t.confirmPlaceholder}
              required
              style={{
                width: '100%', padding: '12px 14px', background: '#0f172a',
                border: `1px solid ${error ? '#ef4444' : '#334155'}`, borderRadius: '8px',
                color: '#f1f5f9', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = '#1565C0'; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = '#334155'; }}
            />
            {error && <p style={{ fontSize: '13px', color: '#ef4444', margin: '8px 0 0' }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#334155' : 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              border: 'none', borderRadius: '8px', color: 'white',
              fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? t.activating : t.activate}
          </button>
        </form>
      </div>
    </div>
  );
}
