import { Suspense, lazy } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';
const Header = lazy(() => import('@/components/layout/Header'));
import Footer from '@/components/layout/Footer';
import ContactSection from '@/components/sections/ContactSection';
import enMessages from '@/i18n/messages/en.json';

export const metadata = {
  title: 'Contact — Iglesia Plenitud en Cristo',
};

export default function ContactPage() {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ThemeProvider>
        <BibleModal />
        <Suspense fallback={null}>
        <Header />
      </Suspense>
        <main className="flex-1 pt-0">
          <ContactSection />
        </main>
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
