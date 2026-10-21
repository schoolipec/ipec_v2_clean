import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <section style={{ background: 'var(--bg-alt)', transition: 'background 0.3s ease' }} className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl flex items-center justify-center p-10"
            style={{ background: 'linear-gradient(135deg, #061828 0%, #0a2240 100%)', minHeight: '320px' }}>
            <Image
              src="/assets/logo-dark.png"
              alt="Iglesia Plenitud en Cristo"
              width={480}
              height={480}
              className="w-full h-auto object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>{t('title')}</h2>
            <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{t('text')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
