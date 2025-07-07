import type { ReactNode } from "react";
import { AppProvider } from '@/contexts/SupabaseAppContext';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { SupabaseHeader } from '@/components/SupabaseHeader';
import { Toaster } from "@/components/ui/toaster";

export default function SupabaseAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <SupabaseHeader />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
          <footer className="py-6 text-center text-sm text-muted-foreground border-t">
              Built with Fresh Ideas & AI. &copy; {new Date().getFullYear()} Homeplate.
          </footer>
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
