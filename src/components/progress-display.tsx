
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-context';

const AD_EARNING_INCREASE = 0.003;
const MAX_ADS_WATCHED = 44;
const AD_URL = 'https://enviousgarbage.com/b/3-Vk0.Ph3HpHv/bfmUVNJ_ZtDF0P2tN/jZISzUMtTPg_3tLmTzYv2XMWjBM/xROPD/gn';


export default function ProgressDisplay() {
  const { toast } = useToast();
  const router = useRouter();
  const { userData, updateUserData, user } = useUserData();

  const [isAdLoading, setIsAdLoading] = useState(false);

  const handleWatchAd = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!userData) return;

    if (userData.adsWatched >= MAX_ADS_WATCHED) {
      toast({
        variant: 'destructive',
        title: 'Ad Limit Reached',
        description: `You can only watch ${MAX_ADS_WATCHED} ads per day.`,
      });
      return;
    }

    setIsAdLoading(true);

    const newAdsWatched = userData.adsWatched + 1;
    const newEarnings = (userData.earnings || 0) + AD_EARNING_INCREASE;

    try {
      await updateUserData({
        earnings: newEarnings,
        adsWatched: newAdsWatched,
      });

      toast({
        title: 'Ad Watched!',
        description: `You've earned ₹${AD_EARNING_INCREASE.toFixed(
          3
        )}. Watched ${newAdsWatched}/${MAX_ADS_WATCHED} ads today.`,
      });

      // Show loading for a bit, then open ad
      setTimeout(() => {
        window.open(AD_URL, '_blank');
        setIsAdLoading(false);
      }, 1000);
      
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error updating data',
        description: `Could not save your progress. Please try again.`,
      });
       setIsAdLoading(false);
    }
  };

  const adsWatched = userData?.adsWatched ?? 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Daily Tasks</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete daily tasks to increase your earnings.
        </p>

        <div className="grid grid-cols-1 gap-4 mt-6">
          <div>
            <p className="text-xs text-muted-foreground">
              Ads Watched Today: {adsWatched}/{MAX_ADS_WATCHED}
            </p>
            <Progress
              value={(adsWatched / MAX_ADS_WATCHED) * 100}
              className="h-1 mt-1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleWatchAd}
            disabled={adsWatched >= MAX_ADS_WATCHED || isAdLoading}
          >
            {isAdLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Video className="mr-2 h-4 w-4" />
            )}
            {isAdLoading
              ? 'Processing...'
              : adsWatched >= MAX_ADS_WATCHED
              ? 'Ad Limit Reached'
              : 'Watch Ad to Earn'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
