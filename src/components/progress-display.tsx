import type { CryptoData } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Video } from 'lucide-react';

interface ProgressDisplayProps {
  crypto: CryptoData;
}

export default function ProgressDisplay({ crypto }: ProgressDisplayProps) {
  const dailyBonus = 0.0184;
  const adBonusTarget = 0.60;
  const totalTarget = adBonusTarget;
  const progress = (dailyBonus / totalTarget) * 100;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">Daily Progress</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your daily earnings are split. Claim the daily bonus, then watch ads to earn the rest.
        </p>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
             <p className="text-sm text-muted-foreground">
              Total Progress (Target: ₹{totalTarget.toFixed(2)})
            </p>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-primary font-bold text-center mt-2">
            {progress.toFixed(2)}% Complete
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
                <p className="text-xs text-muted-foreground">Daily Bonus Earnings</p>
                <p className="font-bold">₹{dailyBonus.toFixed(4)} / ₹0.00</p>
                <Progress value={100} className="h-1 mt-1" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Ad Bonus Earnings (0/15)</p>
                <p className="font-bold">₹0.0000 / ₹{adBonusTarget.toFixed(2)}</p>
                 <Progress value={0} className="h-1 mt-1" />
            </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
            <Button disabled>
                <Gift className="mr-2 h-4 w-4" />
                Next Claim in 00:26:23
            </Button>
            <Button>
                <Video className="mr-2 h-4 w-4" />
                Watch Ad for Bonus
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
