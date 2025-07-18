"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface DatabaseStatus {
  notification_preferences: { exists: boolean; error?: string };
  stored_ingredients: { exists: boolean; error?: string };
  notification_log: { exists: boolean; error?: string };
}

export function DatabaseStatusChecker() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDatabaseStatus = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-database');
      const result = await response.json();
      
      if (result.success) {
        setStatus(result.tables);
      } else {
        setError(result.error || 'Failed to check database status');
      }
    } catch (err) {
      setError('Failed to connect to database API');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (exists: boolean, error?: string) => {
    if (error) return <XCircle className="h-5 w-5 text-red-500" />;
    return exists ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = (exists: boolean, error?: string) => {
    if (error) return 'Error';
    return exists ? 'Exists' : 'Missing';
  };

  const allTablesExist = status && 
    status.notification_preferences.exists && 
    status.stored_ingredients.exists && 
    status.notification_log.exists;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Database Status Checker
        </CardTitle>
        <CardDescription>
          Check if the email notification system database tables are set up correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkDatabaseStatus} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Database Status'
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status && (
          <div className="space-y-3">
            <h4 className="font-medium">Database Tables:</h4>
            
            {Object.entries(status).map(([tableName, tableStatus]) => (
              <div key={tableName} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-mono text-sm">{tableName}</span>
                <div className="flex items-center">
                  {getStatusIcon(tableStatus.exists, tableStatus.error)}
                  <span className="ml-2 text-sm">
                    {getStatusText(tableStatus.exists, tableStatus.error)}
                  </span>
                </div>
              </div>
            ))}

            {allTablesExist ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ✅ All required tables exist! The notification system should work properly.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  ❌ Some tables are missing. Please run the email-notification-setup.sql file in your Supabase dashboard.
                  <br /><br />
                  <strong>Steps:</strong>
                  <br />1. Go to: https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/sql
                  <br />2. Copy contents from email-notification-setup.sql
                  <br />3. Paste and run the SQL
                  <br />4. Check status again
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
