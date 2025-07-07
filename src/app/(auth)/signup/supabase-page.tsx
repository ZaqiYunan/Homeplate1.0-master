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
import { Loader2, UserPlus, Chrome } from 'lucide-react';
import { HomeplateLogo } from '@/components/icons/HomeplateLogo';
import { Separator } from '@/components/ui/separator';

export default function SupabaseSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signUp, signInWithGoogle } = useAuth();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        let description = 'Please check your details and try again.';
        
        if (error.message.includes('already registered')) {
          description = 'This email is already registered. Please try logging in instead.';
        } else if (error.message.includes('Invalid email')) {
          description = 'Please enter a valid email address.';
        } else if (error.message.includes('Password')) {
          description = 'Password must be at least 6 characters long.';
        } else {
          description = error.message || 'An unexpected error occurred.';
        }
        
        toast({
          title: 'Signup Failed',
          description: description,
          variant: 'destructive',
        });
      } else {
        toast({ 
          title: 'Account Created!', 
          description: "Please check your email to confirm your account before signing in." 
        });
        router.push('/login');
      }
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        let description = 'Could not sign up with Google. Please try again.';
        
        if (error.message.includes('popup_closed_by_user')) {
          description = 'Google Sign-Up was cancelled.';
        } else if (error.message.includes('access_denied')) {
          description = 'Google Sign-Up was denied. Please try again.';
        } else if (error.message.includes('provider_disabled')) {
          description = 'Google Sign-Up is not enabled for this project. Please contact support.';
        } else {
          description = error.message || 'An unexpected error occurred.';
        }
        
        toast({
          title: 'Google Signup Failed',
          description: description,
          variant: 'destructive',
        });
      } else {
        // Note: For OAuth redirects, success handling happens after redirect
        toast({ title: 'Redirecting to Google...', description: 'Please wait while we redirect you.' });
      }
    } catch (error: any) {
      toast({
        title: 'Google Signup Failed',
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
          <CardTitle className="text-2xl font-bold text-green-800">Create Account</CardTitle>
          <CardDescription>
            Join HomePlate to start managing your recipes and nutrition goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignup} className="space-y-4">
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
                minLength={6}
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create account with Email
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
            onClick={handleGoogleSignup} 
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up with Google...
              </>
            ) : (
              <>
                <Chrome className="mr-2 h-4 w-4 text-[#DB4437]" />
                Sign up with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-800 font-semibold">
              Sign in
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
