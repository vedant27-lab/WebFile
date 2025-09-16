// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { IoGrid, IoNotifications, IoPersonCircle, IoSettings, IoHardwareChip } from 'react-icons/io5'; // Add IoHardwareChip

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <IoGrid className="text-green-400" />
          <span>MicroGrid</span>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-6 text-2xl">
          <Link href="/devices" className="hover:text-green-400"> {/* NEW LINK */}
            <IoHardwareChip />
          </Link>
          <button className="hover:text-green-400">
            <IoNotifications />
          </button>
          <Link href="/profile" className="hover:text-green-400">
            <IoPersonCircle />
          </Link>
          <Link href="/settings" className="hover:text-green-400">
            <IoSettings />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;