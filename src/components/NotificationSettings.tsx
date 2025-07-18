"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { Mail, Clock, Bell } from 'lucide-react';

interface NotificationPreferences {
  email_notifications_enabled: boolean;
  expiry_reminder_days: number;
  notification_time: string;
}

export function NotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications_enabled: true,
    expiry_reminder_days: 3,
    notification_time: '09:00:00'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          email_notifications_enabled: data.email_notifications_enabled ?? true,
          expiry_reminder_days: data.expiry_reminder_days ?? 3,
          notification_time: data.notification_time ?? '09:00:00'
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications_enabled: preferences.email_notifications_enabled ?? true,
          expiry_reminder_days: preferences.expiry_reminder_days ?? 3,
          notification_time: preferences.notification_time ?? '09:00:00'
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        // Check if it's a table not found error
        if (error.message.includes('relation "notification_preferences" does not exist')) {
          toast({
            title: "Database Setup Required",
            description: "Please run the email-notification-setup.sql file in your Supabase dashboard first",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated"
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testNotification = async () => {
    try {
      // Call our Edge Function to test email notification
      const { data, error } = await supabase.functions.invoke('expiry-notifications', {
        body: { testMode: true, userId: user?.id }
      });

      if (error) {
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
        
        // Handle other types of errors
        throw error;
      }

      toast({
        title: "Test Email Sent",
        description: "Check your email for a test notification"
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how and when you receive expiry reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive email alerts for expiring ingredients
            </p>
          </div>
          <Switch
            checked={preferences.email_notifications_enabled}
            onCheckedChange={(checked) =>
              setPreferences(prev => ({ ...prev, email_notifications_enabled: checked }))
            }
          />
        </div>

        {/* Reminder Days Selection */}
        <div className="space-y-2">
          <Label className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Reminder Timing
          </Label>
          <Select
            value={preferences.expiry_reminder_days?.toString() || "3"}
            onValueChange={(value) =>
              setPreferences(prev => ({ ...prev, expiry_reminder_days: parseInt(value) }))
            }
            disabled={!preferences.email_notifications_enabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reminder timing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day before expiry</SelectItem>
              <SelectItem value="2">2 days before expiry</SelectItem>
              <SelectItem value="3">3 days before expiry</SelectItem>
              <SelectItem value="5">5 days before expiry</SelectItem>
              <SelectItem value="7">1 week before expiry</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            You'll receive notifications when ingredients are expiring within this timeframe
          </p>
        </div>

        {/* Notification Time Selection */}
        <div className="space-y-2">
          <Label>Preferred Time</Label>
          <Select
            value={preferences.notification_time || "09:00:00"}
            onValueChange={(value) =>
              setPreferences(prev => ({ ...prev, notification_time: value }))
            }
            disabled={!preferences.email_notifications_enabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="07:00:00">7:00 AM</SelectItem>
              <SelectItem value="08:00:00">8:00 AM</SelectItem>
              <SelectItem value="09:00:00">9:00 AM</SelectItem>
              <SelectItem value="10:00:00">10:00 AM</SelectItem>
              <SelectItem value="12:00:00">12:00 PM</SelectItem>
              <SelectItem value="18:00:00">6:00 PM</SelectItem>
              <SelectItem value="19:00:00">7:00 PM</SelectItem>
              <SelectItem value="20:00:00">8:00 PM</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Daily notifications will be sent around this time
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={savePreferences} 
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
          <Button 
            variant="outline" 
            onClick={testNotification}
            disabled={!preferences.email_notifications_enabled}
          >
            Send Test Email
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Daily checks for expiring ingredients</li>
            <li>• One email per day with all expiring items</li>
            <li>• No duplicate notifications for the same item</li>
            <li>• Automatically stops when items are used or expired</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
