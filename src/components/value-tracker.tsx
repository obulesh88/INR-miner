import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';

interface ValueTrackerProps {
  earnings: number;
}

export default function ValueTracker({ earnings }: ValueTrackerProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
        <div className="flex items-center gap-2">
          <IndianRupee className="h-8 w-8 text-primary" />
          <div className="text-3xl font-bold text-primary">
            {earnings.toFixed(5)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
            Your earnings are updated in real-time.
        </p>
      </CardContent>
    </Card>
  );
}
