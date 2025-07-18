"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, Chrome } from 'lucide-react';
import { HomeplateLogo } from '@/components/icons/HomeplateLogo';
import { Separator } from '@/components/ui/separator';

export default function SupabaseLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, signInWithGoogle } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        let description = 'Please check your credentials and try again.';
        
        if (error.message.includes('Invalid login credentials')) {
          description = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          description = 'Please check your email and click the confirmation link.';
        } else if (error.message.includes('Too many requests')) {
          description = 'Too many login attempts. Please try again later.';
        } else {
          description = error.message || 'An unexpected error occurred.';
        }
        
        toast({
          title: 'Login Failed',
          description: description,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Login Successful', description: "Welcome back!" });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        let description = 'Could not sign in with Google. Please try again.';
        
        if (error.message.includes('popup_closed_by_user')) {
          description = 'Google Sign-In was cancelled.';
        } else if (error.message.includes('access_denied')) {
          description = 'Google Sign-In was denied. Please try again.';
        } else if (error.message.includes('provider_disabled')) {
          description = 'Google Sign-In is not enabled for this project. Please contact support.';
        } else {
          description = error.message || 'An unexpected error occurred.';
        }
        
        toast({
          title: 'Google Login Failed',
          description: description,
          variant: 'destructive',
        });
      } else {
        // Note: For OAuth redirects, success handling happens after redirect
        toast({ title: 'Redirecting to Google...', description: 'Please wait while we redirect you.' });
      }
    } catch (error: any) {
      toast({
        title: 'Google Login Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <HomeplateLogo className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your HomePlate account to continue managing your recipes and nutrition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in with Email
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin} 
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              <>
                <Chrome className="mr-2 h-4 w-4 text-[#DB4437]" />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-green-600 hover:text-green-800 font-semibold">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="text-green-600 hover:text-green-800">
              ← Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
