
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

const initialUserData: UserData = {
  hashSpeed: 0.0,
  earnings: 0.0,
  adsWatched: 0,
  lastBonusClaimTime: null,
  lastAdResetDate: null,
};

export function CryptoDashboard() {
  const [data, setData] = useState<Record<string, CryptoData>>({});
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(
    MONITORED_COINS[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // User progress state
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async (currentUser: User) => {
    // 1. Load from localStorage first for quick UI update
    const localDataStr = localStorage.getItem(`userData-${currentUser.uid}`);
    if (localDataStr) {
      setUserData(JSON.parse(localDataStr));
    }

    // 2. Fetch from Firebase to get the most up-to-date data
    const firebaseData = await getUserData(currentUser.uid);
    
    let dataToSet: UserData;

    if (firebaseData) {
        dataToSet = firebaseData;
    } else {
        // If no data in Firebase, create it.
        const newUserData: UserData = {
            ...(localDataStr ? JSON.parse(localDataStr) : initialUserData),
            lastAdResetDate: new Date().toISOString().split('T')[0]
        };
        await createUserData(currentUser.uid, newUserData);
        dataToSet = newUserData;
    }
    
    // 3. Set state with the definitive data and update localStorage
    setUserData(dataToSet);
    localStorage.setItem(`userData-${currentUser.uid}`, JSON.stringify(dataToSet));
  }, []);
  
  // This function now handles all updates to user data.
  const handleUserDataChange = useCallback((newUserData: UserData) => {
    if (!user) return;

    // Reset ads watched if it's a new day
    const today = new Date().toISOString().split('T')[0];
    const finalData = { ...newUserData };
    if (finalData.lastAdResetDate !== today) {
        finalData.adsWatched = 0;
        finalData.lastAdResetDate = today;
    }
    
    // Update state and localStorage immediately
    setUserData(finalData);
    localStorage.setItem(`userData-${user.uid}`, JSON.stringify(finalData));

    // Update Firebase (will be queued if offline)
    updateUserData(user.uid, finalData);

  }, [user]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsLoading(true);
        loadUserData(currentUser);
      } else {
        // Clear data if user logs out
        setUserData(initialUserData);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadUserData]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); 

    return () => clearInterval(interval);
  }, [fetchMarketData]);
  
  // Mining effect
  useEffect(() => {
    if (userData.hashSpeed > 0 && data[selectedCryptoId]) {
      const btcPerSecond = 0.00000000005; 
      const interval = setInterval(() => {
        // Use a function for state update to get the latest state
        setUserData(prev => {
            const newEarnings = prev.earnings + btcPerSecond * prev.hashSpeed;
            return {...prev, earnings: newEarnings };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [userData.hashSpeed, data, selectedCryptoId]);

  // Auto-save to Firebase every 15 seconds
  useEffect(() => {
    if(!user) return;
    const saveInterval = setInterval(() => {
        // We get the latest state from localStorage to ensure we're not saving stale data
        const localDataStr = localStorage.getItem(`userData-${user.uid}`);
        if(localDataStr) {
            updateUserData(user.uid, JSON.parse(localDataStr));
        }
    }, 15000);
    return () => clearInterval(saveInterval);
  }, [user]);


  const selectedCrypto = data[selectedCryptoId];

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="space-y-4 max-w-2xl mx-auto">
        {isLoading || !selectedCrypto ? (
          <DashboardSkeleton />
        ) : (
          <>
            <ValueTracker crypto={selectedCrypto} earnings={userData.earnings} />
            
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Active Mining Power</p>
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold">{(userData.hashSpeed || 0).toFixed(2)} H/s</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Actively generating {selectedCrypto.symbol.toUpperCase()}</p>
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
