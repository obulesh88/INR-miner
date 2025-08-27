import type { CryptoData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CryptoIcon from '@/components/crypto-icon';

interface ValueTrackerProps {
  crypto: CryptoData;
}

export default function ValueTracker({ crypto }: ValueTrackerProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;
  const price = crypto.current_price;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <CryptoIcon symbol={crypto.symbol} className="h-10 w-10" />
          <div>
            <CardTitle className="text-2xl font-bold">{crypto.name}</CardTitle>
            <p className="text-sm text-muted-foreground uppercase">
              {crypto.symbol}
            </p>
          </div>
        </div>
        <Badge
          variant={isPositive ? 'default' : 'destructive'}
          className={`${isPositive ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'} border`}
        >
          {isPositive ? (
            <TrendingUp className="mr-2 h-4 w-4" />
          ) : (
            <TrendingDown className="mr-2 h-4 w-4" />
          )}
          {crypto.price_change_percentage_24h.toFixed(2)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold text-primary">
          $
          {price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {new Date(crypto.last_updated).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
