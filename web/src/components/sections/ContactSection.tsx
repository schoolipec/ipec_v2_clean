import { useTranslations } from 'next-intl';
import PrayerForm from './PrayerForm';

const ADDRESS = '5000 Spencer St, Las Vegas, NV 89119';
const PHONE_DISPLAY = '702 328 2536';
const PHONE_TEL = '+17023282536';
const EMAIL = 'marioalsina@suplenitud.com';
const MAPS_URL = 'https://www.google.com/maps/dir/?api=1&destination=5000+Spencer+St,+Las+Vegas,+NV+89119';

export default function ContactSection() {
  const t = useTranslations('contact');

  return (
    <section id="contact" style={{ background: 'var(--bg-page)', transition: 'background 0.3s ease' }} className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32] mb-2">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Columna izquierda: dirección */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {ADDRESS.split(',')[0]}
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>{ADDRESS.split(',').slice(1).join(',').trim()}</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-semibold text-[#1565C0] hover:underline"
              >
                {t('directions')}
              </a>
            </div>

            {/* Mapa */}
            <div className="rounded-xl overflow-hidden h-52" style={{ border: '1px solid var(--border-color)' }}>
              <iframe
                title="Church location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.0!2d-115.14!3d36.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c6c0e2f0c0e1%3A0x1!2s5000+Spencer+St%2C+Las+Vegas%2C+NV+89119!5e0!3m2!1sen!2sus!4v1600000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contacto */}
            <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2.5 hover:text-[#7CB342] transition-colors group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7CB342]/10 flex items-center justify-center group-hover:bg-[#7CB342]/20 transition-colors">
                  <svg className="w-4 h-4 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 hover:text-[#7CB342] transition-colors group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7CB342]/10 flex items-center justify-center group-hover:bg-[#7CB342]/20 transition-colors">
                  <svg className="w-4 h-4 text-[#7CB342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Columna derecha: formulario de oración */}
          <div>
            <PrayerForm />
          </div>
        </div>
      </div>
    </section>
  );
}
