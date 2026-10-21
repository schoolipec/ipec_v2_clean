import { useTranslations } from 'next-intl';

const INSTAGRAM_URL = 'https://www.instagram.com/prmarioalsina';

export default function SocialSection() {
  const t = useTranslations('social');

  return (
    <section style={{ background: 'var(--bg-alt)', transition: 'background 0.3s ease' }} className="py-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">
          {t('label')}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{t('title')}</h2>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>{t('text')}</p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold py-3 px-8 rounded-full text-white text-sm hover:opacity-90 hover:scale-105 transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" />
          </svg>
          {t('action')}
        </a>
      </div>
    </section>
  );
}
