
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

interface UserData {
  id: string;
  email: string;
  created_at: string;
  profiles: {
    role: 'user' | 'admin';
    height: number;
    weight: number;
  } | null;
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

export default function AdminPage() {
  const { userProfile, isContextLoading, updateUserRole } = useAppContext();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          created_at,
          profiles:user_profiles(role, height, weight)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const usersData = data as unknown as UserData[];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
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
      fetchUsers();
    }
  }, [userProfile.role]);

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    await updateUserRole(userId, newRole);
    await fetchUsers(); // Refresh the user list
    setSelectedUser(null);
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

  const adminCards = [
    { 
      title: "User Management", 
      value: users.length.toString(), 
      description: "Total registered users", 
      icon: Users, 
      actionText: "Manage Users",
      onClick: () => setActiveTab('users')
    },
    { 
      title: "Admin Users", 
      value: users.filter(u => u.profiles?.role === 'admin').length.toString(), 
      description: "Users with admin privileges", 
      icon: Shield, 
      actionText: "View Admins",
      onClick: () => setActiveTab('users')
    },
    { 
      title: "Content Overview", 
      value: "N/A", 
      description: "Recipes & Ingredients", 
      icon: FileText, 
      actionText: "View Content"
    },
    { 
      title: "System Health", 
      value: "Operational", 
      description: "API and database status", 
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {adminCards.map(card => (
              <AdminStatCard key={card.title} {...card} />
            ))}
          </div>
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
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.profiles?.role === 'admin' ? 'default' : 'secondary'}>
                            {user.profiles?.role || 'user'}
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
                                    value={user.profiles?.role || 'user'}
                                    onValueChange={(value: 'user' | 'admin') => 
                                      handleUpdateUserRole(user.id, value)
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
      </Tabs>
    </div>
  );
}
