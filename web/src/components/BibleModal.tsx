'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'ipec-bible-modal-hidden';
const DELAY_MS = 30_000;

type Verse = { text: string; ref: string };

export default function BibleModal() {
  const t = useTranslations('bibleModal');
  const [open, setOpen] = useState(false);
  const [noShow, setNoShow] = useState(false);
  const [verse, setVerse] = useState<Verse>({ text: '', ref: '' });

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch { /* no-op */ }

    // Versículos del día en el idioma activo
    const verses = t.raw('verses') as Verse[];
    const idx = new Date().getDate() % verses.length;
    setVerse(verses[idx]);

    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [t]);

  function close() {
    if (noShow) {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* no-op */ }
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      {/* Libro abierto */}
      <div className="relative w-full max-w-2xl shadow-2xl" style={{ perspective: '1200px' }}>

        {/* Botón X cierre */}
        <button
          onClick={close}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#1a1a2e] border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#082942] transition-all"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenedor del libro */}
        <div className="flex rounded-xl overflow-hidden" style={{
          border: '2px solid #c9a227',
          boxShadow: '0 0 0 1px rgba(201,162,39,0.3), inset 0 0 60px rgba(0,0,0,0.1)',
        }}>

          {/* Página izquierda */}
          <div className="flex-1 px-8 py-8 flex flex-col justify-between" style={{
            background: 'linear-gradient(to right, #f5ead0, #f0e4c4)',
            borderRight: '1px solid rgba(150,100,30,0.2)',
          }}>
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#7a5c1e' }}>
                  {t('church')}
                </span>
                <svg className="w-5 h-5" fill="none" stroke="#7a5c1e" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 9h14" />
                </svg>
              </div>
              <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, #c9a227, transparent)' }} />

              <h2 className="text-2xl font-bold mb-3" style={{ color: '#1a1008', fontFamily: 'Georgia, serif' }}>
                {t('subtitle')}
              </h2>
              <div className="flex justify-start mb-4">
                <span className="text-[#c9a227] text-lg">◆</span>
              </div>
              <p className="text-sm leading-relaxed italic" style={{ color: '#4a3520', fontFamily: 'Georgia, serif' }}>
                {t('description')}
              </p>
            </div>

            {/* Decorado inferior */}
            <div className="flex items-center gap-3 mt-6 opacity-30">
              <div className="h-px flex-1" style={{ background: '#7a5c1e' }} />
              <span className="text-xs" style={{ color: '#7a5c1e' }}>✦</span>
              <div className="h-px flex-1" style={{ background: '#7a5c1e' }} />
            </div>
          </div>

          {/* Marcapáginas rojo — centro del libro */}
          <div className="relative flex-shrink-0 w-0 flex justify-center" style={{ zIndex: 10 }}>
            <div className="absolute -top-1 w-6" style={{
              height: '80px',
              background: 'linear-gradient(to bottom, #c0392b, #922b21)',
              borderRadius: '0 0 3px 3px',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
            }} />
          </div>

          {/* Página derecha */}
          <div className="flex-1 px-8 py-8 flex flex-col" style={{
            background: 'linear-gradient(to left, #f5ead0, #ede3c0)',
          }}>
            {/* Header versículo */}
            <div className="mb-5">
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#7a5c1e' }}>
                {t('verseLabel')}
              </span>
              <div className="h-px mt-3" style={{ background: 'linear-gradient(to right, #c9a227, transparent)' }} />
            </div>

            {/* Comillas y versículo */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-4xl leading-none mb-2 font-serif" style={{ color: '#c9a227' }}>"</div>
              <p className="text-lg font-bold leading-snug mb-3" style={{ color: '#1a1008', fontFamily: 'Georgia, serif' }}>
                {verse.text}
                <span className="text-3xl leading-none font-serif ml-1" style={{ color: '#c9a227' }}>"</span>
              </p>
              <p className="text-sm font-bold italic" style={{ color: '#c0392b', fontFamily: 'Georgia, serif' }}>
                {verse.ref}
              </p>
            </div>

            {/* Checkbox + botón */}
            <div className="mt-6">
              <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noShow}
                  onChange={(e) => setNoShow(e.target.checked)}
                  className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 cursor-pointer"
                  style={{ borderColor: '#7a5c1e', accentColor: '#7a5c1e' }}
                />
                <span className="text-xs leading-relaxed" style={{ color: '#4a3520' }}>
                  {t('noShow')}
                </span>
              </label>

              <button
                onClick={close}
                className="w-full py-3 rounded-lg text-white text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-98"
                style={{ background: 'linear-gradient(135deg, #082942 0%, #0a3d5c 100%)' }}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
