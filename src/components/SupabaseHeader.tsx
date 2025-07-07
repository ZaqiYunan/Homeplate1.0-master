"use client";

import Link from 'next/link';
import { HomeplateLogo } from '@/components/icons/HomeplateLogo';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChefHat, Warehouse, LogIn, LogOut, UserPlus, UserCircle2, LayoutDashboard, HeartPulse, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAppContext } from '@/contexts/SupabaseAppContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SupabaseHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { userProfile } = useAppContext();
  const { toast } = useToast();

  // Check if we're on the landing page
  const isLandingPage = pathname === '/';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, protected: true },
    { href: '/recipes', label: 'Recipes Finder', icon: <ChefHat size={18} />, protected: true },
    { href: '/storage', label: 'Storage', icon: <Warehouse size={18} />, protected: true },
    { href: '/nutrition', label: 'Nutrition', icon: <HeartPulse size={18} />, protected: true },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Logged Out', description: "You've been successfully logged out." });
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: "Could not log out. Please try again.", variant: 'destructive' });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <HomeplateLogo className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-800">HomePlate</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              (isLandingPage || !item.protected || user) && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors",
                    pathname === item.href && "text-green-600"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
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
                  <DropdownMenuItem onClick={() => router.push('/nutrition')}>
                    <HeartPulse className="mr-2 h-4 w-4" />
                    Nutrition Profile
                  </DropdownMenuItem>
                  {userProfile?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                  <Link href="/signup">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {(isLandingPage || user) && (
          <div className="md:hidden mt-4 flex items-center justify-center space-x-4">
            {navItems.map((item) => (
              (isLandingPage || !item.protected || user) && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center space-y-1 text-xs font-medium text-gray-600 hover:text-green-600 transition-colors",
                    pathname === item.href && "text-green-600"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
