import type { CryptoData } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressDisplayProps {
  crypto: CryptoData;
}

export default function ProgressDisplay({ crypto }: ProgressDisplayProps) {
  const { low_24h, high_24h, current_price } = crypto;
  const progress =
    high_24h > low_24h
      ? ((current_price - low_24h) / (high_24h - low_24h)) * 100
      : 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
        <CardDescription>
          Today's price movement from low to high.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Low: ${low_24h.toLocaleString()}</span>
          <span>High: ${high_24h.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-3 bg-primary/20" />
        <div className="text-center text-lg font-medium text-primary mt-3">
          Current: ${current_price.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
