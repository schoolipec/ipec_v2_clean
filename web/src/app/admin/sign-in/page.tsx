'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function AdminSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.mustChangePassword) {
          router.replace('/admin/change-password');
        } else {
          const redirect = searchParams.get('redirect') || '/admin';
          router.replace(redirect);
        }
      } else {
        setError(data.error || 'Authentication error. Check your credentials.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  }

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', color: '#f1f5f9', fontSize: '15px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #e8f4fd 0%, #ffffff 45%, #edf7ed 100%)',
    }}>

      {/* ── Ondas de fondo SVG — inspiradas en el branding de Iglesia Plenitud ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Onda azul — izquierda */}
        <path d="M-120,0 C-60,80 20,200 40,350 C60,480 10,580 -30,700 C-60,790 -100,860 -120,900 L-220,900 L-220,0 Z"
          fill="rgba(30,136,229,0.18)" />
        <path d="M-80,0 C-10,100 60,240 70,400 C80,530 30,640 -10,760 C-40,840 -70,880 -80,900 L-180,900 L-180,0 Z"
          fill="rgba(30,136,229,0.10)" />
        <path d="M-40,0 C40,120 100,280 100,440 C100,580 50,690 10,800 C-10,860 -30,890 -40,900 L-140,900 L-140,0 Z"
          fill="rgba(66,165,245,0.07)" />

        {/* Onda verde — derecha/abajo */}
        <path d="M1560,900 C1500,820 1420,700 1400,560 C1380,430 1430,330 1470,200 C1500,100 1540,40 1560,0 L1660,0 L1660,900 Z"
          fill="rgba(104,159,56,0.18)" />
        <path d="M1520,900 C1460,810 1380,680 1360,540 C1340,400 1390,300 1430,170 C1460,80 1500,30 1520,0 L1620,0 L1620,900 Z"
          fill="rgba(104,159,56,0.10)" />
        <path d="M1480,900 C1420,800 1340,660 1320,520 C1300,380 1350,270 1390,140 C1420,60 1460,20 1480,0 L1580,0 L1580,900 Z"
          fill="rgba(139,195,74,0.07)" />

        {/* Ondas inferiores cruzadas */}
        <path d="M0,820 C200,760 400,800 600,780 C800,760 1000,700 1200,740 C1350,770 1440,800 1440,820 L1440,900 L0,900 Z"
          fill="rgba(30,136,229,0.06)" />
        <path d="M0,860 C300,820 600,850 900,830 C1100,815 1300,840 1440,860 L1440,900 L0,900 Z"
          fill="rgba(104,159,56,0.06)" />
      </svg>

      {/* ── Tarjeta del formulario ── */}
      <div style={{
        width: '100%', maxWidth: '420px',
        position: 'relative', zIndex: 1,
        background: 'rgba(15,23,42,0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(30,136,229,0.12)',
        overflow: 'hidden',
      }}>
        {/* ── Branding header ── */}
        <div style={{
          textAlign: 'center', padding: '40px 40px 28px',
          background: 'linear-gradient(180deg, rgba(21,101,192,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Logo — 60% del ancho de la tarjeta, versión dark (letras blancas) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img
              src="/assets/logo-dark.png"
              alt="Iglesia Plenitud en Cristo"
              style={{ width: '60%', maxWidth: '252px', height: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                /* Si logo-dark.png no existe, intentar logo-transparent.png */
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.includes('logo-transparent')) {
                  img.src = '/assets/logo-transparent.png';
                } else {
                  img.style.display = 'none';
                  const fb = img.nextElementSibling as HTMLElement;
                  if (fb) fb.style.display = 'flex';
                }
              }}
            />
            {/* Fallback si no hay logo */}
            <div style={{
              display: 'none', width: '80px', height: '80px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>

          {/* Título — sin nombre de iglesia, visible en el logo */}
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: 0, letterSpacing: '0.02em' }}>
            Administration Panel
          </h1>
        </div>

        {/* ── Formulario ── */}
        <div style={{ padding: '28px 36px 32px' }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '7px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                style={inputBase}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(30,136,229,0.7)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
                  Password
                </label>
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  style={{
                    ...inputBase,
                    paddingRight: '46px',
                    borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.12)',
                  }}
                  onFocus={(e) => { if (!error) e.target.style.borderColor = 'rgba(30,136,229,0.7)'; }}
                  onBlur={(e) => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#475569', padding: '4px',
                    display: 'flex', alignItems: 'center',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
            </div>

            {/* Mensajes de estado */}
            {error && (
              <p style={{ fontSize: '13px', color: '#ef4444', margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </p>
            )}
            {forgotSent && (
              <p style={{ fontSize: '13px', color: '#4ade80', margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Password reset feature coming soon. Contact your system administrator.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'rgba(51,65,85,0.8)' : 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
                border: 'none', borderRadius: '8px', color: 'white',
                fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '22px',
                transition: 'opacity 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              )}
              {loading ? 'Verifying…' : 'Sign In'}
            </button>
          </form>

          {/* Caption */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#475569', marginTop: '20px', marginBottom: 0 }}>
            Authorized administrators only
          </p>
        </div>

        {/* ── Footer (configurable — oculto por default) ── */}
        {/* Para activarlo: SUPER_ADMIN puede habilitarlo desde el panel de configuración */}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
