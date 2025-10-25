
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const AD_EARNING_INCREASE = 0.004;
const MAX_ADS_WATCHED = 100;

export default function ProgressDisplay() {
  const { toast } = useToast();
  const router = useRouter();
  const { userData, updateUserData, user } = useUserData();

  const [isAdLoading, setIsAdLoading] = useState(false);
  const [showAdConfirmation, setShowAdConfirmation] = useState(false);

  const handleWatchAdClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!userData || userData.adsWatched >= MAX_ADS_WATCHED) {
      toast({
        variant: 'destructive',
        title: 'Ad Limit Reached',
        description: `You can only watch ${MAX_ADS_WATCHED} ads per day.`,
      });
      return;
    }

    // Open the ad link in a new tab
    window.open('https://enviousgarbage.com/b/3-Vk0.Ph3HpHv/bfmUVNJ_ZtDF0P2tN/jZISzUMtTPg_3tLmTzYv2XMWjBM/xROPD/gn', '_blank');
    setShowAdConfirmation(true);
  };
  
  const handleConfirmAdWatched = async () => {
    setShowAdConfirmation(false);
    if (!user || !userData) return;

    setIsAdLoading(true);

    try {
      const newAdsWatched = userData.adsWatched + 1;
      const newEarnings = (userData.earnings || 0) + AD_EARNING_INCREASE;

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
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating data',
        description: `Could not save your progress. Please try again.`,
      });
    } finally {
      setIsAdLoading(false);
    }
  };


  const adsWatched = userData?.adsWatched ?? 0;

  return (
    <>
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
              onClick={handleWatchAdClick}
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
      <AlertDialog open={showAdConfirmation} onOpenChange={setShowAdConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Ad Watched</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm that you have finished watching the ad to claim your reward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAdWatched}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
