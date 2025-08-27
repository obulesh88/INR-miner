'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CryptoData } from '@/lib/types';
import { getMarketData } from '@/services/coingecko';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import ValueTracker from '@/components/value-tracker';
import ProgressDisplay from '@/components/progress-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap } from 'lucide-react';

const MONITORED_COINS = ['bitcoin', 'ethereum', 'dogecoin'];

export function CryptoDashboard() {
  const [data, setData] = useState<Record<string, CryptoData>>({});
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(
    MONITORED_COINS[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hashSpeed, setHashSpeed] = useState(0.0);
  const [earnings, setEarnings] = useState(0.0);

  const fetchData = useCallback(async () => {
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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, [fetchData]);
  
  useEffect(() => {
    if (hashSpeed > 0) {
      const btcPerSecond = 0.00000000005; // Example earning rate
      const interval = setInterval(() => {
        setEarnings(prev => prev + btcPerSecond * hashSpeed);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hashSpeed]);

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
              resetAll={() => {
                setHashSpeed(0.0);
                setEarnings(0.0);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
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
    </>
  );
}
