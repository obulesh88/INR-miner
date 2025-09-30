
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BottomNav from '@/components/bottom-nav';
import { Users, X, Copy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReferralsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const link = `https://or-virid.vercel.app/app/inr-miner?ref=${currentUser.uid}`;
        setReferralLink(link);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Link Copied!',
      description: 'Your referral link has been copied to your clipboard.',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Referrals</h1>
        <Link href="/dashboard">
          <X className="h-6 w-6" />
        </Link>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Invite Friends, Earn More</CardTitle>
            <CardDescription>
                Share your unique referral link with friends. You'll both benefit when they sign up!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : user ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="referral-link">Your Referral Link</Label>
                         <div className="flex gap-2">
                            <Input id="referral-link" value={referralLink} readOnly />
                            <Button size="icon" onClick={handleCopy}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mt-6">
                            Start sharing and watch your earnings grow!
                        </p>
                        <Users className="w-16 h-16 text-primary mx-auto mt-4" />
                    </div>
                </div>
            ) : (
                 <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Please log in to get your referral link.</p>
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}
