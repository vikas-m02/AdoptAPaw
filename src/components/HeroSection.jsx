'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-600"></div>
      </div>
      
      <div className="container-custom z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Find Your Perfect<br />
            <span className="text-secondary-300">Furry Companion</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Every dog deserves a loving home. Join our community and adopt a paw today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-lg py-3 px-8">
              Adopt Now
            </Link>
            <Link href="#how-it-works" className="btn-secondary bg-white/90 text-lg py-3 px-8">
              How It Works
            </Link>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link href="#about" className="flex flex-col items-center text-white">
          <span className="text-sm mb-2">Learn More</span>
          <svg 
            className="w-6 h-6 animate-bounce-slow" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}