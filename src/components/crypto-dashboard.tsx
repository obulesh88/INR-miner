
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

export function CryptoDashboard() {
  const [data, setData] = useState<Record<string, CryptoData>>({});
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(
    MONITORED_COINS[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // User progress state
  const [hashSpeed, setHashSpeed] = useState(0.0);
  const [earnings, setEarnings] = useState(0.0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [lastBonusClaimTime, setLastBonusClaimTime] = useState<number | null>(null);
  const [lastAdResetDate, setLastAdResetDate] = useState<string | null>(null);


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
    // 1. Try local storage first
    const localDataStr = localStorage.getItem(`userData-${currentUser.uid}`);
    if (localDataStr) {
        const localData: UserData = JSON.parse(localDataStr);
        setHashSpeed(localData.hashSpeed);
        setEarnings(localData.earnings);
        setLastBonusClaimTime(localData.lastBonusClaimTime);
        setAdsWatched(localData.adsWatched);
        setLastAdResetDate(localData.lastAdResetDate);
    }

    // 2. Fetch from Firebase and potentially create a new user doc
    const firebaseData = await getUserData(currentUser.uid);
    if (firebaseData) {
        setHashSpeed(firebaseData.hashSpeed);
        setEarnings(firebaseData.earnings);
        setLastBonusClaimTime(firebaseData.lastBonusClaimTime);
        setAdsWatched(firebaseData.adsWatched);
        setLastAdResetDate(firebaseData.lastAdResetDate);
    } else {
        const newUserData: UserData = {
            hashSpeed: 0.0,
            earnings: 0.0,
            lastBonusClaimTime: null,
            adsWatched: 0,
            lastAdResetDate: new Date().toISOString().split('T')[0]
        };
        await createUserData(currentUser.uid, newUserData);
    }
  }, []);
  
  const saveUserData = useCallback(() => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const newAdsWatched = lastAdResetDate !== today ? 0 : adsWatched;
    const newLastAdResetDate = today;

    const userData: UserData = {
        hashSpeed,
        earnings,
        lastBonusClaimTime,
        adsWatched: newAdsWatched,
        lastAdResetDate: newLastAdResetDate,
    };

    // Save to local storage
    localStorage.setItem(`userData-${user.uid}`, JSON.stringify(userData));
    // Save to Firebase
    updateUserData(user.uid, userData);
    
    if (newAdsWatched === 0) {
      setAdsWatched(0);
    }
    setLastAdResetDate(newLastAdResetDate);

  }, [user, hashSpeed, earnings, lastBonusClaimTime, adsWatched, lastAdResetDate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser);
      } else {
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

  // Autosave progress every 15 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
        saveUserData();
    }, 15000);
    return () => clearInterval(saveInterval);
  }, [saveUserData]);
  
  useEffect(() => {
    if (hashSpeed > 0 && data[selectedCryptoId]) {
      const btcPerSecond = 0.00000000005; 
      const interval = setInterval(() => {
        setEarnings(prev => prev + btcPerSecond * hashSpeed);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hashSpeed, data, selectedCryptoId]);

  const selectedCrypto = data[selectedCryptoId];

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="space-y-4 max-w-2xl mx-auto">
        {isLoading || !selectedCrypto ? (
          <DashboardSkeleton />
        ) : (
          <>
            <ValueTracker crypto={selectedCrypto} earnings={earnings} />
            
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Active Mining Power</p>
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold">{hashSpeed.toFixed(2)} H/s</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Actively generating {selectedCrypto.symbol.toUpperCase()}</p>
              </CardContent>
            </Card>

            <ProgressDisplay
              crypto={selectedCrypto}
              setHashSpeed={setHashSpeed}
              hashSpeed={hashSpeed}
              adsWatched={adsWatched}
              setAdsWatched={setAdsWatched}
              lastBonusClaimTime={lastBonusClaimTime}
              setLastBonusClaimTime={setLastBonusClaimTime}
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
