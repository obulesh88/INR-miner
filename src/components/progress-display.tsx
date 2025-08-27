'use client';

import type { CryptoData } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Video, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressDisplayProps {
  crypto: CryptoData;
  setHashSpeed: React.Dispatch<React.SetStateAction<number>>;
  resetAll: () => void;
}

const DAILY_BONUS_INR = 0.01;
const AD_BONUS_INR_TARGET = 0.14;
const TOTAL_INR_TARGET = DAILY_BONUS_INR + AD_BONUS_INR_TARGET;
const ADS_PER_DAY = 15;
const AD_BONUS_PER_AD_INR = AD_BONUS_INR_TARGET / ADS_PER_DAY;

const DAILY_BONUS_HASH_INCREASE = 0.10;
const AD_BONUS_HASH_INCREASE = 0.02;

const CLAIM_COOLDOWN_SECONDS = 24 * 60 * 60; // 24 hours

export default function ProgressDisplay({ crypto, setHashSpeed, resetAll }: ProgressDisplayProps) {
  const { toast } = useToast();
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [inrEarnings, setInrEarnings] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const resetState = () => {
    setClaimedBonus(false);
    setInrEarnings(0);
    setAdsWatched(0);
    setCountdown(0);
    resetAll();
    toast({
      title: 'Progress Reset',
      description: 'All your daily earnings and hash speed have been reset.',
    });
  }

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
      setInrEarnings(prev => prev + DAILY_BONUS_INR);
      toast({
        title: 'Daily Bonus Claimed!',
        description: `You've earned ₹${DAILY_BONUS_INR.toFixed(2)} and increased hash speed.`,
      });
    }
  };

  const handleWatchAd = () => {
    if (adsWatched < ADS_PER_DAY) {
      const newAdsWatched = adsWatched + 1;
      setAdsWatched(newAdsWatched);
      setHashSpeed(prev => prev + AD_BONUS_HASH_INCREASE);
      setInrEarnings(prev => prev + AD_BONUS_PER_AD_INR);
      toast({
        title: 'Ad Watched!',
        description: `You earned ₹${AD_BONUS_PER_AD_INR.toFixed(4)} and increased hash speed. Watched ${newAdsWatched}/${ADS_PER_DAY} ads today.`,
      });
    }
  };
  
  const progress = (inrEarnings / TOTAL_INR_TARGET) * 100;

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const isAdBonusMaxed = adsWatched >= ADS_PER_DAY;
  
  const dailyBonusProgress = claimedBonus ? 100 : 0;
  const adBonusProgress = (adsWatched / ADS_PER_DAY) * 100;
  const dailyBonusEarned = claimedBonus ? DAILY_BONUS_INR : 0;
  const adBonusEarned = adsWatched * AD_BONUS_PER_AD_INR;


  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Daily Progress</h3>
          <Button variant="ghost" size="icon" onClick={resetState}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your daily earnings are split. Claim the daily bonus, then watch ads
          to earn the rest.
        </p>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-muted-foreground">
              Total Progress (Target: ₹{TOTAL_INR_TARGET.toFixed(2)})
            </p>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-primary font-bold text-center mt-2">
            ₹{inrEarnings.toFixed(4)} / ₹{TOTAL_INR_TARGET.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Daily Bonus Earnings</p>
            <p className="font-bold">
              ₹{dailyBonusEarned.toFixed(4)} / ₹{DAILY_BONUS_INR.toFixed(2)}
            </p>
            <Progress value={dailyBonusProgress} className="h-1 mt-1" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Ad Bonus Earnings ({adsWatched}/{ADS_PER_DAY})
            </p>
            <p className="font-bold">
              ₹{adBonusEarned.toFixed(4)} / ₹{AD_BONUS_INR_TARGET.toFixed(2)}
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
