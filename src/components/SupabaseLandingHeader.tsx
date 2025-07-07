"use client";

import Link from 'next/link';
import { HomeplateLogo } from '@/components/icons/HomeplateLogo';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, LayoutDashboard, LogOut, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SupabaseLandingHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Logged Out', description: "You've been successfully logged out." });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: "Could not log out. Please try again.", variant: 'destructive' });
    }
  };

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

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <UserCircle2 size={18} />
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
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
