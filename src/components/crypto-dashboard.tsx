
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CryptoData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import ValueTracker from '@/components/value-tracker';
import ProgressDisplay from '@/components/progress-display';
import { Skeleton } from '@/components/ui/skeleton';
import BottomNav from '@/components/bottom-nav';
import { auth } from '@/lib/firebase';
import { getUserData, createUserData, updateUserData, type UserData } from '@/services/userData';
import { onAuthStateChanged, type User } from 'firebase/auth';

const initialUserData: UserData = {
  earnings: 0.0,
  adsWatched: 0,
  lastAdResetDate: null,
};

export function CryptoDashboard() {
  const [selectedCryptoId] = useState<string>('bitcoin');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const loadUserData = useCallback(async (currentUser: User) => {
    let firebaseData = await getUserData(currentUser.uid);
    let dataToSet: UserData;

    if (firebaseData) {
      dataToSet = firebaseData;
    } else {
      const newUserData: UserData = {
        ...initialUserData,
        lastAdResetDate: new Date().toISOString().split('T')[0],
      };
      await createUserData(currentUser.uid, newUserData);
      dataToSet = newUserData;
    }

    const today = new Date().toISOString().split('T')[0];
    if(dataToSet.lastAdResetDate !== today) {
        dataToSet.adsWatched = 0;
        dataToSet.lastAdResetDate = today;
        await updateUserData(currentUser.uid, { adsWatched: 0, lastAdResetDate: today });
    }

    setUserData(dataToSet);
  }, []);
  
  const handleUserDataChange = useCallback((newUserData: Partial<UserData>) => {
    if (!user) return;
    
    setUserData(prev => {
        const updatedData = {...prev, ...newUserData};
        updateUserData(user.uid, updatedData);
        return updatedData;
    });

  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsLoading(true);
        loadUserData(currentUser).finally(() => setIsLoading(false));
      } else {
        setUserData(initialUserData);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadUserData]);
  
  useEffect(() => {
    if(!user) return;
    const saveInterval = setInterval(() => {
        if(userData.earnings > 0) {
            updateUserData(user.uid, { earnings: userData.earnings });
        }
    }, 30000); // Save earnings every 30 seconds
    return () => clearInterval(saveInterval);
  }, [user, userData.earnings]);

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="space-y-4 max-w-2xl mx-auto">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <ValueTracker earnings={userData.earnings} />

            <ProgressDisplay
              userData={userData}
              onUserDataChange={handleUserDataChange}
            />
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
