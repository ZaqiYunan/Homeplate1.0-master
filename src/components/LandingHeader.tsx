"use client";

import Link from 'next/link';
import { HomeplateLogo } from '@/components/icons/HomeplateLogo';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
          <HomeplateLogo className="h-8 w-8" />
          <span>HomePlate</span>
        </Link>
        
        {/* Center navigation */}
        <nav className="flex items-center space-x-6">
          <a href="#home" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
            Home
          </a>
          <a href="#about" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
            About
          </a>
          <a href="#recipes" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
            Recipes
          </a>
          <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
            Contact
          </a>
        </nav>
        
        {/* Auth buttons */}
        <div className="flex items-center space-x-2">
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium"
          >
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button
            asChild
            className="text-sm font-medium bg-green-600 hover:bg-green-700"
          >
            <Link href="/signup">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
