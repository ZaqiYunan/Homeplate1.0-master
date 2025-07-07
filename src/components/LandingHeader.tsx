"use client";

import Link from 'next/link';
import { HomeplateLogo } from '@/components/icons/HomeplateLogo';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export function LandingHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <HomeplateLogo className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-800">HomePlate</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Beranda
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Tentang
            </a>
            <a href="#recipes" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Resep
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Kontak
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Masuk</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Daftar</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex items-center justify-center space-x-6">
          <a href="#home" className="text-xs font-medium text-gray-600 hover:text-green-600 transition-colors">
            Beranda
          </a>
          <a href="#about" className="text-xs font-medium text-gray-600 hover:text-green-600 transition-colors">
            Tentang
          </a>
          <a href="#recipes" className="text-xs font-medium text-gray-600 hover:text-green-600 transition-colors">
            Resep
          </a>
          <a href="#contact" className="text-xs font-medium text-gray-600 hover:text-green-600 transition-colors">
            Kontak
          </a>
        </div>
      </div>
    </header>
  );
}
