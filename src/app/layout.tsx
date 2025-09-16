// src/app/layout.tsx
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Your Tailwind CSS styles
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MicroGrid Dashboard',
  description: 'Real-time microgrid monitoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Toaster position='top-center' />
        <Header />
        <main className="pb-20 pt-4"> {/* Padding to prevent content from hiding behind navbars */}
          {children} {/* This is where your page content will go */}
        </main>
        <Footer />
      </body>
    </html>
  );
}