"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { Mail, Send, Clock } from 'lucide-react';

export function ManualNotificationTrigger() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);

  const triggerNotifications = async () => {
    if (!user) return;

    setIsSending(true);
    try {
      console.log('🚀 Triggering notifications...');
      
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('expiry-notifications', {
        body: { manualTrigger: true }
      });

      console.log('📤 Function response:', { data, error });

      if (error) {
        console.error('❌ Function error:', error);
        
        // Handle FunctionsHttpError with detailed error information
        if (error instanceof FunctionsHttpError) {
          console.log('Edge Function Error Details:', error);
          try {
            const errorMessage = await error.context.json();
            console.log('Function returned an error:', errorMessage);
            toast({
              title: "Edge Function Error",
              description: `Function error: ${errorMessage.error || 'Unknown error'}. Check browser console for details.`,
              variant: "destructive"
            });
          } catch (jsonError) {
            // If we can't parse the error as JSON, show the original error
            toast({
              title: "Edge Function Error", 
              description: `Function failed: ${error.message}. Check browser console for details.`,
              variant: "destructive"
            });
          }
          return;
        }
        
        throw error;
      }

      setLastSent(new Date());
      toast({
        title: "Notifications Triggered",
        description: data?.message || `${data?.emailsSent || 0} notifications processed`,
      });

      // If no emails were sent, show debug info
      if (data?.emailsSent === 0) {
        toast({
          title: "No Emails Sent",
          description: "Check that you have ingredients expiring within 3 days and notifications enabled",
          variant: "default"
        });
      }

    } catch (error) {
      console.error('Error triggering notifications:', error);
      
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Error",
        description: `Failed to send notifications: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5" />
          Manual Notification Trigger
        </CardTitle>
        <CardDescription>
          Send expiry notifications immediately for testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={triggerNotifications}
          disabled={isSending}
          className="w-full"
        >
          <Mail className="mr-2 h-4 w-4" />
          {isSending ? 'Sending...' : 'Send Notifications Now'}
        </Button>
        
        {lastSent && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            Last sent: {lastSent.toLocaleTimeString()}
          </div>
        )}
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This will send notifications to all users with expiring ingredients 
            who have email notifications enabled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
