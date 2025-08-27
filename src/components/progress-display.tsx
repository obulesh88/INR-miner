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
}

const DAILY_BONUS = 0.01;
const AD_BONUS_TARGET = 0.14;
const TOTAL_TARGET = 0.15;
const ADS_PER_DAY = 15;
const AD_BONUS_PER_AD = AD_BONUS_TARGET / ADS_PER_DAY;
const CLAIM_COOLDOWN_SECONDS = 24 * 60 * 60; // 24 hours

export default function ProgressDisplay({ crypto }: ProgressDisplayProps) {
  const { toast } = useToast();
  const [claimedBonus, setClaimedBonus] = useState(true);
  const [adEarnings, setAdEarnings] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [countdown, setCountdown] = useState(26 * 60 + 23); // 26m 23s from screenshot

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (claimedBonus && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown <= 0) {
      setClaimedBonus(false);
    }
    return () => clearInterval(timer);
  }, [claimedBonus, countdown]);

  const handleClaimBonus = () => {
    if (!claimedBonus) {
      setClaimedBonus(true);
      setCountdown(CLAIM_COOLDOWN_SECONDS);
      toast({
        title: 'Daily Bonus Claimed!',
        description: `You've earned ₹${DAILY_BONUS.toFixed(2)}.`,
      });
    }
  };

  const handleWatchAd = () => {
    if (adsWatched < ADS_PER_DAY) {
      const newAdsWatched = adsWatched + 1;
      setAdsWatched(newAdsWatched);
      setAdEarnings((prev) => prev + AD_BONUS_PER_AD);
      toast({
        title: 'Ad Watched!',
        description: `You earned ₹${AD_BONUS_PER_AD.toFixed(4)}. Watched ${newAdsWatched}/${ADS_PER_DAY} ads today.`,
      });
    }
  };
  
  const totalEarnings = (claimedBonus ? DAILY_BONUS : 0) + adEarnings;
  const progress = (totalEarnings / TOTAL_TARGET) * 100;

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const isAdBonusMaxed = adsWatched >= ADS_PER_DAY;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">Daily Progress</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your daily earnings are split. Claim the daily bonus, then watch ads
          to earn the rest.
        </p>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-muted-foreground">
              Total Progress (Target: ₹{TOTAL_TARGET.toFixed(2)})
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
            <p className="font-bold">
              ₹{claimedBonus ? DAILY_BONUS.toFixed(4) : '0.0000'} / ₹{DAILY_BONUS.toFixed(2)}
            </p>
            <Progress value={claimedBonus ? 100 : 0} className="h-1 mt-1" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Ad Bonus Earnings ({adsWatched}/{ADS_PER_DAY})
            </p>
            <p className="font-bold">
              ₹{adEarnings.toFixed(4)} / ₹{AD_BONUS_TARGET.toFixed(2)}
            </p>
            <Progress value={(adEarnings / AD_BONUS_TARGET) * 100} className="h-1 mt-1" />
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