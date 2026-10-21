import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/sections/HeroSection';
import LiveSection from '@/components/sections/LiveSection';
import GroupsSection from '@/components/sections/GroupsSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import OfferingSection from '@/components/sections/OfferingSection';
import VisionSection from '@/components/sections/VisionSection';
import SocialSection from '@/components/sections/SocialSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <LiveSection />
      <GroupsSection />
      <AboutSection />
      <ContactSection />
      <OfferingSection />
      <VisionSection />
      <SocialSection />
    </>
  );
}
