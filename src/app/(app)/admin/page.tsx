"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/SupabaseAppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2, Users, FileText, Settings, ShieldAlert, BarChart3, Bug, Shield, UserCog, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ManualNotificationTrigger } from '@/components/ManualNotificationTrigger';
import { DatabaseStatusChecker } from '@/components/DatabaseStatusChecker';

interface UserData {
  user_id: string;
  email: string;
  role: 'user' | 'admin';
  height: number;
  weight: number;
  created_at: string;
  has_profile?: boolean;
  users: {
    email: string;
    created_at: string;
  };
}

interface AdminRpcResponse {
  user_id: string;
  email: string;
  created_at: string;
  role: 'user' | 'admin';
  height: number;
  weight: number;
  profile_created_at: string;
  has_profile: boolean;
}

const AdminStatCard = ({ title, value, description, icon: Icon, actionText, onClick }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ElementType; 
  actionText: string;
  onClick?: () => void;
}) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
      <Button 
        className="mt-4 w-full" 
        variant="outline" 
        onClick={onClick}
        disabled={!onClick}
      >
        {actionText}
      </Button>
    </CardContent>
  </Card>
);

const DatabaseSetupStatus = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Database Setup Required
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-medium mb-2">⚠️ Admin Functions Missing</p>
        <p className="text-yellow-700 text-sm">
          The admin dashboard requires additional database setup. The system is currently running in fallback mode.
        </p>
      </div>
      
      <p className="text-muted-foreground">
        Please follow these steps to enable full admin functionality:
      </p>
      
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Setup Steps:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Go to your <strong>Supabase project dashboard</strong></li>
          <li>Navigate to <strong>SQL Editor</strong></li>
          <li>Copy the contents of <code className="bg-slate-200 px-1 rounded">supabase-complete-setup.sql</code> (from your project files)</li>
          <li>Paste and <strong>run the SQL script</strong></li>
          <li>Make yourself an admin user:
            <pre className="bg-slate-200 p-2 rounded mt-1 text-xs overflow-x-auto font-mono">
