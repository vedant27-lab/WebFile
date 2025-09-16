// src/components/Footer.tsx
'use client'; // This is a client component

import Link from 'next/link';
import { IoAnalytics, IoBatteryCharging, IoFlash, IoGitNetwork } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-700 bg-gray-800">
      <div className="grid h-16 max-w-lg grid-cols-4 mx-auto font-medium">
        <Link href="/" className="inline-flex flex-col items-center justify-center px-5 text-green-400 hover:bg-gray-700">
          <IoAnalytics className="w-6 h-6 mb-1" />
          <span className="text-sm">Generation</span>
        </Link>
        <Link href="/storage" className="inline-flex flex-col items-center justify-center px-5 text-white hover:bg-gray-700 hover:text-green-400">
          <IoBatteryCharging className="w-6 h-6 mb-1" />
          <span className="text-sm">Storage</span>
        </Link>
        <Link href="/consumption" className="inline-flex flex-col items-center justify-center px-5 text-white hover:bg-gray-700 hover:text-green-400">
          <IoFlash className="w-6 h-6 mb-1" />
          <span className="text-sm">Consume</span>
        </Link>
        <Link href="/distribution" className="inline-flex flex-col items-center justify-center px-5 text-white hover:bg-gray-700 hover:text-green-400">
          <IoGitNetwork className="w-6 h-6 mb-1" />
          <span className="text-sm">Distribute</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;