import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';
import Header from '@/components/layout/Header';
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
        <Header />
        <main className="flex-1 pt-0">
          <ContactSection />
        </main>
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
