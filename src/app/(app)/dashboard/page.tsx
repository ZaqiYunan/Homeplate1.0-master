
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAppContext } from '@/contexts/SupabaseAppContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Clock3,
  LineChart,
  ShieldAlert,
  TriangleAlert,
  ShieldCheck,
  Archive,
  Snowflake,
  Circle,
  PlusCircle,
  ScanLine,
  ArrowRight,
  HandCoins,
  Loader2,
  Refrigerator,
} from 'lucide-react';
import type { StorageLocation, IngredientCategory } from '@/lib/types';
import { differenceInDays, parseISO } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendColor?: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendColor, description }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{value}</div>
      {trend && <p className={`text-xs ${trendColor || 'text-muted-foreground'} pt-1`}>{trend}</p>}
    </CardContent>
    <CardFooter className="text-xs text-muted-foreground pt-2">
        <p>{description}</p>
    </CardFooter>
  </Card>
);

interface OverviewItemProps {
  icon: React.ElementType;
  name: string;
  count: number;
  iconColor?: string;
}

const OverviewItem: React.FC<OverviewItemProps> = ({ icon: Icon, name, count, iconColor }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <Icon className={`h-5 w-5 mr-3 ${iconColor || 'text-muted-foreground'}`} />
      <span className="text-sm text-foreground">{name}</span>
    </div>
    <span className="text-sm font-medium text-primary">{count} items</span>
  </div>
);


export default function DashboardPage() {
  const { user } = useAuth();
  const { storedIngredients, isMounted, isContextLoading } = useAppContext();
  const router = useRouter();

  const getFirstName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  if (!isMounted || isContextLoading && storedIngredients.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const totalIngredients = storedIngredients.length;
  
  const expiringSoonCount = storedIngredients.filter(item => {
    if (!item.expiryDate) return false;
    const daysLeft = differenceInDays(parseISO(item.expiryDate), new Date());
    return daysLeft >= 0 && daysLeft <= 3;
  }).length;

  const freshItemsCount = storedIngredients.filter(item => {
    if (!item.expiryDate) return true; // Assume fresh if no expiry date
    return differenceInDays(parseISO(item.expiryDate), new Date()) > 3;
  }).length;

  const countByLocation = (location: StorageLocation) => {
    return storedIngredients.filter(item => item.location === location).length;
  };
  
  const countByCategory = (category: IngredientCategory) => {
    return storedIngredients.filter(item => item.category === category).length;
  }

  const statCardsData = [
    { title: "Total Items", value: totalIngredients, icon: Package, trend: "", description: "Items in your storage" },
    { title: "Expiring Soon", value: expiringSoonCount, icon: Clock3, trend: "In the next 3 days", description: "Items needing attention", trendColor: "text-orange-500" },
    { title: "Fresh Items", value: freshItemsCount, icon: LineChart, trend: "Good condition", description: "Estimated fresh items", trendColor: "text-green-500" },
    { title: "Waste Saved (Est.)", value: "0%", icon: HandCoins, trend: "Feature coming soon", description: "Contribution to less waste", trendColor: "text-purple-500" }
  ];

  const storageOverviewData = [
    { name: "Pantry", count: countByLocation('pantry'), icon: Archive, iconColor: "text-orange-500" },
    { name: "Refrigerator", count: countByLocation('refrigerator'), icon: Refrigerator, iconColor: "text-blue-500" },
    { name: "Freezer", count: countByLocation('freezer'), icon: Snowflake, iconColor: "text-sky-500" },
  ];

  const topCategoriesData = [
    { name: "Protein", count: countByCategory('protein'), color: "hsl(var(--chart-2))" }, 
    { name: "Vegetable", count: countByCategory('vegetable'), color: "hsl(var(--chart-3))" },
    { name: "Grain", count: countByCategory('grain'), color: "hsl(var(--chart-5))" },
    { name: "Fruit", count: countByCategory('fruit'), color: "hsl(var(--chart-1))" },
    { name: "Dairy", count: countByCategory('dairy'), color: "hsl(var(--chart-4))" },
  ].filter(cat => cat.count > 0).sort((a,b) => b.count - a.count).slice(0,3);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Welcome back, {getFirstName()}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your food inventory and some personalized recommendations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCardsData.map(card => <StatCard key={card.title} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <TriangleAlert className="mr-2 h-5 w-5" />
              Expiration Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-10">
            {expiringSoonCount > 0 ? (
                <>
                    <ShieldAlert className="h-16 w-16 text-orange-500 mb-4" />
                    <p className="text-lg font-medium text-foreground">{expiringSoonCount} item(s) expiring soon!</p>
                    <p className="text-sm text-muted-foreground">Check your storage list for details.</p>
                </>
            ) : (
                <>
                    <ShieldCheck className="h-16 w-16 text-green-500 mb-4" />
                    <p className="text-lg font-medium text-foreground">All items are fresh!</p>
                    <p className="text-sm text-muted-foreground">No items expiring in the next 3 days.</p>
                </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Storage Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {storageOverviewData.filter(item => item.count > 0).length > 0 ? storageOverviewData.map(item => (
                <React.Fragment key={item.name}>
                  <OverviewItem {...item} />
                  <Separator className="last:hidden" />
                </React.Fragment>
              )) : <p className="text-sm text-muted-foreground italic">No items in storage yet.</p>}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {topCategoriesData.length > 0 ? topCategoriesData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center">
                    <Circle className="h-3 w-3 mr-3" style={{ fill: cat.color, color: cat.color }} />
                    <span className="text-sm text-foreground">{cat.name}</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{cat.count} items</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No ingredients to categorize yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full justify-start text-primary-foreground bg-primary-foreground/20 hover:bg-primary-foreground/30"
                onClick={() => router.push('/storage/add')}
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start text-primary-foreground bg-primary-foreground/20 hover:bg-primary-foreground/30"
              >
                <ScanLine className="mr-2 h-5 w-5" /> Scan Barcode (Coming Soon)
              </Button>
               <Button 
                variant="secondary" 
                className="w-full justify-start text-primary-foreground bg-primary-foreground/20 hover:bg-primary-foreground/30"
                onClick={() => router.push('/storage')}
              >
                <ArrowRight className="mr-2 h-5 w-5" /> View Full Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
