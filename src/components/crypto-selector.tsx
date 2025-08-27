import type { CryptoData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CryptoIcon from '@/components/crypto-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { List } from 'lucide-react';

interface CryptoSelectorProps {
  cryptos: CryptoData[];
  selectedCryptoId: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export default function CryptoSelector({
  cryptos,
  selectedCryptoId,
  onSelect,
  isLoading,
}: CryptoSelectorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <List className="h-5 w-5 text-primary" />
        <CardTitle>Markets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <CryptoButtonSkeleton key={i} />)
        ) : cryptos.length > 0 ? (
          cryptos.map((crypto) => (
            <Button
              key={crypto.id}
              variant={selectedCryptoId === crypto.id ? 'secondary' : 'ghost'}
              className="w-full justify-start h-14"
              onClick={() => onSelect(crypto.id)}
            >
              <div className="flex items-center gap-4 w-full">
                <CryptoIcon symbol={crypto.symbol} className="h-8 w-8" />
                <div className="text-left">
                  <p className="font-bold text-base">{crypto.name}</p>
                  <p className="text-muted-foreground text-sm uppercase">
                    {crypto.symbol}
                  </p>
                </div>
                <div className="ml-auto text-right">
                    <p className="font-bold text-base">${crypto.current_price.toLocaleString()}</p>
                    <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                    </p>
                </div>
              </div>
            </Button>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">Could not load market data.</p>
        )}
      </CardContent>
    </Card>
  );
}


function CryptoButtonSkeleton() {
    return (
        <div className="flex items-center gap-4 w-full p-2 h-14">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className='w-full space-y-2'>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
            </div>
             <div className="ml-auto text-right space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    )
}
