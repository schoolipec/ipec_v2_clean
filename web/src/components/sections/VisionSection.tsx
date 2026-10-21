import { useTranslations } from 'next-intl';

export default function VisionSection() {
  const t = useTranslations('vision');

  const pillars = [
    { icon: '⌂', label: t('reach'), text: t('reachText') },
    { icon: '♙', label: t('strengthen'), text: t('strengthenText') },
    { icon: '✦', label: t('form'), text: t('formText') },
    { icon: '◎', label: t('send'), text: t('sendText') },
  ];

  const cultureLabels = [t('presence'), t('character'), t('service')];

  return (
    <section style={{ background: 'var(--bg-page)', transition: 'background 0.3s ease' }} className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Visión */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{t('title')}</h2>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t('text')}</p>
        </div>

        {/* 4 pilares */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {pillars.map((p) => (
            <div
              key={p.label}
              style={{ background: 'var(--bg-alt)', border: '1px solid var(--border-card)', transition: 'background 0.3s ease' }}
              className="rounded-xl p-6 text-center"
            >
              <div className="text-3xl text-[#7CB342] mb-3 font-bold">{p.icon}</div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{p.label}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.text}</p>
            </div>
          ))}
        </div>

        {/* Cultura */}
        <div className="bg-[#061828] rounded-2xl p-8 text-white">
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {cultureLabels.map((label) => (
              <span key={label} className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white/10 text-white/80">
                {label}
              </span>
            ))}
          </div>

          <blockquote className="text-center max-w-3xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-white/90 italic">{t('quote')}</p>
          </blockquote>

          <p className="text-center text-sm text-white/50 mt-8">{t('schedule')}</p>
        </div>
      </div>
    </section>
  );
}
