'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'ADMIN';
  const pathname = usePathname();
  const isRoot = pathname === '/';

  useEffect(() => {
    if (!isRoot) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isRoot]);

  const linkColor = isRoot
    ? isScrolled
      ? 'text-black'
      : 'text-white'
    : 'text-black';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : isRoot ? 'bg-transparent py-4' : 'bg-white py-2'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link href={isAuthenticated ? '/home' : '/'} className="flex items-center space-x-2">
          <span className={`text-2xl font-bold font-display ${linkColor}`}>AdoptAPaw</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href={isAuthenticated ? '/home' : '/'} className={`nav-link ${linkColor}`}>
            Home
          </Link>
          <Link href="#about" className={`nav-link ${linkColor}`}>
            About
          </Link>
          <Link href="#how-it-works" className={`nav-link ${linkColor}`}>
            How It Works
          </Link>
          <Link href="#contact" className={`nav-link ${linkColor}`}>
            Contact
          </Link>

          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className={`flex items-center space-x-2 hover:text-primary-600 ${linkColor}`}
              >
                <FiUser className="h-5 w-5" />
                <span className="font-medium">{session.user.name?.split(' ')[0] || 'User'}</span>
              </button>

              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Account Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className={`text-gray-700`}>
            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto py-4 space-y-4">
            <Link href={isAuthenticated ? '/home' : '/'} className="block nav-link py-2 text-gray-800">
              Home
            </Link>
            <Link href="#about" className="block nav-link py-2 text-gray-800">
              About
            </Link>
            <Link href="#how-it-works" className="block nav-link py-2 text-gray-800">
              How It Works
            </Link>
            <Link href="#contact" className="block nav-link py-2 text-gray-800">
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="block nav-link py-2 text-gray-800">
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/settings" className="block nav-link py-2 text-gray-800">
                  Account Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 py-2"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/auth/login" className="btn-secondary text-center">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
