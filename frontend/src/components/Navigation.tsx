'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/team-analysis', label: 'Team Analysis', icon: '🔍' },
    { href: '/tournament-analysis', label: 'Tournament Analysis', icon: '🏆' },
    { href: '/tournament-archive', label: 'Archive', icon: '📚' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
              <span className="text-white text-xl font-bold">🏀</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Basketball Analytics
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Men&apos;s Basketball
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium 
                  transition-all duration-200 ease-in-out
                  ${isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 