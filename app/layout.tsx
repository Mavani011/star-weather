import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ChartInit from '@/utils/ChartInit';
import Footer from '@/components/Footer';
import SearchBarWrapper from '@/components/SearchBar'; // ✅ client wrapper
import { Toaster } from 'react-hot-toast';

export const revalidate = 0;

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Star Weather',
  description:
    'An advanced weather website where users can view current weather conditions, forecasts, air quality, weather maps, and more.',
  keywords: [
    'weather',
    'forecast',
    'air quality',
    'maps',
    'star weather',
    'react',
    'nextjs',
    'typescript',
  ],
  metadataBase: new URL('http://star-weather.vercel.app'),
  openGraph: {
    images: [{ url: '/icons/icon-512x512.png' }],
  },
  manifest: '/manifest.json',
  themeColor: '#2e2e2e',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ChartInit />
        <div style={{marginBottom:"40px" , padding:"1em"}} className="mx-auto min-h-screen max-w-[86rem] p-4">
          <SearchBarWrapper />
          <div>{children}</div>
        </div>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Add this line */}
      </body>
    </html>
  );
}


