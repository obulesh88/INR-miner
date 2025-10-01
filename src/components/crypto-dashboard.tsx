
'use client';

import { Card } from '@/components/ui/card';
import ValueTracker from '@/components/value-tracker';
import ProgressDisplay from '@/components/progress-display';
import { Skeleton } from '@/components/ui/skeleton';
import BottomNav from '@/components/bottom-nav';
import { useUserData } from '@/contexts/user-data-context';

export function CryptoDashboard() {
  const { userData, isLoading } = useUserData();

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="space-y-4 max-w-2xl mx-auto">
        {isLoading || !userData ? (
          <DashboardSkeleton />
        ) : (
          <>
            <ValueTracker earnings={userData.earnings} />
            <ProgressDisplay />
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className='space-y-4'>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
                <Skeleton className="h-7 w-32 mb-1" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
        <Skeleton className="h-12 w-48" />
      </Card>
       <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </Card>
    </div>
  );
}
