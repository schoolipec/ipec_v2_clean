import { NextIntlClientProvider } from 'next-intl';
import { Suspense, lazy } from 'react';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';

const Header = lazy(() => import('@/components/layout/Header'));
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import LiveSection from '@/components/sections/LiveSection';
import GroupsSection from '@/components/sections/GroupsSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import OfferingSection from '@/components/sections/OfferingSection';
import VisionSection from '@/components/sections/VisionSection';
import SocialSection from '@/components/sections/SocialSection';
import enMessages from '@/i18n/messages/en.json';
import ScrollToTop from '@/components/ScrollToTop';
import WaveDivider from '@/components/ui/WaveDivider';

export default function RootPage() {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ThemeProvider>
        <BibleModal />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="flex-1">
          <HeroSection />
          {/* Transición: hero oscuro (#082942) → LiveSection (#061828) */}
          <WaveDivider variant="blue-dark" />
          <LiveSection />
          {/* Transición: LiveSection oscuro (#061828) → contenido con bg-alt */}
          <WaveDivider variant="dark-blue" flip />
          <GroupsSection />
          <AboutSection />
          <ContactSection />
          <OfferingSection />
          <VisionSection />
          {/* Transición: bg-alt (#0a2240 en dark) → Footer (#061828) */}
          <SocialSection />
          <WaveDivider variant="blue-dark" />
        </main>
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
