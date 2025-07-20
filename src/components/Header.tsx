
"use client";

import Link from 'next/link';
import { HomeplateLogo } from '@/components/icons/HomeplateLogo';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChefHat, Warehouse, LogIn, LogOut, UserPlus, UserCircle2, LayoutDashboard, HeartPulse } from 'lucide-react';
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

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { userProfile } = useAppContext();
  const { toast } = useToast();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/recipes', label: 'Recipes Finder', icon: <ChefHat size={18} /> },
    { href: '/storage', label: 'Storage', icon: <Warehouse size={18} /> },
    { href: '/nutrition', label: 'Nutrition', icon: <HeartPulse size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Logged Out', description: "You've been successfully logged out." });
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: 'Logout Failed', description: "Could not log out. Please try again.", variant: 'destructive' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
          <HomeplateLogo className="h-8 w-8" />
          <span>HomePlate</span>
        </Link>
        
        {/* Center navigation - always visible */}
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          
          {/* Admin link - only show for admin users */}
          {user && userProfile?.role === 'admin' && (
            <Link
              href="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === '/admin' ? "text-primary" : "text-muted-foreground"
              )}
            >
              Admin
            </Link>
          )}
        </nav>
        
        {/* Right side buttons */}
        <div className="flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                  <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
                className="text-sm font-medium"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                className="text-sm font-medium bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}