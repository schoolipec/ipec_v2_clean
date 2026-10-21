import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="min-h-[88vh] flex items-center justify-center relative overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/assets/hero-community.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Overlay — más oscuro en dark mode */}
      <div
        className="absolute inset-0 transition-all duration-300 dark:[background:linear-gradient(to_bottom,rgba(6,24,46,0.72)_0%,rgba(6,24,46,0.85)_50%,rgba(6,24,46,0.95)_100%)]"
        style={{
          background: 'linear-gradient(to bottom, rgba(8,41,66,0.55) 0%, rgba(8,41,66,0.70) 50%, rgba(8,41,66,0.88) 100%)',
        }}
      />

      {/* Patrón de color sutil */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 10% 80%, rgba(126,203,66,0.6) 0%, transparent 45%), radial-gradient(ellipse at 90% 20%, rgba(46,125,50,0.5) 0%, transparent 40%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Tagline */}
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-5"
          style={{
            background: 'linear-gradient(90deg, #4fc3f7 0%, #81c784 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('tagline')}
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
          {t('title')}
        </h1>

        <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
          {t('description')}
        </p>

        {/* Dos botones como en el original */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="inline-block font-bold py-3.5 px-10 rounded-full text-white text-base shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 50%, #7CB342 100%)' }}
          >
            {t('prayerAction')}
          </a>
          <a
            href="#groups"
            className="inline-block font-bold py-3.5 px-10 rounded-full text-white text-base border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200"
          >
            {t('groupsAction')}
          </a>
        </div>
      </div>

      {/* Ondas decorativas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,45 L1440,80 L0,80 Z"
            fill="white"
            fillOpacity="0.06"
          />
          <path
            d="M0,60 C400,20 800,70 1200,45 C1320,37 1400,55 1440,65 L1440,80 L0,80 Z"
            fill="white"
            fillOpacity="0.04"
          />
        </svg>
      </div>
    </section>
  );
}
