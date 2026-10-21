import { Suspense, lazy } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';
const Header = lazy(() => import('@/components/layout/Header'));
import Footer from '@/components/layout/Footer';
import AboutSection from '@/components/sections/AboutSection';
import enMessages from '@/i18n/messages/en.json';

export const metadata = {
  title: 'Conócenos — Iglesia Plenitud en Cristo',
};

export default function AboutPage() {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ThemeProvider>
        <BibleModal />
        <Suspense fallback={null}>
        <Header />
      </Suspense>
        <main className="flex-1 pt-0">
          <AboutSection />
        </main>
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
