'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/team-analysis', label: 'Team Analysis', icon: '🔍' },
    { href: '/team-analysis-individual', label: 'Individual Team', icon: '🏀' },
    { href: '/march-madness', label: 'March Madness', icon: '🏆' },
    { href: '/tournament-archive', label: 'Archive', icon: '📚' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer" onClick={closeMobileMenu}>
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
              <span className="text-white text-lg sm:text-xl font-bold">🏀</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Basketball Analytics
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Men&apos;s Basketball
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                Basketball Analytics
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-2">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium 
                    transition-all duration-200 ease-in-out w-full
                    ${isActive(item.href)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 