UPDATE user_profiles SET role = 'admin' WHERE user_id = 'YOUR_USER_ID';
            </pre>
          </li>
          <li>Click "Test Connection" below</li>
        </ol>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          <strong>💡 Tip:</strong> To find your user ID, check the browser console or Supabase auth.users table.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onRetry} variant="outline">
          Test Connection
        </Button>
        <Button 
          onClick={() => window.open('https://app.supabase.com', '_blank')}
          variant="default"
        >
          Open Supabase Dashboard
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function AdminPage() {
  const { userProfile, isContextLoading, updateUserRole } = useAppContext();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [setupStatus, setSetupStatus] = useState<{
    tested: boolean;
    success: boolean;
    hasRpcFunction?: boolean;
    isAdmin?: boolean;
    error?: string;
  }>({ tested: false, success: false });

  // Test database connectivity and setup
  const testDatabaseSetup = async () => {
    try {
      console.log('Testing database setup...');
      
      // First test: Check if user_profiles table exists and is accessible
      const { data: profileTest, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, role')
        .limit(1);
      
      if (profileError) {
        console.error('user_profiles table test failed:', profileError);
        return { success: false, error: 'user_profiles_access' };
      }
      
      // Second test: Check if RPC function exists
      const { data: rpcTest, error: rpcError } = await supabase
        .rpc('get_users_for_admin');
      
      if (rpcError) {
        console.log('RPC Error Details:', rpcError);
        
        if (rpcError.code === 'PGRST202' || 
            rpcError.message?.includes('function') ||
            Object.keys(rpcError).length === 0) { // Empty error object means function doesn't exist
          console.log('RPC function not found, but basic table access works');
          return { success: true, hasRpcFunction: false };
        }
        
        if (rpcError.message?.includes('Access denied')) {
          console.log('RPC function exists but user is not admin');
          return { success: true, hasRpcFunction: true, isAdmin: false };
        }
        
        console.error('RPC function test failed:', rpcError);
        return { success: false, error: 'rpc_function_error' };
      }
      
      console.log('Database setup test passed');
      return { success: true, hasRpcFunction: true, isAdmin: true };
      
    } catch (error) {
      console.error('Database setup test failed:', error);
      return { success: false, error: 'connection_failed' };
    }
  };

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      console.log('Attempting to fetch users with RPC function...');
      console.log('Current user context:', { users, userProfile });
      
      let data = null;
      let error = null;
      
      try {
        const response = await supabase.rpc('get_users_for_admin');
        data = response.data;
        error = response.error;
      } catch (rpcError) {
        console.warn('RPC call failed with exception:', rpcError);
        error = rpcError;
      }

      console.log('RPC Response:', { data, error });
      console.log('RPC Error full object:', error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : 'null');

      if (error) {
        // Type the error object properly
        const typedError = error as any;
        
        // Log error details for debugging but don't throw
        console.warn('Supabase RPC Error Details:', {
          code: typedError?.code || 'No code',
          message: typedError?.message || 'No message',
          details: typedError?.details || 'No details',
          hint: typedError?.hint || 'No hint',
          fullError: error,
          errorType: typeof error,
          errorKeys: error ? Object.keys(error) : [],
          errorValues: error ? Object.values(error) : []
        });
        
        // Enhanced error detection
        const isEmptyError = !error || Object.keys(error).length === 0 || 
                           (!typedError.code && !typedError.message && !typedError.details);
        const isFunctionNotFound = typedError?.code === 'PGRST202' || 
                                 typedError?.message?.includes('function') || 
                                 typedError?.message?.includes('does not exist');
        const isAccessDenied = typedError?.message?.includes('Access denied') || 
                             typedError?.message?.includes('Admin privileges required') ||
                             typedError?.message?.includes('permission denied');
        
        console.log('Error analysis:', {
          isEmptyError,
          isFunctionNotFound,
          isAccessDenied,
          userRole: userProfile?.role
        });
        
        // Handle specific error cases
        if (isFunctionNotFound || isEmptyError) {
          console.log('RPC function does not exist or empty error, using fallback method...');
          try {
            return await fetchUsersBasic();
          } catch (fallbackError) {
            console.error('Fallback method also failed:', fallbackError);
            setUsers([]);
            setFilteredUsers([]);
            return;
          }
        }
        
        if (isAccessDenied) {
          console.log('Access denied - user is not admin');
          setUsers([]);
          setFilteredUsers([]);
          return;
        }
        
        // For any other error, try fallback
        console.log('Unknown RPC error, trying fallback...');
        try {
          return await fetchUsersBasic();
        } catch (fallbackError) {
          console.error('Fallback method also failed:', fallbackError);
          setUsers([]);
          setFilteredUsers([]);
          return;
        }
      }
      
      // Transform the data to match our expected structure
      const usersData = (data as AdminRpcResponse[])?.map((user: AdminRpcResponse) => ({
        user_id: user.user_id,
        email: user.email || 'No email',
        created_at: user.profile_created_at || user.created_at,
        role: user.role || 'user',
        height: user.height || 0,
        weight: user.weight || 0,
        has_profile: user.has_profile,
        users: {
          email: user.email || 'No email',
          created_at: user.created_at
        }
      })) || [];
      
      console.log(`Successfully processed ${usersData.length} users data:`, usersData);
      
      // Count users with and without profiles
      const withProfiles = (data as AdminRpcResponse[])?.filter(u => u.has_profile).length || 0;
      const withoutProfiles = usersData.length - withProfiles;
      
      if (withoutProfiles > 0) {
        console.log(`📊 User Statistics: ${withProfiles} with profiles, ${withoutProfiles} without profiles`);
      }
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      console.log('Attempting fallback method due to unexpected error...');
      try {
        await fetchUsersBasic();
      } catch (fallbackError) {
        console.error('Both main and fallback methods failed:', { error, fallbackError });
        setUsers([]);
        setFilteredUsers([]);
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fallback method to fetch users directly from user_profiles table
  const fetchUsersBasic = async () => {
    try {
      console.log('Using fallback method to fetch users...');
      
      // First try to get all user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error('Fallback query error:', profileError);
        throw profileError;
      }
      
      // Note: This fallback only shows users with profiles
      // In a production system, you'd want access to auth.users too
      const usersData = profiles?.map((profile: any) => ({
        user_id: profile.user_id,
        email: profile.email || `User ${profile.user_id.substring(0, 8)}...`, // Use actual email if available
        created_at: profile.created_at,
        role: profile.role || 'user',
        height: profile.height || 0,
        weight: profile.weight || 0,
        has_profile: true, // All users in this fallback have profiles by definition
        users: {
          email: profile.email || `User ${profile.user_id.substring(0, 8)}...`,
          created_at: profile.created_at
        }
      })) || [];
      
      console.log('Fallback users data (profiles only):', usersData);
      
      // Show warning that not all users may be visible
      if (usersData.length >= 0) {
        console.warn(`⚠️ FALLBACK MODE: Only showing ${usersData.length} users with completed profiles.`);
        console.warn('📋 To see ALL authenticated users (including those without profiles):');
        console.warn('1. Go to your Supabase dashboard');
        console.warn('2. Navigate to SQL Editor');
        console.warn('3. Run the SQL from supabase-admin-functions.sql');
        console.warn('4. This will create the get_users_for_admin() function');
      }
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Fallback fetch also failed:', error);
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Fetch users on component mount
  useEffect(() => {
    if (userProfile.role === 'admin') {
      // Test database setup first
      testDatabaseSetup().then(status => {
        setSetupStatus({ tested: true, ...status });
        
        if (status.success) {
          fetchUsers();
        }
      });
    } else if (userProfile.role === 'user') {
      // User is not admin
      setSetupStatus({ 
        tested: true, 
        success: false, 
        isAdmin: false,
        error: 'not_admin' 
      });
    }
  }, [userProfile.role]);

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    await updateUserRole(userId, newRole);
    await fetchUsers(); // Refresh the user list
    setSelectedUser(null);
  };

  // Retry setup function
  const retrySetup = async () => {
    setSetupStatus({ tested: false, success: false });
    const status = await testDatabaseSetup();
    setSetupStatus({ tested: true, ...status });
    
    if (status.success) {
      fetchUsers();
    }
  };

  if (isContextLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
        <Card className="max-w-md w-full p-8 shadow-2xl bg-card">
          <ShieldAlert className="mx-auto h-20 w-20 text-destructive mb-6" />
          <h1 className="text-3xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2 mb-6">You do not have the necessary permissions to view this page. Please contact an administrator if you believe this is an error.</p>
          <Button onClick={() => router.replace('/dashboard')} size="lg">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Show loading while testing database setup
  if (!setupStatus.tested) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Testing database setup...</p>
        </div>
      </div>
    );
  }

  // Show database setup guide if there are issues
  if (!setupStatus.success) {
    return <DatabaseSetupStatus onRetry={retrySetup} />;
  }

  const adminCards = [
    { 
      title: "Total Users", 
      value: users.length.toString(), 
      description: users.every(u => u.has_profile) ? "Users with profiles" : "All authenticated users", 
      icon: Users, 
      actionText: "Manage Users",
      onClick: () => setActiveTab('users')
    },
    { 
      title: "Complete Profiles", 
      value: users.filter(u => u.has_profile).length.toString(), 
      description: "Users with complete profiles", 
      icon: UserCog, 
      actionText: "View Profiles",
      onClick: () => setActiveTab('users')
    },
    { 
      title: "Admin Users", 
      value: users.filter(u => u.role === 'admin').length.toString(), 
      description: "Users with admin privileges", 
      icon: Shield, 
      actionText: "View Admins",
      onClick: () => setActiveTab('users')
    },
    { 
      title: "System Health", 
      value: "Operational", 
      description: "Database and API status", 
      icon: BarChart3, 
      actionText: "View Status"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome, Admin. Here you can manage users, content, and application settings.
        </p>
      </div>

      {/* Warning banner when using fallback method */}
      {users.length > 0 && users.every(u => u.has_profile) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Limited User Data
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Currently showing only users with completed profiles ({users.length} users). 
                  To see ALL authenticated users (including those who signed up but haven't completed their profile):
                </p>
                <ol className="mt-2 list-decimal list-inside space-y-1">
                  <li>Go to your Supabase dashboard → SQL Editor</li>
                  <li>Run the SQL code from <code className="bg-yellow-100 px-1 rounded">supabase-admin-functions.sql</code></li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {adminCards.map(card => (
              <AdminStatCard key={card.title} {...card} />
            ))}
          </div>
          
          {/* Debug Section */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Bug className="h-5 w-5" />
                Admin Debug Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div>Current User ID: <code className="bg-gray-100 px-1 rounded">{users?.length > 0 ? 'Available' : 'Not logged in'}</code></div>
                <div>Current User Role: <code className="bg-gray-100 px-1 rounded">{userProfile?.role || 'No profile'}</code></div>
                <div>Users Shown: <code className="bg-gray-100 px-1 rounded">{users.length}</code></div>
                <div>Using Method: <code className="bg-gray-100 px-1 rounded">
                  {users.length > 0 ? 'RPC or Basic' : 'Unknown'}
                </code></div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    console.log('=== MANUAL RPC TEST ===');
                    try {
                      const { data, error } = await supabase.rpc('get_users_for_admin');
                      console.log('Manual RPC Result:', { data, error });
                      console.log('Manual RPC Error Details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                    } catch (e) {
                      console.error('Manual RPC Exception:', e);
                    }
                  }}
                >
                  Test RPC Function
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchUsers()}
                >
                  Refresh Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                User Management
              </CardTitle>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Profile Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.has_profile ? 'default' : 'outline'}>
                            {user.has_profile ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage User: {user.email}</DialogTitle>
                                <DialogDescription>
                                  Update user role and permissions.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="role" className="text-right">Role</Label>
                                  <Select
                                    value={user.role}
                                    onValueChange={(value: 'user' | 'admin') => 
                                      handleUpdateUserRole(user.user_id, value)
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <DatabaseStatusChecker />
          <ManualNotificationTrigger />
        </TabsContent>
      </Tabs>
    </div>
  );
}
