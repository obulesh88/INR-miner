import type { CryptoData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import CryptoIcon from '@/components/crypto-icon';

interface ValueTrackerProps {
  crypto: CryptoData;
}

export default function ValueTracker({ crypto }: ValueTrackerProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;
  // This is a fixed value from the screenshot, not the live one.
  const priceInBtc = 0.0;
  const priceInInr = 0.0;


  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-2">Today's Earnings</p>
        <div className="flex items-center gap-2">
          <CryptoIcon symbol={crypto.symbol} className="h-8 w-8" />
          <div className="text-3xl font-bold text-primary">
            {priceInBtc.toFixed(17)}
          </div>
          <p className="text-3xl font-bold">
            {crypto.symbol.toUpperCase()}
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
            ~ ₹{priceInInr.toFixed(4)}
        </p>
      </CardContent>
    </Card>
  );
}
