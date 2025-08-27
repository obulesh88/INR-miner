
'use client';

import type { CryptoData } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressDisplayProps {
  crypto: CryptoData;
  setHashSpeed: React.Dispatch<React.SetStateAction<number>>;
}

const ADS_PER_DAY = 15;

const DAILY_BONUS_HASH_INCREASE = 0.15;
const AD_BONUS_HASH_INCREASE = 0.01;

const CLAIM_COOLDOWN_SECONDS = 24 * 60 * 60; // 24 hours

export default function ProgressDisplay({ crypto, setHashSpeed }: ProgressDisplayProps) {
  const { toast } = useToast();
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (claimedBonus && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown <= 0 && claimedBonus) {
      setClaimedBonus(false);
    }
    return () => clearInterval(timer);
  }, [claimedBonus, countdown]);

  const handleClaimBonus = () => {
    if (!claimedBonus) {
      setClaimedBonus(true);
      setCountdown(CLAIM_COOLDOWN_SECONDS);
      setHashSpeed(prev => prev + DAILY_BONUS_HASH_INCREASE);
      toast({
        title: 'Daily Bonus Claimed!',
        description: `You've increased hash speed by ${DAILY_BONUS_HASH_INCREASE.toFixed(2)} H/s.`,
      });
    }
  };

  const handleWatchAd = () => {
    if (adsWatched < ADS_PER_DAY) {
      window.open('https://nocturnal-minimum.com/b/3kV.0/PX3wp/vVbTmjVEJHZKDD0s2/NTjSIAzlMHTngX3eL/TBY-2rMZjYMBxCOlDogR', '_blank');
      const newAdsWatched = adsWatched + 1;
      setAdsWatched(newAdsWatched);
      setHashSpeed(prev => prev + AD_BONUS_HASH_INCREASE);
      toast({
        title: 'Ad Watched!',
        description: `You've increased hash speed by ${AD_BONUS_HASH_INCREASE.toFixed(2)} H/s. Watched ${newAdsWatched}/${ADS_PER_DAY} ads today.`,
      });
    }
  };
  
  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const isAdBonusMaxed = adsWatched >= ADS_PER_DAY;
  
  const dailyBonusProgress = claimedBonus ? 100 : 0;
  const adBonusProgress = (adsWatched / ADS_PER_DAY) * 100;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Daily Tasks</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete daily tasks to increase your mining hash speed.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-xs text-muted-foreground">Daily Bonus</p>
            <Progress value={dailyBonusProgress} className="h-1 mt-1" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Ad Bonus ({adsWatched}/{ADS_PER_DAY})
            </p>
            <Progress value={adBonusProgress} className="h-1 mt-1" />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleClaimBonus} disabled={claimedBonus}>
            <Gift className="mr-2 h-4 w-4" />
            {claimedBonus
              ? `Next Claim in ${formatCountdown(countdown)}`
              : 'Claim Daily Bonus'}
          </Button>
          <Button onClick={handleWatchAd} disabled={isAdBonusMaxed}>
            <Video className="mr-2 h-4 w-4" />
            {isAdBonusMaxed ? 'Ad Limit Reached' : 'Watch Ad for Bonus'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
