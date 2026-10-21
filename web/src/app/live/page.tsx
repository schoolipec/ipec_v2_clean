import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LiveSection from '@/components/sections/LiveSection';
import enMessages from '@/i18n/messages/en.json';

export const metadata = {
  title: 'Live — Iglesia Plenitud en Cristo',
};

export default function LivePage() {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ThemeProvider>
        <BibleModal />
        <Header />
        <main className="flex-1 pt-0" style={{ background: '#061828' }}>
          <LiveSection />
        </main>
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
