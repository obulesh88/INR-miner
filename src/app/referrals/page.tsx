
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

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M16.75 13.96c.25.58.53.97.76 1.25.08.1.14.2.14.33a.4.4 0 0 1-.16.3s-.29.28-.5.35c-.23.08-1.1-.15-1.6-.33a5.6 5.6 0 0 1-2.9-2.3c-.23-.4-.53-1.03-.53-1.03s-.18.2-.38.34c-.21.14-.48.24-.65.28-.15.04-.3.05-.44.03-.5-.04-1.1-.2-1.55-.4a5.57 5.57 0 0 1-2.4-2.8c-.06-.1-.13-.2-.18-.3a.47.47 0 0 1 .02-.45c.04-.07.1-.14.16-.2.1-.1.2-.15.3-.2l.13-.05c.18-.07.3-.02.43.14.15.18.53.64.57.68.04.04.08.08.05.15s-.1.14-.2.23a.28.28 0 0 1-.3.1c-.08-.02-.15-.05-.2-.1s-.1-.12-.08-.2c.02-.07.06-.12.1-.17.2-.23.4-.46.58-.67.2-.23.38-.45.5-.6.23-.28.4-.48.52-.6.1-.1.18-.2.25-.26.23-.23.4-.35.5-.42.1-.06.2-.1.3-.1.15 0 .3.02.43.13l.1.08c.1.1.15.2.18.3.02.1.02.2-.02.3-.08.2-.18.38-.25.5a9.34 9.34 0 0 1-.5 1.2c-.07.17-.12.33-.03.5.08.14.48.56.93.96.6.53 1.15.82 1.3.88.16.06.28.05.4-.02.14-.08.45-.5.58-.66.12-.15.24-.13.4-.08.16.05.9.42 1.05.5.15.07.25.1.28.16.03.07.03.3-.02.58zM12 2a10 10 0 0 0-10 10 10 10 0 0 0 5.03 8.58l-1.35 3.9A.5.5 0 0 0 6.2 24l4.13-2.15A9.95 9.95 0 0 0 12 22a10 10 0 0 0 0-20zm0 18a8 8 0 0 1-4.2-1.22.5.5 0 0 0-.6-.05l-2.67 1.4 1.1-3.08a.5.5 0 0 0-.15-.55A8 8 0 1 1 12 20z" />
        </svg>
    );
}

export default function ReferralsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');
  const [fullReferralLink, setFullReferralLink] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fullLink = `https://or-virid.vercel.app/app/inr-miner?ref=${currentUser.uid}`;
        const displayLink = `inr-miner?ref=${currentUser.uid}`;
        setFullReferralLink(fullLink);
        setReferralLink(displayLink);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const handleCopy = () => {
    if (!fullReferralLink) return;
    navigator.clipboard.writeText(fullReferralLink);
    toast({
      title: 'Link Copied!',
      description: 'Your referral link has been copied to your clipboard.',
    });
  };

  const handleShareOnWhatsApp = () => {
    if (!fullReferralLink) return;
    const message = encodeURIComponent(`Hey! Check out this app and earn rewards. Use my referral link: ${fullReferralLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
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
                            <Button size="icon" onClick={handleShareOnWhatsApp} variant="outline">
                                <WhatsAppIcon className="h-5 w-5" />
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
