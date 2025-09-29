
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CryptoData } from '@/lib/types';
import { getMarketData } from '@/services/coingecko';
import { Card, CardContent } from '@/components/ui/card';
import ValueTracker from '@/components/value-tracker';
import ProgressDisplay from '@/components/progress-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap } from 'lucide-react';
import BottomNav from '@/components/bottom-nav';
import { auth } from '@/lib/firebase';
import { getUserData, createUserData, updateUserData, type UserData } from '@/services/userData';
import { onAuthStateChanged, type User } from 'firebase/auth';

const MONITORED_COINS = ['bitcoin', 'ethereum', 'dogecoin'];
const HASH_POWER_RESET_HOURS = 24;

const initialUserData: UserData = {
  hashSpeed: 0.0,
  earnings: 0.0,
  adsWatched: 0,
  lastBonusClaimTime: null,
  lastAdResetDate: null,
  lastHashResetTime: null,
};

export function CryptoDashboard() {
  const [data, setData] = useState<Record<string, CryptoData>>({});
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(
    MONITORED_COINS[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const fetchMarketData = useCallback(async () => {
    try {
      const marketData = await getMarketData(MONITORED_COINS);
      if (marketData && marketData.length > 0) {
        const newData = marketData.reduce((acc, coin) => {
          acc[coin.id] = coin;
          return acc;
        }, {} as Record<string, CryptoData>);
        setData(newData);
      }
    } catch (error) {
      console.error('Failed to fetch crypto data', error);
    }
  }, []);

  const loadUserData = useCallback(async (currentUser: User) => {
    let firebaseData = await getUserData(currentUser.uid);
    let dataToSet: UserData;

    if (firebaseData) {
      dataToSet = firebaseData;
    } else {
      const newUserData = {
        ...initialUserData,
        lastAdResetDate: new Date().toISOString().split('T')[0],
        lastHashResetTime: Date.now(),
      };
      await createUserData(currentUser.uid, newUserData);
      dataToSet = newUserData;
    }

    const now = Date.now();
    const timeSinceLastHashReset = now - (dataToSet.lastHashResetTime || 0);
    const hoursSinceLastHashReset = timeSinceLastHashReset / (1000 * 60 * 60);

    if (hoursSinceLastHashReset >= HASH_POWER_RESET_HOURS) {
      dataToSet = {
        ...dataToSet,
        hashSpeed: 0,
        lastHashResetTime: now,
      };
       await updateUserData(currentUser.uid, { hashSpeed: 0, lastHashResetTime: now });
    }

    const today = new Date().toISOString().split('T')[0];
    if(dataToSet.lastAdResetDate !== today) {
        dataToSet.adsWatched = 0;
        dataToSet.lastAdResetDate = today;
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
        Promise.all([
          loadUserData(currentUser),
          fetchMarketData()
        ]).finally(() => setIsLoading(false));
      } else {
        setUserData(initialUserData);
        setData({});
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadUserData, fetchMarketData]);

  useEffect(() => {
    const marketDataInterval = setInterval(fetchMarketData, 60000); 
    return () => clearInterval(marketDataInterval);
  }, [fetchMarketData]);
  
  useEffect(() => {
    if (user && userData.hashSpeed > 0 && data[selectedCryptoId]) {
      const inrPerSecond = 0.00001; 
      const currentHashSpeed = userData.hashSpeed;
      const earningsInterval = setInterval(() => {
        setUserData(prev => ({...prev, earnings: prev.earnings + inrPerSecond * currentHashSpeed }));
      }, 1000);
      return () => clearInterval(earningsInterval);
    }
  }, [user, userData.hashSpeed, data, selectedCryptoId]);

  useEffect(() => {
    if(!user) return;
    const saveInterval = setInterval(() => {
        if(userData.earnings > 0) {
            updateUserData(user.uid, { earnings: userData.earnings });
        }
    }, 15000); // Save earnings every 15 seconds
    return () => clearInterval(saveInterval);
  }, [user, userData.earnings]);

  const selectedCrypto = data[selectedCryptoId];
  
  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="space-y-4 max-w-2xl mx-auto">
        {isLoading || !selectedCrypto ? (
          <DashboardSkeleton />
        ) : (
          <>
            <ValueTracker earnings={userData.earnings} />
            
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Temporary Mining Power (resets in 24h)</p>
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold">{(userData.hashSpeed).toFixed(2)} H/s</p>
                </div>
              </CardContent>
            </Card>

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
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-8 w-24" />
      </Card>
       <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-1/2 mx-auto" />
      </Card>
    </div>
  );
}
