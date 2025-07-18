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

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signUp, signInWithGoogle } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters long.', variant: 'destructive' });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        let description = 'Please try again.';
        
        if (error.message.includes('User already registered')) {
          description = 'This email is already registered. Try logging in instead.';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          description = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Unable to validate email address')) {
          description = 'Please enter a valid email address.';
        } else if (error.message.includes('Signup is disabled')) {
          description = 'New signups are currently disabled. Please contact support.';
        } else {
          description = error.message || 'An unexpected error occurred.';
        }
        
        toast({
          title: 'Signup Failed',
          description: description,
          variant: 'destructive',
        });
      } else {
        // Check if user was created but needs email confirmation
        if (data?.user && !data.session) {
          toast({ 
            title: 'Signup Successful!', 
            description: 'Please check your email and click the confirmation link to complete your registration. After confirming, you can sign in.' 
          });
          // Don't redirect immediately, wait for email confirmation
        } else if (data?.session) {
          toast({ 
            title: 'Signup Successful!', 
            description: 'Your account has been created and you are now signed in.' 
          });
          router.push('/dashboard');
        } else {
          toast({ 
            title: 'Signup Successful!', 
            description: 'Your account has been created. You can now sign in.' 
          });
          // Redirect to login page for immediate sign in
          setTimeout(() => {
            router.push('/login');
          }, 1000);
        }
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
          description = 'Google Sign-In is not enabled for this project. Please contact support.';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 p-4">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6 shadow-lg">
              <HomeplateLogo className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">HomePlate</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Join thousands of home cooks discovering amazing recipes and managing their kitchen like a pro
            </p>
          </div>

          {/* Signup Card */}
          <Card className="relative overflow-hidden bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200/50">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400 to-green-400 rounded-full translate-y-12 -translate-x-12 opacity-10"></div>
            
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Start your culinary adventure today
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Benefits */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">What you'll get:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Personalized Recipes</p>
                        <p className="text-sm text-gray-600">Get recipe recommendations based on your preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Smart Inventory</p>
                        <p className="text-sm text-gray-600">Track ingredients and reduce food waste</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Nutrition Insights</p>
                        <p className="text-sm text-gray-600">Monitor your nutritional goals effortlessly</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="space-y-6">
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                        disabled={isLoading || isGoogleLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                        disabled={isLoading || isGoogleLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                        disabled={isLoading || isGoogleLoading}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]" 
                      disabled={isLoading || isGoogleLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Creating Your Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-3 h-6 w-6" />
                          Join HomePlate Now
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
                    onClick={handleGoogleSignup}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Chrome className="mr-3 h-6 w-6 text-[#DB4437]" />
                        Sign up with Google
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-800 underline transition-colors">
                        Sign in instead
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="text-center px-8 pb-8">
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-gray-700">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
