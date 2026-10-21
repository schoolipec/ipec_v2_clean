import { setRequestLocale } from 'next-intl/server';
import LiveSection from '@/components/sections/LiveSection';

export default async function LivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div style={{ background: '#061828' }}>
      <LiveSection />
    </div>
  );
}
