
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
  hashSpeed: number;
}

const DAILY_BONUS_HASH_INCREASE = 0.01;
const AD_BONUS_HASH_INCREASE = 0.14;

const CLAIM_COOLDOWN_SECONDS = 24 * 60 * 60; // 24 hours

export default function ProgressDisplay({ crypto, setHashSpeed, hashSpeed }: ProgressDisplayProps) {
  const { toast } = useToast();
  
  const [adsWatched, setAdsWatched] = useState(0);
  const [lastBonusClaimTime, setLastBonusClaimTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedAdsWatched = localStorage.getItem('adsWatched');
    const savedLastBonusClaimTime = localStorage.getItem('lastBonusClaimTime');

    if (savedAdsWatched) {
      setAdsWatched(parseInt(savedAdsWatched, 10));
    }
    
    if (savedLastBonusClaimTime) {
        const claimTime = parseInt(savedLastBonusClaimTime, 10);
        const now = Date.now();
        const timePassed = Math.floor((now - claimTime) / 1000);
        
        // If the day has passed, reset ads watched
        const claimDate = new Date(claimTime);
        const today = new Date();
        if(claimDate.getDate() !== today.getDate() || claimDate.getMonth() !== today.getMonth() || claimDate.getFullYear() !== today.getFullYear()) {
            localStorage.setItem('adsWatched', '0');
            setAdsWatched(0);
        }

        if (timePassed < CLAIM_COOLDOWN_SECONDS) {
            setLastBonusClaimTime(claimTime);
            setCountdown(CLAIM_COOLDOWN_SECONDS - timePassed);
        } else {
            localStorage.removeItem('lastBonusClaimTime');
        }
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lastBonusClaimTime && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
                localStorage.removeItem('lastBonusClaimTime');
                setLastBonusClaimTime(null);
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lastBonusClaimTime, countdown]);

  const handleClaimBonus = () => {
    if (!lastBonusClaimTime) {
      const now = Date.now();
      setLastBonusClaimTime(now);
      localStorage.setItem('lastBonusClaimTime', now.toString());
      setCountdown(CLAIM_COOLDOWN_SECONDS);
      
      setHashSpeed(prev => {
        const updatedSpeed = prev + DAILY_BONUS_HASH_INCREASE;
        localStorage.setItem('hashSpeed', updatedSpeed.toString());
        return updatedSpeed;
      });
      
      toast({
        title: 'Daily Bonus Claimed!',
        description: `You've increased hash speed by ${DAILY_BONUS_HASH_INCREASE.toFixed(2)} H/s.`,
      });
    }
  };

  const handleWatchAd = () => {
    window.open('https://nocturnal-minimum.com/b/3kV.0/PX3wp/vVbTmjVEJHZKDD0s2/NTjSIAzlMHTngX3eL/TBY-2rMZjYMBxCOlDogR', '_blank');
    const newAdsWatched = adsWatched + 1;
    setAdsWatched(newAdsWatched);
    localStorage.setItem('adsWatched', newAdsWatched.toString());
    
    setHashSpeed(prev => {
      const updatedSpeed = prev + AD_BONUS_HASH_INCREASE;
      localStorage.setItem('hashSpeed', updatedSpeed.toString());
      return updatedSpeed;
    });
    
    toast({
      title: 'Ad Watched!',
      description: `You've increased hash speed by ${AD_BONUS_HASH_INCREASE.toFixed(2)} H/s. Watched ${newAdsWatched} ads today.`,
    });
  };
  
  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  
  const dailyBonusProgress = lastBonusClaimTime ? 100 : 0;
  
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
              Ads Watched Today: {adsWatched}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleClaimBonus} disabled={!!lastBonusClaimTime}>
            <Gift className="mr-2 h-4 w-4" />
            {lastBonusClaimTime
              ? `Next Claim in ${formatCountdown(countdown)}`
              : 'Claim Daily Bonus'}
          </Button>
          <Button onClick={handleWatchAd}>
            <Video className="mr-2 h-4 w-4" />
            Watch Ad for Bonus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
