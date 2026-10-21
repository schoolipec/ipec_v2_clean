import { useTranslations } from 'next-intl';

export default function OfferingSection() {
  const t = useTranslations('offering');

  return (
    <section id="giving" style={{ background: 'var(--bg-alt)', transition: 'background 0.3s ease' }} className="py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">
          {t('label')}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t('title')}</h2>
        <p className="mb-3 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('text')}</p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{t('notice')}</p>
        <a
          href="https://square.link/u/MRxMQSu3?src=embed"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-bold py-3.5 px-12 rounded-full text-white text-base shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 50%, #7CB342 100%)' }}
        >
          {t('action')}
        </a>
      </div>
    </section>
  );
}
