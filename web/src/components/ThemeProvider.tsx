'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LIGHT: Record<string, string> = {
  '--bg-page': '#ffffff',
  '--bg-alt': '#f9fafb',
  '--bg-card': '#ffffff',
  '--bg-dark-section': '#061828',
  '--bg-dark-section-deep': '#030e1a',
  '--bg-navy': '#0a2240',
  '--text-primary': '#082942',
  '--text-secondary': '#4b5563',
  '--text-muted': '#9ca3af',
  '--border-color': '#e5e7eb',
  '--border-card': '#f3f4f6',
};

const DARK: Record<string, string> = {
  '--bg-page': '#061a2e',
  '--bg-alt': '#0a2240',
  '--bg-card': '#0f2a42',
  '--bg-dark-section': '#030e1a',
  '--bg-dark-section-deep': '#020b16',
  '--bg-navy': '#0a2240',
  '--text-primary': '#e2e8f0',
  '--text-secondary': '#94a3b8',
  '--text-muted': '#64748b',
  '--border-color': '#1e4060',
  '--border-card': '#1e4060',
};

function applyTheme(dark: boolean) {
  const vars = dark ? DARK : LIGHT;
  const root = document.documentElement;
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val);
  }
  root.classList.toggle('dark', dark);
  document.body.style.setProperty('background-color', vars['--bg-page']);
  document.body.style.setProperty('color', vars['--text-primary']);
}

type ThemeCtx = { isDark: boolean; toggleTheme: () => void };
const ThemeContext = createContext<ThemeCtx>({ isDark: true, toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ipec-theme');
    const dark = saved !== 'light';
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  function toggleTheme() {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('ipec-theme', newDark ? 'dark' : 'light');
    applyTheme(newDark);
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
