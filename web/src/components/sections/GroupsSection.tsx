import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function GroupsSection() {
  const t = useTranslations('groups');

  const groups = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('smallTitle'), text: t('smallText'), action: t('join'),
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: t('trainingTitle'), text: t('trainingText'), action: t('learn'),
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: t('plenitudeTitle'), text: t('plenitudeText'), action: t('discover'),
    },
  ];

  return (
    <section id="groups" style={{ background: 'var(--bg-page)', transition: 'background 0.3s ease' }} className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-6">
            {groups.map((g, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border-color)',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                }}
                className="rounded-xl p-6 hover:border-[#7CB342]"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#7CB342]/10 flex items-center justify-center mb-3">{g.icon}</span>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{g.title}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{g.text}</p>
                <a href="#contact" className="text-sm font-semibold text-[#1565C0] hover:underline">{g.action}</a>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/assets/small-group.png"
              alt="Grupo pequeño estudiando la Biblia"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
