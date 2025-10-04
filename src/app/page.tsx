
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-context';
import LoginPage from '@/app/login/page';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUserData();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="mx-auto max-w-sm w-full space-y-6 p-4">
                <div className="space-y-2 text-center">
                    <Skeleton className="h-8 w-24 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="mt-4 text-center text-sm">
                    <Skeleton className="h-4 w-48 mx-auto" />
                </div>
            </div>
        </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // This will be shown briefly while the redirect to /dashboard happens
  return (
     <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="mx-auto max-w-sm w-full space-y-6 p-4">
            <div className="space-y-2 text-center">
                <Skeleton className="h-8 w-24 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="mt-4 text-center text-sm">
                <Skeleton className="h-4 w-48 mx-auto" />
            </div>
        </div>
    </div>
  );
}
