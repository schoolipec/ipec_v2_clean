import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const ClientLayout = dynamic(() => import("./ClientLayout"), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iglesia Plenitud en Cristo",
  description: "Un lugar para crecer, pertenecer y servir",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/assets/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      {/* Script inline: aplica el tema ANTES de que React hidrate para evitar flash */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ipec-theme');if(t!=='light'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col"><ClientLayout>{children}</ClientLayout></body>
    </html>
  );
}
