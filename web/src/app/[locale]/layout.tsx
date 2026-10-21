import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { Suspense, lazy } from 'react';
import { routing } from '@/i18n/routing';
import ThemeProvider from '@/components/ThemeProvider';
import BibleModal from '@/components/BibleModal';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Header = lazy(() => import('@/components/layout/Header'));

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === 'en') redirect('/');

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <BibleModal />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
