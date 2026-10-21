import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Image from 'next/image';
import enMessages from '@/i18n/messages/en.json';

export const metadata = {
  title: 'Pastors — Iglesia Plenitud en Cristo',
  description: 'Meet the pastoral team of Iglesia Plenitud en Cristo.',
};

const GHTI_URL = 'https://www.globalharvestonline.com/quienes-somos';
const INSTAGRAM_URL = 'https://www.instagram.com/prmarioalsina';

export default function PastorsPage() {
  const p = enMessages.pastors;

  const milestones = [
    { num: '01', title: p.milestone1Title, text: p.milestone1Text },
    { num: '02', title: p.milestone2Title, text: p.milestone2Text },
    { num: '03', title: p.milestone3Title, text: p.milestone3Text },
    { num: '04', title: p.milestone4Title, text: p.milestone4Text },
  ];

  const values = [p.value1, p.value2, p.value3, p.value4];

  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ThemeProvider>
        <BibleModal />
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <section className="py-20" style={{ background: 'var(--bg-page)' }}>
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-3">{p.story}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{p.heroTitle}</h1>
              <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>{p.heroText}</p>
            </div>
            <div className="max-w-4xl mx-auto px-6 mt-10">
              <Image src="/assets/small-group.png" alt="Community studying the Bible" width={1200} height={600}
                className="w-full h-64 md:h-80 object-cover rounded-2xl" />
            </div>
          </section>

          {/* Pastor Mario */}
          <section className="py-16" style={{ background: 'var(--bg-alt)' }}>
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-sm font-bold uppercase tracking-widest text-[#2E7D32] mb-2">{p.marioName}</p>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{p.marioSubtitle}</h2>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{p.marioBio1}</p>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{p.marioBio2}</p>
              <a href={GHTI_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#1565C0] hover:underline">
                {p.ghtiLink}
              </a>
            </div>
          </section>

          {/* Milestones */}
          <section className="py-16" style={{ background: 'var(--bg-page)' }}>
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">{p.journeyLabel}</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-10" style={{ color: 'var(--text-primary)' }}>{p.journeyTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {milestones.map((m) => (
                  <div key={m.num} className="rounded-xl p-6" style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-card)' }}>
                    <span className="text-xs font-bold text-[#7CB342] mb-2 block">{m.num}</span>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{m.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pastora Adriana */}
          <section className="py-16" style={{ background: 'var(--bg-alt)' }}>
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-sm font-bold uppercase tracking-widest text-[#2E7D32] mb-2">{p.adrianaName}</p>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{p.adrianaSubtitle}</h2>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{p.adrianaBio1}</p>
              <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{p.adrianaBio2}</p>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-4">{p.valuesLabel}</p>
              <ul className="flex flex-col gap-3">
                {values.map((v, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="w-4 h-4 text-[#7CB342] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Global Harvest */}
          <section className="py-16" style={{ background: 'var(--bg-page)' }}>
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">{p.ghtiLabel}</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{p.ghtiTitle}</h2>
              <p className="leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>{p.ghtiText}</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-full text-white text-sm hover:opacity-90 hover:scale-105 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
                {p.visitInstagram}
              </a>
            </div>
          </section>
        </main>
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
