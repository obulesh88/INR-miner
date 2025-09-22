
'use client';

import type { UserData } from '@/services/userData';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface ProgressDisplayProps {
  userData: UserData;
  onUserDataChange: (newUserData: UserData) => void;
}

const DAILY_BONUS_HASH_INCREASE = 0.02;
const AD_BONUS_HASH_INCREASE = 0.02;
const MAX_ADS_WATCHED = 44;
const CLAIM_COOLDOWN_SECONDS = 24 * 60 * 60; // 24 hours
const AD_URL = "https://enviousgarbage.com/bX3MV-0.Pw3Np/v/bHmEVxJ/ZPDc0S2/NNjTIXzRMyTagq3/LJTLYi2jMKjRMsxAOQDRgx";

export default function ProgressDisplay({
  userData,
  onUserDataChange,
}: ProgressDisplayProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [timeToNextClaim, setTimeToNextClaim] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (userData.lastBonusClaimTime) {
      const now = Date.now();
      const timePassed = Math.floor((now - userData.lastBonusClaimTime) / 1000);
      const remainingTime = CLAIM_COOLDOWN_SECONDS - timePassed;

      if (remainingTime > 0) {
        setTimeToNextClaim(remainingTime);
        timer = setInterval(() => {
          setTimeToNextClaim((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
      } else {
        setTimeToNextClaim(0);
      }
    } else {
        setTimeToNextClaim(0);
    }
    return () => clearInterval(timer);
  }, [userData.lastBonusClaimTime]);


  const handleClaimBonus = () => {
    if (!auth.currentUser) {
      router.push('/login');
      return;
    }
    if(timeToNextClaim > 0) return;

    const now = Date.now();
    const newUserData: UserData = {
        ...userData,
        bonusHashSpeed: (userData.bonusHashSpeed || 0) + DAILY_BONUS_HASH_INCREASE,
        lastBonusClaimTime: now,
    };
    onUserDataChange(newUserData);
    setTimeToNextClaim(CLAIM_COOLDOWN_SECONDS);
    toast({
      title: 'Daily Bonus Claimed!',
      description: `You've increased bonus hash speed by ${DAILY_BONUS_HASH_INCREASE.toFixed(2)} H/s.`,
    });
  };

  const handleWatchAd = () => {
     if (!auth.currentUser) {
      router.push('/login');
      return;
    }
    if (userData.adsWatched >= MAX_ADS_WATCHED) {
      toast({
        variant: 'destructive',
        title: 'Ad Limit Reached',
        description: `You can only watch ${MAX_ADS_WATCHED} ads per day.`,
      });
      return;
    }
    
    // Open the ad URL in a new tab
    window.open(AD_URL, '_blank');

    const newUserData: UserData = {
        ...userData,
        bonusHashSpeed: (userData.bonusHashSpeed || 0) + AD_BONUS_HASH_INCREASE,
        adsWatched: userData.adsWatched + 1,
    };
    onUserDataChange(newUserData);
    
    toast({
      title: 'Ad Watched!',
      description: `You've increased bonus hash speed by ${AD_BONUS_HASH_INCREASE.toFixed(2)} H/s. Watched ${newUserData.adsWatched}/${MAX_ADS_WATCHED} ads today.`,
    });
  };
  
  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  
  const dailyBonusProgress = timeToNextClaim > 0 ? (1 - timeToNextClaim / CLAIM_COOLDOWN_SECONDS) * 100 : 100;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Daily Tasks</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete daily tasks to increase your temporary bonus hash speed for 24 hours.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-xs text-muted-foreground">Daily Bonus</p>
            <Progress value={dailyBonusProgress} className="h-1 mt-1" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Ads Watched Today: {userData.adsWatched}/{MAX_ADS_WATCHED}
            </p>
             <Progress value={(userData.adsWatched / MAX_ADS_WATCHED) * 100} className="h-1 mt-1" />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleClaimBonus} disabled={timeToNextClaim > 0}>
            <Gift className="mr-2 h-4 w-4" />
            {timeToNextClaim > 0
              ? `Next Claim in ${formatCountdown(timeToNextClaim)}`
              : 'Claim Daily Bonus'}
          </Button>
          <Button onClick={handleWatchAd} disabled={userData.adsWatched >= MAX_ADS_WATCHED}>
            <Video className="mr-2 h-4 w-4" />
            {userData.adsWatched >= MAX_ADS_WATCHED ? 'Ad Limit Reached' : 'Watch Ad for Bonus'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
