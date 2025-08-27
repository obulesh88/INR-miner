'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CryptoData } from '@/lib/types';
import { getMarketData } from '@/services/coingecko';
import { Card } from '@/components/ui/card';
import ValueTracker from '@/components/value-tracker';
import ProgressDisplay from '@/components/progress-display';
import AiAssistant from '@/components/ai-assistant';
import NewsFeed from '@/components/news-feed';
import CryptoSelector from '@/components/crypto-selector';
import { Skeleton } from '@/components/ui/skeleton';

const MONITORED_COINS = ['bitcoin', 'ethereum', 'dogecoin'];

export function CryptoDashboard() {
  const [data, setData] = useState<Record<string, CryptoData>>({});
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(
    MONITORED_COINS[0]
  );
  const [isLoading, setIsLoading] = useState(true);

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

  const selectedCrypto = data[selectedCryptoId];

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {isLoading || !selectedCrypto ? (
            <DashboardSkeleton />
          ) : (
            <>
              <ValueTracker crypto={selectedCrypto} />
              <ProgressDisplay crypto={selectedCrypto} />
              <AiAssistant
                selectedCryptoSymbol={selectedCrypto.symbol}
                selectedCryptoName={selectedCrypto.name}
              />
            </>
          )}
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
          <CryptoSelector
            cryptos={Object.values(data)}
            selectedCryptoId={selectedCryptoId}
            onSelect={setSelectedCryptoId}
            isLoading={isLoading}
          />
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <Card className="p-6 flex justify-between items-start">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-12 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </Card>
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-full" />
      </Card>
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-10 w-full" />
      </Card>
    </>
  );
}
