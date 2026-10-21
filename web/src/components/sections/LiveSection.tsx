import { useTranslations } from 'next-intl';

const YOUTUBE_URL = 'https://www.youtube.com/@suplenitud';
const FACEBOOK_URL = 'https://www.facebook.com/suplenitud';

export default function LiveSection() {
  const t = useTranslations('live');

  return (
    <section id="live" className="bg-[#061828] dark:bg-[#030e1a] py-20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* Indicador de estado */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-red-400 text-sm font-semibold uppercase tracking-widest">{t('status')}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('title')}</h2>
        <p className="text-white/60 mb-4 max-w-xl mx-auto">{t('text')}</p>
        <p className="text-white/40 text-sm mb-10">{t('schedule')}</p>

        {/* Tarjeta de estado sin transmisión */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 mb-8">
          {/* Ícono de iglesia/servicio */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M3 8a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
            </svg>
          </div>
          <p className="text-white/60 text-sm">{t('noLiveText')}</p>
        </div>

        {/* Botones de plataformas */}
        <p className="text-white/50 text-sm mb-5">{t('watchOn')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* YouTube */}
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 font-bold py-3.5 px-8 rounded-full text-white text-sm border border-white/20 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            {t('watchYoutube')}
          </a>
          {/* Facebook */}
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 font-bold py-3.5 px-8 rounded-full text-white text-sm border border-white/20 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {t('watchFacebook')}
          </a>
        </div>
      </div>
    </section>
  );
}
