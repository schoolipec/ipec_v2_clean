import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';
import Header from '@/components/layout/Header';
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
        <Header />
        <main className="flex-1 pt-0">
          <AboutSection />
        </main>
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
