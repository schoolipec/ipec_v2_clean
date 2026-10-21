import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#061828] dark:bg-[#030e1a] text-white py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
        <Image
          src="/assets/logo-dark.png"
          alt="Iglesia Plenitud en Cristo"
          width={640}
          height={640}
          className="h-28 w-auto"
        />
        <p className="text-sm text-white/70">5000 Spencer St, Las Vegas, NV 89119</p>
        <p className="text-sm text-white/70">702 328 2536</p>
        <small className="text-xs text-white/40 mt-2">{t('copyright')}</small>
      </div>
    </footer>
  );
}
